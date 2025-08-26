import { createClient } from '@/lib/supabase/server'
import { createGuestServerClient } from '@/lib/supabase/server-guest'
import { isSupabaseEnabled } from '@/lib/supabase/config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Проверка авторизации (только для отладки на проде)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== 'Bearer debug-key-2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE,
      CSRF_SECRET: !!process.env.CSRF_SECRET,
      isSupabaseEnabled,
      NODE_ENV: process.env.NODE_ENV
    }

    // Тестируем создание клиентов
    const serverClient = await createClient()
    const guestClient = await createGuestServerClient()

    // Простая проверка подключения
    let connectionTest = null
    try {
      if (serverClient) {
        const { data, error } = await serverClient.from('profiles').select('count').limit(1)
        connectionTest = { success: !error, error: error?.message }
      }
    } catch (err) {
      connectionTest = { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: envCheck,
      clients: {
        serverClient: !!serverClient,
        guestClient: !!guestClient
      },
      connectionTest
    })

  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
