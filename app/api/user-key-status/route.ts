import { PROVIDERS } from "@/lib/providers"
import { NextResponse } from "next/server"

const SUPPORTED_PROVIDERS = PROVIDERS.map((p) => p.id)

export async function GET() {
  try {
    // Простая логика - все пользователи получают статус только на основе ENV ключей
    const { env } = await import("@/lib/openproviders/env")
    
    const providerStatus = SUPPORTED_PROVIDERS.reduce(
      (acc, provider) => {
        // Проверяем наличие ENV ключей для каждого провайдера
        switch (provider) {
          case "openai":
            acc[provider] = Boolean(env.OPENAI_API_KEY)
            break
          case "anthropic":
            acc[provider] = Boolean(env.ANTHROPIC_API_KEY)
            break
          case "xai":
            acc[provider] = Boolean(env.XAI_API_KEY)
            break
          case "openrouter":
            acc[provider] = Boolean(env.OPENROUTER_API_KEY)
            break
          default:
            acc[provider] = false
        }
        return acc
      },
      {} as Record<string, boolean>
    )

    return NextResponse.json(providerStatus)
  } catch (err) {
    console.error("Key status error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}