// @ts-nocheck
/// <reference path="./types/react-shims.d.ts" />
import { useEffect, useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { IncomeManagement } from './components/IncomeManagement';
import { ExpenseManagement } from './components/ExpenseManagement';
import { EmployeeAttendance } from './components/EmployeeAttendance';
import { ProfitSharing } from './components/ProfitSharing';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { supabase } from './utils/supabase-client';
import { Toaster } from './components/ui/sonner';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Users,
  PieChart,
  FileText,
  LogOut,
  Menu,
  X,
  Settings as SettingsIcon,
} from 'lucide-react';
import { Button } from './components/ui/button';

type Page = 'dashboard' | 'income' | 'expense' | 'attendance' | 'profit-sharing' | 'reports' | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        setUserName(session.user.user_metadata?.name || session.user.email || 'User');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'income' as Page, label: 'Pemasukan', icon: TrendingUp },
    { id: 'expense' as Page, label: 'Pengeluaran', icon: TrendingDown },
    { id: 'attendance' as Page, label: 'Karyawan & Absensi', icon: Users },
    { id: 'profit-sharing' as Page, label: 'Bagi Hasil', icon: PieChart },
    { id: 'reports' as Page, label: 'Laporan', icon: FileText },
    { id: 'settings' as Page, label: 'Pengaturan', icon: SettingsIcon },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLogin={() => {
          setIsAuthenticated(true);
          checkAuth();
        }} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg">Sistem Akuntansi Peternakan</h1>
            <p className="text-xs text-gray-500">GMT+7 (WIB)</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-full w-64 bg-white border-r transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b">
            <h1 className="text-xl">Akuntansi Peternakan</h1>
            <p className="text-sm text-gray-600 mt-1">Halo, {userName}</p>
            <p className="text-xs text-gray-500 mt-1">Waktu: GMT+7 (WIB)</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8 pb-16">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'income' && <IncomeManagement />}
          {currentPage === 'expense' && <ExpenseManagement />}
          {currentPage === 'attendance' && <EmployeeAttendance />}
          {currentPage === 'profit-sharing' && <ProfitSharing />}
          {currentPage === 'reports' && <Reports />}
          {currentPage === 'settings' && <Settings />}
        </div>
        
        {/* Footer */}
        <footer className="lg:ml-0 bg-white border-t py-4 px-6 text-center text-sm text-gray-600">
          Sistem Akuntansi Peternakan - Semua waktu dalam GMT+7 (WIB)
        </footer>
      </main>

      <Toaster />
    </div>
  );
}
