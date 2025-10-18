<?php
/**
 * Simple PHP API for Login - DotPapa Server Fix
 * This handles the login API call when Node.js backend is not accessible
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit();
}

$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

// Simple authentication (same as your Node.js backend)
if ($username === 'admin' && $password === 'admin123') {
    // Start session
    session_start();
    $_SESSION['userId'] = 'admin-id';
    $_SESSION['username'] = $username;
    
    http_response_code(200);
    echo json_encode([
        'message' => 'Login successful',
        'username' => $username
    ]);
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Invalid credentials']);
}
?>
