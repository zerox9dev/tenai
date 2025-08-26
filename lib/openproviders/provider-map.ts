import type { Provider, SupportedModel } from "./types"

// map each model ID to its provider
const MODEL_PROVIDER_MAP: Record<string, Provider> = {
  "gpt-5": "openai",
  "gpt-5-nano": "openai",

  // Anthropic

  // XAI
  "grok-2-vision-1212": "xai",
  "grok-2-vision": "xai",
  "grok-2-vision-latest": "xai",
  "grok-2-image-1212": "xai",
  "grok-2-image": "xai",
  "grok-2-image-latest": "xai",
  "grok-2-1212": "xai",
  "grok-2": "xai",
  "grok-2-latest": "xai",
  "grok-vision-beta": "xai",
  "grok-beta": "xai",
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