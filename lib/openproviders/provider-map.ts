import type { Provider, SupportedModel } from "./types"

// map each model ID to its provider
const MODEL_PROVIDER_MAP: Record<string, Provider> = {
  "gpt-5": "openai",
  "gpt-5-nano": "openai",

  // Anthropic

  // XAI
  "grok-4-latest": "xai",
}

export function getProviderForModel(model: SupportedModel): Provider {
  if (model.startsWith("openrouter:")) {
    return "openrouter"
  }

  // Check the static mapping
  const provider = MODEL_PROVIDER_MAP[model]
  if (provider) return provider

  throw new Error(`Unknown provider for model: ${model}`)
}