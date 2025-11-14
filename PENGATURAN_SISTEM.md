# Panduan Pengaturan Sistem

## 📋 Daftar Isi
1. [Jenis Ternak](#jenis-ternak)
2. [Pengaturan Umum](#pengaturan-umum)
3. [Notifikasi](#notifikasi)
4. [Tampilan](#tampilan)
5. [Keamanan](#keamanan)
6. [Manajemen Data](#manajemen-data)

---

## 🐓 Jenis Ternak

### Cara Mengakses
1. Klik menu **"Pengaturan"** di sidebar
2. Pilih tab **"Jenis Ternak"**

### Menambah Jenis Ternak Baru

1. **Klik tombol "Tambah Jenis Ternak"**
2. **Isi form:**
   - **Nama Jenis Ternak**: Contoh: Ayam, Bebek, Ikan, Kambing, Sapi, Lele, Nila, Gurame, dll
   - **Warna**: Pilih warna untuk grafik (opsional, default hijau)
3. **Klik "Simpan"**

### Menghapus Jenis Ternak

1. **Cari jenis ternak** yang ingin dihapus di tabel
2. **Klik ikon tempat sampah** (🗑️) di kolom "Aksi"
3. **Konfirmasi penghapusan**

⚠️ **Catatan Penting:**
- Jenis ternak yang sudah ditambahkan akan langsung muncul di dropdown halaman Pemasukan
- Data pemasukan yang sudah diinput TIDAK akan terhapus meskipun jenis ternaknya dihapus
- Warna yang dipilih akan digunakan di grafik Dashboard

---

## ⚙️ Pengaturan Umum

### Informasi Peternakan
- **Nama Peternakan**: Nama yang akan muncul di laporan
- **Nama Pemilik**: Nama pemilik peternakan
- **Alamat**: Alamat lengkap peternakan
- **Nomor Telepon**: Kontak peternakan

### Zona Waktu
- Sistem menggunakan **GMT+7 (WIB - Waktu Indonesia Barat)**
- Semua tanggal dan waktu otomatis disesuaikan dengan zona ini

🔵 **Status**: Fitur ini akan segera tersedia

---

## 🔔 Notifikasi

### Jenis Notifikasi yang Tersedia:
- ✅ Notifikasi Pemasukan Baru
- ✅ Notifikasi Pengeluaran Baru
- ✅ Pengingat Absensi Karyawan
- ✅ Notifikasi Laporan Bulanan

🔵 **Status**: Pengaturan notifikasi akan diaktifkan di versi mendatang

---

## 🎨 Tampilan

### Kustomisasi Tampilan:
- **Mode Gelap**: Tema gelap untuk kenyamanan mata
- **Format Mata Uang**: Rupiah (IDR) - Rp
- **Format Tanggal**: DD/MM/YYYY (Indonesia)
- **Desimal**: Tampilkan/sembunyikan sen (Rp 1.000,00)

🔵 **Status**: Kustomisasi tampilan akan tersedia di versi mendatang

---

## 🔒 Keamanan

### Fitur Keamanan:
- **Ganti Password**: Update password akun
- **Autentikasi Dua Faktor (2FA)**: Lapisan keamanan tambahan
- **Logout Otomatis**: Keluar otomatis setelah tidak aktif

### Mengganti Password:
1. Masukkan password saat ini
2. Masukkan password baru
3. Konfirmasi password baru
4. Klik "Update Password"

🔵 **Status**: Fitur keamanan lanjutan akan tersedia di versi mendatang

---

## 💾 Manajemen Data

### Export Data:
- **Excel**: Download semua data dalam format .xlsx
- **CSV**: Download dalam format .csv

### Import Data:
- Import data dari file Excel atau CSV

### Backup:
- ✅ **Backup Otomatis**: Data di-backup setiap hari ke Supabase cloud storage
- **Restore**: Pulihkan data dari backup

### Hapus Semua Data:
⚠️ **ZONA BAHAYA** - Tindakan ini tidak dapat dibatalkan!

🔵 **Status**: Fitur export/import akan tersedia di versi mendatang

---

## 💡 Tips Penggunaan

### Jenis Ternak
✅ **Disarankan:** Tambahkan jenis ternak sebelum menginput pemasukan
✅ **Best Practice:** Gunakan nama yang jelas (contoh: "Ayam Kampung" bukan "AK")
✅ **Warna:** Pilih warna yang berbeda untuk setiap jenis agar mudah dibedakan di grafik

### Integrasi dengan Modul Lain
- **Dashboard**: Grafik otomatis menggunakan warna yang Anda pilih
- **Pemasukan**: Dropdown jenis ternak otomatis terupdate
- **Laporan**: Jenis ternak muncul di laporan bulanan

---

## 🆘 Troubleshooting

### Jenis ternak tidak muncul di dropdown Pemasukan?
1. Refresh halaman (F5)
2. Pastikan jenis ternak sudah tersimpan di menu Pengaturan
3. Cek koneksi internet Anda

### Warna tidak muncul di grafik?
1. Pastikan warna sudah dipilih saat menambah jenis ternak
2. Refresh halaman Dashboard
3. Klik tombol refresh (🔄) di Dashboard

### Tidak bisa menghapus jenis ternak?
1. Pastikan Anda sudah login
2. Cek apakah ada error di console browser (F12)
3. Coba logout dan login kembali

---

## 📞 Dukungan

Untuk bantuan lebih lanjut, silakan hubungi administrator sistem.

**Terakhir diperbarui**: November 2024
