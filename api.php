<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = 'localhost';
$username = 'root';
$password = '';
$database = 'mahasigma_upil';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $nim = isset($_GET['nim']) ? trim($_GET['nim']) : '';
    $tanggal_lahir = isset($_GET['tanggal_lahir']) ? trim($_GET['tanggal_lahir']) : '';

    if (empty($nim) || empty($tanggal_lahir)) {
        $stmt = $pdo->query("SELECT * FROM mahasigmaupil");
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "data" => $data]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM mahasigmaupil WHERE NIM = ? AND (tanggal_lahir = ? OR DATE_FORMAT(tanggal_lahir, '%d/%m/%Y') = ?)");
    $stmt->execute([$nim, $tanggal_lahir, $tanggal_lahir]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        echo json_encode([
            "status" => "success",
            "message" => "Data ditemukan",
            "data" => $data
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "NIM atau Tanggal Lahir salah!"
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => "Koneksi gagal: " . $e->getMessage()
    ]);
}
?>