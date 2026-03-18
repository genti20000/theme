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

function env_bool(string $key, bool $default = false): bool
{
    $value = getenv($key);
    if ($value === false || $value === null || $value === "") return $default;
    return in_array(strtolower((string)$value), ["1", "true", "yes", "on"], true);
}

function current_iso(): string
{
    return gmdate("c");
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

function request_json(): array
{
    $raw = file_get_contents("php://input");
    if (!$raw || trim($raw) === "") return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function seo_logs_path(): string
{
    return __DIR__ . "/seo_indexing_logs.json";
}

function load_seo_logs(): array
{
    $path = seo_logs_path();
    if (!is_file($path)) return [];
    $raw = @file_get_contents($path);
    if (!$raw) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function save_seo_logs(array $logs): void
{
    @file_put_contents(seo_logs_path(), json_encode(array_values($logs), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function append_seo_log(array $entry): void
{
    $logs = load_seo_logs();
    array_unshift($logs, $entry);
    if (count($logs) > 200) $logs = array_slice($logs, 0, 200);
    save_seo_logs($logs);
}

function rate_limit_path(): string
{
    return __DIR__ . "/seo_rate_limit.json";
}

function enforce_rate_limit(string $key, int $limit = 12, int $windowSeconds = 60): void
{
    $path = rate_limit_path();
    $state = [];
    if (is_file($path)) {
        $decoded = json_decode((string)@file_get_contents($path), true);
        if (is_array($decoded)) $state = $decoded;
    }
    $now = time();
    $bucket = array_values(array_filter($state[$key] ?? [], static fn($ts) => is_int($ts) && $ts >= ($now - $windowSeconds)));
    if (count($bucket) >= $limit) {
        json_response([
            "success" => false,
            "error" => "Rate limit exceeded. Try again shortly."
        ], 429);
    }
    $bucket[] = $now;
    $state[$key] = $bucket;
    @file_put_contents($path, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function canonical_site_url(): string
{
    return rtrim((string)(getenv("LKC_CANONICAL_SITE_URL") ?: "https://www.londonkaraoke.club"), "/");
}

function canonical_host(): string
{
    return (string)(parse_url(canonical_site_url(), PHP_URL_HOST) ?: "www.londonkaraoke.club");
}

function normalize_site_url(string $raw, array $allowedQueryKeys = []): array
{
    $raw = trim($raw);
    if ($raw === "") return ["ok" => false, "error" => "Missing URL"];
    $raw = preg_replace("/#.*$/", "", $raw);
    if (!$raw || !is_absolute_url($raw)) return ["ok" => false, "error" => "URL must be absolute"];

    $parts = parse_url($raw);
    if (!$parts || empty($parts["host"])) return ["ok" => false, "error" => "Invalid URL"];
    $host = strtolower((string)$parts["host"]);
    $path = (string)($parts["path"] ?? "/");
    if ($path === "") $path = "/";
    if ($path !== "/" && str_ends_with($path, "/")) $path = rtrim($path, "/");
    $allowedHosts = array_unique([
        canonical_host(),
        "londonkaraoke.club",
        "www.londonkaraoke.club"
    ]);
    if (!in_array($host, $allowedHosts, true)) {
        return ["ok" => false, "error" => "URL host is not allowed"];
    }

    $query = "";
    if (!empty($parts["query"])) {
        parse_str((string)$parts["query"], $queryParts);
        if (!empty($allowedQueryKeys)) {
            $queryParts = array_intersect_key($queryParts, array_flip($allowedQueryKeys));
        } else {
            $queryParts = [];
        }
        if (!empty($queryParts)) {
            $query = "?" . http_build_query($queryParts);
        }
    }

    $normalized = canonical_site_url() . $path . $query;
    return [
        "ok" => true,
        "url" => $normalized,
        "path" => $path,
        "host" => canonical_host()
    ];
}

function http_json(string $url, array $payload, array $headers = [], int $timeout = 20): array
{
    $body = json_encode($payload, JSON_UNESCAPED_SLASHES);
    $headerLines = array_merge([
        "Content-Type: application/json",
        "Content-Length: " . strlen((string)$body),
    ], $headers);
    $context = stream_context_create([
        "http" => [
            "method" => "POST",
            "header" => implode("\r\n", $headerLines),
            "content" => $body,
            "ignore_errors" => true,
            "timeout" => $timeout,
        ],
    ]);
    $response = @file_get_contents($url, false, $context);
    $statusLine = $http_response_header[0] ?? "";
    preg_match('/\s(\d{3})\s/', $statusLine, $m);
    $status = isset($m[1]) ? (int)$m[1] : 0;
    $decoded = json_decode((string)$response, true);
    return [
        "status" => $status,
        "body" => $response === false ? "" : (string)$response,
        "json" => is_array($decoded) ? $decoded : null,
    ];
}

function http_head(string $url, int $timeout = 12): array
{
    $context = stream_context_create([
        "http" => [
            "method" => "HEAD",
            "ignore_errors" => true,
            "timeout" => $timeout,
        ],
    ]);
    @file_get_contents($url, false, $context);
    $statusLine = $http_response_header[0] ?? "";
    preg_match('/\s(\d{3})\s/', $statusLine, $m);
    $status = isset($m[1]) ? (int)$m[1] : 0;
    return [
        "status" => $status,
        "headers" => $http_response_header ?? [],
    ];
}

function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function google_service_access_token(array $scopes): array
{
    $clientEmail = (string)(getenv("LKC_GOOGLE_SERVICE_ACCOUNT_EMAIL") ?: "");
    $privateKey = (string)(getenv("LKC_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY") ?: "");
    $privateKey = str_replace("\\n", "\n", $privateKey);
    if ($clientEmail === "" || $privateKey === "") {
        return ["ok" => false, "error" => "Google service account credentials are not configured"];
    }

    $header = ["alg" => "RS256", "typ" => "JWT"];
    $now = time();
    $claims = [
        "iss" => $clientEmail,
        "scope" => implode(" ", $scopes),
        "aud" => "https://oauth2.googleapis.com/token",
        "iat" => $now,
        "exp" => $now + 3600,
    ];
    $jwtBase = base64url_encode(json_encode($header)) . "." . base64url_encode(json_encode($claims));
    $signature = "";
    $key = openssl_pkey_get_private($privateKey);
    if (!$key || !openssl_sign($jwtBase, $signature, $key, OPENSSL_ALGO_SHA256)) {
        return ["ok" => false, "error" => "Failed to sign Google JWT"];
    }
    $jwt = $jwtBase . "." . base64url_encode($signature);

    $context = stream_context_create([
        "http" => [
            "method" => "POST",
            "header" => "Content-Type: application/x-www-form-urlencoded\r\n",
            "content" => http_build_query([
                "grant_type" => "urn:ietf:params:oauth:grant-type:jwt-bearer",
                "assertion" => $jwt,
            ]),
            "ignore_errors" => true,
            "timeout" => 20,
        ],
    ]);
    $response = @file_get_contents("https://oauth2.googleapis.com/token", false, $context);
    $decoded = json_decode((string)$response, true);
    if (!is_array($decoded) || empty($decoded["access_token"])) {
        return ["ok" => false, "error" => "Failed to obtain Google access token", "details" => $decoded];
    }
    return ["ok" => true, "token" => (string)$decoded["access_token"]];
}

function search_console_inspect(string $url): array
{
    $siteUrl = (string)(getenv("LKC_GSC_SITE_URL") ?: canonical_site_url() . "/");
    $tokenResult = google_service_access_token(["https://www.googleapis.com/auth/webmasters.readonly"]);
    if (!$tokenResult["ok"]) return ["ok" => false, "error" => $tokenResult["error"]];
    $result = http_json(
        "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
        ["inspectionUrl" => $url, "siteUrl" => $siteUrl],
        ["Authorization: Bearer " . $tokenResult["token"]]
    );
    if ($result["status"] < 200 || $result["status"] >= 300 || !is_array($result["json"])) {
        return ["ok" => false, "error" => "Search Console inspection failed", "details" => $result["json"] ?: $result["body"], "statusCode" => $result["status"]];
    }
    $inspection = $result["json"]["inspectionResult"]["indexStatusResult"] ?? [];
    return [
        "ok" => true,
        "statusCode" => $result["status"],
        "summary" => [
            "verdict" => $inspection["verdict"] ?? null,
            "coverageState" => $inspection["coverageState"] ?? null,
            "indexingState" => $inspection["indexingState"] ?? null,
            "lastCrawlTime" => $inspection["lastCrawlTime"] ?? null,
            "googleCanonical" => $inspection["googleCanonical"] ?? null,
            "userCanonical" => $inspection["userCanonical"] ?? null,
            "referringUrls" => $inspection["referringUrls"] ?? [],
        ],
    ];
}

function submit_indexnow(array $urls): array
{
    $key = (string)(getenv("LKC_INDEXNOW_KEY") ?: "");
    if ($key === "") return ["ok" => false, "error" => "IndexNow key is not configured"];
    $site = canonical_site_url();
    $host = canonical_host();
    $keyLocation = rtrim($site, "/") . "/" . rawurlencode($key) . ".txt";
    $payload = [
        "host" => $host,
        "key" => $key,
        "keyLocation" => $keyLocation,
        "urlList" => array_values($urls),
    ];
    $result = http_json("https://api.indexnow.org/indexnow", $payload);
    $keyCheck = http_head($keyLocation);
    return [
        "ok" => $result["status"] >= 200 && $result["status"] < 300,
        "statusCode" => $result["status"],
        "summary" => [
            "keyLocation" => $keyLocation,
            "keyFileStatus" => $keyCheck["status"],
            "body" => $result["body"],
        ],
    ];
}

function submit_google_indexing_api(string $url, string $pageType): array
{
    if (!in_array($pageType, ["job_posting", "livestream"], true)) {
        return ["ok" => false, "error" => "Google Indexing API is only allowed for job posting or livestream content"];
    }
    if (!env_bool("LKC_ENABLE_GOOGLE_INDEXING_API", false)) {
        return ["ok" => false, "error" => "Google Indexing API is disabled by configuration"];
    }
    $tokenResult = google_service_access_token(["https://www.googleapis.com/auth/indexing"]);
    if (!$tokenResult["ok"]) return ["ok" => false, "error" => $tokenResult["error"]];
    $result = http_json(
        "https://indexing.googleapis.com/v3/urlNotifications:publish",
        [
            "url" => $url,
            "type" => "URL_UPDATED",
        ],
        ["Authorization: Bearer " . $tokenResult["token"]]
    );
    return [
        "ok" => $result["status"] >= 200 && $result["status"] < 300,
        "statusCode" => $result["status"],
        "summary" => $result["json"] ?: $result["body"],
    ];
}

function maybe_ping_sitemap(string $sitemapUrl): array
{
    $targets = [];
    if (env_bool("LKC_ENABLE_BING_SITEMAP_PING", true)) {
        $targets["bing"] = "https://www.bing.com/ping?sitemap=" . rawurlencode($sitemapUrl);
    }
    if (env_bool("LKC_ENABLE_GOOGLE_SITEMAP_PING", false)) {
        // Google no longer provides a supported general sitemap ping endpoint for normal indexing workflows.
        $targets["google"] = "https://www.google.com/ping?sitemap=" . rawurlencode($sitemapUrl);
    }
    $results = [];
    foreach ($targets as $name => $target) {
        $head = http_head($target);
        $results[$name] = ["statusCode" => $head["status"], "target" => $target];
    }
    return ["ok" => true, "summary" => $results];
}

function seo_action_result(string $actionType, string $status, array $summary, string $url, string $path, string $pageType, string $initiatedBy): array
{
    $entry = [
        "id" => sha1($actionType . "|" . $url . "|" . microtime(true)),
        "url" => $url,
        "normalized_path" => $path,
        "page_type" => $pageType,
        "action_type" => $actionType,
        "status" => $status,
        "response_summary" => $summary,
        "created_at" => current_iso(),
        "initiated_by" => $initiatedBy,
    ];
    append_seo_log($entry);
    return $entry;
}

function handle_seo_request(): void
{
    $input = request_json();
    $action = (string)($input["action"] ?? "");
    $pageType = (string)($input["pageType"] ?? "normal");
    $initiatedBy = "admin_key";
    $normalize = normalize_site_url((string)($input["url"] ?? ""));
    if (!$normalize["ok"]) {
        json_response(["success" => false, "error" => $normalize["error"]], 400);
    }
    $url = (string)$normalize["url"];
    $path = (string)$normalize["path"];
    $rateKey = sha1(($path ?: "/") . "|" . ($_SERVER["REMOTE_ADDR"] ?? "unknown"));
    enforce_rate_limit($rateKey);

    $runSingle = static function (string $singleAction) use ($url, $path, $pageType, $initiatedBy): array {
        switch ($singleAction) {
            case "revalidate":
                return seo_action_result(
                    "revalidate",
                    "warning",
                    [
                        "message" => "Static Hostinger deployment does not support Next.js/Vercel cache revalidation. Use this workflow with sitemap refresh, internal links, and inspection instead.",
                    ],
                    $url,
                    $path,
                    $pageType,
                    $initiatedBy
                );
            case "sitemap_ping":
                $result = maybe_ping_sitemap(canonical_site_url() . "/sitemap.xml");
                return seo_action_result("sitemap_ping", $result["ok"] ? "success" : "error", $result["summary"] ?? ["error" => $result["error"] ?? "Ping failed"], $url, $path, $pageType, $initiatedBy);
            case "indexnow":
                $result = submit_indexnow([$url]);
                return seo_action_result("indexnow", $result["ok"] ? "success" : "error", $result["summary"] ?? ["error" => $result["error"] ?? "IndexNow failed"], $url, $path, $pageType, $initiatedBy);
            case "inspect":
                $result = search_console_inspect($url);
                return seo_action_result("inspect", $result["ok"] ? "success" : "error", $result["summary"] ?? ["error" => $result["error"] ?? "Inspection failed", "details" => $result["details"] ?? null], $url, $path, $pageType, $initiatedBy);
            case "google_indexing_api":
                $result = submit_google_indexing_api($url, $pageType);
                return seo_action_result("google_indexing_api", $result["ok"] ? "success" : "warning", $result["summary"] ?? ["error" => $result["error"] ?? "Submission failed"], $url, $path, $pageType, $initiatedBy);
            case "full_workflow":
                $steps = [];
                $steps[] = $runSingle("revalidate");
                $steps[] = $runSingle("sitemap_ping");
                $steps[] = $runSingle("indexnow");
                $steps[] = $runSingle("inspect");
                if (in_array($pageType, ["job_posting", "livestream"], true)) {
                    $steps[] = $runSingle("google_indexing_api");
                }
                return seo_action_result(
                    "full_workflow",
                    "success",
                    [
                        "steps" => $steps,
                        "note" => "Google does not support true instant indexing for normal pages. This workflow only uses legitimate discovery and inspection methods.",
                    ],
                    $url,
                    $path,
                    $pageType,
                    $initiatedBy
                );
            default:
                return seo_action_result("unknown", "error", ["error" => "Unsupported action"], $url, $path, $pageType, $initiatedBy);
        }
    };

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $logs = load_seo_logs();
        json_response([
            "success" => true,
            "canonicalSiteUrl" => canonical_site_url(),
            "logs" => array_slice($logs, 0, 50),
            "capabilities" => [
                "revalidate" => false,
                "indexNow" => getenv("LKC_INDEXNOW_KEY") ? true : false,
                "searchConsoleInspection" => getenv("LKC_GOOGLE_SERVICE_ACCOUNT_EMAIL") && getenv("LKC_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY") ? true : false,
                "googleIndexingApi" => env_bool("LKC_ENABLE_GOOGLE_INDEXING_API", false),
            ],
        ]);
    }

    if ($action === "") {
        json_response(["success" => false, "error" => "Missing seo action"], 400);
    }
    $result = $runSingle($action);
    json_response(["success" => true, "result" => $result]);
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

function extract_media_key(string $urlOrPath, string $mediaBasePath): string
{
    $raw = trim($urlOrPath);
    if ($raw === "" || str_starts_with(strtolower($raw), "blob:")) return "";
    if (is_absolute_url($raw)) {
        $path = (string)(parse_url($raw, PHP_URL_PATH) ?? "");
        $raw = $path;
    }
    $raw = ltrim($raw, "/");
    $baseTrimmed = ltrim(trim($mediaBasePath), "/");
    if ($baseTrimmed !== "" && str_starts_with($raw, $baseTrimmed . "/")) {
        $raw = substr($raw, strlen($baseTrimmed) + 1);
    }
    if (str_starts_with($raw, "uploads/")) {
        $raw = substr($raw, strlen("uploads/"));
    }
    return trim($raw);
}

function is_invalid_media_ref(string $value): bool
{
    $raw = strtolower(trim($value));
    if ($raw === "") return true;
    return str_starts_with($raw, "blob:") || str_contains($raw, "_blob");
}

function resolve_media_url(string $url, string $filename, string $filesBasePath, string $mediaBasePath, string $mediaBaseUrl): string
{
    $raw = trim($url);
    if ($raw === "") $raw = trim($filename);
    $key = extract_media_key($raw, $mediaBasePath);
    if ($key === "" || is_invalid_media_ref($key) || is_invalid_media_ref($raw)) return "";
    $normalized = rtrim($filesBasePath, "/") . "/" . ltrim($key, "/");
    if ($mediaBaseUrl !== "") return rtrim($mediaBaseUrl, "/") . $normalized;
    return $normalized;
}

function is_media_field_key(string $key): bool
{
    static $exact = [
        "backgroundImageUrl" => true, "mainImageUrl" => true, "mobileMainImageUrl" => true, "sideImageUrl" => true, "headerImageUrl" => true,
        "videoUrl" => true, "mobileVideoUrl" => true, "bigImage" => true, "mobileBigImage" => true, "image1" => true, "image2" => true,
        "logoUrl" => true, "faviconUrl" => true, "avatar" => true, "ogImage" => true, "thumbnail" => true, "thumbnailUrl" => true, "fileUrl" => true
    ];
    if (isset($exact[$key])) return true;
    return (bool)preg_match("/(image|video|logo|favicon|avatar|thumbnail|slide)s?(url)?$/i", $key);
}

function sanitize_payload_media($input, string $parentKey, string $filesBasePath, string $mediaBasePath, string $mediaBaseUrl)
{
    if (is_array($input)) {
        $isAssoc = array_keys($input) !== range(0, count($input) - 1);
        if (!$isAssoc) {
            $next = [];
            foreach ($input as $item) {
                $san = sanitize_payload_media($item, $parentKey, $filesBasePath, $mediaBasePath, $mediaBaseUrl);
                if ($san === null) continue;
                if (is_string($san) && trim($san) === "") continue;
                if (($parentKey === "images" || $parentKey === "videos") && is_array($san) && trim((string)($san["url"] ?? "")) === "") continue;
                $next[] = $san;
            }
            return $next;
        }

        $next = [];
        foreach ($input as $key => $value) {
            if (is_string($value)) {
                $mediaUrlInImages = ($key === "url" && ($parentKey === "images" || $parentKey === "videos" || $parentKey === "media"));
                if (is_media_field_key((string)$key) || $mediaUrlInImages) {
                    $next[$key] = resolve_media_url($value, "", $filesBasePath, $mediaBasePath, $mediaBaseUrl);
                } else {
                    $next[$key] = $value;
                }
                continue;
            }
            $next[$key] = sanitize_payload_media($value, (string)$key, $filesBasePath, $mediaBasePath, $mediaBaseUrl);
        }
        return $next;
    }
    return $input;
}

function cleanup_manifest_records(array $manifest, string $filesBasePath, string $mediaBasePath, string $mediaBaseUrl): array
{
    $clean = [];
    $report = ["scanned" => 0, "removed" => 0, "kept" => 0];
    foreach ($manifest as $m) {
        $report["scanned"]++;
        $rawUrl = (string)($m["url"] ?? "");
        $filename = (string)($m["filename"] ?? "");
        $key = (string)($m["key"] ?? extract_media_key($filename !== "" ? $filename : $rawUrl, $mediaBasePath));
        $status = (string)($m["status"] ?? "");
        $invalid = $key === "" || is_invalid_media_ref($key) || is_invalid_media_ref($rawUrl) || strtolower($status) === "broken";
        if ($invalid) {
            $report["removed"]++;
            error_log("[LKC media cleanup] removed invalid record key={$key} url={$rawUrl}");
            continue;
        }
        $clean[] = [
            "id" => (string)($m["id"] ?? sha1($key)),
            "key" => $key,
            "filename" => $key,
            "type" => media_type($key, (string)($m["mimeType"] ?? "")),
            "url" => resolve_media_url($rawUrl, $key, $filesBasePath, $mediaBasePath, $mediaBaseUrl),
            "thumbnailUrl" => resolve_media_url((string)($m["thumbnailUrl"] ?? ""), "", $filesBasePath, $mediaBasePath, $mediaBaseUrl) ?: null,
            "mimeType" => (string)($m["mimeType"] ?? ""),
            "createdAt" => (string)($m["createdAt"] ?? gmdate("c")),
            "status" => "ok",
            "meta" => is_array($m["meta"] ?? null) ? $m["meta"] : (object)[]
        ];
        $report["kept"]++;
    }
    return ["records" => $clean, "report" => $report];
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
    string $filesBasePath,
    string $mediaBasePath,
    string $mediaBaseUrl,
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
        $url = resolve_media_url((string)($existing["url"] ?? ""), $name, $filesBasePath, $mediaBasePath, $mediaBaseUrl);
        $looksBlob = str_contains(strtolower($name), "_blob") || str_starts_with(strtolower((string)($existing["url"] ?? "")), "blob:");
        $status = $looksBlob ? "broken" : ((string)($existing["status"] ?? "ok"));
        if ($status !== "ok" && $status !== "broken" && $status !== "needs_fix") $status = "ok";

        $thumbRel = "thumbs/" . pathinfo($name, PATHINFO_FILENAME) . ".jpg";
        $thumbAbs = $thumbDir . pathinfo($name, PATHINFO_FILENAME) . ".jpg";
        $thumbUrl = resolve_media_url((string)($existing["thumbnailUrl"] ?? ""), $thumbRel, $filesBasePath, $mediaBasePath, $mediaBaseUrl);

        if ($looksBlob) {
            $status = "broken";
            $report["brokenMarked"]++;
        }

        $fixedUrl = resolve_media_url((string)($existing["url"] ?? ""), "", $filesBasePath, $mediaBasePath, $mediaBaseUrl);
        if ($fixedUrl !== $url || (!isset($existing["url"]) && $url !== "")) $report["fixedUrls"]++;

        if ($runRepair && $type === "video" && $status !== "broken") {
            $shouldCreateThumb = $thumbUrl === "" || !is_absolute_url($thumbUrl);
            if ($shouldCreateThumb && generate_video_thumbnail($ffmpeg, $absPath, $thumbAbs)) {
                $thumbUrl = resolve_media_url("", $thumbRel, $filesBasePath, $mediaBasePath, $mediaBaseUrl);
                $report["thumbnailsGenerated"]++;
            } elseif ($shouldCreateThumb) {
                $report["skipped"]++;
            }
        }

        if ($type === "video" && $thumbUrl === "" && is_file($thumbAbs)) {
            $thumbUrl = resolve_media_url("", $thumbRel, $filesBasePath, $mediaBasePath, $mediaBaseUrl);
        }

        $record = [
            "id" => (string)($existing["id"] ?? sha1($name)),
            "key" => $name,
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

    // Preserve manifest-only broken records so admin can run cleanup.
    foreach ($manifest as $m) {
        $filename = (string)($m["filename"] ?? "");
        if ($filename !== "" && in_array($filename, $files, true)) continue;
        $urlRaw = (string)($m["url"] ?? "");
        if ($filename === "" && $urlRaw === "") continue;
        $looksBlob = str_starts_with(strtolower($urlRaw), "blob:") || str_contains(strtolower($filename), "_blob");
        $records[] = [
            "id" => (string)($m["id"] ?? sha1($filename . $urlRaw)),
            "key" => extract_media_key($filename ?: $urlRaw, $mediaBasePath),
            "type" => media_type($filename ?: $urlRaw, (string)($m["mimeType"] ?? "")),
            "url" => resolve_media_url($urlRaw, $filename, $filesBasePath, $mediaBasePath, $mediaBaseUrl),
            "thumbnailUrl" => resolve_media_url((string)($m["thumbnailUrl"] ?? ""), "", $filesBasePath, $mediaBasePath, $mediaBaseUrl) ?: null,
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
    $isRepair = isset($_GET["repair"]);
    $isCleanup = isset($_GET["cleanup"]);
    json_response([
        "success" => false,
        "error" => ($isRepair || $isCleanup)
            ? "Unauthorized: missing/invalid admin auth for media maintenance endpoint. Send Authorization: Bearer <ADMIN_KEY>."
            : "Auth Failed"
    ], 401);
}

$dbHost = getenv("LKC_DB_HOST") ?: $config["db_host"];
$dbName = getenv("LKC_DB_NAME") ?: $config["db_name"];
$dbUser = getenv("LKC_DB_USER") ?: $config["db_user"];
$dbPass = getenv("LKC_DB_PASS") ?: $config["db_pass"];
$mediaBasePath = "/" . trim((string)(getenv("LKC_MEDIA_BASE_PATH") ?: "uploads"), "/");
$mediaBaseUrl = rtrim((string)(getenv("LKC_MEDIA_BASE_URL") ?: getenv("LKC_FILES_BASE_URL") ?: ""), "/");
$uploadDir = __DIR__ . "/" . trim($mediaBasePath, "/") . "/";
$thumbDir = $uploadDir . "thumbs/";
$filesBasePath = rtrim($mediaBasePath, "/") . "/";
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

if (isset($_GET["seo"])) {
    handle_seo_request();
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["repair"])) {
    $manifest = load_manifest($manifestPath);
    $result = build_media_records($uploadDir, $thumbDir, $filesBasePath, $mediaBasePath, $mediaBaseUrl, $manifest, true);
    save_manifest($manifestPath, $result["records"]);
    json_response(["success" => true, "report" => $result["report"]]);
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["cleanup"])) {
    $manifest = load_manifest($manifestPath);
    $cleanManifest = cleanup_manifest_records($manifest, $filesBasePath, $mediaBasePath, $mediaBaseUrl);
    save_manifest($manifestPath, $cleanManifest["records"]);

    $rowResult = $mysqli->query("SELECT payload FROM lkc_site_data WHERE id = 1 LIMIT 1");
    $payloadCleanup = ["updated" => false, "removedInvalidRefs" => 0];
    if ($rowResult && $rowResult->num_rows > 0) {
        $row = $rowResult->fetch_assoc();
        $storedPayload = (string)($row["payload"] ?? "");
        $decoded = json_decode($storedPayload, true);
        if (is_array($decoded)) {
            $before = json_encode($decoded);
            $sanitized = sanitize_payload_media($decoded, "", $filesBasePath, $mediaBasePath, $mediaBaseUrl);
            $after = json_encode($sanitized);
            if ($before !== $after) {
                $stmt = $mysqli->prepare("REPLACE INTO lkc_site_data (id, payload) VALUES (1, ?)");
                if ($stmt) {
                    $payloadJson = json_encode($sanitized, JSON_UNESCAPED_SLASHES);
                    $stmt->bind_param("s", $payloadJson);
                    $payloadCleanup["updated"] = (bool)$stmt->execute();
                    $stmt->close();
                }
            }
        }
    }

    $rebuilt = build_media_records($uploadDir, $thumbDir, $filesBasePath, $mediaBasePath, $mediaBaseUrl, load_manifest($manifestPath), false);
    save_manifest($manifestPath, $rebuilt["records"]);
    json_response([
        "success" => true,
        "report" => [
            "manifest" => $cleanManifest["report"],
            "payload" => $payloadCleanup,
            "availableMedia" => count($rebuilt["records"])
        ]
    ]);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_FILES["file"])) {
        $original = basename((string)$_FILES["file"]["name"]);
        $safeName = preg_replace("/[^A-Za-z0-9._-]/", "_", $original);
        $filename = time() . "_" . $safeName;
        $target = $uploadDir . $filename;
        error_log("[LKC upload] destination={$target} filename={$filename}");

        if (!move_uploaded_file((string)$_FILES["file"]["tmp_name"], $target)) {
            json_response(["success" => false, "error" => "Upload failed"], 500);
        }

        $manifest = load_manifest($manifestPath);
        $record = [
            "id" => sha1($filename),
            "key" => $filename,
            "type" => media_type($filename, (string)@mime_content_type($target)),
            "url" => resolve_media_url("", $filename, $filesBasePath, $mediaBasePath, $mediaBaseUrl),
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

        json_response([
            "success" => true,
            "key" => $filename,
            "url" => resolve_media_url("", $filename, $filesBasePath, $mediaBasePath, $mediaBaseUrl),
            "media" => $record
        ]);
    }

    $input = file_get_contents("php://input");
    if (!$input || trim($input) === "") {
        $contentLength = (string)($_SERVER["CONTENT_LENGTH"] ?? "0");
        error_log("[LKC save] Empty payload rejected content_length={$contentLength} content_type=" . (string)($_SERVER["CONTENT_TYPE"] ?? ""));
        json_response([
            "success" => false,
            "error" => "Empty payload. Send JSON body with site data.",
            "details" => [
                "content_length" => (int)$contentLength,
                "content_type" => (string)($_SERVER["CONTENT_TYPE"] ?? "")
            ]
        ], 400);
    }

    $decoded = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        json_response(["success" => false, "error" => "Invalid JSON payload"], 400);
    }
    if (!is_array($decoded) || count($decoded) === 0) {
        json_response(["success" => false, "error" => "Empty JSON object is not allowed."], 400);
    }

    $sanitizedPayload = sanitize_payload_media($decoded, "", $filesBasePath, $mediaBasePath, $mediaBaseUrl);
    $input = json_encode($sanitizedPayload, JSON_UNESCAPED_SLASHES);

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
    $result = build_media_records($uploadDir, $thumbDir, $filesBasePath, $mediaBasePath, $mediaBaseUrl, $manifest, false);
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
