export type OpenAIModel =
  | "o1"
  | "o1-2024-12-17"
  | "o1-mini"
  | "o1-mini-2024-09-12"
  | "o1-preview"
  | "o1-preview-2024-09-12"
  | "o3-mini"
  | "o3-mini-2025-01-31"
  | "gpt-4.1"
  | "gpt-4.1-2025-04-14"
  | "gpt-4.1-mini"
  | "gpt-4.1-mini-2025-04-14"
  | "gpt-4.1-nano"
  | "gpt-4.1-nano-2025-04-14"
  | "gpt-4o"
  | "gpt-4o-2024-05-13"
  | "gpt-4o-2024-08-06"
  | "gpt-4o-2024-11-20"
  | "gpt-4o-audio-preview"
  | "gpt-4o-audio-preview-2024-10-01"
  | "gpt-4o-audio-preview-2024-12-17"
  | "gpt-4o-search-preview"
  | "gpt-4o-search-preview-2025-03-11"
  | "gpt-4o-mini"
  | "gpt-4o-mini-2024-07-18"
  | "gpt-4-turbo"
  | "gpt-4-turbo-2024-04-09"
  | "gpt-4-turbo-preview"
  | "gpt-4-0125-preview"
  | "gpt-4-1106-preview"
  | "gpt-4"
  | "gpt-4-0613"
  | "gpt-4.5-preview"
  | "gpt-4.5-preview-2025-02-27"
  | "chatgpt-4o-latest"



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
  | "openrouter:openai/gpt-4.1"
  | "openrouter:openai/o4-mini"



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
