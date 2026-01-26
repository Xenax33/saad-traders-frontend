import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface UserAssignedScenario {
  assignmentId: string;
  scenarioId: string;
  scenarioCode: string;
  scenarioDescription: string;
  fbrId?: number;
  assignedAt: string;
}

/**
 * User Scenarios Service
 * Handles fetching scenarios assigned to the current user
 */
export const userScenariosService = {
  /**
   * Get all scenarios assigned to the authenticated user
   * GET /scenarios/my-scenarios
   */
  getMyScenarios: async (): Promise<
    ApiResponse<{ scenarios: UserAssignedScenario[] }>
  > => {
    const response = await axiosInstance.get('/v1/scenarios/my-scenarios');
    return response.data;
  },
};

export default userScenariosService;
