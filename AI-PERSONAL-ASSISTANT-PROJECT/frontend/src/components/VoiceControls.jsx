import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { voiceService } from '../services/voiceService';

export function VoiceControls({ onSpeechInput, activeAiText }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState('');

  const supported = voiceService.isSupported();

  useEffect(() => {
    if (activeAiText && supported) {
      setIsSpeaking(true);
      voiceService.speak(activeAiText, () => {
        setIsSpeaking(false);
      });
    }
  }, [activeAiText]);

  const toggleListen = () => {
    if (!supported) {
      setVoiceError('Web Speech API is not supported in this browser.');
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      setVoiceError('');
      setIsListening(true);
      if (isSpeaking) {
        voiceService.stopSpeaking();
        setIsSpeaking(false);
      }

      voiceService.startListening(
        (transcript) => {
          setIsListening(false);
          if (onSpeechInput) onSpeechInput(transcript);
        },
        (err) => {
          setIsListening(false);
          setVoiceError(`Voice error: ${err}`);
        },
        () => {
          setIsListening(false);
        }
      );
    }
  };

  const stopSpeaking = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  };

  if (!supported) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
      <button
        type="button"
        onClick={toggleListen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '12px',
          border: isListening ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
          background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-card-elevated)',
          color: isListening ? '#f87171' : 'var(--text-muted)',
          fontSize: '0.75rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        title={isListening ? 'Listening... Click to stop' : 'Click to Speak'}
      >
        {isListening ? <MicOff size={13} color="#f87171" /> : <Mic size={13} />}
        <span>{isListening ? 'Listening...' : 'Speak'}</span>
      </button>

      {isSpeaking && (
        <button
          type="button"
          onClick={stopSpeaking}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '12px',
            border: '1px solid #a855f7',
            background: 'rgba(168, 85, 247, 0.2)',
            color: '#c084fc',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          <VolumeX size={13} />
          <span>Stop Speaking</span>
        </button>
      )}

      {voiceError && (
        <span style={{ fontSize: '0.72rem', color: '#f87171' }}>{voiceError}</span>
      )}
    </div>
  );
}
