import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  CheckSquare,
  CalendarRange,
  FileText,
  StickyNote,
  Brain,
  Search,
  BarChart3,
  Settings,
  Plus,
  Rocket,
  ChevronRight,
  Zap,
  UserCheck,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  activeTab,
  onTabChange,
  isOpen,
  onClose,
  onOpenUpgrade,
}) {
  const { user, setShowAuthModal } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'tasks', label: 'Tasks & Reminders', icon: CheckSquare },
    { id: 'planner', label: 'AI Daily Planner', icon: CalendarRange },
    { id: 'documents', label: 'File & Docs Assistant', icon: FileText },
    { id: 'notes', label: 'AI Notes', icon: StickyNote },
    { id: 'memory', label: 'Smart AI Memory', icon: Brain },
    { id: 'search', label: 'Universal Search', icon: Search },
    { id: 'analytics', label: 'Productivity Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className="left-sidebar">
        {/* Logo Header */}
        <div className="logo-section">
          <div className="logo-icon-glow">
            <Zap size={22} color="white" />
          </div>
          <div>
            <div className="brand-title">Nexus AI</div>
            <div className="brand-subtitle">AI Productivity Manager</div>
          </div>
        </div>

        {/* Gradient + New Chat Button */}
        <button
          className="btn-new-chat"
          onClick={() => {
            onTabChange('chat');
            onNew();
          }}
        >
          <Plus size={18} />
          <span>New Chat</span>
        </button>

        {/* Navigation items list */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onTabChange(item.id);
                  if (onClose) onClose();
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile Card - Connect Real Database Data */}
        <div
          className="sidebar-user-card"
          onClick={() => {
            if (user) {
              onTabChange('settings');
            } else {
              setShowAuthModal(true);
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          {user ? (
            <>
              <img
                src={user.profile_image || defaultAvatar}
                alt={user.name}
                className="user-avatar-img"
              />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div className="user-info-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </div>
                <div className="user-info-plan">👑 {user.account_plan || 'Pro Plan'}</div>
              </div>
              <ChevronRight size={16} color="#64748B" />
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
              <div className="logo-icon-glow" style={{ width: '32px', height: '32px' }}>
                <LogIn size={16} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div className="user-info-name">Sign In / Register</div>
                <div className="user-info-plan">Connect your account</div>
              </div>
            </div>
          )}
        </div>

        {/* Upgrade to Pro Card */}
        <div className="pro-upgrade-card">
          <div className="pro-upgrade-title">
            <Rocket size={18} color="#C084FC" />
            <span>Unlock Nexus AI Pro</span>
          </div>
          <p className="pro-upgrade-desc">
            Unlock advanced AI models, voice commands, unlimited documents, and smart automation.
          </p>
          <button className="btn-upgrade-now" onClick={onOpenUpgrade}>
            Upgrade Now
          </button>
        </div>
      </aside>
    </>
  );
}
