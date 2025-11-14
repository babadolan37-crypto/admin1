// @ts-nocheck
/// <reference path="../types/react-shims.d.ts" />
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { apiCall } from '../utils/supabase-client';
import { getCurrentDateWIB, getCurrentMonthWIB, formatDateShortWIB, formatCurrency, formatMonthWIB } from '../utils/dateUtils';
import { toast } from 'sonner';
import { Plus, Trash2, Calendar } from 'lucide-react';

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  quantity: number;
  unitPrice: number;
  description: string;
}

export function ExpenseManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthWIB());

  const [formData, setFormData] = useState({
    date: getCurrentDateWIB(),
    category: '',
    amount: '',
    quantity: '',
    unitPrice: '',
    description: '',
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    // Update default date when selected month changes
    const firstDayOfMonth = selectedMonth + '-01';
    setFormData((prev: any) => ({ ...prev, date: firstDayOfMonth }));
  }, [selectedMonth]);

  const loadExpenses = async () => {
    try {
      const data = await apiCall('/expense');
      setExpenses(data.expenses || []);
    } catch (error) {
      console.error('Error loading expenses:', error);
      toast.error('Gagal memuat data pengeluaran');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiCall('/expense', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      toast.success('Pengeluaran berhasil ditambahkan');
      setIsOpen(false);
      setFormData({
        date: getCurrentDateWIB(),
        category: '',
        amount: '',
        quantity: '',
        unitPrice: '',
        description: '',
      });
      loadExpenses();
      // Trigger refresh event untuk dashboard dan reports
      window.dispatchEvent(new CustomEvent('financialDataUpdated'));
    } catch (error: any) {
      console.error('Error creating expense:', error);
      toast.error(error.message || 'Gagal menambahkan pengeluaran');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data pengeluaran ini?')) return;

    try {
      await apiCall(`/expense/${id}`, {
        method: 'DELETE',
      });

      toast.success('Pengeluaran berhasil dihapus');
      loadExpenses();
      // Trigger refresh event untuk dashboard dan reports
      window.dispatchEvent(new CustomEvent('financialDataUpdated'));
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Gagal menghapus pengeluaran');
    }
  };

  // Filter expenses by selected month
  const filteredExpenses = expenses.filter((expense: Expense) => expense.date?.startsWith(selectedMonth));
  const totalExpense = filteredExpenses.reduce((sum: number, expense: Expense) => sum + (expense.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Pengeluaran</h2>
          <p className="text-gray-600">Kelola data pengeluaran operasional</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <Label htmlFor="month-filter" className="text-sm">Bulan:</Label>
              <Input
                id="month-filter"
                type="month"
                value={selectedMonth}
                onChange={(e: any) => setSelectedMonth(e.target.value)}
                className="w-40"
              />
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pengeluaran
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pengeluaran</DialogTitle>
              <DialogDescription>Tambahkan data pengeluaran operasional</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Tanggal</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e: any) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={formData.category} onValueChange={(value: string) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pakan">Pakan</SelectItem>
                    <SelectItem value="perawatan">Perawatan</SelectItem>
                    <SelectItem value="peralatan">Peralatan</SelectItem>
                    <SelectItem value="gaji">Gaji</SelectItem>
                    <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Jumlah Item (kg/unit)</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e: any) => {
                    const quantity = e.target.value;
                    const unitPrice = formData.unitPrice;
                    const amount = quantity && unitPrice ? (parseFloat(quantity) * parseFloat(unitPrice)).toString() : '';
                    setFormData({ ...formData, quantity, amount });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Harga Satuan (Rp)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e: any) => {
                    const unitPrice = e.target.value;
                    const quantity = formData.quantity;
                    const amount = quantity && unitPrice ? (parseFloat(quantity) * parseFloat(unitPrice)).toString() : '';
                    setFormData({ ...formData, unitPrice, amount });
                  }}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Total (Rp)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e: any) => setFormData({ ...formData, amount: e.target.value })}
                  className="bg-gray-50"
                  readOnly
                />
                <p className="text-xs text-gray-500">Otomatis dihitung dari Jumlah × Harga Satuan</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Keterangan</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Keterangan tambahan..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Simpan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Total Pengeluaran {formatMonthWIB(selectedMonth)}: {formatCurrency(totalExpense)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Jumlah Item</TableHead>
                <TableHead>Harga Satuan</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    Belum ada data pengeluaran untuk {formatMonthWIB(selectedMonth)}
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpenses
                  .sort((a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((expense: Expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{formatDateShortWIB(expense.date)}</TableCell>
                      <TableCell className="capitalize">{expense.category}</TableCell>
                      <TableCell>{expense.quantity || '-'}</TableCell>
                      <TableCell>{formatCurrency(expense.unitPrice || 0)}</TableCell>
                      <TableCell>{formatCurrency(expense.amount)}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(expense.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
