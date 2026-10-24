/**
 * chatService.ts
 *
 * Dedicated chat & pedagogical inquiry service for communicating with the
 * FastAPI backend (/chat/inquiry and /chat/conversations).
 * Seamlessly falls back to local CBC pedagogical intelligence if the backend
 * is unreachable, guaranteeing zero downtime in frontend presentation.
 */

import { request } from './apiClient';
import { CBCInquiryService } from './cbcInquiryService';
import type { RubricTier } from '../components/chat/chatTypes';

export interface BackendMaterial {
  item: string;
  purpose?: string;
  source?: string;
}

export interface BackendInquiryResponse {
  conversation_id: string;
  message_id: string;
  sender_name: string;
  text: string;
  materials?: Array<string | BackendMaterial> | null;
  rubric?: RubricTier | null;
  follow_ups?: string[];
  source_confidence?: string;
  timestamp?: string;
}

export interface InquiryResult {
  conversationId?: string;
  text: string;
  materials?: string[];
  rubric?: RubricTier;
  followUps: string[];
}

export const chatService = {
  /**
   * Dispatches a pedagogical inquiry to the backend API.
   * If the network or backend is offline, gracefully resolves with local CBC reasoning.
   */
  sendInquiry: async (
    query: string,
    conversationId?: string,
    role: string = 'teacher'
  ): Promise<InquiryResult> => {
    try {
      const response = await request<BackendInquiryResponse>('/chat/inquiry', {
        method: 'POST',
        body: JSON.stringify({
          query,
          conversation_id: conversationId,
          role,
        }),
      });

      // Normalize materials into string array for ChatMessageList UI component
      const normalizedMaterials: string[] = [];
      if (response.materials && Array.isArray(response.materials)) {
        for (const m of response.materials) {
          if (typeof m === 'string') {
            normalizedMaterials.push(m);
          } else if (m && typeof m === 'object' && m.item) {
            const extra = m.purpose ? ` (${m.purpose})` : '';
            normalizedMaterials.push(`${m.item}${extra}`);
          }
        }
      }

      return {
        conversationId: response.conversation_id,
        text: response.text,
        materials: normalizedMaterials.length > 0 ? normalizedMaterials : undefined,
        rubric: response.rubric || undefined,
        followUps: response.follow_ups || [],
      };
    } catch {
      // Fallback seamlessly to local curriculum engine if backend is offline or during offline tests
      const localFallback = CBCInquiryService.generateResponse(query);
      return {
        conversationId: conversationId || 'local-session',
        text: localFallback.text,
        materials: localFallback.materials,
        rubric: localFallback.rubric,
        followUps: localFallback.followUps,
      };
    }
  },

  /**
   * Initialize a new conversation on the backend.
   */
  createConversation: async (title: string = 'New CBC Inquiry'): Promise<{ id: string; title: string }> => {
    try {
      return await request<{ id: string; title: string }>('/chat/conversations', {
        method: 'POST',
        body: JSON.stringify({ title }),
      });
    } catch {
      return { id: `local-${Date.now()}`, title };
    }
  },
};