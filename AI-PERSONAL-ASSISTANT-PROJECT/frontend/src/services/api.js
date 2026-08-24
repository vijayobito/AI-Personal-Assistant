import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Conversations ──

export async function fetchConversations() {
  const { data } = await api.get('/conversations');
  return data;
}

export async function fetchConversation(id) {
  const { data } = await api.get(`/conversations/${id}`);
  return data;
}

export async function createConversation() {
  const { data } = await api.post('/conversations');
  return data;
}

export async function deleteConversation(id) {
  await api.delete(`/conversations/${id}`);
}

// ── Chat ──

export async function sendMessage(message, conversationId = null) {
  const { data } = await api.post('/chat', {
    message,
    conversation_id: conversationId,
  });
  return data;
}

export default api;
