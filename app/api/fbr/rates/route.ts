import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface Rate {
  ratE_ID: number;
  ratE_DESC: string;
  ratE_VALUE: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const transTypeId = searchParams.get('transTypeId');
    const originationSupplier = searchParams.get('originationSupplier');
    
    // Get token from Authorization header (Bearer token)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    if (!date || !transTypeId || !originationSupplier) {
      return NextResponse.json(
        { error: 'date, transTypeId, and originationSupplier are required' },
        { status: 400 }
      );
    }

    const fbrApiUrl = 'https://gw.fbr.gov.pk/pdi/v2/SaleTypeToRate';
    
    const response = await axios.get<Rate[]>(fbrApiUrl, {
      params: {
        date,
        transTypeId,
        originationSupplier
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch rates from FBR API';
    console.error('FBR Rates API Error:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
