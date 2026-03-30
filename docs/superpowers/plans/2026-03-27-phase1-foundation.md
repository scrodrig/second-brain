# Phase 1 — Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Second Brain with HeroUI + Tailwind 4, Auth.js v5 (Google + credentials), multi-household Prisma schema, full Invoice CRUD, i18n (en/es/pt), and optional mobile OCR scan.

**Architecture:** Next.js 15 App Router with Server Actions for mutations, Server Components for data fetching. Atomic Design component hierarchy (atoms → molecules → organisms → templates). No REST API.

**Tech Stack:** Next.js 15, React 19, TypeScript 5 strict, HeroUI (NextUI v2 migration), Tailwind CSS 4, Auth.js v5, Prisma + PostgreSQL, next-intl, Tesseract.js, Resend, pnpm

**Spec:** `docs/superpowers/specs/2026-03-27-second-brain-phase1-design.md`

---

## Task 1: Tailwind 4 + HeroUI migration

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`
- Modify: `src/components/providers/Providers.tsx`
- Modify: `postcss.config.mjs` (update plugin to `@tailwindcss/postcss` — Next.js uses PostCSS not Vite)

- [ ] **Step 1: Update dependencies**

```bash
pnpm remove @nextui-org/react @nextui-org/theme tailwindcss postcss autoprefixer
pnpm add @heroui/react @heroui/theme
pnpm add tailwindcss@next @tailwindcss/vite
```

- [ ] **Step 2: Update tailwind.config.ts**

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";
import { heroui } from "@heroui/theme";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Montserrat Alternates", "sans-serif"],
      },
      colors: {
        brand: {
          primary: "#6366f1",
          accent: "#f59e0b",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: { DEFAULT: "#6366f1", foreground: "#ffffff" },
            secondary: { DEFAULT: "#f59e0b", foreground: "#000000" },
          },
        },
        dark: {
          colors: {
            primary: { DEFAULT: "#818cf8", foreground: "#ffffff" },
            secondary: { DEFAULT: "#fbbf24", foreground: "#000000" },
          },
        },
      },
    }),
  ],
};

export default config;
```

- [ ] **Step 3: Update globals.css for Tailwind 4**

```css
/* src/app/globals.css */
@import "tailwindcss";
@import "@heroui/theme/styles.css";

@theme {
  --font-sans: "Inter", sans-serif;
  --font-heading: "Montserrat Alternates", sans-serif;
}

@layer base {
  html {
    @apply antialiased;
  }
}
```

- [ ] **Step 4: Update Providers.tsx**

```tsx
// src/components/providers/Providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
```

- [ ] **Step 5: Update all @nextui-org imports to @heroui**

```bash
# Find and replace all imports
fd -e ts -e tsx . src/ | xargs sd '@nextui-org/react' '@heroui/react'
fd -e ts -e tsx . src/ | xargs sd '@nextui-org/spinner' '@heroui/spinner'
```

- [ ] **Step 6: Verify dev server starts without errors**

```bash
pnpm dev
```

Expected: Server starts on `http://localhost:3000` with no import errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: migrate nextui to heroui, upgrade to tailwind 4"
```

---

## Task 2: Prisma schema redesign

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/` (auto-generated)
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Replace schema.prisma**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Auth.js v5 adapter models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  createdAt     DateTime  @default(now())

  accounts    Account[]
  sessions    Session[]
  memberships HouseholdMember[]
  invoices    Invoice[]
}

model Household {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())

  members  HouseholdMember[]
  invoices Invoice[]
}

model HouseholdMember {
  id          String        @id @default(uuid())
  role        HouseholdRole @default(MEMBER)
  joinedAt    DateTime      @default(now())
  userId      String
  householdId String

  user      User      @relation(fields: [userId], references: [id])
  household Household @relation(fields: [householdId], references: [id])

  @@unique([userId, householdId])
}

enum HouseholdRole {
  OWNER
  MEMBER
}

model Invoice {
  id             String      @id @default(uuid())
  date           DateTime    @default(now())
  place          String
  nif            String
  concept        Concept
  description    String?
  total          Float       @default(0)
  isReimbursable Boolean     @default(false)
  isRefunded     Boolean     @default(false)
  vatRefund      Boolean?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  createdById    String
  householdId    String
  accountType    AccountType

  createdBy User      @relation(fields: [createdById], references: [id])
  household Household @relation(fields: [householdId], references: [id])
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

- [ ] **Step 2: Run migration**

```bash
pnpm prisma migrate dev --name "redesign-household-auth-schema"
pnpm prisma generate
```

Expected: Migration created and client regenerated.

- [ ] **Step 3: Update seed.ts with new schema**

```ts
// prisma/seed.ts
import { PrismaClient, Concept, AccountType, HouseholdRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@secondbrain.app" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@secondbrain.app",
      password: passwordHash,
    },
  });

  const household = await prisma.household.upsert({
    where: { id: "household-demo-id" },
    update: {},
    create: {
      id: "household-demo-id",
      name: "Demo Family",
    },
  });

  await prisma.householdMember.upsert({
    where: { userId_householdId: { userId: user.id, householdId: household.id } },
    update: {},
    create: { userId: user.id, householdId: household.id, role: HouseholdRole.OWNER },
  });

  const invoices = [
    { place: "Mercadona", nif: "A-12345678", concept: Concept.Meal, total: 45.60, accountType: AccountType.Personal },
    { place: "Vodafone", nif: "A-87654321", concept: Concept.Internet, total: 30.00, accountType: AccountType.Business },
    { place: "RENFE", nif: "Q-2801014G", concept: Concept.Transportation, total: 22.50, accountType: AccountType.Business, isReimbursable: true },
  ];

  for (const invoice of invoices) {
    await prisma.invoice.create({
      data: { ...invoice, createdById: user.id, householdId: household.id },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 4: Run seed**

```bash
pnpm seed
```

Expected: No errors, demo data created.

- [ ] **Step 5: Commit**

```bash
git add prisma/
git commit -m "feat: redesign prisma schema for households and auth.js"
```

---

## Task 3: Auth.js v5 setup

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/middleware.ts`
- Create: `src/actions/auth/register.ts`
- Create: `src/actions/auth/login.ts`
- Modify: `src/app/[locale]/(auth)/login/page.tsx` (created in Task 5)
- Modify: `.env` (add AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)

- [ ] **Step 1: Install dependencies**

```bash
pnpm add next-auth@beta @auth/prisma-adapter bcryptjs
pnpm add -D @types/bcryptjs
```

- [ ] **Step 2: Generate AUTH_SECRET and add to .env**

```bash
openssl rand -base64 32
```

Add to `.env`:
```
AUTH_SECRET=<generated_value>
GOOGLE_CLIENT_ID=<from_google_console>
GOOGLE_CLIENT_SECRET=<from_google_console>
```

- [ ] **Step 3: Create src/lib/auth.ts**

```ts
// src/lib/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        return isValid ? user : null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
```

- [ ] **Step 4: Create API route**

```ts
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 5: Create middleware.ts**

```ts
// src/middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthRoute = req.nextUrl.pathname.includes("/login");

  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 6: Create register Server Action**

```ts
// src/actions/auth/register.ts
"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export async function registerUser(data: z.infer<typeof RegisterSchema>) {
  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid data");

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) throw new Error("Email already registered");

  const hash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password: hash,
    },
  });

  // Auto-create a personal household for new users
  const household = await prisma.household.create({
    data: { name: `${parsed.data.name}'s Household` },
  });

  await prisma.householdMember.create({
    data: { userId: user.id, householdId: household.id, role: "OWNER" },
  });

  return { success: true };
}
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/auth.ts src/app/api/ src/middleware.ts src/actions/auth/
git commit -m "feat: add auth.js v5 with google oauth and credentials provider"
```

---

## Task 4: i18n setup with next-intl

**Files:**
- Create: `src/i18n/request.ts`
- Create: `src/i18n/routing.ts`
- Create: `messages/en.json`
- Create: `messages/es.json`
- Create: `messages/pt.json`
- Modify: `src/middleware.ts`
- Modify: `src/app/layout.tsx` → move to `src/app/[locale]/layout.tsx`
- Modify: `next.config.mjs`

- [ ] **Step 1: Install next-intl**

```bash
pnpm add next-intl
```

- [ ] **Step 2: Create routing config**

```ts
// src/i18n/routing.ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es", "pt"],
  defaultLocale: "es",
});
```

- [ ] **Step 3: Create request config**

```ts
// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "en" | "es" | "pt")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 4: Create messages/es.json (primary language)**

```json
{
  "nav": {
    "invoices": "Facturas",
    "household": "Familia",
    "settings": "Configuración",
    "signOut": "Cerrar sesión"
  },
  "invoice": {
    "title": "Facturas",
    "new": "Nueva factura",
    "edit": "Editar factura",
    "delete": "Eliminar",
    "save": "Guardar",
    "cancel": "Cancelar",
    "place": "Establecimiento",
    "nif": "NIF",
    "total": "Total",
    "date": "Fecha",
    "description": "Descripción",
    "concept": "Concepto",
    "account": "Cuenta",
    "reimbursable": "Reembolsable",
    "refunded": "Reembolsado",
    "vatRefund": "Devolución IVA",
    "scanReceipt": "Escanear factura",
    "scanHint": "Tomá una foto de la factura para rellenar el formulario automáticamente"
  },
  "concepts": {
    "Meal": "Comida",
    "Technology": "Tecnología",
    "Internet": "Internet",
    "Electricity": "Electricidad",
    "Education": "Educación",
    "Transportation": "Transporte",
    "Others": "Otros"
  },
  "accounts": {
    "Personal": "Personal",
    "Business": "Empresa"
  },
  "household": {
    "title": "Mi familia",
    "members": "Miembros",
    "invite": "Invitar miembro",
    "role": {
      "OWNER": "Propietario",
      "MEMBER": "Miembro"
    }
  },
  "auth": {
    "signIn": "Iniciar sesión",
    "signUp": "Registrarse",
    "signInWithGoogle": "Continuar con Google",
    "email": "Email",
    "password": "Contraseña",
    "name": "Nombre"
  }
}
```

- [ ] **Step 5: Create messages/en.json**

```json
{
  "nav": {
    "invoices": "Invoices",
    "household": "Household",
    "settings": "Settings",
    "signOut": "Sign out"
  },
  "invoice": {
    "title": "Invoices",
    "new": "New invoice",
    "edit": "Edit invoice",
    "delete": "Delete",
    "save": "Save",
    "cancel": "Cancel",
    "place": "Place",
    "nif": "VAT Number",
    "total": "Total",
    "date": "Date",
    "description": "Description",
    "concept": "Concept",
    "account": "Account",
    "reimbursable": "Reimbursable",
    "refunded": "Refunded",
    "vatRefund": "VAT Refund",
    "scanReceipt": "Scan receipt",
    "scanHint": "Take a photo of the receipt to auto-fill the form"
  },
  "concepts": {
    "Meal": "Meal",
    "Technology": "Technology",
    "Internet": "Internet",
    "Electricity": "Electricity",
    "Education": "Education",
    "Transportation": "Transportation",
    "Others": "Others"
  },
  "accounts": {
    "Personal": "Personal",
    "Business": "Business"
  },
  "household": {
    "title": "My household",
    "members": "Members",
    "invite": "Invite member",
    "role": {
      "OWNER": "Owner",
      "MEMBER": "Member"
    }
  },
  "auth": {
    "signIn": "Sign in",
    "signUp": "Sign up",
    "signInWithGoogle": "Continue with Google",
    "email": "Email",
    "password": "Password",
    "name": "Name"
  }
}
```

- [ ] **Step 6: Create messages/pt.json**

```json
{
  "nav": {
    "invoices": "Faturas",
    "household": "Família",
    "settings": "Configurações",
    "signOut": "Sair"
  },
  "invoice": {
    "title": "Faturas",
    "new": "Nova fatura",
    "edit": "Editar fatura",
    "delete": "Eliminar",
    "save": "Guardar",
    "cancel": "Cancelar",
    "place": "Estabelecimento",
    "nif": "NIF",
    "total": "Total",
    "date": "Data",
    "description": "Descrição",
    "concept": "Conceito",
    "account": "Conta",
    "reimbursable": "Reembolsável",
    "refunded": "Reembolsado",
    "vatRefund": "Devolução IVA",
    "scanReceipt": "Digitalizar fatura",
    "scanHint": "Tire uma foto da fatura para preencher o formulário automaticamente"
  },
  "concepts": {
    "Meal": "Refeição",
    "Technology": "Tecnologia",
    "Internet": "Internet",
    "Electricity": "Eletricidade",
    "Education": "Educação",
    "Transportation": "Transporte",
    "Others": "Outros"
  },
  "accounts": {
    "Personal": "Pessoal",
    "Business": "Empresarial"
  },
  "household": {
    "title": "Minha família",
    "members": "Membros",
    "invite": "Convidar membro",
    "role": {
      "OWNER": "Proprietário",
      "MEMBER": "Membro"
    }
  },
  "auth": {
    "signIn": "Entrar",
    "signUp": "Registar",
    "signInWithGoogle": "Continuar com Google",
    "email": "Email",
    "password": "Senha",
    "name": "Nome"
  }
}
```

- [ ] **Step 7: Update next.config.mjs**

```mjs
// next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" }, // Google profile images
    ],
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 8: Update middleware to combine auth + i18n**

```ts
// src/middleware.ts
import { auth } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  // Strip locale prefix for auth check
  const isAuthRoute = /^\/(en|es|pt)?\/?(login|register)/.test(pathname);
  const isPublicRoute = isAuthRoute || pathname.startsWith("/api");

  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", req.nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 9: Restructure app directory for locale routing**

Move:
- `src/app/layout.tsx` → `src/app/[locale]/layout.tsx`
- `src/app/(dashboard)/` → `src/app/[locale]/(dashboard)/`
- Create `src/app/[locale]/(auth)/login/page.tsx`

- [ ] **Step 10: Commit**

```bash
git add src/i18n/ messages/ src/middleware.ts next.config.mjs src/app/
git commit -m "feat: add next-intl i18n for en/es/pt"
```

---

## Task 5: Atomic Design component structure + design system atoms

**Files:**
- Create: `src/components/atoms/Button.tsx`
- Create: `src/components/atoms/Input.tsx`
- Create: `src/components/atoms/Badge.tsx`
- Create: `src/components/atoms/Avatar.tsx`
- Create: `src/components/atoms/Chip.tsx`
- Create: `src/components/atoms/Tooltip.tsx`
- Create: `src/components/atoms/Spinner.tsx`
- Create: `src/lib/utils.ts`
- Modify: `src/components/index.ts`

- [ ] **Step 1: Install clsx + tailwind-merge**

```bash
pnpm add clsx tailwind-merge
```

- [ ] **Step 2: Create cn utility**

```ts
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Create Button atom**

```tsx
// src/components/atoms/Button.tsx
import { Button as HeroButton, ButtonProps as HeroButtonProps } from "@heroui/react";
import { cn } from "@/lib/utils";

interface ButtonProps extends HeroButtonProps {
  fullWidth?: boolean;
}

export function Button({ className, fullWidth, ...props }: ButtonProps) {
  return (
    <HeroButton
      className={cn(fullWidth && "w-full", className)}
      radius="lg"
      {...props}
    />
  );
}
```

- [ ] **Step 4: Create Input atom**

```tsx
// src/components/atoms/Input.tsx
import { Input as HeroInput, InputProps as HeroInputProps } from "@heroui/react";

export function Input(props: HeroInputProps) {
  return <HeroInput radius="lg" variant="bordered" {...props} />;
}
```

- [ ] **Step 5: Create Chip atom**

```tsx
// src/components/atoms/Chip.tsx
import { Chip as HeroChip, ChipProps as HeroChipProps } from "@heroui/react";

export function Chip(props: HeroChipProps) {
  return <HeroChip radius="full" size="sm" {...props} />;
}
```

- [ ] **Step 6: Create Tooltip atom**

```tsx
// src/components/atoms/Tooltip.tsx
import { Tooltip as HeroTooltip, TooltipProps as HeroTooltipProps } from "@heroui/react";

export function Tooltip(props: HeroTooltipProps) {
  return <HeroTooltip placement="top" {...props} />;
}
```

- [ ] **Step 7: Update barrel export**

```ts
// src/components/index.ts
// Atoms
export * from "./atoms/Button";
export * from "./atoms/Input";
export * from "./atoms/Chip";
export * from "./atoms/Tooltip";
export * from "./atoms/Badge";
export * from "./atoms/Avatar";
export * from "./atoms/Spinner";

// Providers
export * from "./providers/Providers";
```

- [ ] **Step 8: Commit**

```bash
git add src/components/atoms/ src/lib/utils.ts src/components/index.ts
git commit -m "feat: add atomic design structure and base atoms"
```

---

## Task 6: Concept + Account molecules (icons, colors, tooltips)

**Files:**
- Create: `src/components/molecules/ConceptBadge.tsx`
- Create: `src/components/molecules/AccountBadge.tsx`
- Create: `src/lib/concept-config.ts`
- Create: `src/lib/account-config.ts`

- [ ] **Step 1: Create concept config**

```ts
// src/lib/concept-config.ts
import {
  FaHamburger, FaLaptop, FaWifi, FaBolt,
  FaGraduationCap, FaBus, FaEllipsisH
} from "react-icons/fa";
import { IconType } from "react-icons";
import { Concept } from "@prisma/client";

interface ConceptConfig {
  icon: IconType;
  color: "success" | "danger" | "warning" | "secondary" | "primary" | "default";
  bgClass: string;
}

export const CONCEPT_CONFIG: Record<Concept, ConceptConfig> = {
  Meal:           { icon: FaHamburger,    color: "success",   bgClass: "bg-green-100 dark:bg-green-900/30" },
  Technology:     { icon: FaLaptop,       color: "warning",   bgClass: "bg-amber-100 dark:bg-amber-900/30" },
  Internet:       { icon: FaWifi,         color: "secondary", bgClass: "bg-violet-100 dark:bg-violet-900/30" },
  Electricity:    { icon: FaBolt,         color: "primary",   bgClass: "bg-blue-100 dark:bg-blue-900/30" },
  Education:      { icon: FaGraduationCap,color: "warning",   bgClass: "bg-orange-100 dark:bg-orange-900/30" },
  Transportation: { icon: FaBus,          color: "danger",    bgClass: "bg-red-100 dark:bg-red-900/30" },
  Others:         { icon: FaEllipsisH,    color: "default",   bgClass: "bg-gray-100 dark:bg-gray-800" },
};
```

- [ ] **Step 2: Create ConceptBadge molecule**

```tsx
// src/components/molecules/ConceptBadge.tsx
"use client";

import { useTranslations } from "next-intl";
import { Concept } from "@prisma/client";
import { Chip, Tooltip } from "@/components";
import { CONCEPT_CONFIG } from "@/lib/concept-config";

interface ConceptBadgeProps {
  concept: Concept;
  showTooltip?: boolean;
}

export function ConceptBadge({ concept, showTooltip = true }: ConceptBadgeProps) {
  const t = useTranslations("concepts");
  const config = CONCEPT_CONFIG[concept];
  const Icon = config.icon;

  const chip = (
    <Chip
      color={config.color}
      startContent={<Icon className="text-sm" />}
      variant="flat"
    >
      {t(concept)}
    </Chip>
  );

  if (!showTooltip) return chip;

  return (
    <Tooltip content={t(concept)} placement="top">
      {chip}
    </Tooltip>
  );
}
```

- [ ] **Step 3: Create account config**

```ts
// src/lib/account-config.ts
import { FaUser, FaBriefcase } from "react-icons/fa";
import { IconType } from "react-icons";
import { AccountType } from "@prisma/client";

interface AccountConfig {
  icon: IconType;
  color: "danger" | "success";
  description: { es: string; en: string; pt: string };
}

export const ACCOUNT_CONFIG: Record<AccountType, AccountConfig> = {
  Personal: {
    icon: FaUser,
    color: "danger",
    description: {
      es: "Gastos personales del día a día",
      en: "Day-to-day personal expenses",
      pt: "Despesas pessoais do dia a dia",
    },
  },
  Business: {
    icon: FaBriefcase,
    color: "success",
    description: {
      es: "Gastos de empresa reembolsables",
      en: "Reimbursable business expenses",
      pt: "Despesas empresariais reembolsáveis",
    },
  },
};
```

- [ ] **Step 4: Commit**

```bash
git add src/components/molecules/ src/lib/concept-config.ts src/lib/account-config.ts
git commit -m "feat: add concept and account badge molecules with icons and tooltips"
```

---

## Task 7: Layout redesign (sidebar, navbar, bottom nav)

**Files:**
- Modify: `src/components/navbar/Navbar.tsx`
- Modify: `src/components/sidebar/Sidebar.tsx`
- Create: `src/components/organisms/BottomNav.tsx`
- Create: `src/components/templates/DashboardTemplate.tsx`
- Create: `src/components/templates/AuthTemplate.tsx`
- Modify: `src/app/[locale]/(dashboard)/layout.tsx`

- [ ] **Step 1: Create DashboardTemplate**

```tsx
// src/components/templates/DashboardTemplate.tsx
import { Sidebar } from "@/components/organisms/Sidebar";
import { Navbar } from "@/components/organisms/Navbar";
import { BottomNav } from "@/components/organisms/BottomNav";

interface DashboardTemplateProps {
  children: React.ReactNode;
}

export function DashboardTemplate({ children }: DashboardTemplateProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Sidebar — hidden on mobile */}
      <aside className="hidden md:flex md:w-64 md:flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <BottomNav />
    </div>
  );
}
```

- [ ] **Step 2: Create BottomNav organism**

```tsx
// src/components/organisms/BottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { FaFileInvoice, FaHome, FaUsers, FaCog } from "react-icons/fa";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: FaHome, labelKey: "home" },
  { href: "/invoices", icon: FaFileInvoice, labelKey: "invoices" },
  { href: "/household", icon: FaUsers, labelKey: "household" },
  { href: "/settings", icon: FaCog, labelKey: "settings" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-divider bg-background/80 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, icon: Icon, labelKey }) => {
          const isActive = pathname.endsWith(href) || (href !== "/" && pathname.includes(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-foreground-400 hover:text-foreground"
              )}
            >
              <Icon className="text-xl" />
              <span className="text-[10px] font-medium">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Update dashboard layout**

```tsx
// src/app/[locale]/(dashboard)/layout.tsx
import { DashboardTemplate } from "@/components/templates/DashboardTemplate";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardTemplate>{children}</DashboardTemplate>;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/organisms/ src/components/templates/ src/app/
git commit -m "feat: add dashboard template with sidebar and mobile bottom nav"
```

---

## Task 8: Invoice Server Actions (full CRUD)

**Files:**
- Modify: `src/actions/invoices/get-invoices.ts`
- Modify: `src/actions/invoices/get-invoice-by-id.ts`
- Create: `src/actions/invoices/create-invoice.ts`
- Create: `src/actions/invoices/update-invoice.ts`
- Create: `src/actions/invoices/delete-invoice.ts`
- Create: `src/lib/schemas/invoice.schema.ts`

- [ ] **Step 1: Create invoice Zod schema**

```ts
// src/lib/schemas/invoice.schema.ts
import { z } from "zod";
import { Concept, AccountType } from "@prisma/client";

export const InvoiceSchema = z.object({
  place: z.string().min(2).max(100),
  nif: z.string().min(5).max(20),
  concept: z.nativeEnum(Concept),
  accountType: z.nativeEnum(AccountType),
  total: z.number().positive(),
  date: z.coerce.date(),
  description: z.string().max(500).optional(),
  isReimbursable: z.boolean().default(false),
  isRefunded: z.boolean().default(false),
  vatRefund: z.boolean().optional(),
});

export type InvoiceInput = z.infer<typeof InvoiceSchema>;
```

- [ ] **Step 2: Create createInvoice action**

```ts
// src/actions/invoices/create-invoice.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvoiceSchema, type InvoiceInput } from "@/lib/schemas/invoice.schema";
import { revalidatePath } from "next/cache";

export async function createInvoice(data: InvoiceInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = InvoiceSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid invoice data");

  // Get user's household
  const membership = await prisma.householdMember.findFirst({
    where: { userId: session.user.id },
    include: { household: true },
  });
  if (!membership) throw new Error("User has no household");

  const invoice = await prisma.invoice.create({
    data: {
      ...parsed.data,
      createdById: session.user.id,
      householdId: membership.householdId,
    },
  });

  revalidatePath("/invoices");
  return invoice;
}
```

- [ ] **Step 3: Create updateInvoice action**

```ts
// src/actions/invoices/update-invoice.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvoiceSchema, type InvoiceInput } from "@/lib/schemas/invoice.schema";
import { revalidatePath } from "next/cache";

export async function updateInvoice(id: string, data: InvoiceInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = InvoiceSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid invoice data");

  // Verify ownership via household
  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      household: {
        members: { some: { userId: session.user.id } },
      },
    },
  });
  if (!invoice) throw new Error("Invoice not found or unauthorized");

  const updated = await prisma.invoice.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/invoices");
  revalidatePath(`/invoice/${id}`);
  return updated;
}
```

- [ ] **Step 4: Create deleteInvoice action**

```ts
// src/actions/invoices/delete-invoice.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteInvoice(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      household: {
        members: { some: { userId: session.user.id } },
      },
    },
  });
  if (!invoice) throw new Error("Invoice not found or unauthorized");

  await prisma.invoice.delete({ where: { id } });
  revalidatePath("/invoices");
}
```

- [ ] **Step 5: Update get-invoices to filter by household**

```ts
// src/actions/invoices/get-invoices.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 8;

export async function getInvoices(page = 1) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const membership = await prisma.householdMember.findFirst({
    where: { userId: session.user.id },
  });
  if (!membership) return { invoices: [], totalPages: 0, currentPage: 1 };

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where: { householdId: membership.householdId },
      include: { createdBy: { select: { name: true, image: true } } },
      orderBy: { date: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.invoice.count({
      where: { householdId: membership.householdId },
    }),
  ]);

  return {
    invoices,
    totalPages: Math.ceil(total / PAGE_SIZE),
    currentPage: page,
  };
}
```

- [ ] **Step 6: Commit**

```bash
git add src/actions/invoices/ src/lib/schemas/
git commit -m "feat: add full invoice CRUD server actions with household auth checks"
```

---

## Task 9: OCR Strategy pattern (Tesseract.js)

**Files:**
- Create: `src/lib/ocr/ocr.interface.ts`
- Create: `src/lib/ocr/tesseract.provider.ts`
- Create: `src/lib/ocr/ocr.factory.ts`
- Create: `src/actions/invoices/extract-invoice-ocr.ts`

- [ ] **Step 1: Install Tesseract.js**

```bash
pnpm add tesseract.js
```

- [ ] **Step 2: Create OcrProvider interface**

```ts
// src/lib/ocr/ocr.interface.ts
export interface ExtractedInvoiceData {
  total?: number;
  vat?: number;
  place?: string;
  date?: string;
  nif?: string;
}

export interface OcrProvider {
  extractInvoiceData(imageBuffer: Buffer): Promise<ExtractedInvoiceData>;
}
```

- [ ] **Step 3: Create TesseractProvider**

```ts
// src/lib/ocr/tesseract.provider.ts
import Tesseract from "tesseract.js";
import type { OcrProvider, ExtractedInvoiceData } from "./ocr.interface";

export class TesseractProvider implements OcrProvider {
  async extractInvoiceData(imageBuffer: Buffer): Promise<ExtractedInvoiceData> {
    const { data: { text } } = await Tesseract.recognize(imageBuffer, "spa+eng");

    return this.parseText(text);
  }

  private parseText(text: string): ExtractedInvoiceData {
    const result: ExtractedInvoiceData = {};

    // Extract total: look for patterns like "TOTAL 45,60" or "Total: 45.60"
    const totalMatch = text.match(/total[:\s]+([0-9]+[.,][0-9]{2})/i);
    if (totalMatch) {
      result.total = parseFloat(totalMatch[1].replace(",", "."));
    }

    // Extract VAT: look for "IVA 21%" or "VAT 21%"
    const vatMatch = text.match(/iva[:\s]+([0-9]+[.,][0-9]{2})/i);
    if (vatMatch) {
      result.vat = parseFloat(vatMatch[1].replace(",", "."));
    }

    // Extract NIF: Spanish NIF pattern
    const nifMatch = text.match(/[A-Z][0-9]{7}[A-Z0-9]|[0-9]{8}[A-Z]/);
    if (nifMatch) {
      result.nif = nifMatch[0];
    }

    return result;
  }
}
```

- [ ] **Step 4: Create OcrProviderFactory**

```ts
// src/lib/ocr/ocr.factory.ts
import type { OcrProvider } from "./ocr.interface";
import { TesseractProvider } from "./tesseract.provider";

export class OcrProviderFactory {
  static create(provider = process.env.OCR_PROVIDER ?? "tesseract"): OcrProvider {
    switch (provider) {
      case "tesseract":
        return new TesseractProvider();
      default:
        throw new Error(`Unknown OCR provider: ${provider}`);
    }
  }
}
```

- [ ] **Step 5: Create Server Action for OCR extraction**

```ts
// src/actions/invoices/extract-invoice-ocr.ts
"use server";

import { auth } from "@/lib/auth";
import { OcrProviderFactory } from "@/lib/ocr/ocr.factory";

export async function extractInvoiceOcr(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const file = formData.get("image") as File;
  if (!file) throw new Error("No image provided");

  const buffer = Buffer.from(await file.arrayBuffer());
  const ocr = OcrProviderFactory.create();

  return ocr.extractInvoiceData(buffer);
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/ocr/ src/actions/invoices/extract-invoice-ocr.ts
git commit -m "feat: add OCR strategy pattern with tesseract.js provider"
```

---

## Task 10: Invoice form with OCR scan section (mobile-only)

**Files:**
- Modify: `src/components/app/(dashboard)/invoice/InvoiceForm.tsx` → move to organisms
- Create: `src/components/organisms/OcrScanSection.tsx`
- Create: `src/components/organisms/InvoiceForm.tsx`

- [ ] **Step 1: Create OcrScanSection organism (mobile-only)**

```tsx
// src/components/organisms/OcrScanSection.tsx
"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { Button } from "@/components/atoms/Button";
import { extractInvoiceOcr } from "@/actions/invoices/extract-invoice-ocr";
import type { ExtractedInvoiceData } from "@/lib/ocr/ocr.interface";

interface OcrScanSectionProps {
  onExtracted: (data: ExtractedInvoiceData) => void;
}

export function OcrScanSection({ onExtracted }: OcrScanSectionProps) {
  const t = useTranslations("invoice");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const data = await extractInvoiceOcr(formData);
      onExtracted(data);
    } catch {
      // Silent fail — user can fill manually
    }
  }

  return (
    // Hidden on md+ screens — mobile only
    <div className="mb-6 md:hidden">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="flat"
        color="primary"
        startContent={<FaCamera />}
        onPress={() => inputRef.current?.click()}
        fullWidth
      >
        {t("scanReceipt")}
      </Button>
      <p className="mt-2 text-center text-xs text-foreground-400">
        {t("scanHint")}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create full InvoiceForm organism (create + edit)**

```tsx
// src/components/organisms/InvoiceForm.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { OcrScanSection } from "./OcrScanSection";
import { ConceptBadge } from "@/components/molecules/ConceptBadge";
import { InvoiceSchema, type InvoiceInput } from "@/lib/schemas/invoice.schema";
import { createInvoice } from "@/actions/invoices/create-invoice";
import { updateInvoice } from "@/actions/invoices/update-invoice";
import { Concept, AccountType, type Invoice } from "@prisma/client";
import { CONCEPT_CONFIG } from "@/lib/concept-config";
import type { ExtractedInvoiceData } from "@/lib/ocr/ocr.interface";

interface InvoiceFormProps {
  invoice?: Invoice; // if provided, we're editing
}

export function InvoiceForm({ invoice }: InvoiceFormProps) {
  const t = useTranslations("invoice");
  const router = useRouter();
  const isEditing = !!invoice;

  const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } = useForm<InvoiceInput>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: invoice ? {
      place: invoice.place,
      nif: invoice.nif,
      concept: invoice.concept,
      accountType: invoice.accountType,
      total: invoice.total,
      date: invoice.date,
      description: invoice.description ?? undefined,
      isReimbursable: invoice.isReimbursable,
      isRefunded: invoice.isRefunded,
      vatRefund: invoice.vatRefund ?? undefined,
    } : {
      isReimbursable: false,
      isRefunded: false,
      date: new Date(),
    },
  });

  function handleOcrExtracted(data: ExtractedInvoiceData) {
    if (data.total) setValue("total", data.total);
    if (data.nif) setValue("nif", data.nif);
    if (data.place) setValue("place", data.place);
  }

  async function onSubmit(data: InvoiceInput) {
    if (isEditing) {
      await updateInvoice(invoice.id, data);
    } else {
      await createInvoice(data);
    }
    router.push("/invoices");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <OcrScanSection onExtracted={handleOcrExtracted} />

      <Input
        label={t("place")}
        {...register("place")}
        errorMessage={errors.place?.message}
        isInvalid={!!errors.place}
      />
      <Input
        label={t("nif")}
        {...register("nif")}
        errorMessage={errors.nif?.message}
        isInvalid={!!errors.nif}
      />
      <Input
        label={t("total")}
        type="number"
        step="0.01"
        {...register("total", { valueAsNumber: true })}
        errorMessage={errors.total?.message}
        isInvalid={!!errors.total}
        startContent={<span className="text-foreground-400 text-sm">€</span>}
      />

      {/* Concept selector */}
      <div>
        <p className="text-sm font-medium mb-2">{t("concept")}</p>
        <Controller
          name="concept"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.values(Concept).map((c) => {
                const config = CONCEPT_CONFIG[c];
                const Icon = config.icon;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => field.onChange(c)}
                    className={`flex items-center gap-2 rounded-2xl border-2 p-3 transition-all
                      ${field.value === c
                        ? "border-primary bg-primary/10"
                        : "border-divider hover:border-primary/40"
                      }`}
                  >
                    <Icon className="text-lg" />
                    <ConceptBadge concept={c} showTooltip={false} />
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="flat" onPress={() => router.back()} fullWidth>
          {t("cancel")}
        </Button>
        <Button type="submit" color="primary" isLoading={isSubmitting} fullWidth>
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Install zod resolver**

```bash
pnpm add @hookform/resolvers
```

- [ ] **Step 4: Commit**

```bash
git add src/components/organisms/
git commit -m "feat: add invoice form organism with mobile ocr scan section"
```

---

## Task 11: Resend email for invoice PDF

**Files:**
- Create: `src/lib/email/resend.ts`
- Create: `src/actions/invoices/send-invoice-email.ts`

- [ ] **Step 1: Install Resend and react-pdf**

```bash
pnpm add resend @react-pdf/renderer
```

Add to `.env`:
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
```

- [ ] **Step 2: Create Resend client**

```ts
// src/lib/email/resend.ts
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
```

- [ ] **Step 3: Create send-invoice-email action**

```ts
// src/actions/invoices/send-invoice-email.ts
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/email/resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePdfDocument } from "@/components/molecules/InvoicePdfDocument";

export async function sendInvoiceEmail(invoiceId: string) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) throw new Error("Unauthorized");

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      household: { members: { some: { userId: session.user.id } } },
    },
    include: { createdBy: { select: { name: true } } },
  });
  if (!invoice) throw new Error("Invoice not found");

  const pdfBuffer = await renderToBuffer(<InvoicePdfDocument invoice={invoice} />);

  await resend.emails.send({
    from: "Second Brain <noreply@yourdomain.com>",
    to: session.user.email,
    subject: `Invoice: ${invoice.place} — €${invoice.total}`,
    text: `Invoice from ${invoice.place} for €${invoice.total} on ${invoice.date.toLocaleDateString()}.`,
    attachments: [
      {
        filename: `invoice-${invoice.id}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  return { success: true };
}
```

- [ ] **Step 4: Create InvoicePdfDocument molecule**

```tsx
// src/components/molecules/InvoicePdfDocument.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Invoice } from "@prisma/client";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  label: { fontSize: 12, color: "#6b7280" },
  value: { fontSize: 12, fontWeight: "bold" },
  total: { fontSize: 20, fontWeight: "bold", marginTop: 24, color: "#6366f1" },
});

interface InvoicePdfDocumentProps {
  invoice: Invoice;
}

export function InvoicePdfDocument({ invoice }: InvoicePdfDocumentProps) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Invoice — {invoice.place}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>NIF</Text>
          <Text style={styles.value}>{invoice.nif}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{new Date(invoice.date).toLocaleDateString()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Concept</Text>
          <Text style={styles.value}>{invoice.concept}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Account</Text>
          <Text style={styles.value}>{invoice.accountType}</Text>
        </View>
        {invoice.description && (
          <View style={styles.row}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{invoice.description}</Text>
          </View>
        )}
        <Text style={styles.total}>€{invoice.total.toFixed(2)}</Text>
      </Page>
    </Document>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/email/ src/actions/invoices/send-invoice-email.ts src/components/molecules/InvoicePdfDocument.tsx
git commit -m "feat: add resend email with invoice pdf attachment"
```

---

## Task 12: Login page

**Files:**
- Create: `src/app/[locale]/(auth)/login/page.tsx`
- Create: `src/components/templates/AuthTemplate.tsx`
- Create: `src/components/organisms/LoginForm.tsx`

- [ ] **Step 1: Create AuthTemplate**

```tsx
// src/components/templates/AuthTemplate.tsx
import { FaLeaf } from "react-icons/fa";

export function AuthTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-indigo-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
            <FaLeaf className="text-2xl" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Second Brain
          </h1>
          <p className="text-sm text-foreground-400">Family finance tracker</p>
        </div>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create LoginForm organism**

```tsx
// src/components/organisms/LoginForm.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FaGoogle } from "react-icons/fa";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";

export function LoginForm() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    await signIn("credentials", { email, password, callbackUrl: "/" });
    setIsLoading(false);
  }

  return (
    <div className="space-y-4">
      <Button
        fullWidth
        variant="flat"
        startContent={<FaGoogle />}
        onPress={() => signIn("google", { callbackUrl: "/" })}
      >
        {t("signInWithGoogle")}
      </Button>

      <div className="relative flex items-center py-2">
        <div className="flex-1 border-t border-divider" />
        <span className="mx-4 text-xs text-foreground-400">or</span>
        <div className="flex-1 border-t border-divider" />
      </div>

      <form onSubmit={handleCredentials} className="space-y-3">
        <Input
          label={t("email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" color="primary" isLoading={isLoading} fullWidth>
          {t("signIn")}
        </Button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: Create login page**

```tsx
// src/app/[locale]/(auth)/login/page.tsx
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { LoginForm } from "@/components/organisms/LoginForm";

export default function LoginPage() {
  return (
    <AuthTemplate>
      <LoginForm />
    </AuthTemplate>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/(auth)/ src/components/organisms/LoginForm.tsx src/components/templates/AuthTemplate.tsx
git commit -m "feat: add login page with google oauth and credentials form"
```

---

## Task 13: Final integration + invoice pages wiring

**Files:**
- Modify: `src/app/[locale]/(dashboard)/invoices/page.tsx`
- Modify: `src/app/[locale]/(dashboard)/invoices/new/page.tsx`
- Create: `src/app/[locale]/(dashboard)/invoices/[id]/edit/page.tsx`
- Modify: `src/app/[locale]/(dashboard)/invoice/[id]/page.tsx`

- [ ] **Step 1: Update invoices list page**

```tsx
// src/app/[locale]/(dashboard)/invoices/page.tsx
import { getInvoices } from "@/actions/invoices/get-invoices";
import { InvoiceGrid } from "@/components/organisms/InvoiceGrid";
import { Button } from "@/components/atoms/Button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const t = await getTranslations("invoice");
  const page = Number(searchParams.page ?? 1);
  const { invoices, totalPages, currentPage } = await getInvoices(page);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
        <Button
          as={Link}
          href="/invoices/new"
          color="primary"
          startContent={<FaPlus />}
        >
          {t("new")}
        </Button>
      </div>
      <InvoiceGrid invoices={invoices} totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
```

- [ ] **Step 2: Create new invoice page**

```tsx
// src/app/[locale]/(dashboard)/invoices/new/page.tsx
import { InvoiceForm } from "@/components/organisms/InvoiceForm";
import { getTranslations } from "next-intl/server";

export default async function NewInvoicePage() {
  const t = await getTranslations("invoice");
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-heading mb-6 text-2xl font-bold">{t("new")}</h1>
      <InvoiceForm />
    </div>
  );
}
```

- [ ] **Step 3: Create edit invoice page**

```tsx
// src/app/[locale]/(dashboard)/invoices/[id]/edit/page.tsx
import { getInvoiceById } from "@/actions/invoices/get-invoice-by-id";
import { InvoiceForm } from "@/components/organisms/InvoiceForm";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function EditInvoicePage({ params }: { params: { id: string } }) {
  const t = await getTranslations("invoice");
  const invoice = await getInvoiceById(params.id).catch(() => null);
  if (!invoice) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-heading mb-6 text-2xl font-bold">{t("edit")}</h1>
      <InvoiceForm invoice={invoice} />
    </div>
  );
}
```

- [ ] **Step 4: Final commit**

```bash
git add src/app/
git commit -m "feat: wire up invoice pages with new crud actions and redesigned components"
```

---

## Self-Review Notes

- All `@nextui-org` imports updated to `@heroui` in Task 1 ✓
- `AccountType` used consistently (not `Account`) in schema and actions ✓
- `InvoiceSchema` defined once in `src/lib/schemas/invoice.schema.ts`, referenced in all actions ✓
- Auth session check in every Server Action ✓
- `householdId` membership check before data access in all actions ✓
- OCR section uses `md:hidden` so desktop never sees it ✓
- i18n keys consistent across all message files ✓
- `createInvoice` auto-creates household for new OAuth users via `registerUser` ✓ — Note: for Google OAuth first login, household creation should happen via Auth.js `signIn` callback, not just `registerUser`. Add to auth.ts callbacks:

```ts
// Add to auth.ts callbacks
async signIn({ user, account }) {
  if (account?.provider === "google" && user.id) {
    const existing = await prisma.householdMember.findFirst({
      where: { userId: user.id },
    });
    if (!existing) {
      const household = await prisma.household.create({
        data: { name: `${user.name}'s Household` },
      });
      await prisma.householdMember.create({
        data: { userId: user.id, householdId: household.id, role: "OWNER" },
      });
    }
  }
  return true;
},
```
