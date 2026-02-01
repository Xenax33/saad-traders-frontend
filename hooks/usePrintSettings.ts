import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { printSettingsService } from '@/services/printSettings.service';
import type { SavePrintSettingsRequest } from '@/types/api';
import toast from 'react-hot-toast';

// Query keys
export const printSettingsKeys = {
  all: ['printSettings'] as const,
  settings: () => [...printSettingsKeys.all, 'current'] as const,
  availableFields: () => [...printSettingsKeys.all, 'availableFields'] as const,
};

/**
 * Hook to fetch current user's print settings
 * Returns custom settings or defaults if none exist
 */
export function usePrintSettings() {
  return useQuery({
    queryKey: printSettingsKeys.settings(),
    queryFn: () => printSettingsService.getPrintSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch available fields for print configuration
 */
export function useAvailableFields() {
  return useQuery({
    queryKey: printSettingsKeys.availableFields(),
    queryFn: () => printSettingsService.getAvailableFields(),
    staleTime: 30 * 60 * 1000, // 30 minutes (rarely changes)
  });
}

/**
 * Hook to save print settings (create or update)
 */
export function useSavePrintSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SavePrintSettingsRequest) => printSettingsService.savePrintSettings(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: printSettingsKeys.settings() });
      toast.success('Print settings saved successfully');
      
      // Show warning if column widths don't sum to 100%
      if (response.warning) {
        toast(response.warning, { 
          icon: '⚠️',
          duration: 5000,
        });
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to save print settings';
      toast.error(message);
    },
  });
}

/**
 * Hook to reset print settings to defaults
 */
export function useResetPrintSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => printSettingsService.resetPrintSettings(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: printSettingsKeys.settings() });
      toast.success('Print settings reset to defaults');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to reset print settings';
      toast.error(message);
    },
  });
}
