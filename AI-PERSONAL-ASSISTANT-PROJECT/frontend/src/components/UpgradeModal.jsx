import React from 'react';
import { X, Rocket, Check, Zap, Sparkles } from 'lucide-react';

export default function UpgradeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Rocket className="w-5 h-5 text-purple-400" />
            Upgrade to NEXUS AI Pro
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
          Supercharge your productivity with advanced AI models, unlimited RAG document search, voice automation, and custom daily planners.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Free Tier */}
          <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f8fafc' }}>Free Tier</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '8px 0' }}>$0 <span style={{ fontSize: '12px', color: '#64748b' }}>/ month</span></div>
            <ul style={{ fontSize: '13px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, listStyle: 'none', margin: '12px 0' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#22c55e" /> Basic AI Assistant</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#22c55e" /> 5 Document Uploads</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#22c55e" /> Tasks & Reminders</li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2) 0%, rgba(15,23,42,0.9) 100%)', border: '1px solid rgba(168,85,247,0.5)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(168,85,247,0.3)', color: '#c084fc', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>POPULAR</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} color="#a855f7" /> Pro Plan
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '8px 0' }}>$19 <span style={{ fontSize: '12px', color: '#94a3b8' }}>/ month</span></div>
            <ul style={{ fontSize: '13px', color: '#f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, listStyle: 'none', margin: '12px 0' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#a855f7" /> Advanced Gemini 3.6 & GPT-4o</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#a855f7" /> Unlimited RAG File Embeddings</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#a855f7" /> Full Voice Commands & Synthesis</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Check size={14} color="#a855f7" /> AI Daily Planner & Analytics</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button onClick={onClose} style={{ padding: '10px 18px', background: 'transparent', border: '1px solid #334155', color: '#94a3b8', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
          <button onClick={() => { alert('NEXUS AI Pro Subscription initialized! Backend billing route ready.'); onClose(); }} style={{ padding: '10px 24px', background: 'var(--gradient-button)', border: 'none', color: 'white', fontWeight: 600, borderRadius: '8px', cursor: 'pointer' }}>Upgrade Now ($19/mo)</button>
        </div>
      </div>
    </div>
  );
}
