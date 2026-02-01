import axiosInstance from '@/lib/axios';
import type { PrintSettings, SavePrintSettingsRequest, DefaultPrintSettings, AvailableField, FieldCategory, CustomFieldOption } from '@/types/api';

/**
 * Print Settings Service
 * Handles all API calls related to invoice print settings
 */

export const printSettingsService = {
  /**
   * Get current user's print settings
   * Returns custom settings if they exist, otherwise returns default settings
   */
  getPrintSettings: async (): Promise<{
    printSettings: PrintSettings | null;
    defaultSettings?: DefaultPrintSettings;
  }> => {
    const response = await axiosInstance.get('/v1/invoice-print-settings');
    return response.data.data;
  },

  /**
   * Save print settings (create or update)
   * Uses upsert logic on backend
   */
  savePrintSettings: async (data: SavePrintSettingsRequest): Promise<{
    printSettings: PrintSettings;
    warning?: string;
  }> => {
    const response = await axiosInstance.post('/v1/invoice-print-settings', data);
    return {
      printSettings: response.data.data.printSettings,
      warning: response.data.warning,
    };
  },

  /**
   * Reset print settings to defaults
   * Deletes user's custom settings
   */
  resetPrintSettings: async (): Promise<void> => {
    await axiosInstance.delete('/v1/invoice-print-settings');
  },

  /**
   * Get available fields metadata
   * Returns all fields that can be configured for printing, including custom fields
   */
  getAvailableFields: async (): Promise<{
    fields: AvailableField[];
    customFields: CustomFieldOption[];
    categories: FieldCategory[];
  }> => {
    const response = await axiosInstance.get('/v1/invoice-print-settings/available-fields');
    return response.data.data;
  },
};
