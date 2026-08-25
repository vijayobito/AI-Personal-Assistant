import { useState, useEffect } from 'react';
import { FileText, Upload, Trash2, Sparkles, Send, FileCode, FileSpreadsheet } from 'lucide-react';
import { fetchDocuments as apiFetchDocuments, uploadDocument as apiUploadDocument, deleteDocument as apiDeleteDocument, sendMessage as sendChatMessage } from '../services/api';
import PageHeader from './common/PageHeader';
import StatCard from './common/StatCard';
import EmptyState from './common/EmptyState';

export function DocumentChat() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '📄 **Multi-Format Document Workspace Ready!** Upload any **PDF, DOCX, TXT, or CSV** file to ask questions, generate instant summaries, or extract key points.',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const loadDocuments = async () => {
    try {
      const data = await apiFetchDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setUploading(true);
      const doc = await apiUploadDocument(selectedFile);
      setSelectedFile(null);
      loadDocuments();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `✅ Successfully uploaded and processed **${doc.filename}**! Created ${doc.chunk_count} vector embedding passages. Ask me anything about this file!`,
        },
      ]);
    } catch (err) {
      console.error('Document upload error:', err);
      alert(err.response?.data?.detail || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    try {
      await apiDeleteDocument(id);
      loadDocuments();
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  const handleAskQuestion = async (e) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || loadingAnswer) return;

    const userText = inputQuery.trim();
    setInputQuery('');
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setLoadingAnswer(true);

    try {
      const data = await sendChatMessage(`Document search query: ${userText}`);
      setMessages((prev) => [...prev, data.ai_message]);
    } catch (err) {
      console.error('Error asking document question:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error searching the document.' },
      ]);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const handleQuickAction = async (actionPrompt) => {
    setLoadingAnswer(true);
    setMessages((prev) => [...prev, { role: 'user', content: actionPrompt }]);
    try {
      const data = await sendChatMessage(actionPrompt);
      setMessages((prev) => [...prev, data.ai_message]);
    } catch (err) {
      console.error('Error executing document action:', err);
    } finally {
      setLoadingAnswer(false);
    }
  };

  const totalDocs = documents.length;
  const pdfCount = documents.filter((d) => d.file_type === 'pdf').length;
  const docxCount = documents.filter((d) => d.file_type === 'docx').length;
  const csvCount = documents.filter((d) => d.file_type === 'csv').length;

  return (
    <div className="page-container">
      {/* Page Header */}
      <PageHeader
        icon={FileText}
        title="File & Docs AI Assistant Workspace"
        description="Upload PDF, DOCX, TXT, or CSV files to extract insights, generate summaries, and perform vector RAG search."
      />

      {/* Summary Stat Cards */}
      <div className="stats-cards-grid">
        <StatCard icon={FileText} title="Total Uploaded" value={totalDocs} subtext="Processed files" accentColor="#06B6D4" />
        <StatCard icon={FileText} title="PDF Files" value={pdfCount} subtext="PDF documents" accentColor="#8B5CF6" />
        <StatCard icon={FileCode} title="DOCX / TXT" value={docxCount} subtext="Text documents" accentColor="#F59E0B" />
        <StatCard icon={FileSpreadsheet} title="CSV Spreadsheets" value={csvCount} subtext="Structured data" accentColor="#22C55E" />
      </div>

      {/* Structured 2-Column Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px' }}>
        {/* Left Side: Upload & File List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Custom Upload Dropzone Card */}
          <div className="section-card">
            <div className="section-card-title">
              <Upload size={18} color="#06B6D4" />
              <span>Upload Document</span>
            </div>

            <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="file"
                accept=".pdf,.docx,.txt,.csv"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                id="doc-upload"
                style={{ display: 'none' }}
              />
              <label
                htmlFor="doc-upload"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px dashed var(--border-active)',
                  padding: '24px 16px',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <Upload size={24} color="#C084FC" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>
                  {selectedFile ? selectedFile.name : 'Choose PDF, DOCX, TXT, CSV'}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Formats: .pdf, .docx, .txt, .csv</span>
              </label>

              <button
                type="submit"
                disabled={!selectedFile || uploading}
                style={{
                  background: 'var(--gradient-button)',
                  border: 'none',
                  color: 'white',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  opacity: !selectedFile || uploading ? 0.5 : 1
                }}
              >
                {uploading ? 'Processing File...' : 'Upload & Embed'}
              </button>
            </form>
          </div>

          {/* Document List Card */}
          <div className="section-card">
            <div className="section-card-title">
              <FileText size={18} color="#06B6D4" />
              <span>Workspace Files ({documents.length})</span>
            </div>

            {documents.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                No files uploaded yet.
              </p>
            ) : (
              <div className="recent-docs-list">
                {documents.map((doc) => (
                  <div key={doc.id} className="doc-row-item">
                    <div className="doc-row-left">
                      <FileText size={16} color="#06B6D4" />
                      <span className="doc-name-text">{doc.filename}</span>
                    </div>
                    <button onClick={() => handleDeleteDoc(doc.id)} style={{ background: 'transparent', border: 'none', color: '#F87171', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Document Interactive Chat Area */}
        <div className="chat-section-card" style={{ height: '100%', minHeight: '520px' }}>
          <div className="chat-card-header">
            <div className="chat-card-title">
              <Sparkles size={18} color="#06B6D4" />
              <span>Document Intelligence Chat</span>
            </div>

            {documents.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="chip-suggestion-btn"
                  onClick={() => handleQuickAction('Summarize this document')}
                  disabled={loadingAnswer}
                >
                  ✨ Summarize
                </button>
                <button
                  className="chip-suggestion-btn"
                  onClick={() => handleQuickAction('Find important key points in this document')}
                  disabled={loadingAnswer}
                >
                  📌 Key Points
                </button>
              </div>
            )}
          </div>

          <div className="chat-messages-area" style={{ flex: 1, maxHeight: 'none' }}>
            {messages.map((m, idx) => (
              <div key={idx} className={`msg-bubble ${m.role}`}>
                <div className="msg-avatar-icon">{m.role === 'user' ? '👤' : '🤖'}</div>
                <div className="msg-text-bubble">{m.content}</div>
              </div>
            ))}
            {loadingAnswer && (
              <div className="msg-bubble assistant">
                <div className="msg-avatar-icon">🤖</div>
                <div className="msg-text-bubble" style={{ opacity: 0.7 }}>Searching embeddings & extracting passages...</div>
              </div>
            )}
          </div>

          <form className="chat-composer-box" onSubmit={handleAskQuestion}>
            <div className="composer-input-row">
              <input
                type="text"
                placeholder="Ask a question about your uploaded document..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={loadingAnswer}
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem' }}
              />
              <button type="submit" className="btn-send-message" disabled={!inputQuery.trim() || loadingAnswer}>
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
