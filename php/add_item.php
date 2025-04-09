<?php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$stmt = $pdo->prepare("INSERT INTO inventory (product_name, category, price, stock) VALUES (?, ?, ?, ?)");
$result = $stmt->execute([
    $data['product_name'],
    $data['category'],
    $data['price'],
    $data['stock']
]);

echo json_encode(['success' => $result]);