import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { ModelConfig } from "../types"

export const openrouterModels: ModelConfig[] = [

  {
    id: "openrouter:anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "OpenRouter",
    providerId: "openrouter",
    modelFamily: "Claude",
    baseProviderId: "claude",
    description:
      "Claude's latest model with transparent reasoning mode, excellent for complex problem-solving and coding tasks.",
    tags: ["flagship", "reasoning", "transparent", "coding"],
    contextWindow: 200000,
    inputCost: 3.0,
    outputCost: 15.0,
    priceUnit: "per 1M tokens",
    vision: true,
    tools: true,
    audio: false,
    reasoning: true,
    webSearch: true,
    openSource: false,
    speed: "Medium",
    intelligence: "High",
    website: "https://openrouter.ai",
    apiDocs: "https://openrouter.ai/anthropic/claude-sonnet-4",
    modelPage: "https://www.anthropic.com/claude/sonnet",
    releasedAt: "2025-04-01",
    icon: "claude",
    apiSdk: (apiKey?: string, opts?: { enableSearch?: boolean }) =>
      createOpenRouter({
        apiKey: apiKey || process.env.OPENROUTER_API_KEY,
        ...(opts?.enableSearch && {
          extraBody: {
            plugins: [{ id: "web", max_results: 3 }],
          },
        }),
      }).chat("anthropic/claude-sonnet-4"),
  },

  {
    id: "openrouter:openai/gpt-5",
    name: "GPT-5",
    provider: "OpenRouter",
    providerId: "openrouter",
    modelFamily: "GPT",
    baseProviderId: "openai",
    description:
      "Next-generation flagship GPT model with advanced reasoning capabilities through OpenRouter.",
    tags: ["flagship", "reasoning", "tools", "multimodal", "advanced"],
    contextWindow: 2000000,
    inputCost: 5.0,
    outputCost: 15.0,
    priceUnit: "per 1M tokens",
    vision: true,
    tools: true,
    audio: true,
    reasoning: true,
    webSearch: true,
    openSource: false,
    speed: "Medium",
    intelligence: "High",
    website: "https://openrouter.ai",
    apiDocs: "https://openrouter.ai/openai/gpt-5",
    modelPage: "https://platform.openai.com/docs/models/gpt-5",
    releasedAt: "2025-05-01",
    icon: "openai",
    apiSdk: (apiKey?: string, opts?: { enableSearch?: boolean }) =>
      createOpenRouter({
        apiKey: apiKey || process.env.OPENROUTER_API_KEY,
        ...(opts?.enableSearch && {
          extraBody: {
            plugins: [{ id: "web", max_results: 3 }],
          },
        }),
      }).chat("openai/gpt-5"),
  },
  {
    id: "openrouter:openai/gpt-5-nano",
    name: "GPT-5 Nano",
    provider: "OpenRouter",
    providerId: "openrouter",
    modelFamily: "GPT",
    baseProviderId: "openai",
    description:
      "Ultra-efficient nano version of GPT-5 for rapid inference and cost-effectiveness through OpenRouter.",
    tags: ["fast", "efficient", "nano", "cost-effective", "tools"],
    contextWindow: 2000000,
    inputCost: 0.5,
    outputCost: 1.0,
    priceUnit: "per 1M tokens",
    vision: true,
    tools: true,
    audio: false,
    reasoning: true,
    webSearch: true,
    openSource: false,
    speed: "Fast",
    intelligence: "High",
    website: "https://openrouter.ai",
    apiDocs: "https://openrouter.ai/openai/gpt-5-nano",
    modelPage: "https://platform.openai.com/docs/models/gpt-5-nano",
    releasedAt: "2025-05-01",
    icon: "openai",
    apiSdk: (apiKey?: string, opts?: { enableSearch?: boolean }) =>
      createOpenRouter({
        apiKey: apiKey || process.env.OPENROUTER_API_KEY,
        ...(opts?.enableSearch && {
          extraBody: {
            plugins: [{ id: "web", max_results: 3 }],
          },
        }),
      }).chat("openai/gpt-5-nano"),
  },

  {
    id: "openrouter:google/gemini-2.0-flash-lite-001",
    name: "Gemini 2.0 Flash Lite",
    provider: "OpenRouter",
    providerId: "openrouter",
    modelFamily: "Gemini",
    baseProviderId: "gemini",
    description:
      "Lightweight version of Gemini 2.0 Flash optimized for speed and cost-efficiency.",
    tags: ["fast", "lite", "efficient", "cost-effective"],
    contextWindow: 1048576,
    inputCost: 0.075,
    outputCost: 0.3,
    priceUnit: "per 1M tokens",
    vision: true,
    tools: true,
    audio: false,
    reasoning: true,
    webSearch: true,
    openSource: false,
    speed: "Fast",
    intelligence: "Medium",
    website: "https://openrouter.ai",
    apiDocs: "https://openrouter.ai/google/gemini-2.0-flash-lite-001",
    modelPage: "https://ai.google.dev",
    releasedAt: "2024-12-11",
    icon: "gemini",
    apiSdk: (apiKey?: string, opts?: { enableSearch?: boolean }) =>
      createOpenRouter({
        apiKey: apiKey || process.env.OPENROUTER_API_KEY,
        ...(opts?.enableSearch && {
          extraBody: {
            plugins: [{ id: "web", max_results: 3 }],
          },
        }),
      }).chat("google/gemini-2.0-flash-lite-001"),
  },

]