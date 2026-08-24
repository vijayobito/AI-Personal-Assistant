import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { useChat } from './hooks/useChat';
import './index.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
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
  } = useChat();

  const handleNewChat = () => {
    newConversation();
    setSidebarOpen(false);
  };

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={selectConversation}
        onNew={handleNewChat}
        onDelete={removeConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <Chat
        messages={messages}
        isLoading={isLoading}
        error={error}
        messagesEndRef={messagesEndRef}
        onSend={sendMessage}
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
      />
    </div>
  );
}
