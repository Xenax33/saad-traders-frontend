'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  MessageSquare,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
    { name: 'Create Invoice', href: '/dashboard/invoices/create', icon: PlusCircle },
    { name: 'Contact Support', href: '/contact', icon: MessageSquare },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-emerald-700 text-white transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-700" />
              </div>
              <span className="text-xl font-bold">FBR Invoice</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-slate-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      active
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-emerald-50 hover:bg-emerald-600 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="px-4 py-4 border-t border-emerald-600">
            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-600 rounded-lg mb-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-emerald-100 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-emerald-50 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 w-full">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 w-full">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-full">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900 flex-shrink-0"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 truncate px-4">
              {navigation.find((item) => isActive(item.href))?.name || 'Dashboard'}
            </h1>
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              <span className="text-xs lg:text-sm text-slate-600">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 w-full max-w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
