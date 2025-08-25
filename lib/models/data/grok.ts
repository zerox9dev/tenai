import { openproviders } from "@/lib/openproviders"
import { ModelConfig } from "../types"

const grokModels: ModelConfig[] = [
  {
    id: "grok-2",
    name: "Grok 2",
    provider: "xAI",
    providerId: "xai",
    modelFamily: "Grok",
    baseProviderId: "xai",
    description:
      "Second-generation model developed by xAI, designed for reasoning and general tasks.",
    tags: ["reasoning", "conversational", "general-purpose"],
    contextWindow: 128000,
    inputCost: 2.0,
    outputCost: 10.0,
    priceUnit: "per 1M tokens",
    vision: false,
    tools: true,
    audio: false,
    reasoning: true,
    openSource: false,
    speed: "Medium",
    intelligence: "High",
    website: "https://x.ai",
    apiDocs: "https://docs.x.ai/docs/models",
    modelPage: "https://x.ai/news/grok-2",
    releasedAt: "2024-01-21",
    icon: "xai",
    apiSdk: (apiKey?: string) => openproviders("grok-2", undefined, apiKey),
  },
  {
    id: "grok-2-vision",
    name: "Grok 2 Vision",
    provider: "xAI",
    providerId: "xai",
    modelFamily: "Grok",
    baseProviderId: "xai",
    description: "Vision-capable variant of Grok 2 for multimodal use.",
    tags: ["vision", "multimodal", "reasoning"],
    contextWindow: 128000,
    inputCost: 2.5,
    outputCost: 12.5,
    priceUnit: "per 1M tokens",
    vision: true,
    tools: true,
    audio: false,
    reasoning: true,
    openSource: false,
    speed: "Medium",
    intelligence: "High",
    website: "https://x.ai",
    apiDocs: "https://docs.x.ai/docs/models",
    modelPage: "https://x.ai/news/grok-2",
    icon: "xai",
    apiSdk: (apiKey?: string) =>
      openproviders("grok-2-vision", undefined, apiKey),
  },

]

export { grokModels }
