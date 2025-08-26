import { createClient } from "@/lib/supabase/client"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import type { Message as MessageAISDK } from "ai"
import { messageQueries } from "../persist"

// Расширенный тип для MessageAISDK с дополнительными полями
interface ExtendedMessageAISDK extends MessageAISDK {
  message_group_id?: string | null
  model?: string | null
}

export async function getMessagesFromDb(
  chatId: string
): Promise<MessageAISDK[]> {
  // fallback to local cache only
  if (!isSupabaseEnabled) {
    const cached = await getCachedMessages(chatId)
    return cached
  }

  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from("messages")
    .select(
      "id, content, role, experimental_attachments, created_at, parts, message_group_id, model"
    )
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })

  if (!data || error) {
    console.error("Failed to fetch messages:", error)
    return []
  }

  return data.map((message) => ({
    ...message,
    id: String(message.id),
    content: message.content ?? "",
    createdAt: new Date(message.created_at || ""),
    parts: (message?.parts as MessageAISDK["parts"]) || undefined,
    message_group_id: message.message_group_id,
    model: message.model,
  }))
}

async function insertMessageToDb(chatId: string, message: ExtendedMessageAISDK) {
  const supabase = createClient()
  if (!supabase) return

  await supabase.from("messages").insert({
    chat_id: chatId,
    role: message.role,
    content: message.content,
    experimental_attachments: message.experimental_attachments,
    created_at: message.createdAt?.toISOString() || new Date().toISOString(),
    message_group_id: message.message_group_id || null,
    model: message.model || null,
  })
}

async function insertMessagesToDb(chatId: string, messages: ExtendedMessageAISDK[]) {
  const supabase = createClient()
  if (!supabase) return

  const payload = messages.map((message) => ({
    chat_id: chatId,
    role: message.role,
    content: message.content,
    experimental_attachments: message.experimental_attachments,
    created_at: message.createdAt?.toISOString() || new Date().toISOString(),
    message_group_id: message.message_group_id || null,
    model: message.model || null,
  }))

  await supabase.from("messages").insert(payload)
}

async function deleteMessagesFromDb(chatId: string) {
  const supabase = createClient()
  if (!supabase) return

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("chat_id", chatId)

  if (error) {
    console.error("Failed to clear messages from database:", error)
  }
}

export async function getCachedMessages(
  chatId: string
): Promise<MessageAISDK[]> {
  const messages = await messageQueries.getByChatId(chatId)
  
  // Конвертируем из новой структуры БД в старую структуру AI SDK
  return messages.map(msg => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    createdAt: new Date(msg.created_at),
  })).sort(
    (a, b) => +new Date(a.createdAt || 0) - +new Date(b.createdAt || 0)
  )
}

export async function cacheMessages(
  chatId: string,
  messages: MessageAISDK[]
): Promise<void> {
  // Конвертируем из AI SDK структуры в новую структуру БД
  const dbMessages = messages.map(msg => ({
    id: msg.id,
    chat_id: chatId,
    content: msg.content as string,
    role: msg.role,
    created_at: msg.createdAt?.toISOString() || new Date().toISOString(),
  }))
  
  await messageQueries.saveBulk(dbMessages)
}

export async function addMessage(
  chatId: string,
  message: ExtendedMessageAISDK
): Promise<void> {
  await insertMessageToDb(chatId, message)
  
  // Добавляем сообщение в локальную БД
  await messageQueries.save({
    id: message.id,
    chat_id: chatId,
    content: message.content as string,
    role: message.role,
    created_at: message.createdAt?.toISOString() || new Date().toISOString(),
  })
}

export async function setMessages(
  chatId: string,
  messages: ExtendedMessageAISDK[]
): Promise<void> {
  await insertMessagesToDb(chatId, messages)
  await cacheMessages(chatId, messages)
}

export async function clearMessagesCache(chatId: string): Promise<void> {
  await messageQueries.deleteByChatId(chatId)
}

export async function clearMessagesForChat(chatId: string): Promise<void> {
  await deleteMessagesFromDb(chatId)
  await clearMessagesCache(chatId)
}
