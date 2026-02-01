/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { X, GripVertical, Save, Eye } from 'lucide-react';
import type { AvailableField, CustomFieldOption } from '@/types/api';

interface FieldOrderingModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibleFields: string[];
  columnWidths: Record<string, number>;
  onSave: (newOrder: string[]) => void;
  allFields: AvailableField[];
  customFields: CustomFieldOption[];
}

interface FieldItem {
  key: string;
  label: string;
  width: number;
  isCustom: boolean;
}

export default function FieldOrderingModal({
  isOpen,
  onClose,
  visibleFields,
  columnWidths,
  onSave,
  allFields,
  customFields,
}: FieldOrderingModalProps) {
  const [orderedFields, setOrderedFields] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Initialize ordered fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setOrderedFields([...visibleFields]);
    }
  }, [isOpen, visibleFields]);

  if (!isOpen) return null;

  // Get field info
  const getFieldInfo = (fieldKey: string): FieldItem => {
    const isCustom = fieldKey.startsWith('customField_');
    
    if (isCustom) {
      const customField = customFields.find(f => f.key === fieldKey);
      return {
        key: fieldKey,
        label: customField?.label || fieldKey,
        width: columnWidths[fieldKey] || 10,
        isCustom: true,
      };
    } else {
      const field = allFields.find(f => f.key === fieldKey);
      return {
        key: fieldKey,
        label: field?.label || fieldKey,
        width: columnWidths[fieldKey] || 10,
        isCustom: false,
      };
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrderedFields = [...orderedFields];
    const draggedItem = newOrderedFields[draggedIndex];
    
    // Remove from old position
    newOrderedFields.splice(draggedIndex, 1);
    // Insert at new position
    newOrderedFields.splice(index, 0, draggedItem);
    
    setOrderedFields(newOrderedFields);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSave = () => {
    onSave(orderedFields);
    onClose();
  };

  const fieldItems = orderedFields.map(getFieldInfo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-white/10 shadow-2xl flex">
        
        {/* Left Side - Drag and Drop List */}
        <div className="w-1/2 border-r border-white/10 flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-white/10 bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-xl px-6 py-4">
            <div>
              <h2 className="text-xl font-bold text-white">Reorder Fields</h2>
              <p className="text-xs text-stone-400 mt-1">Drag fields to change their order</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-stone-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Draggable Field List */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-2">
              {orderedFields.map((fieldKey, index) => {
                const field = getFieldInfo(fieldKey);
                return (
                  <div
                    key={fieldKey}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-move ${
                      draggedIndex === index
                        ? 'border-violet-500 bg-violet-500/20 scale-105'
                        : 'border-white/10 bg-white/5 hover:border-violet-500/50 hover:bg-white/10'
                    }`}
                  >
                    {/* Drag Handle */}
                    <GripVertical className="h-5 w-5 text-stone-400" />
                    
                    {/* Position Number */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-500/20 text-violet-300 text-sm font-bold">
                      {index + 1}
                    </div>

                    {/* Field Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{field.label}</span>
                        {field.isCustom && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">Width: {field.width}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t-2 border-white/10 bg-slate-900/95 backdrop-blur-xl px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-stone-300 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-2 text-sm font-semibold text-white hover:from-violet-600 hover:to-purple-600 transition-all flex items-center gap-2 shadow-lg"
            >
              <Save className="h-4 w-4" />
              Save Order
            </button>
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="w-1/2 flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center gap-2 border-b-2 border-white/10 bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-xl px-6 py-4">
            <Eye className="h-5 w-5 text-violet-400" />
            <div>
              <h3 className="text-xl font-bold text-white">PDF Preview</h3>
              <p className="text-xs text-stone-400 mt-1">How your columns will appear</p>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="bg-white rounded-lg shadow-lg p-4">
              {/* Preview Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      {fieldItems.map((field) => (
                        <th
                          key={field.key}
                          style={{ width: `${field.width}%` }}
                          className="text-left p-2 text-xs font-bold text-gray-800 bg-gray-100"
                        >
                          {field.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Sample Row 1 */}
                    <tr className="border-b border-gray-200">
                      {fieldItems.map((field) => (
                        <td
                          key={field.key}
                          className="p-2 text-xs text-gray-700"
                        >
                          <div className="truncate">Sample data</div>
                        </td>
                      ))}
                    </tr>
                    {/* Sample Row 2 */}
                    <tr className="border-b border-gray-200">
                      {fieldItems.map((field) => (
                        <td
                          key={field.key}
                          className="p-2 text-xs text-gray-700"
                        >
                          <div className="truncate">Sample data</div>
                        </td>
                      ))}
                    </tr>
                    {/* Sample Row 3 */}
                    <tr className="border-b border-gray-200">
                      {fieldItems.map((field) => (
                        <td
                          key={field.key}
                          className="p-2 text-xs text-gray-700"
                        >
                          <div className="truncate">Sample data</div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Width Breakdown */}
              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                <h4 className="text-xs font-bold text-gray-700 mb-2">Column Width Distribution</h4>
                <div className="flex h-6 rounded overflow-hidden border border-gray-300">
                  {fieldItems.map((field, index) => (
                    <div
                      key={field.key}
                      style={{ width: `${field.width}%` }}
                      className="relative group"
                      title={`${field.label}: ${field.width}%`}
                    >
                      <div 
                        className={`h-full ${
                          field.isCustom 
                            ? 'bg-purple-400' 
                            : index % 2 === 0 ? 'bg-violet-400' : 'bg-violet-500'
                        }`}
                      />
                      {field.width > 8 && (
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                          {field.width}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                  <span>Total: {fieldItems.reduce((sum, f) => sum + f.width, 0)}%</span>
                  <span>{fieldItems.length} columns</span>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-violet-400" />
                  <span>Regular Fields</span>
                </div>
                {fieldItems.some(f => f.isCustom) && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-purple-400" />
                    <span>Custom Fields</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
