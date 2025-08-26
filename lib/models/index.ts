import { FREE_MODELS_IDS } from "../config"
import { claudeModels } from "./data/claude"
import { grokModels } from "./data/grok"

import { openaiModels } from "./data/openai"
import { openrouterModels } from "./data/openrouter"
import { ModelConfig } from "./types"

// Static models (always available)
const STATIC_MODELS: ModelConfig[] = [
  ...openaiModels,
  ...claudeModels,
  ...grokModels,

  ...openrouterModels,
]

// Dynamic models cache
let dynamicModelsCache: ModelConfig[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// // Function to get all models including dynamically detected ones
export async function getAllModels(): Promise<ModelConfig[]> {
  const now = Date.now()

  // Use cache if it's still valid
  if (dynamicModelsCache && now - lastFetchTime < CACHE_DURATION) {
    return dynamicModelsCache
  }

  // Return static models only
  dynamicModelsCache = STATIC_MODELS
  lastFetchTime = now
  return dynamicModelsCache
}

export async function getModelsWithAccessFlags(): Promise<ModelConfig[]> {
  const models = await getAllModels()

  // Get available ENV providers
  const { env } = await import("../openproviders/env")
  const envProviders = new Set<string>()
  
  if (env.OPENAI_API_KEY) envProviders.add("openai")
  if (env.ANTHROPIC_API_KEY) envProviders.add("anthropic")
  if (env.XAI_API_KEY) envProviders.add("xai")
  if (env.OPENROUTER_API_KEY) envProviders.add("openrouter")

  return models.map((model) => {
    // Model is accessible if it's free OR we have ENV key for its provider
    const accessible = FREE_MODELS_IDS.includes(model.id) || 
                      envProviders.has(model.providerId)
    
    return {
      ...model,
      accessible,
    }
  })
}

export async function getModelsForProvider(
  provider: string
): Promise<ModelConfig[]> {
  const models = STATIC_MODELS

  const providerModels = models
    .filter((model) => model.providerId === provider)
    .map((model) => ({
      ...model,
      accessible: true,
    }))

  return providerModels
}

// Function to get models based on user's available providers
export async function getModelsForUserProviders(
  providers: string[]
): Promise<ModelConfig[]> {
  const providerModels = await Promise.all(
    providers.map((provider) => getModelsForProvider(provider))
  )

  const flatProviderModels = providerModels.flat()

  return flatProviderModels
}

// Function to get all models accessible with ENV keys
export async function getModelsWithEnvAccess(): Promise<ModelConfig[]> {
  const models = await getAllModels()
  
  // Get available ENV providers
  const { env } = await import("../openproviders/env")
  const envProviders = new Set<string>()
  
  if (env.OPENAI_API_KEY) envProviders.add("openai")
  if (env.ANTHROPIC_API_KEY) envProviders.add("anthropic")
  if (env.XAI_API_KEY) envProviders.add("xai")
  if (env.OPENROUTER_API_KEY) envProviders.add("openrouter")

  return models
    .filter((model) => 
      FREE_MODELS_IDS.includes(model.id) || envProviders.has(model.providerId)
    )
    .map((model) => ({
      ...model,
      accessible: true,
    }))
}

// Synchronous function to get model info for simple lookups
// This uses cached data if available, otherwise falls back to static models
export function getModelInfo(modelId: string): ModelConfig | undefined {
  // First check the cache if it exists
  if (dynamicModelsCache) {
    return dynamicModelsCache.find((model) => model.id === modelId)
  }

  // Fall back to static models for immediate lookup
  return STATIC_MODELS.find((model) => model.id === modelId)
}

// For backward compatibility - static models only
export const MODELS: ModelConfig[] = STATIC_MODELS

// Function to refresh the models cache
export function refreshModelsCache(): void {
  dynamicModelsCache = null
  lastFetchTime = 0
}
