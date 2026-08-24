export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isOpen,
  onClose,
}) {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${isOpen ? ' sidebar-overlay--visible' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
        {/* Header */}
        <div className="sidebar__header">
          <div className="sidebar__logo">✦</div>
          <span className="sidebar__title">AI Assistant</span>
        </div>

        {/* New Chat Button */}
        <button className="sidebar__new-chat" onClick={onNew}>
          <span>＋</span>
          New Chat
        </button>

        {/* Conversation List */}
        <div className="sidebar__conversations">
          {conversations.length === 0 ? (
            <div className="sidebar__empty">
              No conversations yet.<br />
              Start a new chat to begin!
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`sidebar__conv-item${
                  activeId === conv.id ? ' sidebar__conv-item--active' : ''
                }`}
                onClick={() => {
                  onSelect(conv.id);
                  onClose();
                }}
              >
                <span className="sidebar__conv-title">
                  {conv.title || 'New Chat'}
                </span>
                <button
                  className="sidebar__conv-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  title="Delete conversation"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
