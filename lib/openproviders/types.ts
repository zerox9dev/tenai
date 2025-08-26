export type OpenAIModel =
  | "gpt-5"
  | "gpt-5-nano"

export type AnthropicModel =
  | "claude-opus-4-20250514"
  | "claude-sonnet-4-20250514"

export type XaiModel =
  | "grok-4-latest"

export type OpenRouterModel =
  | "openrouter:openai/gpt-oss-20b:free"

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