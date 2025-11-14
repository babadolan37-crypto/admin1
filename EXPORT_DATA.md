# 📥 Panduan Export Data

## Cara Menggunakan Fitur Export Data

### 🎯 Akses Menu Export

1. Login ke aplikasi
2. Klik menu **"Pengaturan"** di sidebar
3. Pilih tab **"Data"**
4. Lihat bagian **"Export Data"**

### 📅 **FITUR BARU: Filter Berdasarkan Bulan**

Anda sekarang dapat **memilih periode data** yang ingin di-export:

**Pilihan Periode:**
- **Semua Data** - Export seluruh data dari awal hingga sekarang
- **Bulan Tertentu** - Export data hanya untuk bulan yang dipilih (tersedia 12 bulan terakhir)

**Contoh:**
- Pilih "November 2024" → Hanya export data November 2024
- Pilih "Oktober 2024" → Hanya export data Oktober 2024
- Pilih "Semua Data" → Export semua data tanpa filter

**Kegunaan:**
- 📊 Analisis data per bulan
- 📈 Laporan bulanan untuk investor/partner
- 💾 Backup data spesifik bulan tertentu
- 🔍 Audit trail per periode

---

## 📊 Format Export yang Tersedia

### 1️⃣ **Export ke JSON (.json)** ✅ AKTIF

**Keunggulan:**
- ✅ Format universal yang didukung semua platform
- ✅ Semua data dalam **satu file** terstruktur
- ✅ Mudah di-parse oleh aplikasi/script
- ✅ Cocok untuk backup dan restore
- ✅ Dapat dibuka di text editor

**Isi File:**
File JSON berisi:
- `exportedAt`: Timestamp export
- `data`: Object berisi semua data (incomes, expenses, employees, dll)
- `summary`: Ringkasan jumlah record per kategori

**Cara Export:**
```
1. Pilih periode di dropdown (Semua Data / Bulan tertentu)
2. Klik tombol "Export ke JSON"
3. Tunggu proses (1-3 detik)
4. File otomatis terdownload:
   - Semua data: Data_Peternakan_YYYYMMDD.json
   - Bulan tertentu: Data_Peternakan_YYYY-MM_YYYYMMDD.json
```

---

### 2️⃣ **Export ke CSV (.csv)** ✅ AKTIF

**Keunggulan:**
- ✅ Format tabel yang mudah dibaca
- ✅ Dapat dibuka langsung di Excel, Google Sheets, LibreOffice
- ✅ Mudah diedit dan dianalisis
- ✅ Ukuran file kecil

**Isi File:**
File CSV berisi data Pemasukan dan Pengeluaran dalam format tabel dengan header

**Cara Export:**
```
1. Pilih periode di dropdown (Semua Data / Bulan tertentu)
2. Klik tombol "Export ke CSV"
3. Tunggu proses (1-3 detik)
4. File otomatis terdownload:
   - Semua data: Data_Peternakan_YYYYMMDD.csv
   - Bulan tertentu: Data_Peternakan_YYYY-MM_YYYYMMDD.csv
5. Buka dengan Excel atau spreadsheet application
```

---

### 3️⃣ **Export ke Excel (.xlsx)** 🔜 SEGERA

**Status:** Dalam pengembangan

**Keunggulan (planned):**
- ✅ Multiple sheets untuk setiap kategori
- ✅ Format profesional
- ✅ Formula dan formatting otomatis
- ✅ Charts dan visualisasi data

---

## 📋 Struktur Data Export

### Pemasukan (Income)
| Kolom | Deskripsi | Contoh |
|-------|-----------|---------|
| ID | Unique identifier | income:1234567890:abc |
| Tanggal | Tanggal transaksi | 2024-11-13 |
| Jenis Ternak | Ayam/Bebek/Ikan/dll | Ayam |
| Jumlah | Total nilai (Rp) | 5000000 |
| Kuantitas | Jumlah ekor/kg | 50 |
| Harga Satuan | Harga per ekor/kg | 100000 |
| Deskripsi | Catatan tambahan | Penjualan ayam kampung |
| Dibuat Pada | Timestamp | 2024-11-13T10:30:00Z |

### Pengeluaran (Expense)
| Kolom | Deskripsi | Contoh |
|-------|-----------|---------|
| ID | Unique identifier | expense:1234567890:xyz |
| Tanggal | Tanggal transaksi | 2024-11-13 |
| Kategori | pakan/perawatan/peralatan/gaji/lainnya | pakan |
| Jumlah | Total nilai (Rp) | 2000000 |
| Deskripsi | Catatan tambahan | Pembelian pakan ayam |
| Dibuat Pada | Timestamp | 2024-11-13T11:00:00Z |

### Karyawan (Employee)
| Kolom | Deskripsi | Contoh |
|-------|-----------|---------|
| ID | Unique identifier | employee:1234567890:def |
| Nama | Nama lengkap | Budi Santoso |
| Email | Email karyawan | budi@email.com |
| Posisi | Jabatan | Operator Kandang |
| Gaji per Jam | Upah per jam (Rp) | 25000 |
| Dibuat Pada | Timestamp | 2024-11-01T08:00:00Z |

### Absensi (Attendance)
| Kolom | Deskripsi | Contoh |
|-------|-----------|---------|
| ID | Unique identifier | attendance:1234567890:ghi |
| ID Karyawan | Reference ke karyawan | employee:1234567890:def |
| Tanggal | Tanggal kerja | 2024-11-13 |
| Clock In | Waktu masuk | 08:00 |
| Clock Out | Waktu keluar | 17:00 |
| Total Jam | Jam kerja | 9 |
| Total Gaji | Gaji hari ini (Rp) | 225000 |
| Dibuat Pada | Timestamp | 2024-11-13T08:00:00Z |

### Partner (Bagi Hasil)
| Kolom | Deskripsi | Contoh |
|-------|-----------|---------|
| ID | Unique identifier | partner:1234567890:jkl |
| Nama | Nama partner | PT Maju Jaya |
| Email | Email partner | partner@email.com |
| Persentase Bagi Hasil | Persentase (%) | 30 |
| Dibuat Pada | Timestamp | 2024-11-01T09:00:00Z |

### Jenis Ternak (Livestock Type)
| Kolom | Deskripsi | Contoh |
|-------|-----------|---------|
| ID | Unique identifier | livestocktype:1234567890:mno |
| Nama | Nama jenis ternak | Ayam |
| Warna | Warna untuk grafik | #22c55e |
| Dibuat Pada | Timestamp | 2024-11-01T10:00:00Z |

---

## 💡 Tips Penggunaan

### ✅ Best Practices

1. **Export Berkala**
   - Export data setiap akhir bulan untuk backup
   - Simpan file di cloud storage (Google Drive, Dropbox, dll)
   - Gunakan nama file yang jelas dengan tanggal

2. **Analisis Data**
   - Gunakan Excel untuk pivot table dan grafik
   - Import CSV ke database untuk query SQL
   - Gunakan Python/R untuk analisis statistik lanjutan

3. **Audit & Compliance**
   - Simpan backup export untuk keperluan audit
   - Export dapat digunakan sebagai bukti transaksi
   - File dapat dikonversi ke PDF untuk laporan formal

### ⚠️ Perhatian

- **Keamanan**: File export berisi data sensitif, simpan dengan aman
- **Privacy**: Jangan share file export ke pihak yang tidak berwenang
- **Backup**: Export tidak menggantikan backup otomatis Supabase
- **Format**: Pastikan aplikasi pembaca (Excel/CSV reader) terinstall

---

## 🔍 Troubleshooting

### Download tidak dimulai?
✅ **Solusi:**
1. Refresh halaman (F5)
2. Cek popup blocker browser
3. Cek koneksi internet
4. Coba browser lain

### File corrupt atau tidak bisa dibuka?
✅ **Solusi:**
1. Download ulang file
2. Pastikan download selesai 100%
3. Cek ukuran file (tidak 0 KB)
4. Gunakan aplikasi terbaru (Excel 2016+, LibreOffice 7+)

### Data tidak lengkap?
✅ **Solusi:**
1. Pastikan data sudah diinput di sistem
2. Refresh dashboard sebelum export
3. Cek apakah ada filter yang aktif
4. Login ulang jika perlu

### ZIP file tidak bisa di-extract?
✅ **Solusi:**
1. Gunakan 7-Zip atau WinRAR
2. Cek ukuran file ZIP
3. Download ulang jika corrupt
4. Pastikan disk space cukup

---

## 📞 Bantuan Lebih Lanjut

Jika mengalami kendala, silakan:
1. Cek console browser (F12) untuk error messages
2. Screenshot error yang muncul
3. Hubungi administrator sistem

---

## 🚀 Fitur Mendatang

- 📥 **Import Data** - Upload Excel/CSV untuk bulk insert
- 📅 **Export Range** - Export berdasarkan periode tertentu
- 🎨 **Custom Export** - Pilih sheet/kolom yang ingin di-export
- 📧 **Email Export** - Kirim hasil export via email otomatis
- ⏰ **Scheduled Export** - Auto-export harian/mingguan/bulanan

**Terakhir diperbarui**: November 2024
