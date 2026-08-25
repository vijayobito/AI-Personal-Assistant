import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon, Bell, Zap, Check, X, LogIn, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchNotifications, markNotificationRead, clearNotifications } from '../../services/api';

export default function TopHeader({ onSearchClick, onNavigate }) {
  const { user, logout, setShowAuthModal, updateProfile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedModel, setSelectedModel] = useState('Gemini 2.0 Flash');
  const [showModelSelector, setShowModelSelector] = useState(false);

  useEffect(() => {
    async function loadNotifs() {
      if (user) {
        try {
          const list = await fetchNotifications();
          setNotifications(list);
        } catch (e) {
          console.warn('Failed to load notifications:', e);
        }
      }
    }
    loadNotifs();

    if (user?.preferences?.ai_model) {
      setSelectedModel(user.preferences.ai_model);
    }
  }, [user]);

  // Ctrl + K keyboard shortcut for Global Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onSearchClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearchClick]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    const newTheme = !isDarkMode ? 'dark' : 'light';
    if (user) {
      updateProfile({ settings: { theme: newTheme } });
    }
  };

  const handleSelectModel = (model) => {
    setSelectedModel(model);
    setShowModelSelector(false);
    if (user) {
      updateProfile({ preferences: { ai_model: model } });
    }
  };

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const handleClearNotifs = async () => {
    await clearNotifications();
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";

  return (
    <header className="top-header">
      {/* Global Search Bar */}
      <div className="global-search-box" onClick={onSearchClick} style={{ cursor: 'pointer' }}>
        <Search size={16} color="#94A3B8" />
        <input type="text" placeholder="Search anything in workspace..." readOnly />
        <span className="shortcut-badge">Ctrl K</span>
      </div>

      {/* Header Actions */}
      <div className="header-right-actions" style={{ position: 'relative' }}>
        {/* Gemini Model Status Badge Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            className="model-status-badge"
            onClick={() => setShowModelSelector(!showModelSelector)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <Zap size={14} color="#C084FC" />
            <span>✦ {selectedModel}</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.8, background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: '10px' }}>
              Fast
            </span>
          </div>

          {showModelSelector && (
            <div className="dropdown-menu" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '220px', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '8px', zIndex: 50, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>Select AI Model</div>
              {['Gemini 2.0 Flash', 'Gemini 1.5 Pro', 'Gemini 2.0 Flash-Lite', 'GPT-4o Mini'].map((m) => (
                <button
                  key={m}
                  onClick={() => handleSelectModel(m)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '8px 10px', background: selectedModel === m ? 'rgba(168,85,247,0.15)' : 'transparent', border: 'none', borderRadius: '6px', color: '#f8fafc', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span>{m}</span>
                  {selectedModel === m && <Check size={14} color="#a855f7" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dark/Light Mode Theme Toggle */}
        <button className="icon-circle-btn" onClick={handleToggleTheme} title="Toggle Theme">
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notification Bell with Badge & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button className="icon-circle-btn" onClick={() => setShowNotifMenu(!showNotifMenu)} title="Notifications" style={{ position: 'relative' }}>
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '16px', height: '16px', background: '#ef4444', color: 'white', fontSize: '10px', fontWeight: 'bold', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="dropdown-menu" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '320px', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '12px', zIndex: 50, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #1e293b', pb: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#f8fafc' }}>Notifications ({notifications.length})</span>
                {notifications.length > 0 && (
                  <button onClick={handleClearNotifs} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer' }}>Clear all</button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div style={{ padding: '16px 0', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                  No new notifications
                </div>
              ) : (
                <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.map((n) => (
                    <div key={n.id} onClick={() => handleMarkRead(n.id)} style={{ padding: '8px 10px', borderRadius: '8px', background: n.is_read ? '#1e293b' : 'rgba(168,85,247,0.1)', border: '1px solid ' + (n.is_read ? '#334155' : 'rgba(168,85,247,0.3)'), cursor: 'pointer' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{n.title}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{n.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Avatar Icon Menu */}
        <div style={{ position: 'relative' }}>
          <img
            src={user?.profile_image || defaultAvatar}
            alt={user?.name || "User Avatar"}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(139, 92, 246, 0.4)', cursor: 'pointer' }}
          />

          {showProfileMenu && (
            <div className="dropdown-menu" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '200px', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '8px', zIndex: 50, boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
              {user ? (
                <>
                  <div style={{ padding: '8px', borderBottom: '1px solid #1e293b', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#f8fafc' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{user.email}</div>
                  </div>
                  <button onClick={() => { onNavigate('settings'); setShowProfileMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', background: 'transparent', border: 'none', borderRadius: '6px', color: '#f8fafc', fontSize: '13px', cursor: 'pointer' }}>
                    <User size={15} />
                    <span>Profile & Settings</span>
                  </button>
                  <button onClick={() => { logout(); setShowProfileMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', background: 'transparent', border: 'none', borderRadius: '6px', color: '#ef4444', fontSize: '13px', cursor: 'pointer' }}>
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button onClick={() => { setShowAuthModal(true); setShowProfileMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', background: 'transparent', border: 'none', borderRadius: '6px', color: '#a855f7', fontSize: '13px', cursor: 'pointer' }}>
                  <LogIn size={15} />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
