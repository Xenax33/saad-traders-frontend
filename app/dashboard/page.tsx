'use client';

import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data - replace with actual API calls
  const stats = [
    {
      name: 'Total Invoices',
      value: '124',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'bg-emerald-500',
    },
    {
      name: 'This Month',
      value: '18',
      change: '+8%',
      trend: 'up',
      icon: Calendar,
      color: 'bg-emerald-600',
    },
    {
      name: 'Total Revenue',
      value: 'PKR 2.4M',
      change: '+23%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-amber-500',
    },
    {
      name: 'Growth',
      value: '15.3%',
      change: '+4.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-emerald-700',
    },
  ];

  const recentInvoices = [
    {
      id: 'INV-001',
      client: 'ABC Corporation',
      amount: 'PKR 125,000',
      date: '2026-01-14',
      status: 'Paid',
    },
    {
      id: 'INV-002',
      client: 'XYZ Industries',
      amount: 'PKR 89,500',
      date: '2026-01-13',
      status: 'Pending',
    },
    {
      id: 'INV-003',
      client: 'Tech Solutions Ltd',
      amount: 'PKR 210,000',
      date: '2026-01-12',
      status: 'Paid',
    },
    {
      id: 'INV-004',
      client: 'Global Traders',
      amount: 'PKR 67,800',
      date: '2026-01-11',
      status: 'Overdue',
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4 sm:space-y-6 w-full max-w-full">
          {/* Welcome Section */}
          <div className="card bg-gradient-to-r from-emerald-700 to-emerald-600 text-white w-full">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Welcome back, {user?.name}!
                </h2>
                <p className="text-sm sm:text-base text-emerald-50">
                  Here's what's happening with your invoices today.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-emerald-600 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 lg:w-12 lg:h-12" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.name} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">
                        {stat.name}
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {stat.value}
                      </h3>
                      <div className="flex items-center gap-1">
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm font-semibold ${
                            stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                          }`}
                        >
                          {stat.change}
                        </span>
                        <span className="text-sm text-slate-500">vs last month</span>
                      </div>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Invoices */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Recent Invoices</h3>
              <a
                href="/dashboard/invoices"
                className="text-sm font-semibold text-blue-900 hover:text-blue-800"
              >
                View All →
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Invoice ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Client
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-900">
                          {invoice.id}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-700">{invoice.client}</td>
                      <td className="py-4 px-4 font-semibold text-slate-900">
                        {invoice.amount}
                      </td>
                      <td className="py-4 px-4 text-slate-600">{invoice.date}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            invoice.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : invoice.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/dashboard/invoices/create"
              className="card hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <FileText className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Create Invoice</h4>
                  <p className="text-sm text-slate-600">Generate a new invoice</p>
                </div>
              </div>
            </a>

            <a
              href="/dashboard/invoices"
              className="card hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <FileText className="w-6 h-6 text-emerald-600 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">View Invoices</h4>
                  <p className="text-sm text-slate-600">Browse all invoices</p>
                </div>
              </div>
            </a>

            <a
              href="/contact"
              className="card hover:shadow-lg transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                  <FileText className="w-6 h-6 text-amber-500 group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Get Support</h4>
                  <p className="text-sm text-slate-600">Contact our team</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
