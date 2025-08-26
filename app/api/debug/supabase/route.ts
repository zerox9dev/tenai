import { createClient } from '@/lib/supabase/server'
import { createGuestServerClient } from '@/lib/supabase/server-guest'
import { isSupabaseEnabled } from '@/lib/supabase/config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE,
      CSRF_SECRET: !!process.env.CSRF_SECRET,
      isSupabaseEnabled,
      NODE_ENV: process.env.NODE_ENV,
      // Показываем первые и последние символы ключей для проверки
      urlCheck: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 8) + '...' + process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(-8),
      anonKeyCheck: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10) + '...' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(-10),
      serviceRoleCheck: process.env.SUPABASE_SERVICE_ROLE?.slice(0, 10) + '...' + process.env.SUPABASE_SERVICE_ROLE?.slice(-10)
    }

    // Тестируем создание клиентов
    const serverClient = await createClient()
    const guestClient = await createGuestServerClient()

    // Простая проверка подключения
    let connectionTest = null
    try {
      if (serverClient) {
        // Пробуем простой запрос к auth для проверки подключения
        const { error } = await serverClient.auth.getSession()
        connectionTest = { 
          success: !error, 
          error: error?.message,
          hasClient: true
        }
      } else {
        connectionTest = { 
          success: false, 
          error: 'Supabase client not created',
          hasClient: false
        }
      }
    } catch (err) {
      connectionTest = { 
        success: false, 
        error: err instanceof Error ? err.message : 'Unknown error',
        hasClient: !!serverClient
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
