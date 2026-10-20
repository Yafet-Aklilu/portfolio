/**
 * Normalize model output for the chat UI: strip markdown chrome
 * and keep short, readable plain text structure.
 */
export function formatAssistantAnswer(raw: string): string {
  let text = raw.replace(/\r\n/g, "\n").trim();
  if (!text) return text;

  // Fenced code blocks → plain content
  text = text.replace(/```[\w]*\n?([\s\S]*?)```/g, (_match, code: string) =>
    code.trim(),
  );

  // Inline code, bold, italic, strikethrough
  text = text.replace(/`([^`]+)`/g, "$1");
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, "$1");
  text = text.replace(/\*\*(.+?)\*\*/g, "$1");
  text = text.replace(/__(.+?)__/g, "$1");
  text = text.replace(/\*(.+?)\*/g, "$1");
  text = text.replace(/_(.+?)_/g, "$1");
  text = text.replace(/~~(.+?)~~/g, "$1");

  // Headings → plain lines
  text = text.replace(/^#{1,6}\s+/gm, "");

  // Horizontal rules
  text = text.replace(/^\s*([-*_]){3,}\s*$/gm, "");

  // Links / images → label only
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Dash / star bullets → plain lines (keep numbered 1) lists)
  text = text.replace(/^\s*[-*+]\s+/gm, "");
  text = text.replace(/^\s*•\s+/gm, "");

  // Em / en dashes and double hyphens → commas
  text = text.replace(/\s*[—–]\s*/g, ", ");
  text = text.replace(/-{2,}/g, ", ");

  // Collapse leftover markdown asterisks
  text = text.replace(/\*{1,}/g, "");

  // Tidy whitespace and punctuation
  text = text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/,\s*,+/g, ",")
    .replace(/\.\s*,/g, ".")
    .replace(/,\s*\./g, ".")
    .trim();

  return text;
}
