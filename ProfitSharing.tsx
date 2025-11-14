// @ts-nocheck
/// <reference path="../types/react-shims.d.ts" />
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { apiCall } from '../utils/supabase-client';
import { getCurrentMonthWIB, formatMonthWIB, formatDateShortWIB, formatCurrency } from '../utils/dateUtils';
import { toast } from 'sonner';
import { Plus, Calculator, Users2 } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  percentage: number;
}

interface ProfitSharing {
  id: string;
  month: string;
  totalIncome: number;
  totalExpense: number;
  profit: number;
  shares: Array<{
    partnerId: string;
    partnerName: string;
    percentage: number;
    amount: number;
  }>;
  calculatedAt: string;
}

export function ProfitSharing() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [profitSharings, setProfitSharings] = useState<ProfitSharing[]>([]);
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [isCalculateDialogOpen, setIsCalculateDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthWIB());

  const [partnerForm, setPartnerForm] = useState({
    name: '',
    percentage: '',
  });

  useEffect(() => {
    loadPartners();
    loadProfitSharings();
  }, []);

  const loadPartners = async () => {
    try {
      const data = await apiCall('/partner');
      setPartners(data.partners || []);
    } catch (error) {
      console.error('Error loading partners:', error);
    }
  };

  const loadProfitSharings = async () => {
    try {
      const data = await apiCall('/profit-sharing');
      setProfitSharings(data.profitSharings || []);
    } catch (error) {
      console.error('Error loading profit sharings:', error);
    }
  };

  const handleCreatePartner = async (e: any) => {
    e.preventDefault();

    try {
      await apiCall('/partner', {
        method: 'POST',
        body: JSON.stringify(partnerForm),
      });

      toast.success('Partner berhasil ditambahkan');
      setIsPartnerDialogOpen(false);
      setPartnerForm({ name: '', percentage: '' });
      loadPartners();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menambahkan partner');
    }
  };

  const handleCalculateProfitSharing = async () => {
    try {
      const data = await apiCall('/profit-sharing/calculate', {
        method: 'POST',
        body: JSON.stringify({ month: selectedMonth }),
      });

      toast.success('Bagi hasil berhasil dihitung');
      setIsCalculateDialogOpen(false);
      loadProfitSharings();
  } catch (error: any) {
    toast.error(error.message || 'Gagal menghitung bagi hasil');
  }
};

  const totalPercentage = partners.reduce((sum: number, p: Partner) => sum + (p.percentage || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Bagi Hasil</h2>
          <p className="text-gray-600">Kelola partner dan perhitungan bagi hasil</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Partners Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3>Daftar Partner</h3>
            <Dialog open={isPartnerDialogOpen} onOpenChange={setIsPartnerDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Users2 className="mr-2 h-4 w-4" />
                  Tambah Partner
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Partner</DialogTitle>
                  <DialogDescription>Tambahkan partner bagi hasil dengan persentase yang disepakati</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreatePartner} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="partner-name">Nama Partner</Label>
                    <Input
                      id="partner-name"
                      value={partnerForm.name}
                      onChange={(e: any) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentage">Persentase (%)</Label>
                    <Input
                      id="percentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={partnerForm.percentage}
                      onChange={(e: any) => setPartnerForm({ ...partnerForm, percentage: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsPartnerDialogOpen(false)}>
                      Batal
                    </Button>
                    <Button type="submit">Simpan</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Partner</TableHead>
                    <TableHead>Persentase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-gray-500">
                        Belum ada partner
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {partners.map((partner: Partner) => (
                        <TableRow key={partner.id}>
                          <TableCell>{partner.name}</TableCell>
                          <TableCell>{partner.percentage}%</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell>
                          <strong>Total</strong>
                        </TableCell>
                        <TableCell>
                          <strong className={totalPercentage !== 100 ? 'text-red-600' : 'text-green-600'}>
                            {totalPercentage}%
                          </strong>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
              {totalPercentage !== 100 && partners.length > 0 && (
                <p className="text-sm text-red-600 mt-2">
                  Peringatan: Total persentase harus 100%
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Calculate Profit Sharing */}
        <div className="space-y-4">
          <h3>Hitung Bagi Hasil</h3>
          <Card>
            <CardHeader>
              <CardTitle>Perhitungan Baru</CardTitle>
              <CardDescription>Hitung bagi hasil untuk bulan tertentu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="calculate-month">Pilih Bulan</Label>
                <Input
                  id="calculate-month"
                  type="month"
                  value={selectedMonth}
                  onChange={(e: any) => setSelectedMonth(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleCalculateProfitSharing} 
                className="w-full"
                disabled={partners.length === 0 || totalPercentage !== 100}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Hitung Bagi Hasil
              </Button>
              {totalPercentage !== 100 && (
                <p className="text-sm text-red-600">
                  Pastikan total persentase partner = 100% sebelum menghitung
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profit Sharing History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Bagi Hasil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {profitSharings.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Belum ada riwayat bagi hasil
              </p>
            ) : (
              profitSharings.sort((a: ProfitSharing, b: ProfitSharing) => b.month.localeCompare(a.month)).map((ps: ProfitSharing) => (
                <div key={ps.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4>Bulan: {formatMonthWIB(ps.month)}</h4>
                      <p className="text-sm text-gray-600">
                        Dihitung: {formatDateShortWIB(ps.calculatedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Keuntungan</p>
                      <p className={`${ps.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(ps.profit)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Pemasukan</p>
                      <p>{formatCurrency(ps.totalIncome)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Pengeluaran</p>
                      <p>{formatCurrency(ps.totalExpense)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm mb-2">Pembagian {ps.profit < 0 ? '(Pembagian Kerugian)' : '(Pembagian Keuntungan)'}:</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Partner</TableHead>
                          <TableHead>Persentase</TableHead>
                          <TableHead>Jumlah</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ps.shares.map((share: any, idx: number) => (
                          <TableRow key={idx}>
                            <TableCell>{share.partnerName}</TableCell>
                            <TableCell>{share.percentage}%</TableCell>
                            <TableCell className={share.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatCurrency(share.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
