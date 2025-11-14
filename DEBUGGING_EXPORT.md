# 🔧 Debugging Export Feature

## Error yang Terjadi
```
TypeError: Failed to fetch
```

## ✅ Update yang Dilakukan

### 1. **Enhanced Logging di Backend** (`/supabase/functions/server/index.tsx`)

**Export JSON route:**
```typescript
✅ Log saat endpoint dipanggil
✅ Log auth user status
✅ Log month parameter
✅ Log data fetching progress
✅ Log filter results
✅ Log file creation
✅ Detailed error logging dengan stack trace
```

**Export CSV route:**
```typescript
✅ Log saat endpoint dipanggil
✅ Log auth user status
✅ Log month parameter
✅ Log data fetching progress
✅ Log filter results
✅ Log CSV content creation
✅ Detailed error logging dengan stack trace
```

### 2. **Enhanced Logging di Frontend**

**DataManagement.tsx:**
```typescript
✅ Log selected month
✅ Log endpoint yang akan dipanggil
✅ Better error messages dengan instruksi check console
```

**supabase-client.tsx (apiDownload):**
```typescript
✅ Log request URL
✅ Log auth token status
✅ Log response status
✅ Log response headers
✅ Log error response body (both text and JSON)
✅ Log blob size
✅ Log download trigger
✅ Comprehensive try-catch with detailed error info
```

---

## 🔍 Cara Debug

### Step 1: Buka Developer Console
```
1. Buka aplikasi di browser
2. Tekan F12 atau Right Click → Inspect
3. Pilih tab "Console"
```

### Step 2: Test Export dengan Logging
```
1. Login ke aplikasi
2. Klik Pengaturan → Tab "Data"
3. Pilih periode (misalnya "November 2024")
4. Klik "Export ke JSON" atau "Export ke CSV"
5. PERHATIKAN log yang muncul di Console
```

### Step 3: Analisis Log

**Yang Harus Muncul (Skenario Sukses):**

Frontend logs:
```
Starting JSON export, selectedMonth: 2024-11
JSON export endpoint: /export/json?month=2024-11
[apiDownload] Requesting: https://cqqwmjpdzrdemyqvikuq.supabase.co/functions/v1/make-server-7c04b577/export/json?month=2024-11
[apiDownload] Auth token: Present
[apiDownload] Response status: 200
[apiDownload] Response headers: {...}
[apiDownload] Final filename: Data_Peternakan_2024-11_20241114.json
[apiDownload] Blob size: 1234 bytes
[apiDownload] Download triggered successfully
```

Backend logs (di Supabase Dashboard):
```
Export JSON endpoint called
Export JSON: month parameter = 2024-11
Export JSON: Fetching all data from KV store...
Export JSON: Fetched X incomes, Y expenses, Z attendances
Export JSON: Filtering data by month 2024-11
Export JSON: After filter - A incomes, B expenses, C attendances
Export JSON: Creating JSON string...
Export JSON: Sending file Data_Peternakan_2024-11_20241114.json
```

**Jika Ada Error:**

Check bagian mana yang gagal:

1. **Auth error** → Log akan show "Unauthorized"
2. **Network error** → Tidak ada response log
3. **Backend error** → Ada error log di backend
4. **CORS error** → Response header issues

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"

**Kemungkinan penyebab:**

1. **Backend not deployed**
   - Check: Apakah backend code di-deploy ulang?
   - Fix: Deploy ulang Supabase functions

2. **Network/CORS issue**
   - Check: Response headers di console
   - Fix: Verify CORS settings di backend

3. **Auth token invalid**
   - Check: Log "Auth token: Present/Missing"
   - Fix: Re-login ke aplikasi

4. **Backend crash**
   - Check: Backend logs di Supabase Dashboard
   - Fix: Lihat error message di backend

### Error: "Unauthorized" (401)

**Penyebab:**
- Session expired
- Token invalid

**Fix:**
```
1. Logout dari aplikasi
2. Login kembali
3. Coba export lagi
```

### No Logs Appear

**Penyebab:**
- Console tidak terbuka saat fetch
- Filter console aktif

**Fix:**
```
1. Buka Console SEBELUM klik export
2. Clear filter di Console (pilih "All")
3. Coba lagi
```

---

## 📊 Monitoring Backend

### Via Supabase Dashboard

```
1. Login ke Supabase Dashboard
2. Pilih project: cqqwmjpdzrdemyqvikuq
3. Klik "Edge Functions"
4. Pilih function "make-server-7c04b577"
5. Klik tab "Logs"
6. Trigger export dari aplikasi
7. Lihat real-time logs
```

**Log yang harus muncul:**
- ✅ "Export JSON endpoint called"
- ✅ "Export JSON: month parameter = ..."
- ✅ "Export JSON: Fetching all data..."
- ✅ "Export JSON: Sending file..."

**Jika error muncul:**
- ❌ Error message akan show stack trace
- ❌ Line number dari error
- ❌ Context dari error

---

## 🔬 Test Scenarios

### Test 1: Export All Data (JSON)
```
1. Pilih "Semua Data"
2. Klik "Export ke JSON"
3. Expected: Download Data_Peternakan_YYYYMMDD.json
```

### Test 2: Export Specific Month (JSON)
```
1. Pilih "November 2024"
2. Klik "Export ke JSON"
3. Expected: Download Data_Peternakan_2024-11_YYYYMMDD.json
```

### Test 3: Export All Data (CSV)
```
1. Pilih "Semua Data"
2. Klik "Export ke CSV"
3. Expected: Download Data_Peternakan_YYYYMMDD.csv
```

### Test 4: Export Specific Month (CSV)
```
1. Pilih "Oktober 2024"
2. Klik "Export ke CSV"
3. Expected: Download Data_Peternakan_2024-10_YYYYMMDD.csv
```

---

## 📝 Reporting Issues

Jika masih ada error, catat:

1. **Browser & Version:** (Chrome 120, Firefox 115, etc.)
2. **Endpoint:** (/export/json atau /export/csv-simple)
3. **Selected Month:** (all, 2024-11, etc.)
4. **Frontend Logs:** (Copy dari Console)
5. **Backend Logs:** (Copy dari Supabase Dashboard)
6. **Error Message:** (Exact error message)
7. **Steps to Reproduce:** (Langkah-langkah detail)

---

## ✅ Success Indicators

**Export berhasil jika:**
- ✅ File otomatis ter-download
- ✅ Filename sesuai format (dengan/tanpa month suffix)
- ✅ File size > 0 bytes
- ✅ File bisa dibuka dan berisi data
- ✅ Toast notification "berhasil" muncul
- ✅ Tidak ada error di Console
- ✅ Backend logs show "Sending file..."

---

## 🚀 Next Steps

Setelah logging lengkap ini:

1. **Test semua scenarios** yang disebutkan di atas
2. **Screenshot/copy logs** jika ada error
3. **Report hasil test** dengan detail logging
4. Berdasarkan logs, kita bisa **pinpoint exact issue**

Logging sekarang **sangat comprehensive** - kita akan tahu persis di mana errornya terjadi! 🎯
