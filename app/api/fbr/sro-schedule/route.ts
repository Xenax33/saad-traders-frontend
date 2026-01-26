import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface SROSchedule {
  srO_ID: number;
  serNo: number;
  srO_DESC: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rateId = searchParams.get('rate_id');
    const date = searchParams.get('date');
    const originationSupplierCsv = searchParams.get('origination_supplier_csv');
    
    // Get token from Authorization header (Bearer token)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    if (!rateId || !date || !originationSupplierCsv) {
      return NextResponse.json(
        { error: 'rate_id, date, and origination_supplier_csv are required' },
        { status: 400 }
      );
    }

    const fbrApiUrl = 'https://gw.fbr.gov.pk/pdi/v1/SroSchedule';
    
    const response = await axios.get<SROSchedule[]>(fbrApiUrl, {
      params: {
        rate_id: rateId,
        date,
        origination_supplier_csv: originationSupplierCsv
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch SRO Schedule from FBR API';
    console.error('FBR SRO Schedule API Error:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
