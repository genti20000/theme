<?php
declare(strict_types=1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function detect_scheme(): string
{
    if (!empty($_SERVER["HTTP_X_FORWARDED_PROTO"])) return (string)$_SERVER["HTTP_X_FORWARDED_PROTO"];
    if (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off") return "https";
    return "http";
}

function is_absolute_url(string $value): bool
{
    return (bool)preg_match("/^https?:\/\//i", $value);
}

function iso_from_mtime(string $path): string
{
    $ts = @filemtime($path) ?: time();
    return gmdate("c", $ts);
}

function media_type(string $filename, string $mime = ""): string
{
    $probe = strtolower($filename . " " . $mime);
    if ((bool)preg_match("/\.(png|jpe?g|gif|webp|svg|avif|bmp)(\?|$)/i", $probe) || str_starts_with(strtolower($mime), "image/")) return "image";
    if ((bool)preg_match("/\.(mp4|mov|m4v|webm|ogg)(\?|$)/i", $probe) || str_starts_with(strtolower($mime), "video/")) return "video";
    return "unknown";
}

function load_manifest(string $path): array
{
    if (!is_file($path)) return [];
    $raw = @file_get_contents($path);
    if (!$raw) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function save_manifest(string $path, array $records): void
{
    @file_put_contents($path, json_encode(array_values($records), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function resolve_media_url(string $url, string $filename, string $filesBase): string
{
    $raw = trim($url);
    if ($raw === "") $raw = trim($filename);
    if ($raw === "" || str_starts_with($raw, "blob:")) return "";
    if (is_absolute_url($raw)) return $raw;
    if (str_starts_with($raw, "/uploads/")) return $filesBase . ltrim(substr($raw, strlen("/uploads/")), "/");
    if (str_starts_with($raw, "uploads/")) return $filesBase . ltrim(substr($raw, strlen("uploads/")), "/");
    return $filesBase . ltrim($raw, "/");
}

function ffmpeg_binary(): string
{
    $bin = trim((string)@shell_exec("command -v ffmpeg"));
    return $bin ?: "";
}

function generate_video_thumbnail(string $ffmpegBin, string $sourceAbs, string $thumbAbs): bool
{
    if ($ffmpegBin === "") return false;
    if (is_file($thumbAbs) && filesize($thumbAbs) > 0) return true;
    $cmd = escapeshellarg($ffmpegBin)
        . " -y -ss 1 -i " . escapeshellarg($sourceAbs)
        . " -frames:v 1 -vf " . escapeshellarg("scale=640:-1")
        . " " . escapeshellarg($thumbAbs)
        . " 2>&1";
    @shell_exec($cmd);
    return is_file($thumbAbs) && filesize($thumbAbs) > 0;
}

function build_media_records(
    string $uploadDir,
    string $thumbDir,
    string $filesBase,
    array $manifest,
    bool $runRepair
): array {
    $files = @scandir($uploadDir) ?: [];
    $files = array_values(array_filter($files, static function ($name) {
        return $name !== "." && $name !== ".." && $name !== "thumbs" && $name !== ".media_manifest.json";
    }));

    $manifestByFile = [];
    foreach ($manifest as $m) {
        $key = (string)($m["filename"] ?? "");
        if ($key !== "") $manifestByFile[$key] = $m;
    }

    $ffmpeg = $runRepair ? ffmpeg_binary() : "";
    $report = [
        "totalScanned" => 0,
        "fixedUrls" => 0,
        "thumbnailsGenerated" => 0,
        "brokenMarked" => 0,
        "skipped" => 0
    ];
    $records = [];

    foreach ($files as $idx => $name) {
        $report["totalScanned"]++;
        $absPath = $uploadDir . $name;
        $existing = $manifestByFile[$name] ?? [];
        $mime = is_file($absPath) && function_exists("mime_content_type") ? ((string)@mime_content_type($absPath) ?: "") : "";
        $type = media_type($name, $mime);
        $url = resolve_media_url((string)($existing["url"] ?? ""), $name, $filesBase);
        $looksBlob = str_contains(strtolower($name), "_blob") || str_starts_with(strtolower((string)($existing["url"] ?? "")), "blob:");
        $status = $looksBlob ? "broken" : ((string)($existing["status"] ?? "ok"));
        if ($status !== "ok" && $status !== "broken" && $status !== "needs_fix") $status = "ok";

        $thumbRel = "thumbs/" . pathinfo($name, PATHINFO_FILENAME) . ".jpg";
        $thumbAbs = $thumbDir . pathinfo($name, PATHINFO_FILENAME) . ".jpg";
        $thumbUrl = resolve_media_url((string)($existing["thumbnailUrl"] ?? ""), $thumbRel, $filesBase);

        if ($looksBlob) {
            $status = "broken";
            $report["brokenMarked"]++;
        }

        $fixedUrl = resolve_media_url((string)($existing["url"] ?? ""), "", $filesBase);
        if ($fixedUrl !== $url || (!isset($existing["url"]) && $url !== "")) $report["fixedUrls"]++;

        if ($runRepair && $type === "video" && $status !== "broken") {
            $shouldCreateThumb = $thumbUrl === "" || !is_absolute_url($thumbUrl);
            if ($shouldCreateThumb && generate_video_thumbnail($ffmpeg, $absPath, $thumbAbs)) {
                $thumbUrl = resolve_media_url("", $thumbRel, $filesBase);
                $report["thumbnailsGenerated"]++;
            } elseif ($shouldCreateThumb) {
                $report["skipped"]++;
            }
        }

        if ($type === "video" && $thumbUrl === "" && is_file($thumbAbs)) {
            $thumbUrl = resolve_media_url("", $thumbRel, $filesBase);
        }

        $record = [
            "id" => (string)($existing["id"] ?? sha1($name)),
            "type" => $type,
            "url" => $url,
            "thumbnailUrl" => $thumbUrl ?: null,
            "filename" => $name,
            "mimeType" => $mime ?: ($existing["mimeType"] ?? null),
            "createdAt" => (string)($existing["createdAt"] ?? iso_from_mtime($absPath)),
            "status" => $status,
            "meta" => is_array($existing["meta"] ?? null) ? $existing["meta"] : (object)[]
        ];
        $records[] = $record;
    }

    // Preserve manifest-only broken records (e.g. blob links) so admin can see and clean.
    foreach ($manifest as $m) {
        $filename = (string)($m["filename"] ?? "");
        if ($filename !== "" && in_array($filename, $files, true)) continue;
        $urlRaw = (string)($m["url"] ?? "");
        if ($filename === "" && $urlRaw === "") continue;
        $looksBlob = str_starts_with(strtolower($urlRaw), "blob:") || str_contains(strtolower($filename), "_blob");
        $records[] = [
            "id" => (string)($m["id"] ?? sha1($filename . $urlRaw)),
            "type" => media_type($filename ?: $urlRaw, (string)($m["mimeType"] ?? "")),
            "url" => resolve_media_url($urlRaw, $filename, $filesBase),
            "thumbnailUrl" => resolve_media_url((string)($m["thumbnailUrl"] ?? ""), "", $filesBase) ?: null,
            "filename" => $filename ?: ($urlRaw ?: "unknown"),
            "mimeType" => (string)($m["mimeType"] ?? ""),
            "createdAt" => (string)($m["createdAt"] ?? gmdate("c")),
            "status" => $looksBlob ? "broken" : ((string)($m["status"] ?? "needs_fix")),
            "meta" => is_array($m["meta"] ?? null) ? $m["meta"] : (object)[]
        ];
        if ($looksBlob) $report["brokenMarked"]++;
    }

    return ["records" => $records, "report" => $report];
}

$config = [
    "admin_password" => "admin123",
    "db_host" => "localhost",
    "db_name" => "u973281047_code",
    "db_user" => "u973281047_code",
    "db_pass" => 'QhfImwI8$w'
];

$authKey = "Bearer " . (getenv("LKC_ADMIN_PASSWORD") ?: $config["admin_password"]);
$headers = function_exists("getallheaders") ? getallheaders() : [];
$incomingAuth = $headers["Authorization"] ?? $headers["authorization"] ?? "";
if ($incomingAuth !== $authKey) {
    json_response(["success" => false, "error" => "Auth Failed"], 401);
}

$dbHost = getenv("LKC_DB_HOST") ?: $config["db_host"];
$dbName = getenv("LKC_DB_NAME") ?: $config["db_name"];
$dbUser = getenv("LKC_DB_USER") ?: $config["db_user"];
$dbPass = getenv("LKC_DB_PASS") ?: $config["db_pass"];
$uploadDir = __DIR__ . "/uploads/";
$thumbDir = $uploadDir . "thumbs/";
$filesBase = rtrim((string)(getenv("LKC_FILES_BASE_URL") ?: (detect_scheme() . "://" . ($_SERVER["HTTP_HOST"] ?? "") . "/uploads/")), "/") . "/";
$manifestPath = $uploadDir . ".media_manifest.json";

if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
    json_response(["success" => false, "error" => "Upload directory not writable"], 500);
}
if (!is_dir($thumbDir) && !mkdir($thumbDir, 0755, true) && !is_dir($thumbDir)) {
    json_response(["success" => false, "error" => "Thumb directory not writable"], 500);
}

if ($dbName === "YOUR_DB_NAME" || $dbUser === "YOUR_DB_USER" || $dbPass === "YOUR_DB_PASS") {
    json_response(["success" => false, "error" => "Configure DB credentials in db.php or env vars"], 500);
}

mysqli_report(MYSQLI_REPORT_OFF);
try {
    $mysqli = @new mysqli($dbHost, $dbUser, $dbPass, $dbName);
} catch (Throwable $e) {
    json_response(["success" => false, "error" => "DB connection exception: " . $e->getMessage()], 500);
}
if (!$mysqli || $mysqli->connect_error) {
    json_response(["success" => false, "error" => "DB connection failed: " . ($mysqli ? $mysqli->connect_error : "unknown")], 500);
}
$mysqli->set_charset("utf8mb4");

$createSql = "CREATE TABLE IF NOT EXISTS lkc_site_data (
    id INT PRIMARY KEY,
    payload LONGTEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";
if (!$mysqli->query($createSql)) {
    json_response(["success" => false, "error" => "Failed to prepare DB table"], 500);
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["repair"])) {
    $manifest = load_manifest($manifestPath);
    $result = build_media_records($uploadDir, $thumbDir, $filesBase, $manifest, true);
    save_manifest($manifestPath, $result["records"]);
    json_response(["success" => true, "report" => $result["report"]]);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_FILES["file"])) {
        $original = basename((string)$_FILES["file"]["name"]);
        $safeName = preg_replace("/[^A-Za-z0-9._-]/", "_", $original);
        $filename = time() . "_" . $safeName;
        $target = $uploadDir . $filename;

        if (!move_uploaded_file((string)$_FILES["file"]["tmp_name"], $target)) {
            json_response(["success" => false, "error" => "Upload failed"], 500);
        }

        $manifest = load_manifest($manifestPath);
        $record = [
            "id" => sha1($filename),
            "type" => media_type($filename, (string)@mime_content_type($target)),
            "url" => resolve_media_url("", $filename, $filesBase),
            "thumbnailUrl" => null,
            "filename" => $filename,
            "mimeType" => (string)@mime_content_type($target),
            "createdAt" => iso_from_mtime($target),
            "status" => str_contains(strtolower($filename), "_blob") ? "broken" : "ok",
            "meta" => (object)[]
        ];
        $next = array_filter($manifest, static fn($m) => (($m["filename"] ?? "") !== $filename));
        $next[] = $record;
        save_manifest($manifestPath, array_values($next));

        json_response(["success" => true, "url" => resolve_media_url("", $filename, $filesBase), "media" => $record]);
    }

    $input = file_get_contents("php://input");
    if (!$input) json_response(["success" => false, "error" => "Empty payload"], 400);

    json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        json_response(["success" => false, "error" => "Invalid JSON payload"], 400);
    }

    $stmt = $mysqli->prepare("REPLACE INTO lkc_site_data (id, payload) VALUES (1, ?)");
    if (!$stmt) json_response(["success" => false, "error" => "DB prepare failed"], 500);
    $stmt->bind_param("s", $input);
    $ok = $stmt->execute();
    $stmt->close();
    if (!$ok) json_response(["success" => false, "error" => "DB write failed"], 500);

    json_response(["success" => true]);
}

if (isset($_GET["list"])) {
    $manifest = load_manifest($manifestPath);
    $result = build_media_records($uploadDir, $thumbDir, $filesBase, $manifest, false);
    save_manifest($manifestPath, $result["records"]);

    $legacyFiles = array_map(static function ($record) {
        return [
            "name" => (string)($record["filename"] ?? ""),
            "url" => (string)($record["url"] ?? "")
        ];
    }, $result["records"]);

    json_response([
        "success" => true,
        "media" => array_values($result["records"]),
        "files" => $legacyFiles
    ]);
}

$result = $mysqli->query("SELECT payload FROM lkc_site_data WHERE id = 1 LIMIT 1");
if (!$result || $result->num_rows === 0) {
    json_response(["error" => "no data"], 404);
}

$row = $result->fetch_assoc();
$payload = $row["payload"] ?? "";

json_decode($payload, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    json_response(["success" => false, "error" => "Stored payload is invalid JSON"], 500);
}

echo $payload;
