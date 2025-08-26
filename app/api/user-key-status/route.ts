import { PROVIDERS } from "@/lib/providers"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const SUPPORTED_PROVIDERS = PROVIDERS.map((p) => p.id)

export async function GET() {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not available" },
        { status: 500 }
      )
    }

    // Get available ENV providers
    const { env } = await import("@/lib/openproviders/env")
    const envProviders = new Set<string>()
    
    if (env.OPENAI_API_KEY) envProviders.add("openai")
    if (env.ANTHROPIC_API_KEY) envProviders.add("anthropic")
    if (env.XAI_API_KEY) envProviders.add("xai")
    if (env.OPENROUTER_API_KEY) envProviders.add("openrouter")

    const { data: authData } = await supabase.auth.getUser()

    if (!authData?.user?.id) {
      // Anonymous users get ENV provider status
      const providerStatus = SUPPORTED_PROVIDERS.reduce(
        (acc, provider) => {
          acc[provider] = envProviders.has(provider)
          return acc
        },
        {} as Record<string, boolean>
      )
      return NextResponse.json(providerStatus)
    }

    // Check if user is anonymous - they get ENV provider status
    if (authData.user.is_anonymous) {
      const providerStatus = SUPPORTED_PROVIDERS.reduce(
        (acc, provider) => {
          acc[provider] = envProviders.has(provider)
          return acc
        },
        {} as Record<string, boolean>
      )
      return NextResponse.json(providerStatus)
    }

    const { data, error } = await supabase
      .from("user_keys")
      .select("provider")
      .eq("user_id", authData.user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create status object for all supported providers
    // Provider is available if user has key OR ENV key exists
    const userProviders = data?.map((k) => k.provider) || []
    const providerStatus = SUPPORTED_PROVIDERS.reduce(
      (acc, provider) => {
        acc[provider] = userProviders.includes(provider) || envProviders.has(provider)
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
