import axiosInstance from '@/lib/axios';
import type { CustomField, CreateCustomFieldRequest, UpdateCustomFieldRequest } from '@/types/api';

export const customFieldService = {
  /**
   * Get all custom fields for the authenticated user
   */
  async getCustomFields(includeInactive?: boolean): Promise<{ customFields: CustomField[]; results: number }> {
    const response = await axiosInstance.get('/v1/custom-fields', {
      params: { includeInactive }
    });
    return {
      customFields: response.data.data.customFields || [],
      results: response.data.results || 0
    };
  },

  /**
   * Get a single custom field by ID
   */
  async getCustomFieldById(id: string): Promise<CustomField> {
    const response = await axiosInstance.get(`/v1/custom-fields/${id}`);
    return response.data.data.customField;
  },

  /**
   * Create a new custom field
   */
  async createCustomField(data: CreateCustomFieldRequest): Promise<CustomField> {
    const response = await axiosInstance.post('/v1/custom-fields', data);
    return response.data.data.customField;
  },

  /**
   * Update an existing custom field
   */
  async updateCustomField(id: string, data: UpdateCustomFieldRequest): Promise<CustomField> {
    const response = await axiosInstance.put(`/v1/custom-fields/${id}`, data);
    return response.data.data.customField;
  },

  /**
   * Delete a custom field (soft delete by default)
   */
  async deleteCustomField(id: string, hardDelete?: boolean): Promise<void> {
    await axiosInstance.delete(`/v1/custom-fields/${id}`, {
      params: { hardDelete }
    });
  },
};
