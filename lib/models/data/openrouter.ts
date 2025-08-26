import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { ModelConfig } from "../types"

export const openrouterModels: ModelConfig[] = [
  {
    id: "openrouter:openai/gpt-oss-20b:free",
    name: "GPT OSS 20B (Free)",
    provider: "OpenRouter",
    providerId: "openrouter",
    modelFamily: "GPT",
    baseProviderId: "openai",
    description:
      "Free open-source GPT model with 20 billion parameters, optimized for general-purpose tasks.",
    tags: ["free", "open-source", "efficient", "general-purpose"],
    contextWindow: 8192,
    inputCost: 0.0,
    outputCost: 0.0,
    priceUnit: "per 1M tokens",
    vision: false,
    tools: true,
    audio: false,
    reasoning: false,
    webSearch: true,
    openSource: true,
    speed: "Fast",
    intelligence: "Medium",
    website: "https://openrouter.ai",
    apiDocs: "https://openrouter.ai/openai/gpt-oss-20b:free",
    modelPage: "https://openrouter.ai/openai/gpt-oss-20b:free",
    releasedAt: "2024-12-01",
    icon: "openai",
    apiSdk: (apiKey?: string, opts?: { enableSearch?: boolean }) =>
      createOpenRouter({
        apiKey: apiKey || process.env.OPENROUTER_API_KEY,
        ...(opts?.enableSearch && {
          extraBody: {
            plugins: [{ id: "web", max_results: 3 }],
          },
        }),
      }).chat("openai/gpt-oss-20b:free"),
  },
]