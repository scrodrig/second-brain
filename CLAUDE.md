# Second Brain — Project Instructions

## Project Overview

Household financial tracker for families. Multi-user, multi-household. Warm, personal aesthetic.

## Tech Stack

- **Framework:** Next.js 15 App Router
- **Language:** TypeScript 5 (strict)
- **UI:** HeroUI (NextUI v2 migration) + Tailwind CSS 4
- **Auth:** Auth.js v5 — Google OAuth + Credentials (bcryptjs)
- **DB:** PostgreSQL via Prisma ORM
- **i18n:** next-intl (en, es, pt)
- **OCR:** Tesseract.js with Strategy pattern
- **Email:** Resend
- **Package manager:** pnpm

## Architecture Rules

- **No REST API** — use Next.js Server Actions for all mutations
- **Server Components by default** — only add `"use client"` when absolutely necessary
- **Atomic Design** for components: atoms → molecules → organisms → templates
  - Pages use templates, templates use organisms, organisms use molecules, organisms/molecules use atoms
  - Never skip levels
  - HeroUI primitives only inside atoms — never called directly from organisms or pages
- **Server Actions** live in `src/actions/` organized by domain
- **Never** read source code that wasn't changed as part of the task

## Skills to Load

| Context | Skill |
|---|---|
| React components, hooks, JSX | `react-19` |
| Next.js routing, Server Actions | `nextjs-15` |
| TypeScript types | `typescript` |
| Tailwind classes | `tailwind-4` |
| HeroUI components | `heroui` |
| Zod schemas | `zod-4` |

## Code Conventions

- TypeScript strict mode — no `any`
- Zod for all input validation (Server Actions + forms)
- `cn()` from `clsx` for conditional Tailwind classes
- Conventional commits format
- No "Co-Authored-By" or AI attribution in commits

## i18n

- All UI strings go in `messages/{en,es,pt}.json`
- Enum values stored as keys in DB, translated in UI via i18n messages
- Never hardcode user-facing strings in components

## Auth & Security

- Protect all dashboard routes via Auth.js middleware
- Always verify `householdId` membership before returning or mutating data
- Passwords hashed with bcryptjs (never stored plain)
- OAuth users have `password: null`

## OCR Pattern

New OCR providers implement `OcrProvider` interface in `src/lib/ocr/ocr.interface.ts`.
Register in `OcrProviderFactory`. Switch via `OCR_PROVIDER` env var.

## Database

- Run `pnpm prisma generate` after schema changes
- Run `pnpm prisma migrate dev` for local migrations
- Run `pnpm seed` to seed initial data

## What NOT to build (yet)

- Dashboards / charts (Phase 2)
- Playwright E2E tests (Phase 4)
- Gemini OCR provider (Phase 3)
- WhatsApp integration (future)
