export type OpenAIModel =
  | "gpt-5"
  | "gpt-5-nano"

export type AnthropicModel = never

export type XaiModel =
  | "grok-2-vision-1212"
  | "grok-2-vision"
  | "grok-2-vision-latest"
  | "grok-2-image-1212"
  | "grok-2-image"
  | "grok-2-image-latest"
  | "grok-2-1212"
  | "grok-2"
  | "grok-2-latest"
  | "grok-vision-beta"
  | "grok-beta"

export type OpenRouterModel =
  | "openrouter:openai/gpt-5"
  | "openrouter:openai/gpt-5-nano"

export type Provider =
  | "openai"
  | "anthropic"
  | "xai"
  | "openrouter"

export type SupportedModel =
  | OpenAIModel
  | AnthropicModel
  | XaiModel
  | OpenRouterModel