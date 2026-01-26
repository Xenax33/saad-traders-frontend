import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface SROItem {
  srO_ITEM_ID: number;
  srO_ITEM_DESC: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const sroId = searchParams.get('sro_id');
    
    // Get token from Authorization header (Bearer token)
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    if (!date || !sroId) {
      return NextResponse.json(
        { error: 'date and sro_id are required' },
        { status: 400 }
      );
    }

    const fbrApiUrl = 'https://gw.fbr.gov.pk/pdi/v2/SROItem';
    
    const response = await axios.get<SROItem[]>(fbrApiUrl, {
      params: {
        date,
        sro_id: sroId
      },
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch SRO Items from FBR API';
    console.error('FBR SRO Items API Error:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
