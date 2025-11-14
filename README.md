# Sistem Akuntansi Peternakan

Sistem akuntansi berbasis web untuk peternakan dengan fitur lengkap dan dapat disesuaikan:

## ✨ Fitur Utama

- 📊 **Dashboard** - Ringkasan keuangan real-time dengan grafik dinamis
- 🐓 **Jenis Ternak Dinamis** - Tambah/hapus jenis ternak sesuai kebutuhan (ayam, bebek, ikan, kambing, sapi, dll)
- 💰 **Pemasukan** - Pencatatan penjualan ternak dengan filter bulan
- 💸 **Pengeluaran** - Pencatatan operasional dengan filter bulan
- 👥 **Absensi & Gaji** - Sistem absensi karyawan dengan perhitungan gaji otomatis
- 🤝 **Bagi Hasil** - Pembagian keuntungan/kerugian dengan partner
- 📈 **Laporan Keuangan** - Laba/Rugi, Neraca, dan Arus Kas
- ⚙️ **Pengaturan** - Kelola jenis ternak dan konfigurasi sistem

## 🌍 Lokalisasi

- ⏰ Timezone: **GMT+7 (WIB)**
- 💵 Mata Uang: **Rupiah (IDR)**
- 🇮🇩 Bahasa: **Indonesia**

## 🚀 Cara Menggunakan

### 1. Akses Aplikasi
Buka aplikasi di browser Chrome atau browser modern lainnya.

### 2. Registrasi (Pertama Kali)
- Klik tab "Daftar"
- Isi data: Email, Password, Nama, dan Pilih Role (Peternak/Karyawan/Manajer)
- Klik "Daftar"

### 3. Login
- Masukkan Email dan Password
- Klik "Masuk"

### 4. Setup Awal (Disarankan)
- **Pengaturan → Jenis Ternak**: Tambahkan jenis ternak yang Anda kelola (ayam, bebek, ikan, dll)
  - Pilih warna untuk setiap jenis agar mudah dibedakan di grafik

### 5. Mulai Gunakan
- **Dashboard**: Lihat ringkasan keuangan bulan ini dengan grafik dinamis
- **Pemasukan**: Catat penjualan ternak (pilih bulan untuk filter)
- **Pengeluaran**: Catat pengeluaran operasional (pilih bulan untuk filter)
- **Karyawan & Absensi**: Kelola karyawan dan clock in/out
- **Bagi Hasil**: Setup partner dan hitung pembagian keuntungan
- **Laporan**: Generate laporan keuangan lengkap per bulan
- **Pengaturan**: 
  - Kelola jenis ternak dan konfigurasi sistem
  - **Export Data** ke JSON/CSV dengan filter bulan ✨ NEW!

## 🔐 Role-Based Access

- **Peternak**: Akses penuh ke semua fitur
- **Manajer**: Dapat melihat laporan dan mengelola data
- **Karyawan**: Dapat melakukan absensi

## 🛠 Teknologi

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (Database + Auth + Edge Functions)
- **Charts**: Recharts
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 📱 Responsif

Aplikasi dapat digunakan di:
- 💻 Desktop (direkomendasikan untuk pengelolaan data)
- 📱 Mobile (untuk absensi dan monitoring)

## 🔄 Auto-Refresh

Dashboard dan laporan akan otomatis refresh setelah ada perubahan data di:
- Pemasukan
- Pengeluaran
- Absensi
- Bagi Hasil

## 💡 Tips

1. **Gunakan Filter Bulan** di halaman Pemasukan dan Pengeluaran untuk melihat data spesifik
2. **Clock In/Out** tepat waktu untuk perhitungan gaji yang akurat
3. **Generate Laporan** setiap akhir bulan untuk tracking performa
4. **Setup Partner** sebelum menghitung bagi hasil

## 📞 Support

Jika mengalami masalah:
1. Pastikan koneksi internet stabil
2. Clear browser cache
3. Reload halaman (F5 atau Cmd+R)
4. Cek console browser untuk error message

---

**Dibuat dengan ❤️ untuk Peternak Indonesia**
