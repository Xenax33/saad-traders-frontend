/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { X, RotateCcw, Save, AlertCircle, ArrowUpDown } from 'lucide-react';
import { usePrintSettings, useAvailableFields, useSavePrintSettings, useResetPrintSettings } from '@/hooks/usePrintSettings';
import FieldOrderingModal from './FieldOrderingModal';
import type { SavePrintSettingsRequest, AvailableField, FieldCategory, CustomFieldOption } from '@/types/api';

interface PrintSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrintSettingsModal({ isOpen, onClose }: PrintSettingsModalProps) {
  const { data: settingsData, isLoading: settingsLoading } = usePrintSettings();
  const { data: fieldsData, isLoading: fieldsLoading } = useAvailableFields();
  const saveMutation = useSavePrintSettings();
  const resetMutation = useResetPrintSettings();

  // Form state
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('small');
  const [tableBorders, setTableBorders] = useState(true);
  const [showItemNumbers, setShowItemNumbers] = useState(true);
  const [showOrderingModal, setShowOrderingModal] = useState(false);

  // Load settings when modal opens
  useEffect(() => {
    if (isOpen && settingsData && fieldsData) {
      const settings = settingsData.printSettings || settingsData.defaultSettings;
      if (settings) {
        // Get all required field keys
        const allFields = [...(fieldsData.fields || []), ...(fieldsData.customFields || [])];
        const requiredFieldKeys = allFields
          .filter(f => f.required)
          .map(f => f.key);

        // Ensure all required fields are included in visibleFields
        const settingsVisibleFields = settings.visibleFields;
        const mergedVisibleFields = [
          ...settingsVisibleFields,
          ...requiredFieldKeys.filter(key => !settingsVisibleFields.includes(key))
        ];

        // Ensure all required fields have column widths
        const mergedColumnWidths = { ...settings.columnWidths };
        requiredFieldKeys.forEach(key => {
          if (!mergedColumnWidths[key]) {
            const field = allFields.find(f => f.key === key);
            if (field) {
              mergedColumnWidths[key] = Math.floor((field.minWidth + field.maxWidth) / 2);
            }
          }
        });

        setVisibleFields(mergedVisibleFields);
        setColumnWidths(mergedColumnWidths);
        setFontSize(settings.fontSize);
        setTableBorders(settings.tableBorders);
        setShowItemNumbers(settings.showItemNumbers);
      }
    }
  }, [isOpen, settingsData, fieldsData]);

  if (!isOpen) return null;

  const fields = fieldsData?.fields || [];
  const customFields = fieldsData?.customFields || [];
  const categories = fieldsData?.categories || [];

  // Helper function to handle both regular and custom fields
  const handleFieldToggle = (fieldKey: string, minWidth: number, maxWidth: number, required: boolean) => {
    if (required) return; // Can't toggle required fields

    if (visibleFields.includes(fieldKey)) {
      setVisibleFields(visibleFields.filter(f => f !== fieldKey));
    } else {
      setVisibleFields([...visibleFields, fieldKey]);
      // Set default width if not exists
      if (!columnWidths[fieldKey]) {
        const defaultWidth = Math.floor((minWidth + maxWidth) / 2);
        setColumnWidths({ ...columnWidths, [fieldKey]: defaultWidth });
      }
    }
  };

  // Calculate total width
  const totalWidth = visibleFields.reduce((sum, fieldKey) => {
    return sum + (columnWidths[fieldKey] || 0);
  }, 0);

  const isWidthWarning = totalWidth < 95 || totalWidth > 105;

  // Render a field item (works for both regular and custom fields)
  const renderFieldItem = (fieldKey: string, label: string, description: string, minWidth: number, maxWidth: number, required: boolean) => {
    const isVisible = visibleFields.includes(fieldKey);
    const width = columnWidths[fieldKey] || minWidth;

    return (
      <div
        key={fieldKey}
        className={`border rounded-lg p-4 transition-all ${
          isVisible
            ? 'border-violet-500/30 bg-violet-500/5'
            : 'border-white/10 bg-white/5 opacity-60'
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div className="pt-1">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={() => handleFieldToggle(fieldKey, minWidth, maxWidth, required)}
              disabled={required}
              className="h-5 w-5 rounded border-white/20 bg-white/10 text-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Field Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-white">
                {label}
              </label>
              {required && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-semibold">
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-0.5">{description}</p>

            {/* Width Slider */}
            {isVisible && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-stone-400">Column Width</span>
                  <span className="text-xs font-semibold text-violet-300">{width}%</span>
                </div>
                <input
                  type="range"
                  min={minWidth}
                  max={maxWidth}
                  value={width}
                  onChange={(e) => handleWidthChange(fieldKey, parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Handle width change
  const handleWidthChange = (fieldKey: string, width: number) => {
    setColumnWidths({ ...columnWidths, [fieldKey]: width });
  };

  // Handle save
  const handleSave = () => {
    const data: SavePrintSettingsRequest = {
      visibleFields,
      columnWidths,
      fontSize,
      tableBorders,
      showItemNumbers,
    };

    saveMutation.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  // Handle field reordering
  const handleSaveOrder = (newOrder: string[]) => {
    setVisibleFields(newOrder);
  };

  // Handle reset
  const handleReset = () => {
    if (confirm('Are you sure you want to reset print settings to defaults? This cannot be undone.')) {
      resetMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  // Group fields by category
  const fieldsByCategory = categories
    .sort((a, b) => a.order - b.order)
    .map(category => ({
      ...category,
      fields: fields.filter(f => f.category === category.key),
    }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-white/10 bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-xl px-6 py-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Configure Print Settings</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-6">
          {(settingsLoading || fieldsLoading) ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Fields Selection by Category */}
              {fieldsByCategory.map(category => (
                <div key={category.key}>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-violet-400" />
                    {category.label}
                  </h3>
                  <div className="space-y-3">
                    {category.fields.map(field => 
                      renderFieldItem(field.key, field.label, field.description, field.minWidth, field.maxWidth, field.required)
                    )}
                  </div>
                </div>
              ))}

              {/* Custom Fields Section */}
              {customFields.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-violet-400" />
                    Custom Fields
                  </h3>
                  <div className="space-y-3">
                    {customFields.map(field => 
                      renderFieldItem(field.key, field.label, field.description, field.minWidth, field.maxWidth, field.required)
                    )}
                  </div>
                </div>
              )}

              {/* Field Ordering Button */}
              {visibleFields.length > 1 && (
                <div className="rounded-lg p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-2 border-violet-500/30">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Column Order</h4>
                      <p className="text-xs text-stone-400">
                        Drag and drop fields to customize the order they appear in your invoice PDF
                      </p>
                    </div>
                    <button
                      onClick={() => setShowOrderingModal(true)}
                      className="rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white hover:from-violet-600 hover:to-purple-600 transition-all flex items-center gap-2 shadow-lg whitespace-nowrap"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                      Reorder Fields
                    </button>
                  </div>
                </div>
              )}

              {/* Total Width Warning */}
              {visibleFields.length > 0 && (
                <div className={`rounded-lg p-4 ${
                  isWidthWarning
                    ? 'bg-amber-500/10 border-2 border-amber-500/30'
                    : 'bg-green-500/10 border-2 border-green-500/30'
                }`}>
                  <div className="flex items-center gap-3">
                    <AlertCircle className={`h-5 w-5 ${isWidthWarning ? 'text-amber-400' : 'text-green-400'}`} />
                    <div>
                      <p className={`text-sm font-semibold ${isWidthWarning ? 'text-amber-200' : 'text-green-200'}`}>
                        Total Width: {totalWidth}%
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {isWidthWarning ? 'Recommended: 95-105%' : 'Column widths look good!'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Settings */}
              <div className="border-t-2 border-white/10 pt-6">
                <h3 className="text-lg font-bold text-white mb-4">Additional Settings</h3>

                <div className="space-y-4">
                  {/* Show Item Numbers */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <label className="text-sm font-semibold text-white">Show Item Numbers</label>
                      <p className="text-xs text-stone-400 mt-0.5">Display row numbers in the table</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={showItemNumbers}
                      onChange={(e) => setShowItemNumbers(e.target.checked)}
                      className="h-5 w-5 rounded border-white/20 bg-white/10 text-violet-500 focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  {/* Table Borders */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <label className="text-sm font-semibold text-white">Show Table Borders</label>
                      <p className="text-xs text-stone-400 mt-0.5">Display borders around table cells</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={tableBorders}
                      onChange={(e) => setTableBorders(e.target.checked)}
                      className="h-5 w-5 rounded border-white/20 bg-white/10 text-violet-500 focus:ring-2 focus:ring-violet-500"
                    />
                  </div>

                  {/* Font Size */}
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <label className="text-sm font-semibold text-white block mb-3">Font Size</label>
                    <div className="flex gap-3">
                      {(['small', 'medium', 'large'] as const).map(size => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                            fontSize === size
                              ? 'bg-violet-500 text-white'
                              : 'bg-white/10 text-stone-300 hover:bg-white/20'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between border-t-2 border-white/10 bg-slate-900/95 backdrop-blur-xl px-6 py-4">
          <button
            onClick={handleReset}
            disabled={resetMutation.isPending || !settingsData?.printSettings}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-stone-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-stone-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saveMutation.isPending || visibleFields.length === 0}
              className="rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-2 text-sm font-semibold text-white hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg"
            >
              <Save className="h-4 w-4" />
              {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Field Ordering Modal */}
      <FieldOrderingModal
        isOpen={showOrderingModal}
        onClose={() => setShowOrderingModal(false)}
        visibleFields={visibleFields}
        columnWidths={columnWidths}
        onSave={handleSaveOrder}
        allFields={fields}
        customFields={customFields}
      />
    </div>
  );
}
