// @ts-nocheck
/// <reference path="../types/react-shims.d.ts" />
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LivestockTypeManagement } from './LivestockTypeManagement';
import { DataManagement } from './DataManagement';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { 
  Settings as SettingsIcon, 
  Fish, 
  Bell, 
  Globe, 
  Palette,
  Shield,
  Database
} from 'lucide-react';
import { Badge } from './ui/badge';

export function Settings() {
  const [activeTab, setActiveTab] = useState('livestock');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-1">Pengaturan</h2>
        <p className="text-sm text-gray-600">
          Kelola pengaturan sistem akuntansi peternakan Anda
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="livestock" className="flex items-center gap-2">
            <Fish className="h-4 w-4" />
            <span className="hidden sm:inline">Jenis Ternak</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Umum</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifikasi</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Tampilan</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Keamanan</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
        </TabsList>

        {/* Jenis Ternak Tab */}
        <TabsContent value="livestock" className="space-y-4">
          <LivestockTypeManagement />
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Umum</CardTitle>
              <CardDescription>
                Konfigurasi dasar sistem akuntansi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Nama Peternakan</Label>
                  <Input
                    id="business-name"
                    placeholder="Contoh: Peternakan Maju Jaya"
                    defaultValue="Peternakan Saya"
                  />
                  <p className="text-xs text-gray-500">
                    Nama ini akan muncul di laporan dan dokumen
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="owner-name">Nama Pemilik</Label>
                  <Input
                    id="owner-name"
                    placeholder="Nama lengkap pemilik"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Peternakan</Label>
                  <Input
                    id="address"
                    placeholder="Alamat lengkap"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+62 xxx xxxx xxxx"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Zona Waktu</Label>
                    <p className="text-sm text-gray-500">
                      GMT+7 (Waktu Indonesia Barat)
                    </p>
                  </div>
                  <Badge variant="outline">WIB</Badge>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button disabled>
                  Simpan Pengaturan
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Info:</strong> Fitur pengaturan umum akan segera tersedia. 
                  Saat ini hanya Jenis Ternak yang sudah dapat dikelola.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Notifikasi</CardTitle>
              <CardDescription>
                Kelola notifikasi dan peringatan sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifikasi Pemasukan Baru</Label>
                    <p className="text-sm text-gray-500">
                      Tampilkan notifikasi saat ada pemasukan baru
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifikasi Pengeluaran Baru</Label>
                    <p className="text-sm text-gray-500">
                      Tampilkan notifikasi saat ada pengeluaran baru
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pengingat Absensi</Label>
                    <p className="text-sm text-gray-500">
                      Ingatkan untuk input absensi karyawan
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifikasi Laporan Bulanan</Label>
                    <p className="text-sm text-gray-500">
                      Notifikasi saat laporan bulanan siap
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                  <strong>Info:</strong> Pengaturan notifikasi saat ini hanya tampilan. 
                  Fitur notifikasi akan diaktifkan di versi mendatang.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Tampilan</CardTitle>
              <CardDescription>
                Sesuaikan tampilan aplikasi sesuai preferensi Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mode Gelap</Label>
                    <p className="text-sm text-gray-500">
                      Aktifkan tema gelap untuk mata yang lebih nyaman
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Format Mata Uang</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Rp</Badge>
                    <span className="text-sm text-gray-500">Rupiah (IDR)</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Format Tanggal</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">DD/MM/YYYY</Badge>
                    <span className="text-sm text-gray-500">Indonesia</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tampilkan Desimal</Label>
                    <p className="text-sm text-gray-500">
                      Tampilkan sen dalam mata uang (Rp 1.000,00)
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-800">
                  <strong>Info:</strong> Pengaturan tampilan saat ini menggunakan default sistem.
                  Kustomisasi akan tersedia di versi mendatang.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Keamanan</CardTitle>
              <CardDescription>
                Kelola keamanan akun dan data Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Password Saat Ini</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Masukkan password saat ini"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="new-password">Password Baru</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Masukkan password baru"
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Konfirmasi password baru"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autentikasi Dua Faktor</Label>
                    <p className="text-sm text-gray-500">
                      Tambahkan lapisan keamanan ekstra
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Logout Otomatis</Label>
                    <p className="text-sm text-gray-500">
                      Keluar otomatis setelah 30 menit tidak aktif
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button disabled>
                  Update Password
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Info:</strong> Fitur keamanan lanjutan akan tersedia di versi mendatang.
                  Saat ini autentikasi dasar sudah aktif.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-4">
          <DataManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
