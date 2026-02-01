'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileBarChart, 
  Package, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon,
  Mail,
  Building2,
  ShieldCheck,
  Layers,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Redirect if not authenticated or not a user
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && user.role !== 'USER') {
      router.push('/admin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  if (!user || user.role !== 'USER') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Buyers', href: '/dashboard/buyers', icon: Users },
    { name: 'HS Codes', href: '/dashboard/hs-codes', icon: Package },
    { name: 'Scenarios', href: '/dashboard/scenarios', icon: Layers },
    { name: 'Custom Fields', href: '/dashboard/custom-fields', icon: Sparkles },
    { name: 'Invoices', href: '/dashboard/invoices', icon: FileBarChart },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden rounded-lg bg-white/10 backdrop-blur-md p-2 shadow-lg shadow-emerald-900/20 border border-white/10 hover:bg-white/20 transition-all duration-200"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <Menu className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col bg-slate-900/95 backdrop-blur-xl shadow-2xl border-r border-white/10">
          {/* Logo/Brand */}
          <div className="flex h-20 items-center justify-center border-b border-white/10 bg-gradient-to-r from-emerald-600 to-emerald-700 px-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shadow-lg shadow-emerald-900/30">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white drop-shadow-lg">FBR Invoice</h1>
                <p className="text-xs text-emerald-100">User Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                      : 'text-stone-300 hover:bg-white/10 hover:text-emerald-300 backdrop-blur-sm'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-emerald-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="border-t border-white/10 p-4 space-y-3">
            <div className="rounded-xl bg-white/5 backdrop-blur-xl p-4 border border-white/10 shadow-lg shadow-emerald-900/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-900/30">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-emerald-300 font-medium">User</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center text-stone-300/85 truncate">
                  <Mail className="h-3 w-3 mr-1.5 flex-shrink-0 text-emerald-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-stone-300/85 truncate">
                  <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0 text-emerald-400" />
                  <span className="truncate">{user.businessName}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-sm font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              <LogOut className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 lg:h-20 items-center justify-between border-b border-white/10 bg-slate-900/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 shadow-lg shadow-emerald-900/10">
          {/* Mobile: Add padding for menu button */}
          <div className="lg:hidden w-12"></div>
          
          <div className="flex-1 lg:flex-none">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              {pathname === '/dashboard' ? 'Dashboard' : 
               pathname === '/dashboard/buyers' ? 'Buyers Management' :
               pathname === '/dashboard/hs-codes' ? 'HS Codes Management' :
               pathname === '/dashboard/invoices' ? 'Invoices Management' : 'User Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-400 mt-0.5 hidden sm:block">
              {pathname === '/dashboard' ? 'Welcome back! Here\'s your overview' :
               pathname === '/dashboard/buyers' ? 'Manage your buyer information' :
               pathname === '/dashboard/hs-codes' ? 'Manage your HS codes' :
               pathname === '/dashboard/invoices' ? 'Create and manage invoices' : 'Manage your account'}
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <div className="text-right px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg shadow-emerald-900/20">
              <p className="text-xs lg:text-sm font-semibold text-white truncate max-w-[120px] lg:max-w-none">{user.name}</p>
              <p className="text-xs text-emerald-300 font-medium">User</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
