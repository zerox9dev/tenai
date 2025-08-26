import { openproviders } from "@/lib/openproviders"
import { ModelConfig } from "../types"

const grokModels: ModelConfig[] = [
  {
    id: "grok-4-latest",
    name: "Grok 4 Latest",
    provider: "xAI",
    providerId: "xai",
    modelFamily: "Grok",
    baseProviderId: "xai",
    description:
      "Latest fourth-generation Grok model with enhanced reasoning, multimodal capabilities, and improved performance.",
    tags: ["flagship", "reasoning", "multimodal", "latest", "advanced"],
    contextWindow: 200000,
    inputCost: 3.0,
    outputCost: 12.0,
    priceUnit: "per 1M tokens",
    vision: true,
    tools: true,
    audio: false,
    reasoning: true,
    openSource: false,
    speed: "Fast",
    intelligence: "High",
    website: "https://x.ai",
    apiDocs: "https://docs.x.ai/docs/models",
    modelPage: "https://x.ai/news/grok-4",
    releasedAt: "2025-01-15",
    icon: "xai",
    apiSdk: (apiKey?: string) => openproviders("grok-4-latest", undefined, apiKey),
  },
]

export { grokModels }
