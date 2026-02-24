<?php
declare(strict_types=1);

/**
 * One-time / repeatable media repair runner.
 * Usage:
 *   LKC_SYNC_URL="https://files.londonkaraoke.club/db.php" LKC_ADMIN_PASSWORD="admin123" php scripts/repair_media.php
 */

$syncUrl = getenv("LKC_SYNC_URL") ?: "";
$admin = getenv("LKC_ADMIN_PASSWORD") ?: "";

if ($syncUrl === "" || $admin === "") {
    fwrite(STDERR, "Missing LKC_SYNC_URL or LKC_ADMIN_PASSWORD env vars.\n");
    exit(1);
}

$url = rtrim($syncUrl, "?&") . "?repair=1";
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => ["Authorization: Bearer {$admin}"],
    CURLOPT_TIMEOUT => 600
]);

$raw = curl_exec($ch);
$code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
    fwrite(STDERR, "Request failed: {$err}\n");
    exit(1);
}

$data = json_decode((string)$raw, true);
if (!is_array($data) || $code >= 400 || empty($data["success"])) {
    fwrite(STDERR, "Repair failed (HTTP {$code}): " . (string)$raw . "\n");
    exit(1);
}

$r = $data["report"] ?? [];
echo "Media repair complete\n";
echo "totalScanned: " . (int)($r["totalScanned"] ?? 0) . PHP_EOL;
echo "fixedUrls: " . (int)($r["fixedUrls"] ?? 0) . PHP_EOL;
echo "thumbnailsGenerated: " . (int)($r["thumbnailsGenerated"] ?? 0) . PHP_EOL;
echo "brokenMarked: " . (int)($r["brokenMarked"] ?? 0) . PHP_EOL;
echo "skipped: " . (int)($r["skipped"] ?? 0) . PHP_EOL;
