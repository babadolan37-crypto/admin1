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
import { Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface Income {
  id: string;
  date: string;
  type: string;
  amount: number;
  quantity: number;
  unitPrice: number;
  description: string;
}

interface LivestockType {
  id: string;
  name: string;
  color: string;
}

export function IncomeManagement() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [livestockTypes, setLivestockTypes] = useState<LivestockType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthWIB());

  const [formData, setFormData] = useState({
    date: getCurrentDateWIB(),
    type: '',
    amount: '',
    quantity: '',
    unitPrice: '',
    description: '',
  });

  useEffect(() => {
    loadIncomes();
    loadLivestockTypes();
  }, []);

  useEffect(() => {
    // Listen for livestock types updates
    const handleLivestockTypesUpdate = () => {
      loadLivestockTypes();
    };
    
    window.addEventListener('livestockTypesUpdated', handleLivestockTypesUpdate);
    
    return () => {
      window.removeEventListener('livestockTypesUpdated', handleLivestockTypesUpdate);
    };
  }, []);

  useEffect(() => {
    // Update default date when selected month changes
    const firstDayOfMonth = selectedMonth + '-01';
    setFormData((prev: any) => ({ ...prev, date: firstDayOfMonth }));
  }, [selectedMonth]);

  const loadIncomes = async () => {
    try {
      const data = await apiCall('/income');
      setIncomes(data.incomes || []);
    } catch (error) {
      console.error('Error loading incomes:', error);
      toast.error('Gagal memuat data pemasukan');
    }
  };

  const loadLivestockTypes = async () => {
    try {
      const data = await apiCall('/livestock-type');
      setLivestockTypes(data.livestockTypes || []);
    } catch (error) {
      console.error('Error loading livestock types:', error);
      toast.error('Gagal memuat jenis ternak');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiCall('/income', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      toast.success('Pemasukan berhasil ditambahkan');
      setIsOpen(false);
      setFormData({
        date: getCurrentDateWIB(),
        type: '',
        amount: '',
        quantity: '',
        unitPrice: '',
        description: '',
      });
      loadIncomes();
      // Trigger refresh event untuk dashboard dan reports
      window.dispatchEvent(new CustomEvent('financialDataUpdated'));
    } catch (error: any) {
      console.error('Error creating income:', error);
      toast.error(error.message || 'Gagal menambahkan pemasukan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data pemasukan ini?')) return;

    try {
      await apiCall(`/income/${id}`, {
        method: 'DELETE',
      });

      toast.success('Pemasukan berhasil dihapus');
      loadIncomes();
      // Trigger refresh event untuk dashboard dan reports
      window.dispatchEvent(new CustomEvent('financialDataUpdated'));
    } catch (error) {
      console.error('Error deleting income:', error);
      toast.error('Gagal menghapus pemasukan');
    }
  };

  // Filter incomes by selected month
  const filteredIncomes = incomes.filter((income: Income) => income.date?.startsWith(selectedMonth));
  const totalIncome = filteredIncomes.reduce((sum: number, income: Income) => sum + (income.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Pemasukan</h2>
          <p className="text-gray-600">Kelola data pemasukan dari penjualan ternak</p>
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
              Tambah Pemasukan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Pemasukan</DialogTitle>
              <DialogDescription>Tambahkan data pemasukan dari penjualan ternak</DialogDescription>
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
                <Label htmlFor="type">Jenis Ternak</Label>
                <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis ternak" />
                  </SelectTrigger>
                  <SelectContent>
                    {livestockTypes.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Belum ada jenis ternak.<br />
                        Silakan tambahkan di menu "Jenis Ternak"
                      </div>
                    ) : (
                      livestockTypes.map((type: LivestockType) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Jumlah (ekor/kg)</Label>
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
            Total Pemasukan {formatMonthWIB(selectedMonth)}: {formatCurrency(totalIncome)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Harga Satuan</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncomes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    Belum ada data pemasukan untuk {formatMonthWIB(selectedMonth)}
                  </TableCell>
                </TableRow>
              ) : (
                filteredIncomes
                  .sort((a: Income, b: Income) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((income: Income) => (
                    <TableRow key={income.id}>
                      <TableCell>{formatDateShortWIB(income.date)}</TableCell>
                      <TableCell className="capitalize">{income.type}</TableCell>
                      <TableCell>{income.quantity}</TableCell>
                      <TableCell>{formatCurrency(income.unitPrice || 0)}</TableCell>
                      <TableCell>{formatCurrency(income.amount)}</TableCell>
                      <TableCell>{income.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(income.id)}
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
