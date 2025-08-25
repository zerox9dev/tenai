import Anthropic from "@/components/icons/anthropic"
import Claude from "@/components/icons/claude"
import Grok from "@/components/icons/grok"
import Meta from "@/components/icons/meta"

import OpenAI from "@/components/icons/openai"
import OpenRouter from "@/components/icons/openrouter"
import Xai from "@/components/icons/xai"

export type Provider = {
  id: string
  name: string
  available: boolean
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export const PROVIDERS: Provider[] = [
  {
    id: "openrouter",
    name: "OpenRouter",
    icon: OpenRouter,
  },
  {
    id: "openai",
    name: "OpenAI",
    icon: OpenAI,
  },
  {
    id: "claude",
    name: "Claude",
    icon: Claude,
  },
  {
    id: "grok",
    name: "Grok",
    icon: Grok,
  },
  {
    id: "xai",
    name: "XAI",
    icon: Xai,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    icon: Anthropic,
  },
  {
    id: "meta",
    name: "Meta",
    icon: Meta,
  },
] as Provider[]
