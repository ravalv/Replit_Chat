import type { User, Conversation, Message } from "@shared/schema";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new ApiError(response.status, error.message);
  }

  return response.json();
}

export const api = {
  // Auth
  async register(username: string, password: string, role: string) {
    return apiRequest<{ user: User }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password, role }),
    });
  },

  async login(username: string, password: string) {
    return apiRequest<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  async logout() {
    return apiRequest<{ message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },

  async getSession() {
    return apiRequest<{
      user: User;
      sessionTimeRemaining: number;
      showWarning: boolean;
    }>("/api/auth/session");
  },

  async extendSession() {
    return apiRequest<{ message: string; sessionTimeRemaining: number }>("/api/auth/extend-session", {
      method: "POST",
    });
  },

  // Conversations
  async getConversations() {
    return apiRequest<Conversation[]>("/api/conversations");
  },

  async createConversation(data: { title: string; category: string; isBookmarked?: boolean }) {
    return apiRequest<Conversation>("/api/conversations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateConversation(id: string, updates: { title?: string; isBookmarked?: boolean }) {
    return apiRequest<Conversation>(`/api/conversations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  async deleteConversation(id: string) {
    return apiRequest<{ message: string }>(`/api/conversations/${id}`, {
      method: "DELETE",
    });
  },

  // Messages
  async getMessages(conversationId: string) {
    return apiRequest<Message[]>(`/api/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId: string, content: string) {
    return apiRequest<{ userMessage: Message; aiMessage: Message }>(
      `/api/conversations/${conversationId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ role: "user", content }),
      }
    );
  },

  async updateMessageFeedback(messageId: string, feedback: "up" | "down" | null) {
    return apiRequest<Message>(`/api/messages/${messageId}/feedback`, {
      method: "PATCH",
      body: JSON.stringify({ feedback }),
    });
  },

  // Chat (creates new conversation)
  async chat(message: string) {
    return apiRequest<{
      conversation: Conversation;
      userMessage: Message;
      aiMessage: Message;
    }>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  },
};
