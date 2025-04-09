<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$stmt = $pdo->prepare("DELETE FROM inventory WHERE id = ?");
$result = $stmt->execute([$data['id']]);

echo json_encode(['success' => $result]);