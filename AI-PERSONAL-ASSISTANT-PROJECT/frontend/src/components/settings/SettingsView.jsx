import React, { useState, useEffect } from 'react';
import { Settings, User, Cpu, Mic, Sun, Bell, ShieldCheck, Trash2, Sliders, Volume2, Edit3, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import PageHeader from '../common/PageHeader';
import ToggleSwitch from '../common/ToggleSwitch';

export default function SettingsView() {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [autoSpeech, setAutoSpeech] = useState(true);
  const [voiceInput, setVoiceInput] = useState(true);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [taskNotifs, setTaskNotifs] = useState(true);
  const [plannerNotifs, setPlannerNotifs] = useState(true);
  const [docNotifs, setDocNotifs] = useState(true);

  // Edit Profile Modal Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPlan, setEditPlan] = useState('');
  const [selectedModel, setSelectedModel] = useState('Gemini 2.0 Flash');
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      setEditPlan(user.account_plan || 'Pro Plan');
      if (user.preferences?.ai_model) setSelectedModel(user.preferences.ai_model);
      if (user.settings?.theme) setSelectedTheme(user.settings.theme);
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: editName,
        email: editEmail,
        account_plan: editPlan,
        preferences: { ai_model: selectedModel },
        settings: { theme: selectedTheme },
      });
      setIsEditingProfile(false);
      setSaveSuccess('Profile updated successfully!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (e) {
      console.error('Failed to update profile:', e);
    }
  };

  const handleSaveVoiceSettings = async () => {
    try {
      await updateProfile({
        settings: { voice_auto_speech: autoSpeech, voice_input: voiceInput, speech_speed: speechSpeed },
      });
      setSaveSuccess('Voice settings saved!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (e) {
      console.error('Failed to save voice settings:', e);
    }
  };

  const handleSaveNotificationSettings = async () => {
    try {
      await updateProfile({
        settings: { notif_tasks: taskNotifs, notif_planner: plannerNotifs, notif_docs: docNotifs },
      });
      setSaveSuccess('Notification preferences saved!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (e) {
      console.error('Failed to save notification settings:', e);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'aimodel', label: 'AI & Model', icon: Cpu },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Data', icon: ShieldCheck },
  ];

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";

  return (
    <div className="page-container">
      {/* Page Header */}
      <PageHeader
        icon={Settings}
        title="Settings & Configuration"
        description="Manage your account profile, AI preferences, voice controls, appearance, and persistent application settings."
      />

      {saveSuccess && (
        <div style={{ padding: '10px 16px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '8px', color: '#4ade80', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} /> {saveSuccess}
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="filter-chips-row" style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`chip-item-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 18px' }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* GENERAL TAB */}
      {activeTab === 'general' && (
        <div className="section-card">
          <div className="section-card-title">
            <User size={18} color="#8B5CF6" />
            <span>Profile Settings</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--bg-card-elevated)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
            <img
              src={user?.profile_image || defaultAvatar}
              alt={user?.name || "User Avatar"}
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-active)' }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', color: 'white' }}>{user?.name || 'Vijay Kumar'}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email || 'vijay.kumar@example.com'}</p>
              <span style={{ fontSize: '0.75rem', background: 'rgba(139, 92, 246, 0.2)', color: '#C084FC', padding: '2px 10px', borderRadius: '10px', marginTop: '6px', display: 'inline-block' }}>
                👑 {user?.account_plan || 'Pro Plan'}
              </span>
            </div>

            <button onClick={() => setIsEditingProfile(true)} style={{ background: 'var(--gradient-button)', border: 'none', color: 'white', padding: '8px 20px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}>
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {/* AI & MODEL TAB */}
      {activeTab === 'aimodel' && (
        <div className="section-card">
          <div className="section-card-title">
            <Cpu size={18} color="#C084FC" />
            <span>AI Model Engine Configuration</span>
          </div>

          <div style={{ background: 'var(--bg-card-elevated)', border: '1px solid var(--border-active)', padding: '20px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>✨ {selectedModel}</span>
                <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', border: '1px solid rgba(34, 197, 94, 0.4)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                  Active
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Fast, intelligent conversational AI model optimized for low latency chat, memory extraction, and autonomous tool execution.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '8px' }}>
              {['Gemini 2.0 Flash', 'Gemini 1.5 Pro', 'Gemini 2.0 Flash-Lite', 'GPT-4o Mini'].map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setSelectedModel(m);
                    updateProfile({ preferences: { ai_model: m } });
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: selectedModel === m ? '1px solid #a855f7' : '1px solid #334155',
                    background: selectedModel === m ? 'rgba(168,85,247,0.2)' : '#0f172a',
                    color: selectedModel === m ? '#f8fafc' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VOICE TAB */}
      {activeTab === 'voice' && (
        <div className="section-card">
          <div className="section-card-title">
            <Mic size={18} color="#EC4899" />
            <span>Voice Assistant Settings</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card-elevated)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'white' }}>Auto Text-to-Speech Output</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automatically speak out AI responses when voice mode is active</div>
              </div>
              <ToggleSwitch active={autoSpeech} onChange={setAutoSpeech} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card-elevated)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'white' }}>Voice Input Enabled</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Allow browser Speech Recognition for voice input</div>
              </div>
              <ToggleSwitch active={voiceInput} onChange={setVoiceInput} />
            </div>

            <div style={{ background: 'var(--bg-card-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'white' }}>
                <span>Speech Speed ({speechSpeed}x)</span>
                <Volume2 size={16} color="#94A3B8" />
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speechSpeed}
                onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                style={{ accentColor: '#8B5CF6' }}
              />
              <button
                onClick={() => {
                  const synth = window.speechSynthesis;
                  if (synth) {
                    const u = new SpeechSynthesisUtterance("Nexus AI voice assistant synthesis is active and working cleanly.");
                    u.rate = speechSpeed;
                    synth.speak(u);
                  }
                }}
                style={{ alignSelf: 'flex-start', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'white', padding: '6px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.8rem', marginTop: '6px' }}
              >
                🔊 Test Voice Output
              </button>
            </div>
          </div>
          <button
            onClick={handleSaveVoiceSettings}
            style={{ alignSelf: 'flex-end', background: 'var(--gradient-button)', border: 'none', color: 'white', padding: '10px 24px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
          >
            Save Voice Settings
          </button>
        </div>
      )}

      {/* APPEARANCE TAB */}
      {activeTab === 'appearance' && (
        <div className="section-card">
          <div className="section-card-title">
            <Sun size={18} color="#F59E0B" />
            <span>Appearance & Theme</span>
          </div>

          <div className="card-grid-3col">
            {[
              { id: 'dark', title: 'Dark Mode (Default)', desc: 'Deep Navy & Purple Glass' },
              { id: 'light', title: 'Light Mode', desc: 'Clean Modern White' },
              { id: 'system', title: 'System Default', desc: 'Match OS Preferences' },
            ].map((theme) => (
              <div
                key={theme.id}
                onClick={() => {
                  setSelectedTheme(theme.id);
                  updateProfile({ settings: { theme: theme.id } });
                }}
                className="stat-card-box"
                style={{
                  cursor: 'pointer',
                  borderColor: selectedTheme === theme.id ? 'var(--accent-purple)' : 'var(--border-subtle)',
                  boxShadow: selectedTheme === theme.id ? 'var(--shadow-glow)' : 'none',
                }}
              >
                <div style={{ fontWeight: 700, color: 'white' }}>{theme.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{theme.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {activeTab === 'notifications' && (
        <div className="section-card">
          <div className="section-card-title">
            <Bell size={18} color="#3B82F6" />
            <span>Notification Preferences</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card-elevated)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'white' }}>Task & Reminder Alerts</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Get notified when tasks or reminders are due</div>
              </div>
              <ToggleSwitch active={taskNotifs} onChange={setTaskNotifs} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card-elevated)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'white' }}>Daily Planner Notifications</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Morning schedule summary alerts</div>
              </div>
              <ToggleSwitch active={plannerNotifs} onChange={setPlannerNotifs} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card-elevated)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'white' }}>Document Processing Alerts</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Notify when file embedding & analysis finishes</div>
              </div>
              <ToggleSwitch active={docNotifs} onChange={setDocNotifs} />
            </div>
          </div>
          <button
            onClick={handleSaveNotificationSettings}
            style={{ alignSelf: 'flex-end', background: 'var(--gradient-button)', border: 'none', color: 'white', padding: '10px 24px', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', fontSize: '0.88rem' }}
          >
            Save Notification Settings
          </button>
        </div>
      )}

      {/* PRIVACY & DATA TAB */}
      {activeTab === 'privacy' && (
        <div className="section-card">
          <div className="section-card-title">
            <ShieldCheck size={18} color="#22C55E" />
            <span>Privacy & Data Management</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#F87171' }}>Account Sign Out</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sign out of your active NEXUS AI session</div>
              </div>
              <button onClick={logout} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #F87171', color: '#F87171', padding: '6px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.8rem' }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="modal-overlay" onClick={() => setIsEditingProfile(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button className="modal-close-btn" onClick={() => setIsEditingProfile(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>Account Plan</label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value)}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }}
                >
                  <option value="Pro Plan">👑 Pro Plan</option>
                  <option value="Free Plan">Free Plan</option>
                  <option value="Enterprise Plan">🚀 Enterprise Plan</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsEditingProfile(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 20px', background: 'var(--gradient-button)', border: 'none', color: 'white', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
