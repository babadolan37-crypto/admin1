// @ts-nocheck
/// <reference path="../types/react-shims.d.ts" />
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { apiDownload } from '../utils/supabase-client';
import { toast } from 'sonner';
import { Download, Upload, Database, FileSpreadsheet, FileText, Trash2, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function DataManagement() {
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingJSON, setIsExportingJSON] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Generate month options (current month and 12 months back)
  const getMonthOptions = () => {
    const options = [{ value: 'all', label: 'Semua Data' }];
    const now = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const value = `${year}-${month.toString().padStart(2, '0')}`;
      
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const label = `${monthNames[date.getMonth()]} ${year}`;
      
      options.push({ value, label });
    }
    
    return options;
  };

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
      const filename = `Data_Peternakan_${dateStr}.xlsx`;
      
      await apiDownload('/export/excel', filename);
      toast.success('Data berhasil diexport ke Excel');
    } catch (error: any) {
      console.error('Error exporting to Excel:', error);
      toast.error(error.message || 'Gagal mengekspor data ke Excel');
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExportingCSV(true);
    try {
      console.log('Starting CSV export, selectedMonth:', selectedMonth);
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
      const monthSuffix = selectedMonth !== 'all' ? `_${selectedMonth}` : '';
      const filename = `Data_Peternakan${monthSuffix}_${dateStr}.csv`;
      
      const endpoint = selectedMonth === 'all' 
        ? '/export/csv-simple'
        : `/export/csv-simple?month=${selectedMonth}`;
      
      console.log('CSV export endpoint:', endpoint);
      await apiDownload(endpoint, filename);
      
      const monthLabel = selectedMonth === 'all' ? 'semua' : selectedMonth;
      toast.success(`Data ${monthLabel} berhasil diexport ke CSV`);
    } catch (error: any) {
      console.error('Error exporting to CSV:', error);
      toast.error(error.message || 'Gagal mengekspor data ke CSV. Silakan cek console untuk detail.');
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleExportJSON = async () => {
    setIsExportingJSON(true);
    try {
      console.log('Starting JSON export, selectedMonth:', selectedMonth);
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
      const monthSuffix = selectedMonth !== 'all' ? `_${selectedMonth}` : '';
      const filename = `Data_Peternakan${monthSuffix}_${dateStr}.json`;
      
      const endpoint = selectedMonth === 'all' 
        ? '/export/json'
        : `/export/json?month=${selectedMonth}`;
      
      console.log('JSON export endpoint:', endpoint);
      await apiDownload(endpoint, filename);
      
      const monthLabel = selectedMonth === 'all' ? 'semua' : selectedMonth;
      toast.success(`Data ${monthLabel} berhasil diexport ke JSON`);
    } catch (error: any) {
      console.error('Error exporting to JSON:', error);
      toast.error(error.message || 'Gagal mengekspor data ke JSON. Silakan cek console untuk detail.');
    } finally {
      setIsExportingJSON(false);
    }
  };

  const monthOptions = getMonthOptions();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Data</CardTitle>
          <CardDescription>
            Kelola dan backup data sistem Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Export Data</Label>
              <p className="text-sm text-gray-500 mb-3">
                Download semua data dalam format JSON atau CSV
              </p>
              
              {/* Month Selector */}
              <div className="space-y-2 mb-4">
                <Label htmlFor="month-select">Pilih Periode</Label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger id="month-select" className="w-full max-w-xs">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Pilih bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  {selectedMonth === 'all' 
                    ? 'Export semua data yang tersimpan di sistem' 
                    : `Export data untuk bulan ${monthOptions.find(o => o.value === selectedMonth)?.label}`
                  }
                </p>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  onClick={handleExportJSON}
                  disabled={isExportingJSON}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExportingJSON ? 'Mengekspor...' : 'Export ke JSON'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExportCSV}
                  disabled={isExportingCSV}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isExportingCSV ? 'Mengekspor...' : 'Export ke CSV'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleExportExcel}
                  disabled={isExportingExcel || true}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel (Segera)
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                <strong>JSON:</strong> Format universal untuk backup dan transfer data<br />
                <strong>CSV:</strong> Format tabel yang dapat dibuka di Excel/Google Sheets<br />
                <strong>Excel:</strong> Fitur akan tersedia segera (dalam pengembangan)
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Import Data</Label>
              <p className="text-sm text-gray-500 mb-3">
                Import data dari file Excel atau CSV
              </p>
              <Button variant="outline" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Fitur import akan tersedia segera
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Backup Otomatis</Label>
              <p className="text-sm text-gray-500 mb-3">
                Data otomatis di-backup setiap hari ke Supabase cloud storage
              </p>
              <div className="flex items-center gap-2">
                <Switch defaultChecked disabled />
                <span className="text-sm text-green-600">Aktif (Managed by Supabase)</span>
              </div>
            </div>

            <Separator />

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <Label className="text-red-600">Zona Bahaya</Label>
              <p className="text-sm text-gray-600 mt-2 mb-3">
                Hapus semua data sistem. Tindakan ini tidak dapat dibatalkan!
              </p>
              <Button variant="destructive" disabled>
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Semua Data
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Fitur ini dinonaktifkan untuk keamanan
              </p>
            </div>
          </div>

          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              <strong>Info:</strong> Data Anda disimpan dengan aman di Supabase.
              Export data dapat digunakan untuk backup lokal atau analisis eksternal.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
