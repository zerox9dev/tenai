import {
  getAllModels,
  getModelsWithEnvAccess,
  refreshModelsCache,
} from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Простая логика - все пользователи получают модели доступные через ENV ключи
    // Никаких пользовательских BYOK ключей
    const models = await getModelsWithEnvAccess()
    
    return NextResponse.json(
      { models },
      {
        headers: {
          // Кеширование на клиенте  
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        }
      }
    )
  } catch (error) {
    console.error("Error fetching models:", error)
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    )
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
