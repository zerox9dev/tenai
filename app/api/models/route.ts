import {
  getAllModels,
  getModelsForUserProviders,
  getModelsWithAccessFlags,
  getModelsWithEnvAccess,
  refreshModelsCache,
} from "@/lib/models"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    if (!supabase) {
      // For non-authenticated users, show models with ENV access
      const models = await getModelsWithEnvAccess()
      return new Response(JSON.stringify({ models }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const { data: authData } = await supabase.auth.getUser()

    if (!authData?.user?.id) {
      // For anonymous users, show models with ENV access
      const models = await getModelsWithEnvAccess()
      return new Response(JSON.stringify({ models }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const { data, error } = await supabase
      .from("user_keys")
      .select("provider")
      .eq("user_id", authData.user.id)

    if (error) {
      console.error("Error fetching user keys:", error)
      // Fallback to models with ENV access
      const models = await getModelsWithEnvAccess()
      return new Response(JSON.stringify({ models }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    const userProviders = data?.map((k) => k.provider) || []

    // Combine user provider models with ENV accessible models
    let models: any[]
    if (userProviders.length === 0) {
      // No user keys, show ENV accessible models
      models = await getModelsWithEnvAccess()
    } else {
      // User has some keys, combine user models with ENV models
      const userModels = await getModelsForUserProviders(userProviders)
      const envModels = await getModelsWithEnvAccess()
      
      // Create a map to avoid duplicates
      const modelMap = new Map()
      
      // Add user models first (they take priority)
      userModels.forEach(model => modelMap.set(model.id, model))
      
      // Add ENV models if not already present
      envModels.forEach(model => {
        if (!modelMap.has(model.id)) {
          modelMap.set(model.id, model)
        }
      })
      
      models = Array.from(modelMap.values())
    }

    return new Response(JSON.stringify({ models }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error fetching models:", error)
    return new Response(JSON.stringify({ error: "Failed to fetch models" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export async function POST() {
  try {
    refreshModelsCache()
    const models = await getAllModels()

    return NextResponse.json({
      message: "Models cache refreshed",
      models,
      timestamp: new Date().toISOString(),
      count: models.length,
    })
  } catch (error) {
    console.error("Failed to refresh models:", error)
    return NextResponse.json(
      { error: "Failed to refresh models" },
      { status: 500 }
    )
  }
}
