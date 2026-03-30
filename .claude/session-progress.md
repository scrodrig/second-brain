# Session Progress — phase1-foundation

## Branch
`worktree-phase1-foundation`

## Last session date
2026-03-27

## Completed tasks

| # | Task | Commit |
|---|------|--------|
| 1 | Tailwind 4 + HeroUI migration | ✅ |
| 2 | Prisma schema redesign | ✅ |
| 3 | Auth.js v5 setup | ✅ |
| 4 | i18n setup with next-intl | ✅ |
| 5 | Atomic Design atoms | ✅ |
| 6 | Concept + Account molecules | ✅ |
| 7 | Layout redesign | ✅ |
| 8 | Invoice CRUD server actions | `4b8ea2a` feat: add full invoice CRUD server actions with household auth checks |

## Task 8 — what was done (commit 4b8ea2a)

Files created/modified:
- `src/lib/schemas/invoice.schema.ts` — Zod schema with `InvoiceSchema` + `InvoiceInput` type
- `src/actions/invoices/create-invoice.ts` — creates invoice, resolves household from session
- `src/actions/invoices/update-invoice.ts` — updates invoice, checks household membership
- `src/actions/invoices/delete-invoice.ts` — deletes invoice, checks household membership
- `src/actions/invoices/get-invoices.ts` — replaced: paginated (PAGE_SIZE=8), household-scoped, auth-aware
- `src/actions/invoices/get-invoice-by-id.ts` — replaced: household membership check, notFound() on miss

## Stopped before

**Task 9: OCR Strategy pattern** — NOT started.

Files to create:
- `src/lib/ocr/ocr.interface.ts`
- `src/lib/ocr/tesseract.provider.ts`
- `src/lib/ocr/ocr.factory.ts`
- `src/actions/invoices/extract-invoice-ocr.ts`

Needs: `pnpm add tesseract.js`

## Remaining tasks (5 left)

| # | Task |
|---|------|
| 9 | OCR Strategy pattern (tesseract.js) — **NEXT** |
| 10 | Invoice form with OCR scan |
| 11 | Resend email + PDF |
| 12 | Login page |
| 13 | Final integration + invoice pages |
