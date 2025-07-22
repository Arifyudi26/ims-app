-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 22 Jul 2025 pada 16.08
-- Versi server: 10.4.22-MariaDB
-- Versi PHP: 8.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_ims_finance`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `jadwal_angsuran`
--

CREATE TABLE `jadwal_angsuran` (
  `ID` int(11) NOT NULL,
  `KONTRAK_NO` varchar(20) NOT NULL,
  `ANGSURAN_KE` int(11) NOT NULL,
  `ANGSURAN_PER_BULAN` decimal(15,2) NOT NULL,
  `TANGGAL_JATUH_TEMPO` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `jadwal_angsuran`
--

INSERT INTO `jadwal_angsuran` (`ID`, `KONTRAK_NO`, `ANGSURAN_KE`, `ANGSURAN_PER_BULAN`, `TANGGAL_JATUH_TEMPO`) VALUES
(1, 'AGR00001', 1, '12907000.00', '2024-01-25'),
(2, 'AGR00001', 2, '12907000.00', '2024-02-25'),
(3, 'AGR00001', 3, '12907000.00', '2024-03-25'),
(4, 'AGR00001', 4, '12907000.00', '2024-04-25'),
(5, 'AGR00001', 5, '12907000.00', '2024-05-25'),
(6, 'AGR00001', 6, '12907000.00', '2024-06-25'),
(7, 'AGR00001', 7, '12907000.00', '2024-07-25'),
(8, 'AGR00001', 8, '12907000.00', '2024-08-25'),
(9, 'AGR00001', 9, '12907000.00', '2024-09-25'),
(10, 'AGR00001', 10, '12907000.00', '2024-10-25'),
(11, 'AGR00001', 11, '12907000.00', '2024-11-25'),
(12, 'AGR00001', 12, '12907000.00', '2024-12-25');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kontrak`
--

CREATE TABLE `kontrak` (
  `KONTRAK_NO` varchar(20) NOT NULL,
  `CLIENT_NAME` varchar(100) NOT NULL,
  `OTR` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `kontrak`
--

INSERT INTO `kontrak` (`KONTRAK_NO`, `CLIENT_NAME`, `OTR`) VALUES
('AGR00001', 'SUGUS', '240000000.00');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `jadwal_angsuran`
--
ALTER TABLE `jadwal_angsuran`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `KONTRAK_NO` (`KONTRAK_NO`);

--
-- Indeks untuk tabel `kontrak`
--
ALTER TABLE `kontrak`
  ADD PRIMARY KEY (`KONTRAK_NO`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `jadwal_angsuran`
--
ALTER TABLE `jadwal_angsuran`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `jadwal_angsuran`
--
ALTER TABLE `jadwal_angsuran`
  ADD CONSTRAINT `jadwal_angsuran_ibfk_1` FOREIGN KEY (`KONTRAK_NO`) REFERENCES `kontrak` (`KONTRAK_NO`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
