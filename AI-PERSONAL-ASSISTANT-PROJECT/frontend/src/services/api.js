import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// ── Auth ──

export async function loginUser(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  if (data.token) {
    localStorage.setItem('nexus_token', data.token);
  }
  return data;
}

export async function registerUser(name, email, password) {
  const { data } = await api.post('/auth/register', { name, email, password });
  if (data.token) {
    localStorage.setItem('nexus_token', data.token);
  }
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function updateUserProfile(profileData) {
  const { data } = await api.put('/auth/profile', profileData);
  return data;
}

export function logoutUser() {
  localStorage.removeItem('nexus_token');
}

// ── Conversations & Chat ──

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

export async function sendMessage(message, conversationId = null) {
  const { data } = await api.post('/chat', {
    message,
    conversation_id: conversationId,
  });
  return data;
}

// ── Tasks & Reminders ──

export async function fetchTasks() {
  const { data } = await api.get('/tasks');
  return data;
}

export async function createTask(taskData) {
  const { data } = await api.post('/tasks', taskData);
  return data;
}

export async function updateTask(id, taskData) {
  const { data } = await api.put(`/tasks/${id}`, taskData);
  return data;
}

export async function completeTask(id) {
  const { data } = await api.patch(`/tasks/${id}/complete`);
  return data;
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
}

export async function fetchReminders() {
  const { data } = await api.get('/reminders');
  return data;
}

export async function createReminder(reminderData) {
  const { data } = await api.post('/reminders', reminderData);
  return data;
}

export async function completeReminder(id) {
  const { data } = await api.patch(`/reminders/${id}/complete`);
  return data;
}

export async function deleteReminder(id) {
  await api.delete(`/reminders/${id}`);
}

// ── Daily Planner ──

export async function fetchTodayPlan() {
  const { data } = await api.get('/planner/today');
  return data;
}

export async function generateDailyPlan(activities, date = 'Today') {
  const { data } = await api.post('/planner/generate', { activities, date });
  return data;
}

export async function updatePlanSlots(planId, slots) {
  const { data } = await api.put(`/planner/${planId}/slots`, slots);
  return data;
}

// ── Notes ──

export async function fetchNotes(query = '') {
  const { data } = await api.get('/notes', { params: { query } });
  return data;
}

export async function createNote(noteData) {
  const { data } = await api.post('/notes', noteData);
  return data;
}

export async function updateNote(id, noteData) {
  const { data } = await api.put(`/notes/${id}`, noteData);
  return data;
}

export async function togglePinNote(id) {
  const { data } = await api.patch(`/notes/${id}/pin`);
  return data;
}

export async function deleteNote(id) {
  await api.delete(`/notes/${id}`);
}

export async function performAINoteAction(id, action) {
  const { data } = await api.post(`/notes/${id}/ai-action`, null, { params: { action } });
  return data;
}

// ── Memories ──

export async function fetchMemories() {
  const { data } = await api.get('/memories');
  return data;
}

export async function createMemory(memData) {
  const { data } = await api.post('/memories', memData);
  return data;
}

export async function toggleMemory(id) {
  const { data } = await api.patch(`/memories/${id}/toggle`);
  return data;
}

export async function deleteMemory(id) {
  await api.delete(`/memories/${id}`);
}

// ── Documents ──

export async function fetchDocuments() {
  const { data } = await api.get('/documents');
  return data;
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function summarizeDocument(docId) {
  const { data } = await api.post(`/documents/${docId}/summarize`);
  return data;
}

export async function deleteDocument(docId) {
  await api.delete(`/documents/${docId}`);
}

// ── Universal Search & Analytics ──

export async function executeUniversalSearch(q, semantic = false) {
  const { data } = await api.get('/search', { params: { q, semantic } });
  return data;
}

export async function fetchAnalytics() {
  const { data } = await api.get('/analytics');
  return data;
}

// ── Notifications ──

export async function fetchNotifications() {
  const { data } = await api.get('/notifications');
  return data;
}

export async function markNotificationRead(id) {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data;
}

export async function clearNotifications() {
  await api.delete('/notifications/clear');
}

export async function executeCommandCenter(command) {
  const { data } = await api.post('/command-center', { command });
  return data;
}

export default api;
