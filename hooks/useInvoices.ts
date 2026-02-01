import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoiceService, GetInvoicesParams } from '@/services/invoice.service';
import type { CreateInvoiceRequest, CreateProductionInvoiceRequest, ValidateInvoiceRequest } from '@/types/api';
import toast from 'react-hot-toast';

// Helper function to handle API errors with validation messages
const handleApiError = (error: unknown, defaultMessage: string) => {
  const response = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response ? error.response.data : null;
  console.log('API Error Response:', response);
  // Check for validation errors array
  if (response && typeof response === 'object' && 'errors' in response && Array.isArray(response.errors)) {
    console.log('Validation Errors:', response.errors);
    // Show each validation error
    response.errors.forEach((err: { field: string; message: string }) => {
      toast.error(`${err.field}: ${err.message}`);
    });
  } else {
    // Show general error message
    const message = response && typeof response === 'object' && 'message' in response && typeof response.message === 'string' ? response.message : defaultMessage;
    console.log('General Error Message:', message);
    toast.error(message);
  }
};

// Query keys
export const invoiceKeys = {
  all: ['invoices'] as const,
  lists: () => [...invoiceKeys.all, 'list'] as const,
  list: (params: GetInvoicesParams) => [...invoiceKeys.lists(), params] as const,
  details: () => [...invoiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...invoiceKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated list of invoices
 */
export function useInvoices(params?: GetInvoicesParams) {
  return useQuery({
    queryKey: invoiceKeys.list(params || {}),
    queryFn: () => invoiceService.getInvoices(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch a single invoice by ID
 */
export function useInvoice(id: string) {
  return useQuery({
    queryKey: invoiceKeys.detail(id),
    queryFn: () => invoiceService.getInvoiceById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create and post a new invoice to FBR (Test Environment)
 */
export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceRequest) => invoiceService.createInvoice(data),
    onSuccess: (response: any) => {
      if (response.savedToDatabase) {
        queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
        toast.success('Invoice created and posted to FBR successfully');
      }
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to create invoice');
    },
  });
}

/**
 * Hook to create and post a new invoice to FBR (Production Environment)
 */
export function useCreateProductionInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductionInvoiceRequest) => invoiceService.createProductionInvoice(data),
    onSuccess: (response: any) => {
      // Check if invoice was saved to database (FBR validation successful)
      if (response.savedToDatabase) {
        queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
        toast.success('Invoice created and posted to FBR production successfully');
      }
      // If validation failed, the error will be handled by the component
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to create production invoice');
    },
  });
}

/**
 * Hook to validate an invoice with FBR
 */
export function useValidateInvoice() {
  return useMutation({
    mutationFn: (data: ValidateInvoiceRequest) => invoiceService.validateInvoice(data),
    onSuccess: (data) => {
      const result = data.data.validationResult;
      if (result.status === 'valid') {
        toast.success('Invoice is valid');
      } else {
        toast.error('Invoice validation failed');
      }
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to validate invoice');
    },
  });
}

/**
 * Hook to delete an invoice
 */
export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoiceService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invoiceKeys.lists() });
      toast.success('Invoice deleted successfully');
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to delete invoice');
    },
  });
}
