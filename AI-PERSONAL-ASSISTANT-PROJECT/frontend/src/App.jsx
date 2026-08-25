import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/layout/TopHeader';
import Chat from './components/Chat';
import { DocumentChat } from './components/DocumentChat';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import DailyPlanner from './components/DailyPlanner';
import NotesManager from './components/NotesManager';
import MemoryManager from './components/MemoryManager';
import UniversalSearch from './components/UniversalSearch';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/settings/SettingsView';
import AuthModal from './components/auth/AuthModal';
import UpgradeModal from './components/UpgradeModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useChat } from './hooks/useChat';
import './index.css';

function MainApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { showAuthModal, setShowAuthModal } = useAuth();

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

  // —— Ctrl + K global shortcut to open Universal Search ——
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setActiveTab('search');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNewChat = () => {
    setActiveTab('chat');
    newConversation();
    setSidebarOpen(false);
  };

  return (
    <div className="app-container">
      {/* Fixed Left Navigation Sidebar (~270px) */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={selectConversation}
        onNew={handleNewChat}
        onDelete={removeConversation}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenUpgrade={() => setShowUpgradeModal(true)}
      />

      {/* Flexible Center + Right Panel Viewport */}
      <div className="main-viewport">
        {/* Top Header Bar */}
        <TopHeader
          onSearchClick={() => setActiveTab('search')}
          onNavigate={setActiveTab}
        />

        {/* View Router */}
        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigate={setActiveTab}
            onOpenUpgrade={() => setShowUpgradeModal(true)}
          />
        )}
        {activeTab === 'chat' && (
          <div className="viewport-body">
            <div className="center-content">
              <Chat
                messages={messages}
                isLoading={isLoading}
                error={error}
                messagesEndRef={messagesEndRef}
                onSend={sendMessage}
                onToggleSidebar={() => setSidebarOpen((p) => !p)}
              />
            </div>
          </div>
        )}
        {activeTab === 'tasks' && <TaskManager />}
        {activeTab === 'planner' && <DailyPlanner />}
        {activeTab === 'documents' && <DocumentChat />}
        {activeTab === 'notes' && <NotesManager />}
        {activeTab === 'memory' && <MemoryManager />}
        {activeTab === 'search' && <UniversalSearch onNavigate={setActiveTab} />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'settings' && <SettingsView />}
      </div>

      {/* Global Authentication Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Global Upgrade Modal */}
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
