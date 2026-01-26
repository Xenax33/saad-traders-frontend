'use client';

import { useState, useMemo } from 'react';
import UserLayout from '@/components/layouts/UserLayout';
import { useBuyers, useCreateBuyer, useUpdateBuyer, useDeleteBuyer } from '@/hooks/useBuyers';
import type { Buyer, CreateBuyerRequest } from '@/types/api';
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash2,
  Users,
  Building2,
  MapPin,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';

const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Gilgit-Baltistan',
  'Azad Jammu and Kashmir',
];

export default function BuyersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [registrationFilter, setRegistrationFilter] = useState<'ALL' | 'Registered' | 'Unregistered'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateBuyerRequest>({
    ntncnic: '',
    businessName: '',
    province: '',
    address: '',
    registrationType: 'Registered',
  });

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, string | number | boolean> = {
      page: currentPage,
      limit: 10,
    };
    if (searchTerm) params.search = searchTerm;
    if (registrationFilter !== 'ALL') params.registrationType = registrationFilter;
    return params;
  }, [currentPage, searchTerm, registrationFilter]);

  // React Query hooks
  const { data, isLoading } = useBuyers(queryParams);
  const createBuyer = useCreateBuyer();
  const updateBuyer = useUpdateBuyer();
  const deleteBuyer = useDeleteBuyer();

  const buyers = data?.data || [];
  const totalBuyers = data?.pagination.total || 0;
  const totalPages = data?.pagination.totalPages || 1;

  // Create buyer
  const handleCreateBuyer = async (e: React.FormEvent) => {
    e.preventDefault();
    await createBuyer.mutateAsync(formData);
    setShowCreateModal(false);
    resetForm();
  };

  // Open edit modal
  const openEditModal = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setFormData({
      ntncnic: buyer.ntncnic,
      businessName: buyer.businessName,
      province: buyer.province,
      address: buyer.address,
      registrationType: buyer.registrationType,
    });
    setShowEditModal(true);
  };

  // Update buyer
  const handleUpdateBuyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBuyer) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ntncnic: _ntncnic, ...updateData } = formData;
    await updateBuyer.mutateAsync({ id: selectedBuyer.id, data: updateData });
    setShowEditModal(false);
    resetForm();
  };

  // Open delete modal
  const openDeleteModal = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setShowDeleteModal(true);
  };

  // Delete buyer
  const handleDeleteBuyer = async () => {
    if (!selectedBuyer) return;
    await deleteBuyer.mutateAsync(selectedBuyer.id);
    setShowDeleteModal(false);
    setSelectedBuyer(null);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      ntncnic: '',
      businessName: '',
      province: '',
      address: '',
      registrationType: 'Registered',
    });
    setSelectedBuyer(null);
  };

  return (
    <UserLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Buyers Management</h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 flex items-center">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-blue-600" />
              Manage your buyer information
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 group"
          >
            <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Add Buyer
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-6 shadow-lg border border-slate-200">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by NTN/CNIC, business name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Registration Type Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">Registration Type</label>
              <select
                value={registrationFilter}
                onChange={(e) => {
                  setRegistrationFilter(e.target.value as 'ALL' | 'Registered' | 'Unregistered');
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              >
                <option value="ALL">All Types</option>
                <option value="Registered">Registered</option>
                <option value="Unregistered">Unregistered</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 sm:mt-5 flex items-center justify-between border-t-2 border-slate-200 pt-4 sm:pt-5">
            <p className="text-xs sm:text-sm text-slate-600 flex items-center">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-blue-600" />
              Showing <span className="font-bold text-slate-900 mx-1">{buyers.length}</span> of{' '}
              <span className="font-bold text-slate-900 ml-1">{totalBuyers}</span> buyers
            </p>
          </div>
        </div>

        {/* Buyers Table */}
        <div className="rounded-xl sm:rounded-2xl bg-white shadow-lg border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-lg"></div>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600 font-medium">Loading buyers...</p>
            </div>
          ) : buyers.length === 0 ? (
            <div className="py-12 sm:py-16 text-center">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-slate-300 mb-3 sm:mb-4" />
              <p className="text-slate-600 font-medium text-sm sm:text-base">No buyers found</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">Create your first buyer to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider hidden md:table-cell">
                      Location
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {buyers.map((buyer) => (
                    <tr key={buyer.id} className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200 group">
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm sm:text-base flex items-center">
                            <Building2 className="h-4 w-4 mr-1.5 text-blue-600 flex-shrink-0" />
                            <span className="truncate">{buyer.businessName}</span>
                          </p>
                          <p className="text-xs sm:text-sm text-slate-600 flex items-center mt-0.5">
                            <CreditCard className="h-3 w-3 mr-1 flex-shrink-0" />
                            {buyer.ntncnic}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div>
                          <p className="font-medium text-slate-900 flex items-center text-sm sm:text-base">
                            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{buyer.province}</span>
                          </p>
                          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 truncate">{buyer.address}</p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold shadow-sm ${
                            buyer.registrationType === 'Registered'
                              ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300'
                              : 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {buyer.registrationType === 'Registered' ? (
                            <ShieldCheck className="h-3 w-3 mr-1" />
                          ) : (
                            <ShieldAlert className="h-3 w-3 mr-1" />
                          )}
                          {buyer.registrationType}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => openEditModal(buyer)}
                            className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center group/btn"
                            title="Edit buyer"
                          >
                            <Edit className="h-3.5 w-3.5 sm:mr-1 group-hover/btn:rotate-12 transition-transform duration-200" />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => openDeleteModal(buyer)}
                            className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center group/btn"
                            title="Delete buyer"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:mr-1 group-hover/btn:rotate-12 transition-transform duration-200" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 px-4 sm:px-6 py-3 sm:py-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
                Previous
              </button>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-slate-200 shadow-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-300 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Buyer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 rounded-t-xl sm:rounded-t-2xl border-b-2 border-blue-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Add New Buyer</h3>
              </div>
            </div>
            <form onSubmit={handleCreateBuyer} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  <CreditCard className="inline h-4 w-4 mr-1.5 text-blue-600" />
                  NTN/CNIC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={13}
                  value={formData.ntncnic}
                  onChange={(e) => setFormData({ ...formData, ntncnic: e.target.value })}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter 13-digit NTN/CNIC"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  <Building2 className="inline h-4 w-4 mr-1.5 text-blue-600" />
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter business name"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1.5 text-blue-600" />
                  Province <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Select Province</option>
                  {PROVINCES.map((province) => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Registration Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.registrationType}
                  onChange={(e) => setFormData({ ...formData, registrationType: e.target.value as 'Registered' | 'Unregistered' })}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Registered">Registered</option>
                  <option value="Unregistered">Unregistered</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  disabled={createBuyer.isPending}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl border-2 border-slate-300 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createBuyer.isPending}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createBuyer.isPending ? 'Creating...' : 'Create Buyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Buyer Modal */}
      {showEditModal && selectedBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 rounded-t-xl sm:rounded-t-2xl border-b-2 border-blue-700">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Edit className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Edit Buyer</h3>
              </div>
            </div>
            <form onSubmit={handleUpdateBuyer} className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  <CreditCard className="inline h-4 w-4 mr-1.5 text-blue-600" />
                  NTN/CNIC
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.ntncnic}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-slate-50 text-slate-500"
                />
                <p className="mt-1 text-xs text-slate-500">NTN/CNIC cannot be changed</p>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  <Building2 className="inline h-4 w-4 mr-1.5 text-blue-600" />
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1.5 text-blue-600" />
                  Province <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Select Province</option>
                  {PROVINCES.map((province) => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Registration Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.registrationType}
                  onChange={(e) => setFormData({ ...formData, registrationType: e.target.value as 'Registered' | 'Unregistered' })}
                  className="w-full rounded-lg sm:rounded-xl border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Registered">Registered</option>
                  <option value="Unregistered">Unregistered</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t-2 border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl border-2 border-slate-300 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                >
                  Update Buyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-md rounded-xl sm:rounded-2xl bg-white shadow-2xl border-2 border-slate-200">
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 py-4 sm:py-5 rounded-t-xl sm:rounded-t-2xl border-b-2 border-red-800">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Delete Buyer</h3>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-slate-700 mb-4">
                Are you sure you want to delete <span className="font-bold text-slate-900">{selectedBuyer.businessName}</span>?
              </p>
              <p className="text-xs sm:text-sm text-red-600 mb-4">
                This action cannot be undone. The buyer will be permanently removed.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedBuyer(null);
                  }}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl border-2 border-slate-300 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteBuyer}
                  className="w-full sm:flex-1 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-semibold text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
