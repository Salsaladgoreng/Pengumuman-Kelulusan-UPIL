<?php
// Lute dan Sal memasrahkan berjalannya kodingan ini kepada Yang Mahakuasa dan ey ay
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'mahasigma_upil';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Koneksi database gagal: " . $e->getMessage());
}

$csvFile = __DIR__ . '/mahasigmaupil.csv';
if (!file_exists($csvFile)) {
    die("File CSV tidak ditemukan di path: $csvFile");
}

$pdo->exec("TRUNCATE TABLE mahasigmaupil");
if (($handle = fopen($csvFile, 'r')) !== FALSE) {
    $isHeader = true;
    $insertedCount = 0;
    $stmt = $pdo->prepare("INSERT INTO mahasigmaupil (id, nama_mahasiswa, tanggal_lahir, NIM, lulus_engga, nama_author) VALUES (?, ?, ?, ?, ?, ?)");

    while (($data = fgetcsv($handle, 1000, ';')) !== FALSE) {
        if ($isHeader) {
            $isHeader = false;
            continue;
        }

        $stmt->execute([
            $data[0], // id
            $data[1], // nama_mahasiswa
            $data[2], // tanggal_lahir
            $data[3], // NIM
            $data[4], // lulus_engga
            $data[7]  // nama_author (sesuai kolom ke-8 di CSV kamu)
        ]);

        $insertedCount++;
    }
    fclose($handle);

    echo "<h2 style='color: green;'>Sukses! Sebanyak $insertedCount data berhasil di-import otomatis ke database yey!</h2>";
} else {
    echo "<h2 style='color: red;'>Gagal membuka file CSV.</h2>";
}
?>