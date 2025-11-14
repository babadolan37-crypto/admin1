# Informasi Timezone Sistem

## GMT+7 (WIB - Waktu Indonesia Barat)

Sistem Akuntansi Peternakan ini menggunakan timezone **GMT+7** atau **WIB (Waktu Indonesia Barat)** untuk semua operasi tanggal dan waktu.

## Fitur Timezone

### 1. Utility Functions (`/utils/dateUtils.tsx`)

File ini menyediakan berbagai fungsi helper untuk menangani tanggal dan waktu dalam timezone WIB:

- `getCurrentDateWIB()` - Mendapatkan tanggal saat ini dalam format YYYY-MM-DD (WIB)
- `getCurrentMonthWIB()` - Mendapatkan bulan saat ini dalam format YYYY-MM (WIB)
- `getCurrentDateTimeWIB()` - Mendapatkan datetime saat ini untuk input datetime-local (WIB)
- `formatDateWIB(dateString)` - Format tanggal ke locale Indonesia dengan timezone WIB
- `formatDateShortWIB(dateString)` - Format tanggal singkat (DD/MM/YYYY) dalam WIB
- `formatTimeWIB(dateString)` - Format waktu (HH:MM) dalam WIB
- `formatDateTimeWIB(dateString)` - Format tanggal dan waktu lengkap dalam WIB
- `formatMonthWIB(monthString)` - Format bulan (contoh: "Januari 2024") dalam WIB
- `formatMonthShortWIB(monthString)` - Format bulan singkat untuk chart (contoh: "Jan 24")
- `formatCurrency(value)` - Format mata uang Rupiah

### 2. Komponen yang Telah Diupdate

Semua komponen utama telah diupdate untuk menggunakan timezone WIB:

#### Dashboard (`/components/Dashboard.tsx`)
- ✅ Menambahkan month selector untuk memilih bulan yang ingin dilihat
- ✅ Menampilkan data berdasarkan bulan yang dipilih
- ✅ Semua tanggal ditampilkan dalam format WIB

#### Reports (`/components/Reports.tsx`)
- ✅ Month selector untuk memilih periode laporan
- ✅ Tren 6 bulan terakhir dengan format bulan WIB
- ✅ Export laporan dengan informasi timezone
- ✅ Semua tanggal dalam tabel menggunakan format WIB

#### Income Management (`/components/IncomeManagement.tsx`)
- ✅ Default date input menggunakan tanggal WIB saat ini
- ✅ Display tanggal dalam format Indonesia/WIB

#### Expense Management (`/components/ExpenseManagement.tsx`)
- ✅ Default date input menggunakan tanggal WIB saat ini
- ✅ Display tanggal dalam format Indonesia/WIB

#### Employee Attendance (`/components/EmployeeAttendance.tsx`)
- ✅ Default datetime input menggunakan WIB
- ✅ Month selector untuk filter absensi
- ✅ Clock in/out time ditampilkan dalam WIB
- ✅ Tanggal absensi dalam format WIB

#### Profit Sharing (`/components/ProfitSharing.tsx`)
- ✅ Month selector untuk perhitungan bagi hasil
- ✅ Tanggal perhitungan dalam format WIB
- ✅ Display bulan dalam format Indonesia

### 3. Indikator Timezone di UI

Sistem menampilkan indikator timezone di beberapa tempat:

1. **Sidebar Desktop** - Menampilkan "Waktu: GMT+7 (WIB)"
2. **Header Mobile** - Menampilkan "GMT+7 (WIB)"
3. **Login Page** - Informasi "Waktu sistem: GMT+7 (WIB)"
4. **Footer** - "Semua waktu dalam GMT+7 (WIB)"

## Cara Penggunaan

### Untuk Developer

Ketika bekerja dengan tanggal/waktu dalam kode:

```typescript
import { 
  getCurrentDateWIB, 
  getCurrentMonthWIB,
  formatDateWIB,
  formatCurrency 
} from '../utils/dateUtils';

// Mendapatkan tanggal hari ini dalam WIB
const today = getCurrentDateWIB(); // "2024-11-12"

// Mendapatkan bulan ini dalam WIB
const thisMonth = getCurrentMonthWIB(); // "2024-11"

// Format tanggal untuk display
const formatted = formatDateWIB("2024-11-12"); // "12 November 2024"

// Format mata uang
const price = formatCurrency(50000); // "Rp50.000"
```

### Input Form

Semua form input tanggal/waktu sudah menggunakan nilai default WIB:

```typescript
const [formData, setFormData] = useState({
  date: getCurrentDateWIB(), // Default ke hari ini (WIB)
  // ...
});
```

### Display Data

Semua tanggal yang ditampilkan ke user sudah menggunakan format WIB:

```typescript
<TableCell>{formatDateShortWIB(income.date)}</TableCell>
<TableCell>{formatTimeWIB(attendance.clockIn)}</TableCell>
```

## Catatan Penting

1. **Backend Storage**: Data tanggal disimpan di backend dalam format ISO string. Frontend menangani conversion ke WIB untuk display.

2. **User Input**: Input dari user (date picker, datetime-local) otomatis menggunakan WIB sebagai default.

3. **Konsistensi**: Semua komponen menggunakan utility functions yang sama untuk memastikan konsistensi timezone di seluruh aplikasi.

4. **Format Indonesia**: Semua display tanggal menggunakan locale 'id-ID' untuk format Indonesia yang familiar bagi user.

## Timezone Coverage

- ✅ Dashboard with month selector
- ✅ Income Management
- ✅ Expense Management  
- ✅ Employee Attendance
- ✅ Profit Sharing
- ✅ Reports
- ✅ Login Page
- ✅ Main App UI

Semua komponen dan fitur sudah menggunakan GMT+7 (WIB) secara konsisten.
