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
    if (!empty($_SERVER["HTTP_X_FORWARDED_PROTO"])) {
        return $_SERVER["HTTP_X_FORWARDED_PROTO"];
    }
    if (!empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off") {
        return "https";
    }
    return "http";
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
$uploadWebPath = "uploads/";

if ($dbName === "YOUR_DB_NAME" || $dbUser === "YOUR_DB_USER" || $dbPass === "YOUR_DB_PASS") {
    json_response(["success" => false, "error" => "Configure DB credentials in db.php or env vars"], 500);
}

if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
    json_response(["success" => false, "error" => "Upload directory not writable"], 500);
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

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_FILES["file"])) {
        $original = basename((string)$_FILES["file"]["name"]);
        $safeName = preg_replace("/[^A-Za-z0-9._-]/", "_", $original);
        $filename = time() . "_" . $safeName;
        $target = $uploadDir . $filename;

        if (!move_uploaded_file((string)$_FILES["file"]["tmp_name"], $target)) {
            json_response(["success" => false, "error" => "Upload failed"], 500);
        }

        $base = detect_scheme() . "://" . ($_SERVER["HTTP_HOST"] ?? "");
        json_response(["success" => true, "url" => $base . "/" . $uploadWebPath . $filename]);
    }

    $input = file_get_contents("php://input");
    if (!$input) {
        json_response(["success" => false, "error" => "Empty payload"], 400);
    }

    json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        json_response(["success" => false, "error" => "Invalid JSON payload"], 400);
    }

    $stmt = $mysqli->prepare("REPLACE INTO lkc_site_data (id, payload) VALUES (1, ?)");
    if (!$stmt) {
        json_response(["success" => false, "error" => "DB prepare failed"], 500);
    }
    $stmt->bind_param("s", $input);
    $ok = $stmt->execute();
    $stmt->close();

    if (!$ok) {
        json_response(["success" => false, "error" => "DB write failed"], 500);
    }

    json_response(["success" => true]);
}

if (isset($_GET["list"])) {
    $files = @scandir($uploadDir) ?: [];
    $files = array_values(array_filter($files, static function ($name) {
        return $name !== "." && $name !== "..";
    }));

    $base = detect_scheme() . "://" . ($_SERVER["HTTP_HOST"] ?? "");
    $result = array_map(static function ($name) use ($base, $uploadWebPath) {
        return ["name" => $name, "url" => $base . "/" . $uploadWebPath . $name];
    }, $files);

    json_response(["success" => true, "files" => $result]);
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
