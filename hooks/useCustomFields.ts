import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customFieldService } from '@/services/customField.service';
import type { CreateCustomFieldRequest, UpdateCustomFieldRequest } from '@/types/api';
import toast from 'react-hot-toast';

// Query keys
export const customFieldKeys = {
  all: ['customFields'] as const,
  lists: () => [...customFieldKeys.all, 'list'] as const,
  list: (includeInactive?: boolean) => [...customFieldKeys.lists(), { includeInactive }] as const,
  details: () => [...customFieldKeys.all, 'detail'] as const,
  detail: (id: string) => [...customFieldKeys.details(), id] as const,
};

/**
 * Hook to fetch all custom fields
 */
export function useCustomFields(includeInactive?: boolean) {
  return useQuery({
    queryKey: customFieldKeys.list(includeInactive),
    queryFn: () => customFieldService.getCustomFields(includeInactive),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch a single custom field by ID
 */
export function useCustomField(id: string) {
  return useQuery({
    queryKey: customFieldKeys.detail(id),
    queryFn: () => customFieldService.getCustomFieldById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new custom field
 */
export function useCreateCustomField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomFieldRequest) => customFieldService.createCustomField(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customFieldKeys.lists() });
      toast.success('Custom field created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.errors?.[0]?.message || 'Failed to create custom field';
      toast.error(message);
    },
  });
}

/**
 * Hook to update a custom field
 */
export function useUpdateCustomField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomFieldRequest }) =>
      customFieldService.updateCustomField(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customFieldKeys.lists() });
      toast.success('Custom field updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update custom field';
      toast.error(message);
    },
  });
}

/**
 * Hook to delete a custom field
 */
export function useDeleteCustomField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, hardDelete }: { id: string; hardDelete?: boolean }) =>
      customFieldService.deleteCustomField(id, hardDelete),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customFieldKeys.lists() });
      toast.success('Custom field deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete custom field';
      toast.error(message);
    },
  });
}
