import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchConversations,
  fetchConversation,
  createConversation,
  deleteConversation as apiDeleteConversation,
  sendMessage as apiSendMessage,
} from '../services/api';

export function useChat() {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // ── Load conversations on mount ──
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  }, []);

  // ── Select a conversation ──
  const selectConversation = useCallback(async (id) => {
    setActiveId(id);
    setError(null);
    try {
      const data = await fetchConversation(id);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setMessages([]);
    }
  }, []);

  // ── Create new conversation ──
  const newConversation = useCallback(() => {
    setActiveId(null);
    setMessages([]);
    setError(null);
  }, []);

  // ── Delete a conversation ──
  const removeConversation = useCallback(async (id) => {
    try {
      await apiDeleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) {
        setActiveId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  }, [activeId]);

  // ── Send message ──
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;
    setError(null);

    // Optimistic: show user message immediately
    const tempUserMsg = {
      id: 'temp-user-' + Date.now(),
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const response = await apiSendMessage(text, activeId);

      // If this was a new conversation, set the active ID
      if (!activeId) {
        setActiveId(response.conversation_id);
      }

      // Replace temp user message with real one, add AI response
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
        return [...filtered, response.user_message, response.ai_message];
      });

      // Refresh sidebar
      await loadConversations();
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');
      // Remove the optimistic message
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setIsLoading(false);
    }
  }, [activeId, isLoading, loadConversations]);

  // ── Auto-scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return {
    conversations,
    activeId,
    messages,
    isLoading,
    error,
    messagesEndRef,
    selectConversation,
    newConversation,
    removeConversation,
    sendMessage,
  };
}
