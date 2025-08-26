// Заменить 266 строк кастомной IndexedDB логики на 20 строк Dexie
import Dexie, { Table } from 'dexie'

export interface Chat {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  chat_id: string
  content: string
  role: 'system' | 'user' | 'assistant' | 'data'
  created_at: string
}

export class TenaiDB extends Dexie {
  chats!: Table<Chat>
  messages!: Table<Message>

  constructor() {
    super('TenaiDB')
    this.version(1).stores({
      chats: 'id, title, created_at, updated_at',
      messages: 'id, chat_id, role, created_at'
    })
  }
}

export const db = new TenaiDB()

// Простые хелперы вместо сложной логики
export const chatQueries = {
  getAll: () => db.chats.orderBy('updated_at').reverse().toArray(),
  getById: (id: string) => db.chats.get(id),
  save: (chat: Chat) => db.chats.put(chat),
  delete: (id: string) => db.chats.delete(id),
}

export const messageQueries = {
  getByChatId: (chatId: string) => db.messages.where('chat_id').equals(chatId).toArray(),
  save: (message: Message) => db.messages.put(message),
  saveBulk: (messages: Message[]) => db.messages.bulkPut(messages),
  delete: (id: string) => db.messages.delete(id),
  deleteByChatId: (chatId: string) => db.messages.where('chat_id').equals(chatId).delete(),
  getAll: () => db.messages.toArray(),
}

// Полная очистка всех данных
export const clearAllData = async () => {
  try {
    await db.delete();
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } catch (error) {
    console.error('Clear all data error:', error);
  }
};


