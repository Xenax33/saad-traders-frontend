import axiosInstance from '@/lib/axios';
import type { Invoice, CreateInvoiceRequest, CreateProductionInvoiceRequest, ValidateInvoiceRequest, ValidateInvoiceResponse, PaginatedResponse } from '@/types/api';

export interface GetInvoicesParams {
  page?: number;
  limit?: number;
  invoiceType?: string;
  isTestEnvironment?: boolean;
  startDate?: string;
  endDate?: string;
}

export const invoiceService = {
  /**
   * Get all invoices for the authenticated user
   */
  async getInvoices(params?: GetInvoicesParams): Promise<PaginatedResponse<Invoice>> {
    const response = await axiosInstance.get('/v1/invoices', { params });
    return {
      data: response.data.data.invoices || [],
      pagination: response.data.data.pagination,
    };
  },

  /**
   * Get a single invoice by ID
   */
  async getInvoiceById(id: string): Promise<Invoice> {
    const response = await axiosInstance.get(`/v1/invoices/${id}`);
    return response.data.data.invoice;
  },

  /**
   * Create and post a new invoice to FBR (Test Environment)
   */
  async createInvoice(data: CreateInvoiceRequest): Promise<{ invoice: Invoice; fbrResponse: Record<string, unknown> }> {
    const response = await axiosInstance.post('/v1/invoices', data);
    return response.data.data;
  },

  /**
   * Create and post a new invoice to FBR (Production Environment)
   */
  async createProductionInvoice(data: CreateProductionInvoiceRequest): Promise<{ invoice: Invoice; fbrResponse: Record<string, unknown> }> {
    const response = await axiosInstance.post('/v1/invoices/production', data);
    return response.data.data;
  },

  /**
   * Validate an invoice with FBR
   */
  async validateInvoice(data: ValidateInvoiceRequest): Promise<ValidateInvoiceResponse> {
    const response = await axiosInstance.post('/v1/invoices/validate', data);
    return response.data;
  },

  /**
   * Delete an invoice
   */
  async deleteInvoice(id: string): Promise<void> {
    await axiosInstance.delete(`/v1/invoices/${id}`);
  },
};
