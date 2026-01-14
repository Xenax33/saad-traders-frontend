'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardLayout from '../../components/DashboardLayout';
import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with actual API calls
  const invoices = [
    {
      id: 'INV-001',
      client: 'ABC Corporation',
      amount: 125000,
      date: '2026-01-14',
      dueDate: '2026-02-14',
      status: 'Paid',
      items: 3,
    },
    {
      id: 'INV-002',
      client: 'XYZ Industries',
      amount: 89500,
      date: '2026-01-13',
      dueDate: '2026-02-13',
      status: 'Pending',
      items: 5,
    },
    {
      id: 'INV-003',
      client: 'Tech Solutions Ltd',
      amount: 210000,
      date: '2026-01-12',
      dueDate: '2026-02-12',
      status: 'Paid',
      items: 8,
    },
    {
      id: 'INV-004',
      client: 'Global Traders',
      amount: 67800,
      date: '2026-01-11',
      dueDate: '2026-01-25',
      status: 'Overdue',
      items: 2,
    },
    {
      id: 'INV-005',
      client: 'Smart Systems Inc',
      amount: 156000,
      date: '2026-01-10',
      dueDate: '2026-02-10',
      status: 'Pending',
      items: 6,
    },
    {
      id: 'INV-006',
      client: 'Digital Media Co',
      amount: 92300,
      date: '2026-01-09',
      dueDate: '2026-02-09',
      status: 'Paid',
      items: 4,
    },
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || invoice.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-100 text-emerald-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-4 sm:space-y-6 w-full max-w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">All Invoices</h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Manage and track all your invoices
              </p>
            </div>
            <Link href="/dashboard/invoices/create" className="btn-primary inline-flex items-center justify-center gap-2 text-sm sm:text-base">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Create New Invoice</span>
              <span className="sm:hidden">New Invoice</span>
            </Link>
          </div>

          {/* Filters */}
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by invoice ID or client name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-slate-400" />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="input-field pl-10 appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                        Invoice ID
                      </th>
                      <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                        Client
                      </th>
                      <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                        Amount
                      </th>
                      <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap hidden md:table-cell">
                        Date
                      </th>
                      <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap hidden lg:table-cell">
                        Due Date
                      </th>
                      <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                        Status
                      </th>
                      <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                          <span className="font-semibold text-emerald-700 text-xs sm:text-sm">
                            {invoice.id}
                          </span>
                        </td>
                        <td className="py-3 px-3 sm:px-4">
                          <div>
                            <p className="font-medium text-slate-900 text-xs sm:text-sm">
                              {invoice.client}
                            </p>
                            <p className="text-xs text-slate-500">
                              {invoice.items} items
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                            PKR {invoice.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-3 sm:px-4 text-slate-600 text-xs sm:text-sm whitespace-nowrap hidden md:table-cell">{invoice.date}</td>
                        <td className="py-3 px-3 sm:px-4 text-slate-600 text-xs sm:text-sm whitespace-nowrap hidden lg:table-cell">{invoice.dueDate}</td>
                        <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button
                              className="p-1.5 sm:p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              className="p-1.5 sm:p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              className="p-1.5 sm:p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors hidden sm:block"
                              title="Download"
                            >
                              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                            <button
                              className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors hidden sm:block"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No invoices found
                </h3>
                <p className="text-slate-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="card">
              <p className="text-sm text-slate-600 mb-1">Total Invoices</p>
              <p className="text-2xl font-bold text-slate-900">{invoices.length}</p>
            </div>
            <div className="card">
              <p className="text-sm text-slate-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-slate-900">
                PKR{' '}
                {invoices
                  .reduce((sum, inv) => sum + inv.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-slate-600 mb-1">Pending Payments</p>
              <p className="text-2xl font-bold text-amber-600">
                PKR{' '}
                {invoices
                  .filter((inv) => inv.status === 'Pending')
                  .reduce((sum, inv) => sum + inv.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
