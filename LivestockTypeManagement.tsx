// @ts-nocheck
/// <reference path="../types/react-shims.d.ts" />
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { apiCall } from '../utils/supabase-client';
import { toast } from 'sonner';
import { Plus, Trash2, Fish, AlertCircle } from 'lucide-react';

interface LivestockType {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export function LivestockTypeManagement() {
  const [livestockTypes, setLivestockTypes] = useState<LivestockType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [color, setColor] = useState('#22c55e');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default colors
  const colorOptions = [
    { value: '#22c55e', label: 'Hijau' },
    { value: '#3b82f6', label: 'Biru' },
    { value: '#f59e0b', label: 'Oranye' },
    { value: '#ef4444', label: 'Merah' },
    { value: '#8b5cf6', label: 'Ungu' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#14b8a6', label: 'Teal' },
    { value: '#f97316', label: 'Jingga' },
  ];

  useEffect(() => {
    loadLivestockTypes();
  }, []);

  const loadLivestockTypes = async () => {
    setIsLoading(true);
    try {
      const data = await apiCall('/livestock-type');
      setLivestockTypes(data.livestockTypes || []);
    } catch (error) {
      console.error('Error loading livestock types:', error);
      toast.error('Gagal memuat jenis ternak');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Nama jenis ternak harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiCall('/livestock-type', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), color }),
      });

      toast.success('Jenis ternak berhasil ditambahkan');
      setIsDialogOpen(false);
      setName('');
      setColor('#22c55e');
      loadLivestockTypes();
      
      // Trigger update untuk komponen lain
      window.dispatchEvent(new Event('livestockTypesUpdated'));
    } catch (error: any) {
      console.error('Error creating livestock type:', error);
      toast.error(error.message || 'Gagal menambahkan jenis ternak');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus jenis ternak "${name}"?\n\nPerhatian: Data pemasukan yang menggunakan jenis ternak ini tidak akan terhapus, tetapi jenis ternaknya akan hilang dari sistem.`)) {
      return;
    }

    try {
      await apiCall(`/livestock-type/${id}`, {
        method: 'DELETE',
      });

      toast.success('Jenis ternak berhasil dihapus');
      loadLivestockTypes();
      
      // Trigger update untuk komponen lain
      window.dispatchEvent(new Event('livestockTypesUpdated'));
    } catch (error: any) {
      console.error('Error deleting livestock type:', error);
      toast.error(error.message || 'Gagal menghapus jenis ternak');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Jenis Ternak</h2>
        <p className="text-sm text-gray-600">
          Kelola jenis ternak yang tersedia untuk pencatatan pemasukan
        </p>
      </div>

      {livestockTypes.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Belum ada jenis ternak. Silakan tambahkan jenis ternak pertama Anda (contoh: Ayam, Bebek, Ikan, Kambing, Sapi, dll)
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daftar Jenis Ternak</CardTitle>
              <CardDescription>
                {livestockTypes.length} jenis ternak terdaftar
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Jenis Ternak
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Jenis Ternak Baru</DialogTitle>
                  <DialogDescription>
                    Tambahkan jenis ternak yang Anda kelola
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Jenis Ternak *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Ayam, Bebek, Ikan, Kambing, Sapi"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Nama akan muncul di dropdown pemasukan
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Warna (untuk grafik) *</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorOptions.map((option: any) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setColor(option.value)}
                          className={`
                            flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
                            ${color === option.value ? 'border-gray-900 shadow-md' : 'border-gray-200 hover:border-gray-300'}
                          `}
                        >
                          <div
                            className="w-8 h-8 rounded-full"
                            style={{ backgroundColor: option.value }}
                          />
                          <span className="text-xs">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setName('');
                        setColor('#22c55e');
                      }}
                      disabled={isSubmitting}
                    >
                      Batal
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {livestockTypes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Fish className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Belum ada jenis ternak</p>
              <p className="text-sm">Klik tombol di atas untuk menambahkan</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Jenis Ternak</TableHead>
                  <TableHead>Warna</TableHead>
                  <TableHead>Tanggal Ditambahkan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {livestockTypes.map((type: LivestockType) => (
                  <TableRow key={type.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Fish className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{type.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-200"
                          style={{ backgroundColor: type.color }}
                        />
                        <Badge variant="outline" style={{ borderColor: type.color, color: type.color }}>
                          {type.color}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(type.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(type.id, type.name)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Tips:</strong> Jenis ternak yang sudah ditambahkan akan langsung tersedia di halaman Pemasukan. 
          Data pemasukan yang sudah diinput tidak akan terhapus meskipun jenis ternaknya dihapus.
        </AlertDescription>
      </Alert>
    </div>
  );
}
