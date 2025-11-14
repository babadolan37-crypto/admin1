// @ts-nocheck
/// <reference path="../types/react-shims.d.ts" />
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { apiCall } from '../utils/supabase-client';
import { getCurrentMonthWIB, formatDateShortWIB, formatMonthWIB, formatMonthShortWIB, formatCurrency } from '../utils/dateUtils';
import { FileText, Download, AlertCircle, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export function Reports() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthWIB());
  const [report, setReport] = useState<any>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
    loadMonthlyTrend();
  }, [selectedMonth]);

  useEffect(() => {
    // Listen for financial data updates
    const handleDataUpdate = () => {
      console.log('Financial data updated, refreshing reports...');
      loadReport();
      loadMonthlyTrend();
    };
    
    window.addEventListener('financialDataUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('financialDataUpdated', handleDataUpdate);
    };
  }, [selectedMonth]);

  const loadReport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiCall(`/reports/monthly?month=${selectedMonth}`);
      setReport(data);
      console.log('Laporan dimuat:', data);
    } catch (error: any) {
      console.error('Error loading report:', error);
      setError(error.message || 'Gagal memuat laporan keuangan');
      toast.error('Gagal memuat laporan keuangan');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMonthlyTrend = async () => {
    try {
      // Get last 6 months
      const months = [];
      const currentDate = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        months.push(date.toISOString().slice(0, 7));
      }

      const trendData = await Promise.all(
        months.map(async (month) => {
          try {
            const data = await apiCall(`/reports/monthly?month=${month}`);
            return {
              month: formatMonthShortWIB(month),
              pemasukan: data.totalIncome || 0,
              pengeluaran: data.totalExpense || 0,
              keuntungan: data.profit || 0,
            };
          } catch {
            return {
              month: formatMonthShortWIB(month),
              pemasukan: 0,
              pengeluaran: 0,
              keuntungan: 0,
            };
          }
        })
      );

      setMonthlyTrend(trendData);
    } catch (error) {
      console.error('Error loading monthly trend:', error);
    }
  };

  const exportReport = () => {
    if (!report) return;

    const content = `
LAPORAN KEUANGAN
Bulan: ${formatMonthWIB(selectedMonth)}
Waktu: GMT+7 (WIB)

RINGKASAN
Total Pemasukan: ${formatCurrency(report.totalIncome)}
Total Pengeluaran: ${formatCurrency(report.totalExpense)}
Keuntungan Bersih: ${formatCurrency(report.profit)}

PEMASUKAN PER JENIS
Ayam: ${formatCurrency(report.incomeByType?.ayam || 0)}
Bebek: ${formatCurrency(report.incomeByType?.bebek || 0)}
Ikan: ${formatCurrency(report.incomeByType?.ikan || 0)}

PENGELUARAN PER KATEGORI
Pakan: ${formatCurrency(report.expenseByCategory?.pakan || 0)}
Perawatan: ${formatCurrency(report.expenseByCategory?.perawatan || 0)}
Peralatan: ${formatCurrency(report.expenseByCategory?.peralatan || 0)}
Gaji: ${formatCurrency(report.expenseByCategory?.gaji || 0)}
Lainnya: ${formatCurrency(report.expenseByCategory?.lainnya || 0)}

DETAIL PEMASUKAN
${report.incomes?.map((i: any) => 
  `${formatDateShortWIB(i.date)} - ${i.type} - Qty: ${i.quantity || '-'} - @${formatCurrency(i.unitPrice || 0)} = ${formatCurrency(i.amount)} - ${i.description || '-'}`
).join('\n')}

DETAIL PENGELUARAN
${report.expenses?.map((e: any) => 
  `${formatDateShortWIB(e.date)} - ${e.category} - Qty: ${e.quantity || '-'} - @${formatCurrency(e.unitPrice || 0)} = ${formatCurrency(e.amount)} - ${e.description || '-'}`
).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-${selectedMonth}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Laporan Keuangan</h2>
          <p className="text-gray-600">Laporan otomatis dari data pemasukan & pengeluaran</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadReport} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportReport} disabled={!report || isLoading}>
            <Download className="mr-2 h-4 w-4" />
            Export Laporan
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="report-month">Pilih Bulan</Label>
        <div className="flex items-center gap-2">
          <Input
            id="report-month"
            type="month"
            value={selectedMonth}
            onChange={(e: any) => setSelectedMonth(e.target.value)}
            className="w-48"
          />
          <span className="text-sm text-gray-500">GMT+7 (WIB)</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-40" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      {!isLoading && report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Pemasukan</CardTitle>
                <CardDescription>
                  {report.incomes?.length || 0} transaksi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-green-600">{formatCurrency(report.totalIncome)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total Pengeluaran</CardTitle>
                <CardDescription>
                  {report.expenses?.length || 0} transaksi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-red-600">{formatCurrency(report.totalExpense)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Keuntungan Bersih</CardTitle>
                <CardDescription>
                  Pemasukan - Pengeluaran
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl ${report.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(report.profit)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Tren 6 Bulan Terakhir</CardTitle>
              <CardDescription>Perbandingan pemasukan, pengeluaran, dan keuntungan</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="pemasukan" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="pengeluaran" stroke="#ef4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="keuntungan" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Income by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Pemasukan per Jenis Ternak</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis Ternak</TableHead>
                    <TableHead>Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Ayam</TableCell>
                    <TableCell>{formatCurrency(report.incomeByType?.ayam || 0)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bebek</TableCell>
                    <TableCell>{formatCurrency(report.incomeByType?.bebek || 0)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ikan</TableCell>
                    <TableCell>{formatCurrency(report.incomeByType?.ikan || 0)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Expenses by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Pengeluaran per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Jumlah</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Pakan</TableCell>
                    <TableCell>{formatCurrency(report.expenseByCategory?.pakan || 0)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Perawatan</TableCell>
                    <TableCell>{formatCurrency(report.expenseByCategory?.perawatan || 0)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Peralatan</TableCell>
                    <TableCell>{formatCurrency(report.expenseByCategory?.peralatan || 0)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gaji</TableCell>
                    <TableCell>{formatCurrency(report.expenseByCategory?.gaji || 0)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Lainnya</TableCell>
                    <TableCell>{formatCurrency(report.expenseByCategory?.lainnya || 0)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detail Pemasukan</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Harga Satuan</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!report.incomes || report.incomes?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          <p>Tidak ada data pemasukan</p>
                          <p className="text-xs mt-1">Tambahkan pemasukan di menu Pemasukan</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      report.incomes?.map((income: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>{formatDateShortWIB(income.date)}</TableCell>
                          <TableCell className="capitalize">{income.type}</TableCell>
                          <TableCell>{income.quantity || '-'}</TableCell>
                          <TableCell>{formatCurrency(income.unitPrice || 0)}</TableCell>
                          <TableCell>{formatCurrency(income.amount)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detail Pengeluaran</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Harga Satuan</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!report.expenses || report.expenses?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                          <p>Tidak ada data pengeluaran</p>
                          <p className="text-xs mt-1">Tambahkan pengeluaran di menu Pengeluaran</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      report.expenses?.map((expense: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>{formatDateShortWIB(expense.date)}</TableCell>
                          <TableCell className="capitalize">{expense.category}</TableCell>
                          <TableCell>{expense.quantity || '-'}</TableCell>
                          <TableCell>{formatCurrency(expense.unitPrice || 0)}</TableCell>
                          <TableCell>{formatCurrency(expense.amount)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Empty State - ketika belum ada data sama sekali */}
      {!isLoading && !error && report && report.totalIncome === 0 && report.totalExpense === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg mb-2">Belum Ada Data Keuangan</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Laporan akan otomatis menampilkan data ketika Anda menambahkan pemasukan atau pengeluaran untuk bulan <strong>{formatMonthWIB(selectedMonth)}</strong>.
            </p>
            <p className="text-sm text-gray-500">
              Gunakan menu <strong>Pemasukan</strong> dan <strong>Pengeluaran</strong> untuk mulai mencatat transaksi.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
