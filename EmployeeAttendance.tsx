// @ts-nocheck
/// <reference path="../types/react-shims.d.ts" />
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { apiCall } from '../utils/supabase-client';
import { getCurrentMonthWIB, getCurrentDateTimeWIB, formatDateShortWIB, formatTimeWIB, formatCurrency } from '../utils/dateUtils';
import { toast } from 'sonner';
import { Clock, UserPlus } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  position: string;
  hourlyRate: number;
  monthlyTarget: number;
}

interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  hours: number;
}

export function EmployeeAttendance() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthWIB());

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    position: '',
    hourlyRate: '',
    monthlyTarget: '',
  });

  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: '',
    type: 'in',
    timestamp: getCurrentDateTimeWIB(),
  });

  useEffect(() => {
    loadEmployees();
    loadAttendances();
  }, [selectedMonth]);

  const loadEmployees = async () => {
    try {
      const data = await apiCall('/employee');
      setEmployees(data.employees || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadAttendances = async () => {
    try {
      const data = await apiCall(`/attendance?month=${selectedMonth}`);
      setAttendances(data.attendances || []);
    } catch (error) {
      console.error('Error loading attendances:', error);
    }
  };

  const handleCreateEmployee = async (e: any) => {
    e.preventDefault();

    try {
      await apiCall('/employee', {
        method: 'POST',
        body: JSON.stringify(employeeForm),
      });

      toast.success('Karyawan berhasil ditambahkan');
      setIsEmployeeDialogOpen(false);
      setEmployeeForm({ name: '', position: '', hourlyRate: '', monthlyTarget: '' });
      loadEmployees();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menambahkan karyawan');
    }
  };

  const handleClockInOut = async (e: any) => {
    e.preventDefault();

    try {
      await apiCall('/attendance', {
        method: 'POST',
        body: JSON.stringify(attendanceForm),
      });

      toast.success(`Berhasil ${attendanceForm.type === 'in' ? 'clock in' : 'clock out'}`);
      setIsAttendanceDialogOpen(false);
      setAttendanceForm({
        employeeId: '',
        type: 'in',
        timestamp: getCurrentDateTimeWIB(),
      });
      loadAttendances();
    } catch (error: any) {
      toast.error(error.message || 'Gagal mencatat absensi');
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e: Employee) => e.id === employeeId);
    return employee?.name || 'Unknown';
  };

  const getEmployeeMonthlyStats = (employeeId: string) => {
    const employee = employees.find((e: Employee) => e.id === employeeId);
    if (!employee) return { totalHours: 0, totalSalary: 0 };

    const employeeAttendances = attendances.filter((a: Attendance) => a.employeeId === employeeId);
    const totalHours = employeeAttendances.reduce((sum: number, a: Attendance) => sum + (a.hours || 0), 0);
    const totalSalary = totalHours * employee.hourlyRate;

    return { totalHours, totalSalary };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2>Karyawan & Absensi</h2>
          <p className="text-gray-600">Kelola data karyawan dan kehadiran</p>
        </div>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList>
          <TabsTrigger value="employees">Daftar Karyawan</TabsTrigger>
          <TabsTrigger value="attendance">Absensi</TabsTrigger>
          <TabsTrigger value="salary">Perhitungan Gaji</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Tambah Karyawan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Karyawan Baru</DialogTitle>
                  <DialogDescription>Tambahkan data karyawan baru ke sistem</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateEmployee} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input
                      id="name"
                      value={employeeForm.name}
                      onChange={(e: any) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Posisi</Label>
                    <Input
                      id="position"
                      value={employeeForm.position}
                      onChange={(e: any) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Upah per Jam (Rp)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      step="0.01"
                      value={employeeForm.hourlyRate}
                      onChange={(e: any) => setEmployeeForm({ ...employeeForm, hourlyRate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyTarget">Target Jam Bulanan</Label>
                    <Input
                      id="monthlyTarget"
                      type="number"
                      value={employeeForm.monthlyTarget}
                      onChange={(e: any) => setEmployeeForm({ ...employeeForm, monthlyTarget: e.target.value })}
                      placeholder="contoh: 160"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>
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
                    <TableHead>Nama</TableHead>
                    <TableHead>Posisi</TableHead>
                    <TableHead>Upah/Jam</TableHead>
                    <TableHead>Target Jam/Bulan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500">
                        Belum ada karyawan
                      </TableCell>
                    </TableRow>
                  ) : (
                    employees.map((employee: Employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{formatCurrency(employee.hourlyRate)}</TableCell>
                        <TableCell>{employee.monthlyTarget} jam</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Label htmlFor="month">Bulan</Label>
              <Input
                id="month"
                type="month"
                value={selectedMonth}
                onChange={(e: any) => setSelectedMonth(e.target.value)}
                className="w-48"
              />
            </div>
            <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Clock className="mr-2 h-4 w-4" />
                  Catat Absensi
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Catat Absensi</DialogTitle>
                  <DialogDescription>Catat waktu masuk atau keluar karyawan</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleClockInOut} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Karyawan</Label>
                    <Select value={attendanceForm.employeeId} onValueChange={(value: string) => setAttendanceForm({ ...attendanceForm, employeeId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih karyawan" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee: Employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipe</Label>
                    <Select value={attendanceForm.type} onValueChange={(value: string) => setAttendanceForm({ ...attendanceForm, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">Clock In (Masuk)</SelectItem>
                        <SelectItem value="out">Clock Out (Keluar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timestamp">Waktu</Label>
                    <Input
                      id="timestamp"
                      type="datetime-local"
                      value={attendanceForm.timestamp}
                      onChange={(e: any) => setAttendanceForm({ ...attendanceForm, timestamp: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAttendanceDialogOpen(false)}>
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
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Nama Karyawan</TableHead>
                    <TableHead>Masuk</TableHead>
                    <TableHead>Keluar</TableHead>
                    <TableHead>Total Jam</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendances.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        Belum ada data absensi
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendances.map((attendance: Attendance) => (
                      <TableRow key={attendance.id}>
                        <TableCell>{formatDateShortWIB(attendance.date)}</TableCell>
                        <TableCell>{getEmployeeName(attendance.employeeId)}</TableCell>
                        <TableCell>
                          {attendance.clockIn ? formatTimeWIB(attendance.clockIn) : '-'}
                        </TableCell>
                        <TableCell>
                          {attendance.clockOut ? formatTimeWIB(attendance.clockOut) : '-'}
                        </TableCell>
                        <TableCell>{attendance.hours.toFixed(2)} jam</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salary-month">Bulan</Label>
              <Input
                id="salary-month"
                type="month"
                value={selectedMonth}
                onChange={(e: any) => setSelectedMonth(e.target.value)}
                className="w-48"
              />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Perhitungan Gaji Bulan {selectedMonth}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Karyawan</TableHead>
                    <TableHead>Posisi</TableHead>
                    <TableHead>Total Jam</TableHead>
                    <TableHead>Upah/Jam</TableHead>
                    <TableHead>Total Gaji</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        Belum ada karyawan
                      </TableCell>
                    </TableRow>
                  ) : (
                    employees.map((employee: Employee) => {
                      const { totalHours, totalSalary } = getEmployeeMonthlyStats(employee.id);
                      return (
                        <TableRow key={employee.id}>
                          <TableCell>{employee.name}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{totalHours.toFixed(2)} jam</TableCell>
                          <TableCell>{formatCurrency(employee.hourlyRate)}</TableCell>
                          <TableCell>{formatCurrency(totalSalary)}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
