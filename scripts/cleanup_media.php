<?php
declare(strict_types=1);

/**
 * One-time / repeatable cleanup for corrupted media records.
 *
 * Usage:
 *   LKC_SYNC_URL="https://files.londonkaraoke.club/db.php" LKC_ADMIN_PASSWORD="admin123" php scripts/cleanup_media.php
 */

$syncUrl = getenv('LKC_SYNC_URL') ?: '';
$adminKey = getenv('LKC_ADMIN_PASSWORD') ?: '';

if ($syncUrl === '' || $adminKey === '') {
    fwrite(STDERR, "Missing LKC_SYNC_URL or LKC_ADMIN_PASSWORD\n");
    exit(1);
}

$url = rtrim($syncUrl, "?&") . "?cleanup=1";
$headers = [
    'Authorization: Bearer ' . $adminKey,
    'Accept: application/json'
];

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_TIMEOUT => 120,
]);

$raw = (string)curl_exec($ch);
$http = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$err = curl_error($ch);
curl_close($ch);

if ($err !== '') {
    fwrite(STDERR, "Request error: {$err}\n");
    exit(1);
}

$data = json_decode($raw, true);
if ($http >= 400 || !is_array($data) || !($data['success'] ?? false)) {
    fwrite(STDERR, "Cleanup failed (HTTP {$http})\n");
    fwrite(STDERR, $raw . "\n");
    exit(1);
}

$report = $data['report'] ?? [];
$manifest = $report['manifest'] ?? [];
$payload = $report['payload'] ?? [];

fwrite(STDOUT, "Media cleanup complete\n");
fwrite(STDOUT, "manifest scanned: " . (int)($manifest['scanned'] ?? 0) . "\n");
fwrite(STDOUT, "manifest removed: " . (int)($manifest['removed'] ?? 0) . "\n");
fwrite(STDOUT, "manifest kept: " . (int)($manifest['kept'] ?? 0) . "\n");
fwrite(STDOUT, "payload updated: " . ((bool)($payload['updated'] ?? false) ? 'yes' : 'no') . "\n");
fwrite(STDOUT, "available media: " . (int)($report['availableMedia'] ?? 0) . "\n");
