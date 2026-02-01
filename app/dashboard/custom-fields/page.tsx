'use client';

import { useState } from 'react';
import UserLayout from '@/components/layouts/UserLayout';
import { useCustomFields, useCreateCustomField, useUpdateCustomField, useDeleteCustomField } from '@/hooks/useCustomFields';
import { Sparkles, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Type, Hash, Calendar, AlignLeft, X } from 'lucide-react';
import type { CustomField, CreateCustomFieldRequest, UpdateCustomFieldRequest } from '@/types/api';

export default function CustomFieldsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedField, setSelectedField] = useState<CustomField | null>(null);
  const [includeInactive, setIncludeInactive] = useState(false);

  // Form state
  const [formData, setFormData] = useState<CreateCustomFieldRequest>({
    fieldName: '',
    fieldType: 'text',
  });

  // Hooks
  const { data, isLoading } = useCustomFields(includeInactive);
  const createField = useCreateCustomField();
  const updateField = useUpdateCustomField();
  const deleteField = useDeleteCustomField();

  const customFields = data?.customFields || [];

  // Field type icons and labels
  const fieldTypeConfig = {
    text: { icon: Type, label: 'Text', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    number: { icon: Hash, label: 'Number', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    date: { icon: Calendar, label: 'Date', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    textarea: { icon: AlignLeft, label: 'Long Text', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  };

  // Handlers
  const handleCreate = async () => {
    if (!formData.fieldName.trim()) {
      alert('Please enter a field name');
      return;
    }

    await createField.mutateAsync(formData);
    setShowCreateModal(false);
    setFormData({ fieldName: '', fieldType: 'text' });
  };

  const handleEdit = async () => {
    if (!selectedField) return;

    const updateData: UpdateCustomFieldRequest = {
      fieldName: formData.fieldName,
      fieldType: formData.fieldType,
    };

    await updateField.mutateAsync({ id: selectedField.id, data: updateData });
    setShowEditModal(false);
    setSelectedField(null);
    setFormData({ fieldName: '', fieldType: 'text' });
  };

  const handleToggleActive = async (field: CustomField) => {
    await updateField.mutateAsync({
      id: field.id,
      data: { isActive: !field.isActive }
    });
  };

  const handleDelete = async () => {
    if (!selectedField) return;
    await deleteField.mutateAsync({ id: selectedField.id, hardDelete: false });
    setShowDeleteModal(false);
    setSelectedField(null);
  };

  const openEditModal = (field: CustomField) => {
    setSelectedField(field);
    setFormData({
      fieldName: field.fieldName,
      fieldType: field.fieldType,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (field: CustomField) => {
    setSelectedField(field);
    setShowDeleteModal(true);
  };

  return (
    <UserLayout>
      <div className="min-h-screen pb-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 border border-white/10 backdrop-blur-xl mb-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(217,70,239,0.15),transparent_50%)]" />
          <div className="relative px-8 py-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                  <span className="text-xs font-semibold text-violet-200 tracking-wide uppercase">Custom Fields</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                  Define Your Data
                </h1>
                <p className="text-stone-300 text-lg max-w-2xl leading-relaxed">
                  Create custom fields to track additional invoice data specific to your business needs. 
                  <span className="text-violet-300 font-medium"> Fields are stored locally and not sent to FBR.</span>
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-900/30 transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>New Field</span>
              </button>
            </div>

            {/* Filter Toggle */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setIncludeInactive(!includeInactive)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  includeInactive
                    ? 'bg-violet-500/20 border-violet-500/40 text-violet-200'
                    : 'bg-white/5 border-white/20 text-stone-400 hover:bg-white/10'
                }`}
              >
                {includeInactive ? (
                  <ToggleRight className="h-4 w-4" />
                ) : (
                  <ToggleLeft className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">Show Inactive Fields</span>
              </button>
              <div className="text-sm text-stone-400">
                {customFields.length} {customFields.length === 1 ? 'field' : 'fields'} total
              </div>
            </div>
          </div>
        </div>

        {/* Fields Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
          </div>
        ) : customFields.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/30 mb-4">
              <Sparkles className="h-8 w-8 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Custom Fields Yet</h3>
            <p className="text-stone-400 mb-6 max-w-md mx-auto">
              Create your first custom field to start tracking additional data on your invoices.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-900/30 transition-all duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Create First Field</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customFields.map((field) => {
              const config = fieldTypeConfig[field.fieldType];
              const Icon = config.icon;

              return (
                <div
                  key={field.id}
                  className={`group relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] ${
                    field.isActive
                      ? 'bg-white/5 border-white/10 hover:border-violet-500/50'
                      : 'bg-white/[0.02] border-white/5 opacity-60'
                  }`}
                >
                  {/* Active indicator */}
                  {!field.isActive && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/30">
                      <span className="text-xs font-medium text-red-300">Inactive</span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Field Type Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${config.bg} border ${config.border} mb-4`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                      <span className={`text-xs font-semibold ${config.color} uppercase tracking-wide`}>
                        {config.label}
                      </span>
                    </div>

                    {/* Field Name */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                      {field.fieldName}
                    </h3>

                    {/* Metadata */}
                    <div className="flex items-center gap-3 text-xs text-stone-400 mb-4">
                      <span>Created {new Date(field.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleToggleActive(field)}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                          field.isActive
                            ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                        }`}
                      >
                        {field.isActive ? (
                          <>
                            <ToggleLeft className="h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <ToggleRight className="h-4 w-4" />
                            Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => openEditModal(field)}
                        className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-all duration-200"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(field)}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Create Custom Field</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-stone-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-stone-200 mb-2">
                    Field Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fieldName}
                    onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                    placeholder="e.g., Purchase Order Number"
                    className="w-full rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 px-4 py-3 text-white placeholder-stone-400 focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-200 mb-2">
                    Field Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(fieldTypeConfig).map(([type, config]) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={type}
                          onClick={() => setFormData({ ...formData, fieldType: type as any })}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                            formData.fieldType === type
                              ? `${config.bg} ${config.border} shadow-lg`
                              : 'bg-white/5 border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${formData.fieldType === type ? config.color : 'text-stone-400'}`} />
                          <span className={`font-medium ${formData.fieldType === type ? 'text-white' : 'text-stone-300'}`}>
                            {config.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={createField.isPending}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-violet-900/30 transition-all duration-200 disabled:opacity-50"
                >
                  {createField.isPending ? 'Creating...' : 'Create Field'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedField && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Edit Custom Field</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedField(null);
                      setFormData({ fieldName: '', fieldType: 'text' });
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-stone-400" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-stone-200 mb-2">
                    Field Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fieldName}
                    onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
                    className="w-full rounded-lg bg-white/5 backdrop-blur-sm border-2 border-white/20 px-4 py-3 text-white placeholder-stone-400 focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-200 mb-2">
                    Field Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(fieldTypeConfig).map(([type, config]) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={type}
                          onClick={() => setFormData({ ...formData, fieldType: type as any })}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                            formData.fieldType === type
                              ? `${config.bg} ${config.border} shadow-lg`
                              : 'bg-white/5 border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${formData.fieldType === type ? config.color : 'text-stone-400'}`} />
                          <span className={`font-medium ${formData.fieldType === type ? 'text-white' : 'text-stone-300'}`}>
                            {config.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedField(null);
                    setFormData({ fieldName: '', fieldType: 'text' });
                  }}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  disabled={updateField.isPending}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-cyan-900/30 transition-all duration-200 disabled:opacity-50"
                >
                  {updateField.isPending ? 'Updating...' : 'Update Field'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedField && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900/95 backdrop-blur-xl border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold text-white">Deactivate Custom Field</h2>
              </div>

              <div className="p-6">
                <p className="text-stone-300 mb-4">
                  Are you sure you want to deactivate <span className="font-semibold text-white">"{selectedField.fieldName}"</span>?
                </p>
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-sm text-amber-200">
                    <strong>Note:</strong> This will soft-delete the field. Historical data will be preserved, 
                    but the field cannot be used for new invoices.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedField(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteField.isPending}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg shadow-red-900/30 transition-all duration-200 disabled:opacity-50"
                >
                  {deleteField.isPending ? 'Deactivating...' : 'Deactivate'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
