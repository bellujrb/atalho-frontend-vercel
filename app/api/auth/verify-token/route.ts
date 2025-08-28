import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/config/api.config'

export async function POST(request: NextRequest) {
  try {
    console.log('Token verification request received');
    
    // Aguardar a resolução dos headers
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      console.log('No authorization header provided');
      return NextResponse.json({ 
        error: 'Token não fornecido',
        message: 'Authorization header is missing',
        statusCode: 401 
      }, { status: 401 })
    }

    console.log('Authorization header found:', authHeader.substring(0, 20) + '...');
    console.log('Backend URL:', `${API_CONFIG.BASE_URL}/auth/verify-token`);

    // Fazer chamada para o backend para verificar o token
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    })

    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const responseData = await response.json();
      console.log('Backend response data:', responseData);
      return NextResponse.json({ valid: true, data: responseData })
    } else {
      const errorData = await response.text();
      console.log('Backend error response:', errorData);
      
      try {
        const parsedError = JSON.parse(errorData);
        return NextResponse.json({ 
          error: 'Token inválido',
          message: parsedError.message || 'Token validation failed',
          statusCode: response.status,
          details: parsedError
        }, { status: response.status })
      } catch {
        return NextResponse.json({ 
          error: 'Token inválido',
          message: 'Token validation failed',
          statusCode: response.status,
          details: errorData
        }, { status: response.status })
      }
    }
  } catch (error) {
    console.error('Erro ao verificar token:', error)
    return NextResponse.json({ 
      error: 'Erro interno',
      message: 'Internal server error during token verification',
      statusCode: 500,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}