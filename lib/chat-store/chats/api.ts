import { chatQueries } from "@/lib/chat-store/persist"
import type { Chat as PersistChat } from "@/lib/chat-store/persist"
import type { Chat, Chats } from "@/lib/chat-store/types"
import { createClient } from "@/lib/supabase/client"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { MODEL_DEFAULT } from "../../config"
import { fetchWithCSRF } from "../../fetch"
import {
  API_ROUTE_TOGGLE_CHAT_PIN,
  API_ROUTE_UPDATE_CHAT_MODEL,
} from "../../routes"

// Конвертер типов между Supabase и Dexie
function convertToPersistChat(supabaseChat: Chats): PersistChat {
  return {
    id: supabaseChat.id,
    title: supabaseChat.title || "",
    created_at: supabaseChat.created_at || new Date().toISOString(),
    updated_at: supabaseChat.updated_at || new Date().toISOString(),
  }
}

// Сохранение массива чатов в IndexedDB
async function saveChatsToCache(chats: Chats[]): Promise<void> {
  for (const chat of chats) {
    await chatQueries.save(convertToPersistChat(chat))
  }
}

export async function getChatsForUserInDb(userId: string): Promise<Chats[]> {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .order("pinned", { ascending: false })
    .order("pinned_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false })

  if (!data || error) {
    console.error("Failed to fetch chats:", error)
    return []
  }

  return data
}

export async function updateChatTitleInDb(id: string, title: string) {
  const supabase = createClient()
  if (!supabase) return

  const { error } = await supabase
    .from("chats")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw error
}

export async function deleteChatInDb(id: string) {
  const supabase = createClient()
  if (!supabase) return

  const { error } = await supabase.from("chats").delete().eq("id", id)
  if (error) throw error
}

export async function getAllUserChatsInDb(userId: string): Promise<Chats[]> {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (!data || error) return []
  return data
}

export async function createChatInDb(
  userId: string,
  title: string,
  model: string,
  systemPrompt: string
): Promise<string | null> {
  const supabase = createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("chats")
    .insert({ user_id: userId, title, model, system_prompt: systemPrompt })
    .select("id")
    .single()

  if (error || !data?.id) return null
  return data.id
}

export async function fetchAndCacheChats(userId: string): Promise<Chats[]> {
  if (!isSupabaseEnabled) {
    return await getCachedChats()
  }

  const data = await getChatsForUserInDb(userId)

  if (data.length > 0) {
    await saveChatsToCache(data)
  }

  return data
}

export async function getCachedChats(): Promise<Chats[]> {
  const all = await chatQueries.getAll()
  return (all as Chats[]).sort(
    (a, b) => +new Date(b.created_at || "") - +new Date(a.created_at || "")
  )
}

export async function updateChatTitle(
  id: string,
  title: string
): Promise<void> {
  await updateChatTitleInDb(id, title)
  const all = await getCachedChats()
  const updated = (all as Chats[]).map((c) =>
    c.id === id ? { ...c, title } : c
  )
  await saveChatsToCache(updated)
}

export async function deleteChat(id: string): Promise<void> {
  await deleteChatInDb(id)
  // Удаляем чат напрямую из IndexedDB
  await chatQueries.delete(id)
}

export async function getChat(chatId: string): Promise<Chat | null> {
  const all = await chatQueries.getAll()
  return (all as Chat[]).find((c) => c.id === chatId) || null
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  const data = await getAllUserChatsInDb(userId)
  if (!data) return []
  await saveChatsToCache(data)
  return data
}

export async function createChat(
  userId: string,
  title: string,
  model: string,
  systemPrompt: string
): Promise<string> {
  const id = await createChatInDb(userId, title, model, systemPrompt)
  const finalId = id ?? crypto.randomUUID()

  const persistChat: PersistChat = {
    id: finalId,
    title,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  await chatQueries.save(persistChat)

  return finalId
}

export async function updateChatModel(chatId: string, model: string) {
  try {
    const res = await fetchWithCSRF(API_ROUTE_UPDATE_CHAT_MODEL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, model }),
    })
    const responseData = await res.json()

    if (!res.ok) {
      throw new Error(
        responseData.error ||
          `Failed to update chat model: ${res.status} ${res.statusText}`
      )
    }

    const all = await getCachedChats()
    const updated = (all as Chats[]).map((c) =>
      c.id === chatId ? { ...c, model } : c
    )
    await saveChatsToCache(updated)

    return responseData
  } catch (error) {
    console.error("Error updating chat model:", error)
    throw error
  }
}

export async function toggleChatPin(chatId: string, pinned: boolean) {
  try {
    const res = await fetchWithCSRF(API_ROUTE_TOGGLE_CHAT_PIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId, pinned }),
    })
    const responseData = await res.json()
    if (!res.ok) {
      throw new Error(
        responseData.error ||
          `Failed to update pinned: ${res.status} ${res.statusText}`
      )
    }
    const all = await getCachedChats()
    const now = new Date().toISOString()
    const updated = (all as Chats[]).map((c) =>
      c.id === chatId ? { ...c, pinned, pinned_at: pinned ? now : null } : c
    )
    await saveChatsToCache(updated)
    return responseData
  } catch (error) {
    console.error("Error updating chat pinned:", error)
    throw error
  }
}

export async function createNewChat(
  userId: string,
  title?: string,
  model?: string,
  isAuthenticated?: boolean,
  projectId?: string
): Promise<Chats> {
  try {
    const payload: {
      userId: string
      title: string
      model: string
      isAuthenticated?: boolean
      projectId?: string
    } = {
      userId,
      title: title || "New Chat",
      model: model || MODEL_DEFAULT,
      isAuthenticated,
    }

    if (projectId) {
      payload.projectId = projectId
    }

    const res = await fetchWithCSRF("/api/create-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const responseData = await res.json()

    if (!res.ok || !responseData.chat) {
      throw new Error(responseData.error || "Failed to create chat")
    }

    const chat: Chats = {
      id: responseData.chat.id,
      title: responseData.chat.title,
      created_at: responseData.chat.created_at,
      model: responseData.chat.model,
      user_id: responseData.chat.user_id,
      public: responseData.chat.public,
      updated_at: responseData.chat.updated_at,
      project_id: responseData.chat.project_id || null,
      pinned: responseData.chat.pinned ?? false,
      pinned_at: responseData.chat.pinned_at ?? null,
    }

    await chatQueries.save(convertToPersistChat(chat))
    return chat
  } catch (error) {
    console.error("Error creating new chat:", error)
    throw error
  }
}
