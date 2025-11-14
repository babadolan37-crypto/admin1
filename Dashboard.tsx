// @ts-nocheck
/// <reference path="../types/react-shims.d.ts" />
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { apiCall } from '../utils/supabase-client';
import { getCurrentMonthWIB, formatCurrency, formatMonthWIB } from '../utils/dateUtils';
import { DollarSign, TrendingUp, TrendingDown, Users, RefreshCw, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

export function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthWIB());
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    profit: 0,
    employeeCount: 0,
  });
  const [incomeByType, setIncomeByType] = useState<any[]>([]);
  const [expenseByCategory, setExpenseByCategory] = useState<any[]>([]);
  const [livestockTypes, setLivestockTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
    loadLivestockTypes();
  }, [selectedMonth]);

  useEffect(() => {
    // Listen for financial data updates
    const handleDataUpdate = () => {
      console.log('Financial data updated, refreshing dashboard...');
      loadDashboardData();
    };

    const handleLivestockTypesUpdate = () => {
      console.log('Livestock types updated, refreshing dashboard...');
      loadLivestockTypes();
      loadDashboardData();
    };
    
    window.addEventListener('financialDataUpdated', handleDataUpdate);
    window.addEventListener('livestockTypesUpdated', handleLivestockTypesUpdate);
    
    return () => {
      window.removeEventListener('financialDataUpdated', handleDataUpdate);
      window.removeEventListener('livestockTypesUpdated', handleLivestockTypesUpdate);
    };
  }, [selectedMonth]);

  const loadLivestockTypes = async () => {
    try {
      const data = await apiCall('/livestock-type');
      setLivestockTypes(data.livestockTypes || []);
    } catch (error) {
      console.error('Error loading livestock types:', error);
    }
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [reportData, employeesData] = await Promise.all([
        apiCall(`/reports/monthly?month=${selectedMonth}`),
        apiCall('/employee'),
      ]);

      console.log('Dashboard data dimuat:', { reportData, employeesData });

      setStats({
        totalIncome: reportData.totalIncome || 0,
        totalExpense: reportData.totalExpense || 0,
        profit: reportData.profit || 0,
        employeeCount: employeesData.employees?.length || 0,
      });

      // Format income data for chart - dynamically from report data
      const incomeData = Object.entries(reportData.incomeByType || {}).map(([name, value]) => ({
        name,
        value: value as number,
      }));
      setIncomeByType(incomeData);

      // Format expense data for chart
      const expenseData = [
        { name: 'Pakan', value: reportData.expenseByCategory?.pakan || 0 },
        { name: 'Perawatan', value: reportData.expenseByCategory?.perawatan || 0 },
        { name: 'Peralatan', value: reportData.expenseByCategory?.peralatan || 0 },
        { name: 'Gaji', value: reportData.expenseByCategory?.gaji || 0 },
        { name: 'Lainnya', value: reportData.expenseByCategory?.lainnya || 0 },
      ];
      setExpenseByCategory(expenseData);

    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      setError(error.message || 'Gagal memuat data dashboard');
      toast.error('Gagal memuat data dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Dashboard</h2>
          <p className="text-gray-600">Ringkasan otomatis dari data pemasukan & pengeluaran</p>
        </div>
        <div className="flex items-end gap-4">
          <div className="space-y-2">
            <Label htmlFor="dashboard-month">Pilih Bulan</Label>
            <div className="flex items-center gap-2">
              <Input
                id="dashboard-month"
                type="month"
                value={selectedMonth}
                onChange={(e: any) => setSelectedMonth(e.target.value)}
                className="w-48"
              />
              <Button onClick={loadDashboardData} variant="outline" size="icon" disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-40 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Pemasukan</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{formatCurrency(stats.totalIncome)}</div>
              <p className="text-xs text-gray-600 mt-1">{formatMonthWIB(selectedMonth)}</p>
            </CardContent>
          </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatCurrency(stats.totalExpense)}</div>
            <p className="text-xs text-gray-600 mt-1">{formatMonthWIB(selectedMonth)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Keuntungan Bersih</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl ${stats.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.profit)}
            </div>
            <p className="text-xs text-gray-600 mt-1">{formatMonthWIB(selectedMonth)}</p>
          </CardContent>
        </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Jumlah Karyawan</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stats.employeeCount}</div>
              <p className="text-xs text-gray-600 mt-1">Karyawan aktif</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pemasukan per Jenis Ternak</CardTitle>
            <CardDescription>Distribusi pemasukan {formatMonthWIB(selectedMonth)}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
                <Bar dataKey="value">
                  {incomeByType.map((entry: any, index: number) => {
                    const livestock = livestockTypes.find((lt: any) => lt.name === entry.name);
                    const color = livestock?.color || COLORS[index % COLORS.length];
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengeluaran per Kategori</CardTitle>
            <CardDescription>Distribusi pengeluaran {formatMonthWIB(selectedMonth)}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseByCategory.map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        </div>
      )}
    </div>
  );
}
