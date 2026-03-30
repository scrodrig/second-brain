# Second Brain — Phase 1: Foundation Design

**Date:** 2026-03-27
**Status:** Approved
**Scope:** UI redesign, Auth, Household model, Invoice CRUD, OCR optional scan

---

## Overview

Second Brain is a household financial tracker for families. Phase 1 establishes the full foundation: a redesigned UI with a warm/personal aesthetic, multi-user household model, complete invoice CRUD, Google + email/password auth, i18n support (en/es/pt), and optional OCR invoice scanning on mobile.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript 5 |
| UI Library | HeroUI (NextUI v2 migration) + Tailwind CSS 4 |
| Auth | Auth.js v5 (Google OAuth + Credentials/bcryptjs) |
| Database | PostgreSQL via Prisma ORM |
| i18n | next-intl (en, es, pt) |
| OCR | Tesseract.js with Strategy pattern (swappable) |
| Email | Resend (free tier, no credit card) |
| Package Manager | pnpm |

---

## Data Model

```prisma
model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  emailVerified DateTime?
  image         String?
  password      String?  // null for OAuth users
  createdAt     DateTime @default(now())

  memberships   HouseholdMember[]
  invoices      Invoice[]         // invoices created by this user
  accounts      Account[]         // Auth.js adapter
  sessions      Session[]         // Auth.js adapter
}

model Household {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())

  members   HouseholdMember[]
  invoices  Invoice[]
}

model HouseholdMember {
  id          String          @id @default(uuid())
  role        HouseholdRole   @default(MEMBER)
  joinedAt    DateTime        @default(now())

  userId      String
  householdId String

  user        User            @relation(fields: [userId], references: [id])
  household   Household       @relation(fields: [householdId], references: [id])

  @@unique([userId, householdId])
}

enum HouseholdRole {
  OWNER
  MEMBER
}

model Invoice {
  id             String   @id @default(uuid())
  date           DateTime @default(now())
  place          String
  nif            String
  concept        Concept
  description    String?
  total          Float    @default(0)
  isReimbursable Boolean  @default(false)
  isRefunded     Boolean  @default(false)
  vatRefund      Boolean?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  createdById    String
  householdId    String
  accountType    AccountType

  createdBy      User      @relation(fields: [createdById], references: [id])
  household      Household @relation(fields: [householdId], references: [id])
}

enum Concept {
  Meal
  Technology
  Internet
  Electricity
  Education
  Transportation
  Others
}

enum AccountType {
  Personal
  Business
}
```

**Key changes from current schema:**
- `Invoice` now belongs to a `Household`, not a loose string `owner`
- `createdById` FK replaces the free-text `owner` field
- `HouseholdMember` join table with roles
- Auth.js adapter models (`Account`, `Session`) added to schema

---

## Architecture

```
src/
├── app/
│   └── [locale]/                    ← next-intl locale routing (en/es/pt)
│       ├── (auth)/
│       │   └── login/               ← Google OAuth + email/password
│       ├── (dashboard)/
│       │   ├── layout.tsx           ← sidebar + navbar wrapper
│       │   ├── page.tsx             ← dashboard home
│       │   ├── invoices/
│       │   │   ├── page.tsx         ← invoice list with pagination
│       │   │   └── [id]/page.tsx    ← invoice detail
│       │   ├── invoices/new/        ← create invoice form
│       │   ├── invoices/[id]/edit/  ← edit invoice form
│       │   ├── household/           ← manage household members
│       │   └── settings/            ← profile, language
├── actions/                         ← Server Actions by domain
│   ├── invoices/
│   ├── household/
│   └── auth/
├── components/                      ← Atomic Design
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── templates/
│   └── providers/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts                      ← Auth.js v5 config
│   └── ocr/
│       ├── ocr.interface.ts         ← OcrProvider interface
│       ├── tesseract.provider.ts    ← TesseractProvider implements OcrProvider
│       └── ocr.factory.ts           ← OcrProviderFactory (env-driven)
├── i18n/
│   └── request.ts                   ← next-intl config
└── messages/
    ├── en.json
    ├── es.json
    └── pt.json
```

---

## Component Structure (Atomic Design)

```
atoms/
  Button, Input, Badge, Avatar, Icon, Chip, Spinner, Label, Tooltip

molecules/
  FormField, InvoiceCard, StatCard, ConceptBadge (icon + color + label),
  LanguageSwitcher, HelpTooltip, MemberAvatar

organisms/
  InvoiceGrid, InvoiceForm, Sidebar, Navbar,
  HouseholdMemberList, OcrScanSection

templates/
  DashboardTemplate, AuthTemplate
```

**Rule:** Pages → Templates → Organisms → Molecules → Atoms. Never skip levels. HeroUI components are only used inside atoms — never called directly from organisms or pages.

---

## UI Design Direction

**Style:** Warm, personal, family-focused (Splitwise / Copilot Money aesthetic). Not corporate.

**Colors:**
- Primary: Indigo `#6366f1`
- Accent: Amber `#f59e0b`
- Surface: Off-white / deep slate (light/dark)
- Success/Error: Desaturated green and red

**Typography:** Inter (body + data), Montserrat Alternates (app name / large headings only)

**Design decisions:**
- `rounded-2xl` borders — feels like an app, not a spreadsheet
- Cards with subtle shadow, no hard borders
- Collapsible sidebar with icon + label (never icon-only)
- **Mobile:** sidebar becomes bottom navigation
- Concept badges: icon + color + label (e.g., 🍔 green for Meal)
- `HelpTooltip` on concept/account selectors explaining what each means
- Hero images removed — they were mockup placeholders

---

## Auth

- **Google OAuth:** primary login method
- **Email + Password:** Credentials provider with bcryptjs hashing
- **Session strategy:** database sessions via Auth.js Prisma adapter
- Password is `null` for OAuth-only users — no collision
- Protected routes via Auth.js middleware on `[locale]/(dashboard)/**`

---

## Invoice CRUD

Full create, read, update, delete via Server Actions:

- `createInvoice(data)` — validates, saves to DB under user's household
- `updateInvoice(id, data)` — checks user belongs to same household
- `deleteInvoice(id)` — hard delete in Phase 1
- `getInvoices({ householdId, page, filters })` — paginated list
- `getInvoiceById(id)` — with household membership check

---

## OCR (Optional, Mobile-only)

**Strategy pattern:**

```ts
interface OcrProvider {
  extractInvoiceData(image: Buffer): Promise<ExtractedInvoiceData>
}

interface ExtractedInvoiceData {
  total?: number
  vat?: number
  place?: string
  date?: string
  nif?: string
}

class TesseractProvider implements OcrProvider { ... }
// Future: class GeminiProvider implements OcrProvider { ... }

class OcrProviderFactory {
  static create(provider = process.env.OCR_PROVIDER ?? 'tesseract'): OcrProvider
}
```

**UX flow:**
1. User opens invoice creation form
2. Optional `OcrScanSection` is visible on mobile (`md:hidden`)
3. User taps "Scan receipt" → `<input type="file" accept="image/*" capture="environment">`
4. Image processed in memory by Tesseract (never saved to disk)
5. Extracted fields pre-fill the form — user validates and corrects
6. On form submit, only the invoice data is saved — image discarded

**Desktop:** The entire `OcrScanSection` is hidden (`md:hidden`). No file picker shown.

---

## i18n

- `next-intl` with locale prefix: `/en/`, `/es/`, `/pt/`
- Middleware auto-detects browser language, redirects to matching locale
- All UI strings externalized to `messages/{locale}.json`
- Enum values (Concept, AccountType) stored as keys in DB, translated in UI
- `LanguageSwitcher` molecule in navbar settings

---

## Email (Resend)

When a user wants to keep a receipt record outside the app:
- Server Action generates a PDF summary of the invoice (react-pdf or similar)
- Sends via Resend to the user's registered email
- No file stored anywhere — generated and sent in one request
- Free tier: 100 emails/day, no credit card required

---

## What's NOT in Phase 1

- Dashboards and spending charts (Phase 2)
- Advanced filters and reports (Phase 2)
- Automated tests / Playwright E2E (Phase 4)
- WhatsApp integration (future consideration)
- Google Drive integration (future consideration)
- Swap OCR provider (Gemini) — interface ready, not implemented

---

## Roadmap

| Phase | Focus |
|---|---|
| **1 — Foundation** | This spec |
| **2 — Dashboards** | Monthly summaries, charts by category/member/account |
| **3 — Smart features** | Swap to Gemini OCR, PDF export improvements |
| **4 — Quality** | E2E tests (Playwright), unit tests where it matters |
