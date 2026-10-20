"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { askAssistantClient } from "@/components/assistant/askAssistantClient";
import type {
  AssistantPanelProps,
  AssistantUiMessage,
} from "@/components/assistant/types";
import { cn } from "@/lib/cn";

const WELCOME_CONTENT =
  "Hi. I’m Yafet’s portfolio assistant. Ask about his skills, projects, or how he can help with remote work and freelance collaborations.";

function isWelcomeMessage(message: AssistantUiMessage) {
  return message.id.startsWith("welcome");
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AiAssistantPanel({ open, onClose }: AssistantPanelProps) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<AssistantUiMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME_CONTENT },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fresh conversation whenever the panel opens; clear completely on close
  useEffect(() => {
    if (open) {
      setMessages([
        {
          id: `welcome-${createId()}`,
          role: "assistant",
          content: WELCOME_CONTENT,
        },
      ]);
      setInput("");
      setError(null);
      setLoading(false);
      const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
      return () => window.clearTimeout(timer);
    }

    setMessages([]);
    setInput("");
    setError(null);
    setLoading(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading, open]);

  const send = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: AssistantUiMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    };

    const historyForApi = messages.filter((message) => !isWelcomeMessage(message));
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setLoading(true);

    const result = await askAssistantClient(trimmed, historyForApi);

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: createId(),
        role: "assistant",
        content: result.answer,
      },
    ]);
  }, [input, loading, messages]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]" aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-[min(92dvh,720px)] w-full max-w-3xl flex-col overflow-hidden border border-line bg-bg shadow-[0_24px_60px_rgba(0,0,0,0.2)] sm:h-[min(84dvh,720px)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p id={titleId} className="text-label text-ink">
              Portfolio assistant
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Ask about skills, projects, or collaboration
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="btn btn-line !px-3 !py-2"
            onClick={onClose}
          >
            Close
          </button>
        </header>

        <div
          ref={listRef}
          className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5"
          aria-live="polite"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                  message.role === "user"
                    ? "bg-ink text-[var(--palette-invert-ink)]"
                    : "border border-line bg-bg-elevated text-ink",
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading ? (
            <div className="flex justify-start">
              <div className="border border-line bg-bg-elevated px-4 py-3 text-label text-muted">
                Thinking
                <span className="ml-1 inline-flex gap-0.5" aria-hidden>
                  <span className="animate-pulse">.</span>
                  <span className="animate-pulse [animation-delay:120ms]">.</span>
                  <span className="animate-pulse [animation-delay:240ms]">.</span>
                </span>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="border border-line bg-bg-elevated px-4 py-3 text-sm text-ink-muted">
              {error}
            </div>
          ) : null}
        </div>

        <form
          className="border-t border-line px-4 py-4"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <label className="sr-only" htmlFor="assistant-input">
            Message
          </label>
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              id="assistant-input"
              rows={2}
              value={input}
              disabled={loading}
              placeholder="Ask about Yafet’s work…"
              className="min-h-[3rem] flex-1 resize-none border border-line bg-bg-elevated px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-subtle focus-visible:border-ink disabled:opacity-60"
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send();
                }
              }}
            />
            <button
              type="submit"
              className="btn btn-solid shrink-0 !px-4 !py-3"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
          <p className="text-label mt-2 text-ink-subtle">
            Enter to send · Shift + Enter for a new line
          </p>
        </form>
      </div>
    </div>,
    document.body,
  );
}
