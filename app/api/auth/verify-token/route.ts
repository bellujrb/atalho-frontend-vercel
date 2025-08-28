import { NextRequest, NextResponse } from 'next/server'
import { API_CONFIG } from '@/config/api.config'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 })
    }

    // Fazer chamada para o backend para verificar o token
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      return NextResponse.json({ valid: true })
    } else {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }
  } catch (error) {
    console.error('Erro ao verificar token:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}