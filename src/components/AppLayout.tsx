import { useState, type ReactNode } from 'react';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard, Wallet, TrendingUp, Users, Upload, ListChecks, Settings,
  HelpCircle, LogOut, Menu, X, ShieldCheck,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  page: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, page: 'dashboard' },
  { id: 'money', label: 'Money', icon: <Wallet size={20} />, page: 'money' },
  { id: 'sales', label: 'Sales', icon: <TrendingUp size={20} />, page: 'sales' },
  { id: 'customers', label: 'Customers', icon: <Users size={20} />, page: 'customers' },
  { id: 'upload', label: 'Upload Data', icon: <Upload size={20} />, page: 'upload' },
  { id: 'actions', label: 'Actions', icon: <ListChecks size={20} />, page: 'actions' },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, page: 'settings' },
];

interface LayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  children: ReactNode;
}

export function AppLayout({ currentPage, onNavigate, children }: LayoutProps) {
  const { state, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
          <ShieldCheck size={20} />
        </div>
        <span className="text-lg font-bold text-gray-900">Recoverly</span>
      </div>

      <nav className="flex-1 px-3 py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.page)}
            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              currentPage === item.page
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-gray-200 px-3 py-2">
        <button className="mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100">
          <HelpCircle size={20} />
          Help
        </button>
        <button
          onClick={() => { logout(); onNavigate('landing'); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
        >
          <LogOut size={20} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block">
        {sidebar}
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <ShieldCheck size={18} />
          </div>
          <span className="font-bold text-gray-900">Recoverly</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-gray-100">
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl animate-slide-in-right">
            <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 rounded-lg p-2 hover:bg-gray-100">
              <X size={20} />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {state.isDemoData && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-700">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              <span className="font-medium">Demo data</span>
              <span className="text-brand-600">— This is sample data so you can explore Recoverly. Upload your own file to see your real records.</span>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
