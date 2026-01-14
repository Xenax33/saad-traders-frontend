'use client';

import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/DashboardLayout';
import { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientNTN, setClientNTN] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, rate: 0, amount: 0 },
  ]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (
    id: string,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call to your backend
      const invoiceData = {
        clientName,
        clientEmail,
        clientAddress,
        clientNTN,
        invoiceDate,
        dueDate,
        notes,
        items,
        total,
      };

      console.log('Invoice data:', invoiceData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to invoices page
      router.push('/dashboard/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 w-full max-w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Create New Invoice</h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">
                Create an invoice and validate it with FBR portal
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-outline inline-flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'Creating...' : 'Create Invoice'}
              </button>
            </div>
          </div>

          {/* Client Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Client Name *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="input-field"
                  placeholder="ABC Corporation"
                  required
                />
              </div>
              <div>
                <label className="label">Client Email *</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="input-field"
                  placeholder="client@example.com"
                  required
                />
              </div>
              <div>
                <label className="label">Client NTN (Tax Number)</label>
                <input
                  type="text"
                  value={clientNTN}
                  onChange={(e) => setClientNTN(e.target.value)}
                  className="input-field"
                  placeholder="1234567-8"
                />
              </div>
              <div>
                <label className="label">Client Address *</label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="input-field"
                  placeholder="123 Business Street, City"
                  required
                />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Invoice Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Invoice Date *</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Due Date *</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input-field"
                  required
                  min={invoiceDate}
                />
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Invoice Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="btn-secondary inline-flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 p-4 bg-slate-50 rounded-lg"
                >
                  <div className="col-span-12 md:col-span-5">
                    <label className="label">Description *</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, 'description', e.target.value)
                      }
                      className="input-field"
                      placeholder="Product or service description"
                      required
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="label">Quantity *</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                      }
                      className="input-field"
                      min="0"
                      step="1"
                      required
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <label className="label">Rate (PKR) *</label>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)
                      }
                      className="input-field"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <label className="label">Amount</label>
                    <div className="input-field bg-slate-100 text-slate-700 font-semibold">
                      {item.amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="max-w-md ml-auto space-y-3">
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-3">
                  <span>Total Amount:</span>
                  <span>PKR {total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-slate-600 italic">
                  * Tax calculations will be handled by FBR portal validation
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Additional Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field resize-none"
              rows={4}
              placeholder="Add any additional notes or payment terms..."
            />
          </div>

          {/* Submit Button (Mobile) */}
          <div className="flex gap-3 md:hidden">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
