import React from 'react';
import { Cpu, Mic, FileCheck, Zap, ChevronRight } from 'lucide-react';

export default function ProFeaturesBanner() {
  const features = [
    {
      icon: Cpu,
      title: 'Advanced AI Models',
      desc: 'GPT-4o, Claude 3.5 & more',
    },
    {
      icon: Mic,
      title: 'Voice Commands',
      desc: 'Talk naturally to your assistant',
    },
    {
      icon: FileCheck,
      title: 'Unlimited Documents',
      desc: 'Upload & analyze files',
    },
    {
      icon: Zap,
      title: 'Smart Automation',
      desc: 'Automate repetitive tasks',
    },
  ];

  return (
    <div className="pro-features-banner">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="pro-banner-title">
          Unlock More with <span style={{ color: '#C084FC' }}>Nexus AI Pro</span>
        </span>
        <ChevronRight size={18} color="#94A3B8" style={{ cursor: 'pointer' }} />
      </div>

      <div className="pro-cards-row">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="pro-feature-card">
              <div className="pro-feature-icon">
                <Icon size={18} />
              </div>
              <div>
                <div className="pro-feature-name">{f.title}</div>
                <div className="pro-feature-desc">{f.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
