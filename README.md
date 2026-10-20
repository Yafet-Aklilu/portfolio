# Yafet Aklilu — Portfolio

Desktop-first black-and-white editorial portfolio. Built with Next.js App Router, TypeScript, Tailwind CSS v4, and GSAP.

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- GSAP + ScrollTrigger (`src/lib/gsap.ts`)

## AI assistant

Server-side portfolio assistant with a floating chat UI.

| Piece | Location |
|--------|----------|
| Knowledge (human) | `docs/ai-assistant/README.md` |
| Knowledge (structured) | `src/lib/ai/knowledge.ts` |
| Providers | `src/lib/ai/providers/groq.ts`, `gemini.ts` |
| API | `POST /api/assistant` |
| Chat UI | `src/components/assistant/AiAssistantPanel.tsx` |
| Env template | `.env.example` |

### Configure

1. Copy `.env.example` → `.env.local` (gitignored).
2. Set `AI_ASSISTANT_ENABLED=true`.
3. Choose provider: `AI_ASSISTANT_PROVIDER=groq` or `gemini`.
4. Set `AI_ASSISTANT_MODEL` for that provider.
5. Set `GROQ_API_KEY` and/or `GEMINI_API_KEY` (server-only).

Switch providers by changing env vars only — no code changes required.

Conversations are **not** persisted. Closing the modal clears the session.
