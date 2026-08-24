export default function Message({ message }) {
  const isUser = message.role === 'user';
  const time = new Date(message.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`message message--${message.role}`}>
      <div className="message__avatar">
        {isUser ? '👤' : '✦'}
      </div>
      <div>
        <div className="message__content">
          {isUser ? (
            message.content
          ) : (
            <MarkdownLite text={message.content} />
          )}
        </div>
        <div className="message__time">{time}</div>
      </div>
    </div>
  );
}

/**
 * Lightweight markdown renderer for AI responses.
 * Handles: code blocks, inline code, links, bold, italic, lists, paragraphs.
 */
function MarkdownLite({ text }) {
  if (!text) return null;

  // Split by code blocks first
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <>
      {parts.map((part, i) => {
        // Code block
        if (part.startsWith('```')) {
          const lines = part.slice(3, -3).split('\n');
          const lang = lines[0]?.trim();
          const code = (lang ? lines.slice(1) : lines).join('\n');
          return (
            <pre key={i}>
              <code>{code}</code>
            </pre>
          );
        }

        // Regular text — parse inline elements
        return <InlineMarkdown key={i} text={part} />;
      })}
    </>
  );
}

function InlineMarkdown({ text }) {
  // Split into paragraphs
  const paragraphs = text.split(/\n\n+/);

  return (
    <>
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Unordered list
        if (/^[-*•]\s/m.test(trimmed)) {
          const items = trimmed.split(/\n/).filter((l) => l.trim());
          return (
            <ul key={i}>
              {items.map((item, j) => (
                <li key={j}>
                  <InlineText text={item.replace(/^[-*•]\s*/, '')} />
                </li>
              ))}
            </ul>
          );
        }

        // Ordered list
        if (/^\d+\.\s/m.test(trimmed)) {
          const items = trimmed.split(/\n/).filter((l) => l.trim());
          return (
            <ol key={i}>
              {items.map((item, j) => (
                <li key={j}>
                  <InlineText text={item.replace(/^\d+\.\s*/, '')} />
                </li>
              ))}
            </ol>
          );
        }

        // Regular paragraph
        return (
          <p key={i}>
            <InlineText text={trimmed} />
          </p>
        );
      })}
    </>
  );
}

function InlineText({ text }) {
  // Handle markdown links: [text](url), bold: **text**, italic: *text*, inline code: `text`
  const parts = text.split(/(\[[^\]]+\]\([^\)]+\)|\*\*.*?\*\*|`[^`]+`|\*.*?\*)/g);

  return (
    <>
      {parts.map((part, i) => {
        // Markdown link [Label](url)
        const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\)]+)\)$/);
        if (linkMatch) {
          return (
            <a
              key={i}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkMatch[1]}
            </a>
          );
        }

        // Bold
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }

        // Inline code
        if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
          return <code key={i}>{part.slice(1, -1)}</code>;
        }

        // Italic
        if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }

        // Handle line breaks within regular text
        return part.split('\n').map((line, j, arr) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ));
      })}
    </>
  );
}
