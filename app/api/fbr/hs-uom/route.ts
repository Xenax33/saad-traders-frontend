import { NextRequest, NextResponse } from 'next/server';
import axiosInstance from '@/lib/axios';

interface HSUoM {
  uoM_ID: number;
  description: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hsCode = searchParams.get('hs_code');
    const annexureId = searchParams.get('annexure_id') || '1';
    
    // Get token from Authorization header (Bearer token)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!hsCode) {
      return NextResponse.json(
        { error: 'HS code is required' },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Make request to FBR API with Bearer token
    const response = await axiosInstance.get<HSUoM[]>(
      `https://gw.fbr.gov.pk/pdi/v2/HS_UOM?hs_code=${hsCode}&annexure_id=${annexureId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: unknown) {
    console.error('FBR HS_UOM API error:', error);

    if (error && typeof error === 'object' && ('name' in error) && (error.name === 'AbortError' || error.name === 'TimeoutError')) {
      return NextResponse.json(
        {
          error: 'Request timeout',
          message: 'FBR API request timed out after 30 seconds'
        },
        { status: 504 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch HS UoM data';
    const errorType = error && typeof error === 'object' && 'constructor' in error && error.constructor ? error.constructor.name : 'Error';

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: errorMessage,
        type: errorType
      },
      { status: 500 }
    );
  }
}
