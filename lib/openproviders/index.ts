import { anthropic, createAnthropic } from "@ai-sdk/anthropic"
import { createOpenAI, openai } from "@ai-sdk/openai"
import type { LanguageModelV1 } from "@ai-sdk/provider"
import { createXai, xai } from "@ai-sdk/xai"
import { getProviderForModel } from "./provider-map"
import type {
  AnthropicModel,
  OpenAIModel,
  SupportedModel,
  XaiModel,
} from "./types"

type OpenAIChatSettings = Parameters<typeof openai>[1]
type AnthropicProviderSettings = Parameters<typeof anthropic>[1]
type XaiProviderSettings = Parameters<typeof xai>[1]


type ModelSettings<T extends SupportedModel> = T extends OpenAIModel
  ? OpenAIChatSettings
  : T extends AnthropicModel
    ? AnthropicProviderSettings
    : T extends XaiModel
      ? XaiProviderSettings
      : never

export type OpenProvidersOptions<T extends SupportedModel> = ModelSettings<T>



export function openproviders<T extends SupportedModel>(
  modelId: T,
  settings?: OpenProvidersOptions<T>,
  apiKey?: string
): LanguageModelV1 {
  const provider = getProviderForModel(modelId)

  if (provider === "openai") {
    if (apiKey) {
      const openaiProvider = createOpenAI({
        apiKey,
        compatibility: "strict",
      })
      return openaiProvider(
        modelId as OpenAIModel,
        settings as OpenAIChatSettings
      )
    }
    return openai(modelId as OpenAIModel, settings as OpenAIChatSettings)
  }



  if (provider === "anthropic") {
    if (apiKey) {
      const anthropicProvider = createAnthropic({ apiKey })
      return anthropicProvider(
        modelId as AnthropicModel,
        settings as AnthropicProviderSettings
      )
    }
    return anthropic(
      modelId as AnthropicModel,
      settings as AnthropicProviderSettings
    )
  }

  if (provider === "xai") {
    if (apiKey) {
      const xaiProvider = createXai({ apiKey })
      return xaiProvider(modelId as XaiModel, settings as XaiProviderSettings)
    }
    return xai(modelId as XaiModel, settings as XaiProviderSettings)
  }



  throw new Error(`Unsupported model: ${modelId}`)
}
