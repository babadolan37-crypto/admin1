# Panduan Laporan Keuangan Otomatis

## Cara Kerja Sistem Laporan

Sistem laporan keuangan di aplikasi ini **otomatis mengambil data** dari transaksi pemasukan dan pengeluaran yang telah Anda input.

### Alur Data

```
Input Pemasukan/Pengeluaran 
    ↓
Tersimpan di Database (Supabase KV Store)
    ↓
Dashboard & Laporan Keuangan otomatis update
    ↓
Menampilkan ringkasan dan detail transaksi
```

## Fitur Laporan

### 1. Dashboard
- **Ringkasan Real-time**: Menampilkan total pemasukan, pengeluaran, dan keuntungan bersih
- **Grafik Visual**: 
  - Bar chart untuk pemasukan per jenis ternak (Ayam, Bebek, Ikan)
  - Pie chart untuk distribusi pengeluaran per kategori
- **Auto-refresh**: Otomatis update ketika ada transaksi baru
- **Filter Bulan**: Pilih bulan untuk melihat data spesifik

### 2. Laporan Keuangan
- **Ringkasan Bulanan**: Total pemasukan, pengeluaran, dan keuntungan
- **Tren 6 Bulan**: Grafik line chart perbandingan 6 bulan terakhir
- **Detail Per Jenis**: Breakdown pemasukan berdasarkan jenis ternak
- **Detail Per Kategori**: Breakdown pengeluaran berdasarkan kategori
- **Detail Transaksi**: Tabel lengkap dengan:
  - Tanggal transaksi
  - Jenis/Kategori
  - Quantity (jumlah)
  - Harga satuan
  - Total
- **Export**: Download laporan dalam format text file

## Cara Menggunakan

### Menambah Data Pemasukan
1. Buka menu **Pemasukan**
2. Klik tombol **+ Tambah Pemasukan**
3. Isi form:
   - Tanggal (format WIB GMT+7)
   - Jenis ternak (Ayam/Bebek/Ikan)
   - Jumlah (quantity)
   - Harga satuan
   - Total akan otomatis terhitung
   - Deskripsi (opsional)
4. Klik **Simpan**
5. Data langsung masuk ke Dashboard & Laporan

### Menambah Data Pengeluaran
1. Buka menu **Pengeluaran**
2. Klik tombol **+ Tambah Pengeluaran**
3. Isi form:
   - Tanggal (format WIB GMT+7)
   - Kategori (Pakan/Perawatan/Peralatan/Gaji/Lainnya)
   - Jumlah (quantity)
   - Harga satuan
   - Total akan otomatis terhitung
   - Deskripsi (opsional)
4. Klik **Simpan**
5. Data langsung masuk ke Dashboard & Laporan

### Melihat Laporan
1. Buka menu **Laporan Keuangan**
2. Pilih bulan yang ingin dilihat
3. Klik tombol **Refresh** jika data belum muncul
4. Scroll untuk melihat semua detail
5. Klik **Export Laporan** untuk download

## Troubleshooting

### Laporan Kosong?
- Pastikan sudah ada data pemasukan/pengeluaran untuk bulan tersebut
- Klik tombol **Refresh** untuk memuat ulang data
- Periksa apakah bulan yang dipilih sudah benar

### Data Tidak Update?
- Klik tombol **Refresh** di Dashboard atau Laporan
- Sistem akan otomatis update setelah menambah/menghapus transaksi

### Total Tidak Sesuai?
- Periksa kembali input Quantity dan Harga Satuan
- Total = Quantity × Harga Satuan
- Pastikan tidak ada transaksi yang terlewat

## Timezone
Semua data menggunakan **GMT+7 (WIB - Waktu Indonesia Barat)**

## Keamanan Data
- Data tersimpan aman di Supabase backend
- Akses terproteksi dengan autentikasi
- Role-based access untuk keamanan
