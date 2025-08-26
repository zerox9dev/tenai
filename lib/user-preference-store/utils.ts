export type LayoutType = "sidebar" | "fullscreen"

export type UserPreferences = {
  layout: LayoutType
  promptSuggestions: boolean
  showToolInvocations: boolean
  showConversationPreviews: boolean
  multiModelEnabled: boolean
  hiddenModels: string[]
}

export const defaultPreferences: UserPreferences = {
  layout: "fullscreen",
  promptSuggestions: true,
  showToolInvocations: true,
  showConversationPreviews: true,
  multiModelEnabled: false,
  hiddenModels: [],
}

// API format type for user preferences (snake_case)
type ApiUserPreferences = {
  layout?: LayoutType | string | null
  prompt_suggestions?: boolean | null
  show_tool_invocations?: boolean | null
  show_conversation_previews?: boolean | null
  multi_model_enabled?: boolean | null
  hidden_models?: string[] | null
}

// Helper functions to convert between API format (snake_case) and frontend format (camelCase)
export function convertFromApiFormat(apiData: ApiUserPreferences): UserPreferences {
  // Ensure layout is a valid LayoutType, fallback to default if invalid
  const layout = apiData.layout === "sidebar" || apiData.layout === "fullscreen" 
    ? apiData.layout 
    : "fullscreen"
    
  return {
    layout,
    promptSuggestions: apiData.prompt_suggestions ?? true,
    showToolInvocations: apiData.show_tool_invocations ?? true,
    showConversationPreviews: apiData.show_conversation_previews ?? true,
    multiModelEnabled: apiData.multi_model_enabled ?? false,
    hiddenModels: apiData.hidden_models || [],
  }
}

export function convertToApiFormat(preferences: Partial<UserPreferences>): Partial<ApiUserPreferences> {
  const apiData: Partial<ApiUserPreferences> = {}
  if (preferences.layout !== undefined) apiData.layout = preferences.layout
  if (preferences.promptSuggestions !== undefined)
    apiData.prompt_suggestions = preferences.promptSuggestions
  if (preferences.showToolInvocations !== undefined)
    apiData.show_tool_invocations = preferences.showToolInvocations
  if (preferences.showConversationPreviews !== undefined)
    apiData.show_conversation_previews = preferences.showConversationPreviews
  if (preferences.multiModelEnabled !== undefined)
    apiData.multi_model_enabled = preferences.multiModelEnabled
  if (preferences.hiddenModels !== undefined)
    apiData.hidden_models = preferences.hiddenModels
  return apiData
}
