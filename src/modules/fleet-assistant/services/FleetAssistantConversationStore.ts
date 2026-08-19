/**
 * Fleet Intelligence Smart AI - Conversation Store for AI Fleet Assistant (Prompt 34)
 * Manages persistent conversation threads, message histories, tool audits,
 * and user feedback ratings with localStorage persistence.
 */

import { FleetAssistantConversation, FleetAssistantMessage } from '../types';

const STORAGE_KEY = 'fleet_assistant_conversations_v1';
const ACTIVE_CONV_KEY = 'fleet_assistant_active_id';

export class FleetAssistantConversationStore {
  private static instance: FleetAssistantConversationStore;
  private conversations: FleetAssistantConversation[] = [];
  private activeConversationId: string | null = null;

  private constructor() {
    this.loadFromStorage();
    if (this.conversations.length === 0) {
      this.initDefaultConversation();
    }
  }

  public static getInstance(): FleetAssistantConversationStore {
    if (!FleetAssistantConversationStore.instance) {
      FleetAssistantConversationStore.instance = new FleetAssistantConversationStore();
    }
    return FleetAssistantConversationStore.instance;
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.conversations = JSON.parse(raw);
      }
      this.activeConversationId = localStorage.getItem(ACTIVE_CONV_KEY) || (this.conversations[0]?.id ?? null);
    } catch (e) {
      console.warn('Failed to load conversations from storage:', e);
      this.conversations = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.conversations));
      if (this.activeConversationId) {
        localStorage.setItem(ACTIVE_CONV_KEY, this.activeConversationId);
      }
    } catch (e) {
      console.warn('Failed to save conversations to storage:', e);
    }
  }

  private initDefaultConversation(): void {
    const defaultConv: FleetAssistantConversation = {
      id: `conv-${Date.now()}`,
      tenantId: 'tenant-tln-01',
      userId: 'usr-default',
      title: 'Status & Analisis Armada',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-init`,
          conversationId: `conv-${Date.now()}`,
          role: 'assistant',
          content: `Halo! Saya **AI Fleet Assistant** untuk PT Trans Nusantara Logistik.\n\nSaya memantau telemetri armada real-time, mendeteksi anomali BBM, memprediksi kebutuhan maintenance, dan mengawasi keselamatan operasional. Apa yang ingin Anda ketahui tentang armada hari ini?`,
          createdAt: new Date().toISOString(),
        },
      ],
    };
    this.conversations = [defaultConv];
    this.activeConversationId = defaultConv.id;
    this.saveToStorage();
  }

  public getAllConversations(): FleetAssistantConversation[] {
    return [...this.conversations].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public getActiveConversation(): FleetAssistantConversation | null {
    if (!this.activeConversationId && this.conversations.length > 0) {
      this.activeConversationId = this.conversations[0].id;
    }
    return this.conversations.find((c) => c.id === this.activeConversationId) || null;
  }

  public setActiveConversationId(id: string): void {
    this.activeConversationId = id;
    this.saveToStorage();
  }

  public createNewConversation(tenantId: string, userId: string, initialTitle?: string): FleetAssistantConversation {
    const newConv: FleetAssistantConversation = {
      id: `conv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      userId,
      title: initialTitle || 'Percakapan Baru',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          conversationId: `conv-${Date.now()}`,
          role: 'assistant',
          content: 'Halo! Saya siap membantu Anda menganalisis operasional armada, GPS, BBM, maintenance, dan keselamatan driver. Silakan ajukan pertanyaan Anda.',
          createdAt: new Date().toISOString(),
        },
      ],
    };

    this.conversations.unshift(newConv);
    this.activeConversationId = newConv.id;
    this.saveToStorage();
    return newConv;
  }

  public addMessage(conversationId: string, message: FleetAssistantMessage): void {
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (!conv) return;

    conv.messages.push(message);
    conv.updatedAt = new Date().toISOString();

    // Auto-update conversation title if it was default
    if (conv.messages.length === 2 && message.role === 'user') {
      conv.title = message.content.slice(0, 32) + (message.content.length > 32 ? '...' : '');
    }

    this.saveToStorage();
  }

  public renameConversation(id: string, newTitle: string): void {
    const conv = this.conversations.find((c) => c.id === id);
    if (conv) {
      conv.title = newTitle.trim() || conv.title;
      conv.updatedAt = new Date().toISOString();
      this.saveToStorage();
    }
  }

  public deleteConversation(id: string): void {
    this.conversations = this.conversations.filter((c) => c.id !== id);
    if (this.activeConversationId === id) {
      this.activeConversationId = this.conversations[0]?.id || null;
    }
    if (this.conversations.length === 0) {
      this.initDefaultConversation();
    }
    this.saveToStorage();
  }

  public recordFeedback(
    conversationId: string,
    messageId: string,
    feedback: {
      isHelpful: boolean;
      reason?: 'wrong_data' | 'wrong_analysis' | 'not_relevant' | 'missing_information' | 'other';
      comment?: string;
    }
  ): void {
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (!conv) return;

    const msg = conv.messages.find((m) => m.id === messageId);
    if (msg) {
      msg.feedback = {
        ...feedback,
        submittedAt: new Date().toISOString(),
      };
      this.saveToStorage();
    }
  }
}

export const fleetAssistantConversationStore = FleetAssistantConversationStore.getInstance();
