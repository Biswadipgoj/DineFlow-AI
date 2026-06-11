# DineNova AI — Complete Build Specification for Claude Code

> **This is your only instruction set. Drop this file at `docs/SPEC.md` in your repo.**
> Start every Claude Code session with: *"Read docs/SPEC.md fully before writing any code."*

**Product:** DineNova AI — Restaurant management SaaS ("Shopify + AI Copilot for Restaurants")
**Region:** India (₹ INR, GST/FSSAI, UPI; languages: English / Bengali / Hindi)
**Architecture:** Multi-tenant SaaS — 5 separate Next.js apps, 1 shared Supabase database, RLS-enforced isolation
**Domain:** `dinenovaai.com` (replace everywhere with your real domain)
**Verified:** June 2026

---

## HOW TO USE WITH CLAUDE CODE

```
PASTE THIS AT THE START OF EVERY CLAUDE CODE SESSION:

"Read the full file at docs/SPEC.md first. Confirm you have read it before writing
any code. Then perform the task below. Follow all naming conventions, SQL patterns,
security rules, and money-handling rules exactly as written. After finishing, append
a one-paragraph summary of what was done to docs/PROGRESS.md."
```

Then add your specific task. The numbered tasks in Section 22 are copy-paste ready.

---

## SECTION 1 — WHAT DINENOVAAI IS

DineNova AI is a **multi-tenant B2B SaaS**. You are the platform operator. Your customers are restaurant owners ("tenants"). Each tenant pays a monthly subscription. Their staff and diners use the apps you build.

### The 5 apps (one codebase, separate deployments)

| # | App | Users | URL | PWA? |
|---|---|---|---|---|
| 1 | **Customer** | Diners (QR scan) | `order.dinenovaai.com/r/{slug}/t/{tableCode}` | Yes — offline menu |
| 2 | **Waiter** | Floor staff (phone) | `waiter.dinenovaai.com` | Yes — offline-tolerant |
| 3 | **Kitchen / KDS** | Kitchen staff (tablet) | `kitchen.dinenovaai.com` | Yes — must not blank on WiFi drop |
| 4 | **Owner** | Restaurant owner/manager | `owner.dinenovaai.com` | No (desktop-first) |
| 5 | **Admin** | **You** (platform super-admin) | `admin.dinenovaai.com` | No (desktop-first) |

All 5 apps share **one Supabase project**: one Postgres database, one Auth instance, one Storage bucket set, one Realtime pool, shared Edge Functions. Row-Level Security (RLS) keeps every restaurant's data fully isolated from others.

### The 5 build phases

| Phase | Name | Plan tier | Core features |
|---|---|---|---|
| 1 | MVP | ₹999/mo | QR ordering, waiter app, kitchen KDS, digital bill, UPI payment, owner sales dashboard |
| 2 | Operations | ₹2,999/mo | Inventory, suppliers, staff/attendance, expenses, real-profit report |
| 3 | AI | ₹5,999/mo | Restaurant Brain chat, demand + inventory forecast, menu engineering, anomaly alerts |
| 4 | Marketing | ₹5,999/mo (bundled or add-on) | WhatsApp campaigns, AI content generator, loyalty, coupons |
| 5 | Enterprise | Custom | Multi-branch dashboard, centralized inventory, franchise controls, Swiggy/Zomato |

---

## SECTION 2 — MONOREPO STRUCTURE (exact)

```
dinenovaai/
├── apps/
│   ├── customer/          # Next.js 15 App Router, PWA
│   ├── waiter/            # Next.js 15 App Router, PWA
│   ├── kitchen/           # Next.js 15 App Router, PWA
│   ├── owner/             # Next.js 15 App Router
│   └── admin/             # Next.js 15 App Router
├── packages/
│   ├── ui/                # shadcn/ui components, Tailwind preset, design tokens
│   ├── db/                # Supabase client, generated TS types, query helpers
│   ├── auth/              # session helpers, role guards, JWT claim utils, entitlements
│   ├── validators/        # zod schemas shared by all apps + edge functions
│   ├── ai/                # Gemini/OpenAI clients, prompt builders
│   ├── integrations/      # Razorpay, WhatsApp, aggregator channel abstraction
│   ├── config/            # shared eslint, tsconfig base, tailwind preset
│   └── utils/             # money (paise), GST math, dates, formatting
├── supabase/
│   ├── migrations/        # SQL migrations in order: 0001_enums.sql, 0002_...
│   ├── functions/         # one folder per edge function
│   │   ├── razorpay-webhook/
│   │   ├── razorpay-subscription-webhook/
│   │   ├── ai-assistant/
│   │   ├── ai-forecast/
│   │   ├── whatsapp-webhook/
│   │   └── aggregator-inbound/
│   ├── seed.sql
│   └── config.toml
├── docs/
│   ├── SPEC.md            ← this file
│   └── PROGRESS.md        ← Claude Code updates after each task
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── keepalive.yml  ← prevents Supabase free-tier pause
├── .env.example
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev":   { "cache": false, "persistent": true },
    "typecheck": { "dependsOn": ["^build"] },
    "lint": {},
    "test": {}
  }
}
```

### Package names (use these exactly in package.json "name" fields)
```
apps:     @dinenovaai/customer, @dinenovaai/waiter, @dinenovaai/kitchen,
          @dinenovaai/owner, @dinenovaai/admin
packages: @dinenovaai/ui, @dinenovaai/db, @dinenovaai/auth, @dinenovaai/validators,
          @dinenovaai/ai, @dinenovaai/integrations, @dinenovaai/config, @dinenovaai/utils
```

---

## SECTION 3 — TECH STACK

| Layer | Choice | Notes |
|---|---|---|
| Framework | `next@15` App Router + TypeScript | All 5 apps |
| Styling | `tailwindcss@3`, `shadcn/ui`, `framer-motion` | Shared theme in `packages/ui` |
| State | Zustand (client), RSC + Server Actions | Prefer RSC; Zustand only for cart/realtime UI |
| Forms | `react-hook-form` + `zod` | Validators from `packages/validators` |
| DB / Auth / Realtime / Storage | `@supabase/supabase-js@2`, `@supabase/ssr` | One project |
| Payments | `razorpay` (server SDK) + Razorpay Checkout (CDN) | |
| AI | `@google/generative-ai` (start: Gemini 2.5 Flash) | Swap to `openai`/`@anthropic-ai/sdk` at scale |
| Monorepo | Turborepo + pnpm | |
| PWA | `next-pwa` + service worker | Customer / Waiter / Kitchen only |
| Icons | `lucide-react` | |
| Charts | `recharts` | Owner dashboard |
| PDF | `@react-pdf/renderer` | GST invoice |
| QR | `qrcode` (server) + `react-qr-code` (client) | |
| Error tracking | `@sentry/nextjs` | All apps |
| Analytics | `posthog-js` | Owner + Admin |
| Testing | `vitest`, `@testing-library/react`, `playwright` | |
| CI/CD | GitHub Actions + Vercel Pro (or Cloudflare Pages) | See Section 7 on commercial use |

---

## SECTION 4 — ROLES & RBAC

```typescript
// packages/auth/src/roles.ts
export const ROLES = [
  'super_admin', // YOU — platform operator, all tenants
  'owner',       // restaurant admin — full control of their restaurant
  'manager',     // like owner but cannot manage billing or delete restaurant
  'cashier',     // take payments, settle bills, view today's sales
  'waiter',      // create/transfer/split orders, request bill
  'chef',        // advance kitchen item status, mark out-of-stock
  'customer',    // browse, order, pay — anonymous or phone OTP
] as const;
export type Role = typeof ROLES[number];
```

### JWT custom claims written by Auth hook (Section 8):
```json
{
  "sub": "<user_uuid>",
  "app_metadata": {
    "role": "waiter",
    "restaurant_id": "<uuid>",
    "branch_id": "<uuid_or_null>",
    "org_id": "<uuid>"
  }
}
```
Super-admin JWT: `"role": "super_admin"`, no `restaurant_id`.

---

## SECTION 5 — CRITICAL CONVENTIONS (follow exactly, no exceptions)

### 5.1 Money — ALWAYS integer paise, NEVER floats
```typescript
// packages/utils/src/money.ts
export const toRupees = (paise: number): string =>
  `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
export const toPaise = (rupees: number): number => Math.round(rupees * 100);
// ALL DB money columns: bigint, name ends in _paise (e.g. price_paise, total_paise)
```

### 5.2 Timestamps — always timestamptz + IST display
```typescript
// packages/utils/src/dates.ts
export const IST = 'Asia/Kolkata';
export const toIST = (ts: string) =>
  new Intl.DateTimeFormat('en-IN', { timeZone: IST, dateStyle: 'medium', timeStyle: 'short' })
    .format(new Date(ts));
```
Store in UTC (`timestamptz`), display in IST. Never store naive timestamps.

### 5.3 Database naming
- Tables/columns: `snake_case`
- PK: `id uuid default gen_random_uuid() primary key`
- Every table: `created_at timestamptz default now() not null`, `updated_at timestamptz default now() not null`
- FK convention: `referenced_table_id uuid not null references referenced_table(id)`
- Create indexes on all FK columns and frequently filtered columns

### 5.4 RLS — THE IRON RULE
**Every table that holds tenant data MUST have RLS enabled. No migration without it. The test suite must prove tenant A cannot read tenant B's rows.**

### 5.5 Secrets — never in client bundles
Only `NEXT_PUBLIC_*` vars go to the browser. Everything else (Razorpay secret, Gemini key, service role key, webhook secrets, WhatsApp token) lives only in server env / Edge Functions.

### 5.6 Server action return shape
```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };
```

### 5.7 PostgREST grants (required for new Supabase projects post-May 2026)
Every migration that creates a table must include:
```sql
grant select, insert, update, delete on <table_name> to authenticated;
grant select on <table_name> to anon; -- only for public-read tables like menu_items
```

---

## SECTION 6 — ENVIRONMENT VARIABLES

### `.env.example`
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...           # server / edge functions ONLY
SUPABASE_JWT_SECRET=your-jwt-secret

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx              # rzp_live_xxx in production
RAZORPAY_KEY_SECRET=xxx                   # server ONLY
RAZORPAY_WEBHOOK_SECRET=xxx              # server ONLY

# AI
GEMINI_API_KEY=AIza...                    # server ONLY
# OPENAI_API_KEY=sk-...                   # optional at scale
# ANTHROPIC_API_KEY=sk-ant-...            # optional at scale

# WhatsApp Business Cloud API
WHATSAPP_ACCESS_TOKEN=xxx                 # server ONLY
WHATSAPP_PHONE_NUMBER_ID=xxx
WHATSAPP_BUSINESS_ACCOUNT_ID=xxx
WHATSAPP_WEBHOOK_VERIFY_TOKEN=xxx        # server ONLY
WHATSAPP_APP_SECRET=xxx                  # server ONLY

# Aggregator bridge (Phase 5)
URBANPIPER_API_KEY=xxx
INTEGRATION_CREDS_ENCRYPTION_KEY=xxx     # 32-byte hex; encrypts per-tenant credentials

# App URLs
APP_BASE_DOMAIN=dinenovaai.com
NEXT_PUBLIC_CUSTOMER_APP_URL=https://order.dinenovaai.com
NEXT_PUBLIC_WAITER_APP_URL=https://waiter.dinenovaai.com
NEXT_PUBLIC_KITCHEN_APP_URL=https://kitchen.dinenovaai.com
NEXT_PUBLIC_OWNER_APP_URL=https://owner.dinenovaai.com
NEXT_PUBLIC_ADMIN_APP_URL=https://admin.dinenovaai.com

# Optional
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
```

---

## SECTION 7 — FREE TIER REALITY & UPGRADE TRIGGERS

| Service | Free limits | Critical caveat | When to upgrade |
|---|---|---|---|
| **Supabase** | 500 MB DB, 1 GB storage, 5 GB egress, 50k MAU, 200 realtime connections, 500k edge invocations | **Project pauses after 7 days idle** → add keepalive.yml on Day 1 | Pro ($25/mo) before any paying tenant |
| **Vercel** | 100 GB/mo bandwidth | **Commercial use prohibited on Hobby** | Vercel Pro ($20/seat) or Cloudflare Pages the moment you charge ₹1 |
| **Gemini** | Flash ~250 RPD, Flash-Lite ~1,500 RPD | **Free tier may train on your prompts** → never send PII | Paid Flash for anything sensitive |
| **Razorpay** | No monthly fee | MDR per transaction | N/A |
| **WhatsApp** | Service replies inside 24h window = free | **Marketing = never free** (India ≈ ₹0.8–1.1/msg; utility ≈ ₹0.13/msg) | Budget per campaign |

### `.github/workflows/keepalive.yml`
```yaml
name: Supabase Keepalive
on:
  schedule:
    - cron: '0 6 * * *'  # daily 06:00 UTC = 11:30 IST
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase
        run: |
          curl -s "${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}/rest/v1/" \
            -H "apikey: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}" > /dev/null
          echo "Pinged at $(date)"
```
Add both secrets to GitHub repo secrets.

---

## SECTION 8 — SUPABASE AUTH SETUP

### 8.1 Custom JWT claims (Auth hook — Database function)
```sql
-- supabase/migrations/0002_auth_hook.sql
create or replace function public.custom_jwt_claims(event jsonb)
returns jsonb language plpgsql as $$
declare
  uid uuid := (event->>'user_id')::uuid;
  mem record;
begin
  select m.role, m.restaurant_id, m.branch_id, r.org_id
  into mem
  from memberships m
  join restaurants r on r.id = m.restaurant_id
  where m.user_id = uid and m.is_active = true
  order by m.created_at asc limit 1;

  if not found then
    select default_role as role, null as restaurant_id, null as branch_id, null as org_id
    into mem from users where id = uid;
  end if;

  return jsonb_set(event, '{claims,app_metadata}', jsonb_build_object(
    'role',          coalesce(mem.role::text, 'customer'),
    'restaurant_id', mem.restaurant_id,
    'branch_id',     mem.branch_id,
    'org_id',        mem.org_id
  ));
end;
$$;
-- Register as custom_access_token hook in Supabase Dashboard → Auth → Hooks
```

### 8.2 RLS helper functions
```sql
-- supabase/migrations/0003_rls_helpers.sql
create or replace function auth.restaurant_id() returns uuid language sql stable as $$
  select nullif(auth.jwt()->'app_metadata'->>'restaurant_id','')::uuid;
$$;
create or replace function auth.user_role() returns text language sql stable as $$
  select coalesce(auth.jwt()->'app_metadata'->>'role', 'customer');
$$;
create or replace function auth.is_super_admin() returns boolean language sql stable as $$
  select auth.user_role() = 'super_admin';
$$;
```

### 8.3 Supabase client wrappers
```typescript
// packages/db/src/client.ts  (browser)
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';
export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// packages/db/src/server.ts  (Server Components, Server Actions, Route Handlers)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';
export const createServerSupabaseClient = () =>
  createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookies().getAll(),
                 setAll: (c) => c.forEach(({name,value,options}) => cookies().set(name,value,options)) } }
  );

// packages/db/src/service.ts  (Edge Functions and server-only actions — never in browser)
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
export const createServiceClient = () =>
  createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
```

---

## SECTION 9 — COMPLETE DATABASE SCHEMA

### Migration 0001 — All enums
```sql
-- supabase/migrations/0001_enums.sql
create type user_role as enum ('super_admin','owner','manager','cashier','waiter','chef','customer');
create type order_type as enum ('dine_in','takeaway','delivery');
create type order_status as enum ('open','placed','in_kitchen','ready','served','billed','paid','cancelled');
create type item_status as enum ('queued','cooking','ready','served','cancelled');
create type session_status as enum ('open','bill_requested','settled','cancelled');
create type payment_status as enum ('created','pending','success','failed','refunded','partially_refunded');
create type payment_method as enum ('upi','card','cash','wallet','netbanking','aggregator');
create type channel_type as enum ('dine_in','takeaway','own_web','swiggy','zomato','other');
create type sub_status as enum ('trialing','active','past_due','cancelled','paused');
create type po_status as enum ('draft','sent','partially_received','received','cancelled');
create type expense_category as enum ('rent','electricity','gas','salary','supplies','marketing','repairs','misc');
create type attendance_status as enum ('present','absent','half_day','leave','week_off');
create type kot_status as enum ('pending','printing','printed','cancelled');
```

### Migration 0002 — Platform / tenancy tables
```sql
-- supabase/migrations/0004_tenancy.sql
create table organizations (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
grant select, insert, update, delete on organizations to authenticated;

create table restaurants (
  id          uuid default gen_random_uuid() primary key,
  org_id      uuid not null references organizations(id) on delete cascade,
  name        text not null,
  slug        text not null unique,    -- used in QR URLs e.g. "spice-garden"
  gstin       text,
  fssai_no    text,
  address     text,
  city        text,
  state       text,
  pincode     text,
  phone       text,
  email       text,
  logo_url    text,
  currency    text not null default 'INR',
  timezone    text not null default 'Asia/Kolkata',
  is_active   boolean not null default true,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);
grant select, insert, update, delete on restaurants to authenticated;

create table branches (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name          text not null,
  address       text,
  phone         text,
  is_active     boolean not null default true,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on branches to authenticated;

create table users (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  phone        text,
  email        text,
  default_role user_role not null default 'customer',
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);
grant select, insert, update on users to authenticated;

create table memberships (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid not null references users(id) on delete cascade,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id     uuid references branches(id) on delete set null,
  role          user_role not null,
  is_active     boolean not null default true,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  unique(user_id, restaurant_id)
);
grant select, insert, update, delete on memberships to authenticated;

create table settings (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  key           text not null,
  value         jsonb not null,
  updated_at    timestamptz default now() not null,
  unique(restaurant_id, key)
);
grant select, insert, update, delete on settings to authenticated;

create table audit_logs (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid references restaurants(id) on delete set null,
  actor_user_id uuid references users(id) on delete set null,
  action        text not null,
  entity        text not null,
  entity_id     uuid,
  before_data   jsonb,
  after_data    jsonb,
  ip_address    text,
  created_at    timestamptz default now() not null
);
grant select, insert on audit_logs to authenticated;

create index on memberships(user_id);
create index on memberships(restaurant_id);
create index on audit_logs(restaurant_id, created_at desc);
```

### Migration 0003 — SaaS billing
```sql
-- supabase/migrations/0005_billing.sql
create table plans (
  id          uuid default gen_random_uuid() primary key,
  code        text not null unique,
  name        text not null,
  price_paise bigint not null,
  interval    text not null default 'monthly',
  features    jsonb not null default '{}',
  limits      jsonb not null default '{}',
  is_active   boolean not null default true,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);
grant select on plans to authenticated, anon;
grant insert, update, delete on plans to authenticated;

insert into plans (code, name, price_paise, features, limits) values
('mvp','Starter',99900,
  '{"qr_ordering":true,"kitchen_display":true,"digital_bill":true,"inventory":false,"ai_assistant":false,"whatsapp_marketing":false,"multi_branch":false}',
  '{"max_branches":1,"max_staff":10,"max_menu_items":100}'),
('operations','Operations',299900,
  '{"qr_ordering":true,"kitchen_display":true,"digital_bill":true,"inventory":true,"suppliers":true,"staff_management":true,"expenses":true,"ai_assistant":false,"whatsapp_marketing":false,"multi_branch":false}',
  '{"max_branches":2,"max_staff":50,"max_menu_items":500}'),
('ai','AI Pro',599900,
  '{"qr_ordering":true,"kitchen_display":true,"digital_bill":true,"inventory":true,"suppliers":true,"staff_management":true,"expenses":true,"ai_assistant":true,"ai_forecast":true,"menu_engineering":true,"anomaly_detection":true,"whatsapp_marketing":true,"loyalty":true,"multi_branch":false}',
  '{"max_branches":3,"max_staff":200,"max_menu_items":2000}'),
('enterprise','Enterprise',0,
  '{"qr_ordering":true,"kitchen_display":true,"digital_bill":true,"inventory":true,"suppliers":true,"staff_management":true,"expenses":true,"ai_assistant":true,"ai_forecast":true,"menu_engineering":true,"anomaly_detection":true,"whatsapp_marketing":true,"loyalty":true,"multi_branch":true,"franchise":true,"aggregator_integration":true}',
  '{"max_branches":-1,"max_staff":-1,"max_menu_items":-1}');

create table subscriptions (
  id                       uuid default gen_random_uuid() primary key,
  restaurant_id            uuid not null references restaurants(id) on delete cascade,
  plan_id                  uuid not null references plans(id),
  status                   sub_status not null default 'trialing',
  razorpay_subscription_id text unique,
  trial_end                timestamptz,
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  cancelled_at             timestamptz,
  created_at               timestamptz default now() not null,
  updated_at               timestamptz default now() not null
);
grant select, insert, update on subscriptions to authenticated;
create unique index on subscriptions(restaurant_id) where status not in ('cancelled');
create index on subscriptions(restaurant_id);

create table invoices (
  id                  uuid default gen_random_uuid() primary key,
  restaurant_id       uuid not null references restaurants(id),
  subscription_id     uuid references subscriptions(id),
  amount_paise        bigint not null,
  status              text not null default 'pending',
  razorpay_invoice_id text unique,
  issued_at           timestamptz default now() not null,
  paid_at             timestamptz,
  pdf_url             text,
  created_at          timestamptz default now() not null
);
grant select, insert, update on invoices to authenticated;
```

### Migration 0004 — Menu
```sql
-- supabase/migrations/0006_menu.sql
create table menu_categories (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name          text not null,
  image_url     text,
  sort_order    int not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on menu_categories to authenticated;
grant select on menu_categories to anon;

create table menu_items (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  category_id   uuid not null references menu_categories(id) on delete cascade,
  name          text not null,
  description   text,
  price_paise   bigint not null,
  image_url     text,
  is_veg        boolean,             -- true=veg, false=non-veg, null=N/A
  hsn_sac       text,                -- GST HSN/SAC code
  gst_rate      numeric(5,2) not null default 5,  -- 0/5/12/18/28
  is_available  boolean not null default true,
  sort_order    int not null default 0,
  deleted_at    timestamptz,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on menu_items to authenticated;
grant select on menu_items to anon;

create table menu_item_translations (
  id           uuid default gen_random_uuid() primary key,
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  lang         text not null,  -- 'en' | 'bn' | 'hi'
  name         text not null,
  description  text,
  unique(menu_item_id, lang)
);
grant select, insert, update, delete on menu_item_translations to authenticated;
grant select on menu_item_translations to anon;

create table modifier_groups (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name          text not null,
  is_required   boolean not null default false,
  min_select    int not null default 0,
  max_select    int not null default 1,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on modifier_groups to authenticated;
grant select on modifier_groups to anon;

create table modifier_options (
  id                uuid default gen_random_uuid() primary key,
  modifier_group_id uuid not null references modifier_groups(id) on delete cascade,
  name              text not null,
  price_delta_paise bigint not null default 0,
  is_available      boolean not null default true
);
grant select, insert, update, delete on modifier_options to authenticated;
grant select on modifier_options to anon;

create table menu_item_modifier_groups (
  menu_item_id      uuid not null references menu_items(id) on delete cascade,
  modifier_group_id uuid not null references modifier_groups(id) on delete cascade,
  primary key (menu_item_id, modifier_group_id)
);
grant select, insert, delete on menu_item_modifier_groups to authenticated;
grant select on menu_item_modifier_groups to anon;

create index on menu_items(restaurant_id, category_id) where deleted_at is null;
create index on menu_items(restaurant_id, is_available);
```

### Migration 0005 — Tables & sessions
```sql
-- supabase/migrations/0007_tables_sessions.sql
create table dining_tables (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id     uuid not null references branches(id) on delete cascade,
  label         text not null,
  capacity      int,
  area          text,
  qr_code       text unique,   -- short code e.g. nanoid(8), embedded in QR URL
  is_active     boolean not null default true,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on dining_tables to authenticated;
grant select on dining_tables to anon;

create table table_sessions (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id     uuid not null references branches(id),
  table_id      uuid not null references dining_tables(id),
  status        session_status not null default 'open',
  guest_count   int,
  opened_by     uuid references users(id),
  opened_at     timestamptz default now() not null,
  closed_at     timestamptz,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update on table_sessions to authenticated;

-- Max 1 open session per table at a time
create unique index one_open_session_per_table on table_sessions(table_id)
  where status = 'open';
create index on table_sessions(restaurant_id, status);
create index on dining_tables(restaurant_id, branch_id);
```

### Migration 0006 — Orders
```sql
-- supabase/migrations/0008_orders.sql
create table orders (
  id                   uuid default gen_random_uuid() primary key,
  restaurant_id        uuid not null references restaurants(id) on delete cascade,
  branch_id            uuid not null references branches(id),
  session_id           uuid references table_sessions(id),
  order_number         text not null,           -- human-readable: "#0042"
  channel              channel_type not null default 'dine_in',
  order_type           order_type not null default 'dine_in',
  status               order_status not null default 'open',
  customer_id          uuid references users(id),
  waiter_id            uuid references users(id),
  subtotal_paise       bigint not null default 0,
  discount_paise       bigint not null default 0,
  tax_paise            bigint not null default 0,
  service_charge_paise bigint not null default 0,
  total_paise          bigint not null default 0,
  notes                text,
  external_ref         text,                     -- aggregator order ID
  placed_at            timestamptz,
  created_at           timestamptz default now() not null,
  updated_at           timestamptz default now() not null
);
grant select, insert, update on orders to authenticated;

create table order_items (
  id               uuid default gen_random_uuid() primary key,
  order_id         uuid not null references orders(id) on delete cascade,
  menu_item_id     uuid references menu_items(id) on delete set null,
  name_snapshot    text not null,         -- immutable copy at time of order
  unit_price_paise bigint not null,       -- immutable copy
  qty              int not null default 1,
  modifiers        jsonb not null default '[]', -- [{name, price_delta_paise}]
  item_total_paise bigint not null,
  gst_rate         numeric(5,2) not null default 5,
  notes            text,
  status           item_status not null default 'queued',
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now() not null
);
grant select, insert, update on order_items to authenticated;

create table order_status_history (
  id          uuid default gen_random_uuid() primary key,
  order_id    uuid not null references orders(id) on delete cascade,
  from_status order_status,
  to_status   order_status not null,
  changed_by  uuid references users(id),
  note        text,
  changed_at  timestamptz default now() not null
);
grant select, insert on order_status_history to authenticated;

create table kots (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  order_id      uuid not null references orders(id) on delete cascade,
  kot_number    int not null,
  station       text,
  status        kot_status not null default 'pending',
  printed_at    timestamptz,
  created_at    timestamptz default now() not null
);
grant select, insert, update on kots to authenticated;

create index on orders(restaurant_id, status, created_at desc);
create index on orders(session_id);
create index on orders(restaurant_id, channel);
create index on order_items(order_id);
create index on order_items(order_id, status);
create index on kots(order_id);
create index on kots(restaurant_id, created_at desc);
```

### Migration 0007 — Payments & Bills
```sql
-- supabase/migrations/0009_payments.sql
create table payments (
  id                  uuid default gen_random_uuid() primary key,
  restaurant_id       uuid not null references restaurants(id) on delete cascade,
  order_id            uuid references orders(id),
  session_id          uuid references table_sessions(id),
  method              payment_method not null,
  amount_paise        bigint not null,
  tip_paise           bigint not null default 0,
  status              payment_status not null default 'created',
  razorpay_order_id   text unique,
  razorpay_payment_id text unique,
  signature_verified  boolean not null default false,
  failure_reason      text,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);
grant select on payments to authenticated;
-- Writes go through service role key in edge functions only

create table refunds (
  id                 uuid default gen_random_uuid() primary key,
  payment_id         uuid not null references payments(id),
  amount_paise       bigint not null,
  reason             text,
  status             text not null default 'pending',
  razorpay_refund_id text unique,
  created_by         uuid references users(id),
  created_at         timestamptz default now() not null,
  updated_at         timestamptz default now() not null
);
grant select on refunds to authenticated;

-- GST invoice per settled bill
create table bills (
  id                   uuid default gen_random_uuid() primary key,
  restaurant_id        uuid not null references restaurants(id),
  session_id           uuid references table_sessions(id),
  order_id             uuid references orders(id),
  invoice_number       text not null,     -- DN/2025-26/0042
  subtotal_paise       bigint not null,
  discount_paise       bigint not null default 0,
  cgst_paise           bigint not null default 0,
  sgst_paise           bigint not null default 0,
  igst_paise           bigint not null default 0,
  service_charge_paise bigint not null default 0,
  total_paise          bigint not null,
  pdf_url              text,
  issued_at            timestamptz default now() not null,
  created_at           timestamptz default now() not null
);
grant select on bills to authenticated;
grant insert on bills to authenticated;

create table bill_splits (
  id           uuid default gen_random_uuid() primary key,
  bill_id      uuid not null references bills(id) on delete cascade,
  label        text not null,
  amount_paise bigint not null,
  paid         boolean not null default false,
  payment_id   uuid references payments(id)
);
grant select, insert, update on bill_splits to authenticated;

create index on payments(restaurant_id, created_at desc);
create index on payments(order_id);
create index on payments(razorpay_order_id);
create index on bills(restaurant_id, issued_at desc);
```

### Migration 0008 — Inventory & supply (Phase 2)
```sql
-- supabase/migrations/0010_inventory.sql
create table inventory_items (
  id                  uuid default gen_random_uuid() primary key,
  restaurant_id       uuid not null references restaurants(id) on delete cascade,
  name                text not null,
  unit                text not null,   -- 'kg'|'g'|'litre'|'ml'|'piece'|'dozen'
  current_qty         numeric(12,3) not null default 0,
  reorder_level       numeric(12,3) not null default 0,
  expiry_date         date,
  cost_per_unit_paise bigint,
  deleted_at          timestamptz,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);
grant select, insert, update, delete on inventory_items to authenticated;

create table recipes (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id),
  menu_item_id  uuid not null references menu_items(id) on delete cascade,
  created_at    timestamptz default now() not null,
  unique(menu_item_id)
);
grant select, insert, update, delete on recipes to authenticated;

create table recipe_ingredients (
  id                uuid default gen_random_uuid() primary key,
  recipe_id         uuid not null references recipes(id) on delete cascade,
  inventory_item_id uuid not null references inventory_items(id) on delete cascade,
  qty_per_serving   numeric(12,4) not null
);
grant select, insert, update, delete on recipe_ingredients to authenticated;

create table stock_movements (
  id                uuid default gen_random_uuid() primary key,
  restaurant_id     uuid not null references restaurants(id),
  inventory_item_id uuid not null references inventory_items(id),
  change_qty        numeric(12,3) not null,  -- positive=in, negative=out
  reason            text not null,  -- 'sale'|'purchase'|'wastage'|'adjustment'|'opening'
  ref_id            uuid,
  note              text,
  created_by        uuid references users(id),
  created_at        timestamptz default now() not null
);
grant select, insert on stock_movements to authenticated;

create table suppliers (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name          text not null,
  contact_name  text,
  phone         text,
  email         text,
  products      jsonb not null default '[]',
  deleted_at    timestamptz,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on suppliers to authenticated;

create table purchase_orders (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id),
  supplier_id   uuid not null references suppliers(id),
  status        po_status not null default 'draft',
  notes         text,
  total_paise   bigint not null default 0,
  ordered_at    timestamptz,
  received_at   timestamptz,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update on purchase_orders to authenticated;

create table purchase_order_items (
  id                uuid default gen_random_uuid() primary key,
  purchase_order_id uuid not null references purchase_orders(id) on delete cascade,
  inventory_item_id uuid not null references inventory_items(id),
  qty               numeric(12,3) not null,
  unit_price_paise  bigint not null,
  received_qty      numeric(12,3) not null default 0
);
grant select, insert, update on purchase_order_items to authenticated;

create index on inventory_items(restaurant_id) where deleted_at is null;
create index on stock_movements(restaurant_id, inventory_item_id, created_at desc);
```

### Migration 0009 — Staff & expenses (Phase 2)
```sql
-- supabase/migrations/0011_staff_expenses.sql
create table employees (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  user_id       uuid references users(id),
  name          text not null,
  role          user_role not null,
  phone         text,
  salary_paise  bigint,
  salary_type   text not null default 'monthly',  -- 'monthly'|'hourly'|'daily'
  join_date     date,
  deleted_at    timestamptz,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on employees to authenticated;

create table shifts (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id),
  employee_id   uuid not null references employees(id) on delete cascade,
  start_at      timestamptz not null,
  end_at        timestamptz,
  role          user_role,
  notes         text,
  created_at    timestamptz default now() not null
);
grant select, insert, update on shifts to authenticated;

create table attendance (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id),
  employee_id   uuid not null references employees(id) on delete cascade,
  date          date not null,
  status        attendance_status not null,
  clock_in      timestamptz,
  clock_out     timestamptz,
  created_at    timestamptz default now() not null,
  unique(employee_id, date)
);
grant select, insert, update on attendance to authenticated;

create table expenses (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  category      expense_category not null,
  amount_paise  bigint not null,
  note          text,
  spent_on      date not null,
  receipt_url   text,
  created_by    uuid references users(id),
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on expenses to authenticated;
```

### Migration 0010 — Customers & marketing (Phase 4)
```sql
-- supabase/migrations/0012_customers_marketing.sql
-- PII: phone encrypted AES-256 at app layer before insert
create table customers (
  id                uuid default gen_random_uuid() primary key,
  restaurant_id     uuid not null references restaurants(id) on delete cascade,
  name              text,
  phone_encrypted   text,           -- AES-256 encrypted
  phone_hash        text,           -- SHA-256 hash for lookup
  email             text,
  total_orders      int not null default 0,
  total_spent_paise bigint not null default 0,
  last_order_at     timestamptz,
  consent_marketing boolean not null default false,
  consent_given_at  timestamptz,
  deleted_at        timestamptz,    -- DPDPA delete support
  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null
);
grant select, insert, update on customers to authenticated;

create table loyalty_points (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id),
  customer_id   uuid not null references customers(id) on delete cascade,
  balance       int not null default 0,
  ledger        jsonb not null default '[]',
  updated_at    timestamptz default now() not null,
  unique(restaurant_id, customer_id)
);
grant select, insert, update on loyalty_points to authenticated;

create table coupons (
  id              uuid default gen_random_uuid() primary key,
  restaurant_id   uuid not null references restaurants(id),
  code            text not null,
  type            text not null,    -- 'flat' | 'percent'
  value_paise     bigint,
  value_percent   numeric(5,2),
  min_order_paise bigint not null default 0,
  max_uses        int,
  used_count      int not null default 0,
  valid_from      timestamptz,
  valid_to        timestamptz,
  is_active       boolean not null default true,
  created_at      timestamptz default now() not null,
  unique(restaurant_id, code)
);
grant select, insert, update on coupons to authenticated;
grant select on coupons to anon;

create table marketing_campaigns (
  id              uuid default gen_random_uuid() primary key,
  restaurant_id   uuid not null references restaurants(id),
  name            text not null,
  channel         text not null default 'whatsapp',
  template_name   text not null,
  template_params jsonb,
  audience_filter jsonb,
  scheduled_at    timestamptz,
  sent_at         timestamptz,
  status          text not null default 'draft',
  sent_count      int not null default 0,
  total_cost_paise bigint not null default 0,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);
grant select, insert, update on marketing_campaigns to authenticated;

create table message_logs (
  id              uuid default gen_random_uuid() primary key,
  restaurant_id   uuid not null references restaurants(id),
  customer_id     uuid references customers(id),
  campaign_id     uuid references marketing_campaigns(id),
  channel         text not null,
  template_name   text,
  status          text not null,
  provider_msg_id text,
  cost_paise      bigint not null default 0,
  created_at      timestamptz default now() not null
);
grant select, insert on message_logs to authenticated;

create index on customers(restaurant_id, phone_hash);
create index on customers(restaurant_id, consent_marketing) where deleted_at is null;
```

### Migration 0011 — AI, forecasts, integrations
```sql
-- supabase/migrations/0013_ai_integrations.sql
create table ai_reports (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  type          text not null,
  period_start  date,
  period_end    date,
  payload       jsonb not null,
  model_used    text,
  created_at    timestamptz default now() not null
);
grant select, insert on ai_reports to authenticated;

create table forecasts (
  id              uuid default gen_random_uuid() primary key,
  restaurant_id   uuid not null references restaurants(id) on delete cascade,
  target          text not null,
  forecast_date   date not null,
  predicted_value numeric(14,2) not null,
  confidence_low  numeric(14,2),
  confidence_high numeric(14,2),
  method          text,
  created_at      timestamptz default now() not null,
  unique(restaurant_id, target, forecast_date)
);
grant select, insert on forecasts to authenticated;

create table integrations (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  provider      text not null,   -- 'urbanpiper'|'petpooja'|'swiggy'|'zomato'
  status        text not null default 'disconnected',
  credentials   text,            -- AES-256 encrypted JSON
  config        jsonb,
  last_synced_at timestamptz,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  unique(restaurant_id, provider)
);
grant select, insert, update on integrations to authenticated;

create table external_orders (
  id              uuid default gen_random_uuid() primary key,
  restaurant_id   uuid not null references restaurants(id),
  provider        text not null,
  external_id     text not null,
  raw_payload     jsonb not null,
  mapped_order_id uuid references orders(id),
  status          text not null default 'pending',
  received_at     timestamptz default now() not null,
  unique(provider, external_id)
);
grant select, insert, update on external_orders to authenticated;

create table menu_item_mappings (
  id               uuid default gen_random_uuid() primary key,
  restaurant_id    uuid not null references restaurants(id),
  provider         text not null,
  external_item_id text not null,
  menu_item_id     uuid not null references menu_items(id),
  created_at       timestamptz default now() not null,
  unique(restaurant_id, provider, external_item_id)
);
grant select, insert, update, delete on menu_item_mappings to authenticated;

create table webhook_events (
  id              uuid default gen_random_uuid() primary key,
  source          text not null,
  event_type      text not null,
  idempotency_key text not null unique,
  payload         jsonb not null,
  processed       boolean not null default false,
  processed_at    timestamptz,
  error           text,
  created_at      timestamptz default now() not null
);
-- webhook_events is service-role only; no grant to authenticated

create table devices (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id),
  branch_id     uuid references branches(id),
  type          text not null,   -- 'printer'|'kds'
  name          text not null,
  config        jsonb,
  is_active     boolean not null default true,
  created_at    timestamptz default now() not null
);
grant select, insert, update on devices to authenticated;

create index on ai_reports(restaurant_id, type, created_at desc);
create index on webhook_events(idempotency_key);
create index on webhook_events(processed, created_at) where processed = false;
create index on external_orders(restaurant_id, status);
```

---

## SECTION 10 — ALL RLS POLICIES

```sql
-- supabase/migrations/0014_rls_policies.sql
-- Run AFTER all table migrations and after Section 8.2 helper functions

-- organizations
alter table organizations enable row level security;
create policy "super_admin_all" on organizations for all using (auth.is_super_admin());
create policy "member_read_own" on organizations for select
  using (id in (select org_id from restaurants where id = auth.restaurant_id()));

-- restaurants
alter table restaurants enable row level security;
create policy "tenant_read_own" on restaurants for select
  using (id = auth.restaurant_id() or auth.is_super_admin());
create policy "super_admin_write" on restaurants for insert update delete
  using (auth.is_super_admin());

-- branches
alter table branches enable row level security;
create policy "tenant_all" on branches for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id() or auth.is_super_admin());

-- settings
alter table settings enable row level security;
create policy "tenant_all" on settings for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- users
alter table users enable row level security;
create policy "read_own" on users for select using (id = auth.uid() or auth.is_super_admin());
create policy "update_own" on users for update using (id = auth.uid());
create policy "insert_own" on users for insert with check (id = auth.uid());

-- memberships
alter table memberships enable row level security;
create policy "tenant_read" on memberships for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());
create policy "owner_write" on memberships for insert update delete
  using (restaurant_id = auth.restaurant_id() and auth.user_role() in ('owner','manager') or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- plans (read-only for restaurants; super_admin manages)
alter table plans enable row level security;
create policy "anyone_read_active" on plans for select using (is_active = true or auth.is_super_admin());
create policy "super_admin_write" on plans for insert update delete using (auth.is_super_admin());

-- subscriptions
alter table subscriptions enable row level security;
create policy "owner_read_own" on subscriptions for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());
create policy "super_admin_write" on subscriptions for insert update delete
  using (auth.is_super_admin());

-- invoices
alter table invoices enable row level security;
create policy "owner_read_own" on invoices for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());

-- menu_categories, menu_item_translations, modifier_groups, modifier_options, menu_item_modifier_groups
alter table menu_categories enable row level security;
create policy "tenant_staff_all" on menu_categories for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());
create policy "anon_read" on menu_categories for select using (is_active = true);

-- menu_items (staff all; customer/anon read available only)
alter table menu_items enable row level security;
create policy "tenant_staff_all" on menu_items for all
  using (restaurant_id = auth.restaurant_id() and auth.user_role() <> 'customer' or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());
create policy "customer_read_available" on menu_items for select
  using (is_available = true and deleted_at is null);

-- dining_tables
alter table dining_tables enable row level security;
create policy "tenant_all" on dining_tables for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());
create policy "anon_read" on dining_tables for select using (is_active = true);

-- table_sessions
alter table table_sessions enable row level security;
create policy "tenant_all" on table_sessions for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- orders (staff all; customer own only)
alter table orders enable row level security;
create policy "staff_all" on orders for all
  using (restaurant_id = auth.restaurant_id() and auth.user_role() <> 'customer' or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id() and auth.user_role() <> 'customer');
create policy "customer_read_own" on orders for select
  using (restaurant_id = auth.restaurant_id() and customer_id = auth.uid());
create policy "customer_insert" on orders for insert
  with check (restaurant_id = auth.restaurant_id() and auth.user_role() = 'customer');

-- order_items
alter table order_items enable row level security;
create policy "tenant_via_order" on order_items for all
  using (exists (
    select 1 from orders o where o.id = order_items.order_id
      and (o.restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  ));

-- order_status_history, kots
alter table order_status_history enable row level security;
create policy "tenant_all" on order_status_history for all
  using (exists (select 1 from orders o where o.id = order_status_history.order_id
    and (o.restaurant_id = auth.restaurant_id() or auth.is_super_admin())));

alter table kots enable row level security;
create policy "tenant_all" on kots for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- payments (read for staff; writes through service role key only)
alter table payments enable row level security;
create policy "staff_read" on payments for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());

-- refunds, bills, bill_splits
alter table refunds enable row level security;
create policy "staff_read" on refunds for select
  using (exists (select 1 from payments p where p.id = refunds.payment_id
    and (p.restaurant_id = auth.restaurant_id() or auth.is_super_admin())));

alter table bills enable row level security;
create policy "tenant_read" on bills for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());
create policy "tenant_insert" on bills for insert
  with check (restaurant_id = auth.restaurant_id());

alter table bill_splits enable row level security;
create policy "tenant_via_bill" on bill_splits for all
  using (exists (select 1 from bills b where b.id = bill_splits.bill_id
    and (b.restaurant_id = auth.restaurant_id() or auth.is_super_admin())));

-- inventory, suppliers, purchase_orders, etc.
alter table inventory_items enable row level security;
create policy "tenant_all" on inventory_items for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table recipes enable row level security;
create policy "tenant_all" on recipes for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table recipe_ingredients enable row level security;
create policy "tenant_via_recipe" on recipe_ingredients for all
  using (exists (select 1 from recipes r where r.id = recipe_ingredients.recipe_id
    and (r.restaurant_id = auth.restaurant_id() or auth.is_super_admin())));

alter table stock_movements enable row level security;
create policy "tenant_all" on stock_movements for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table suppliers enable row level security;
create policy "tenant_all" on suppliers for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table purchase_orders enable row level security;
create policy "tenant_all" on purchase_orders for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table purchase_order_items enable row level security;
create policy "tenant_via_po" on purchase_order_items for all
  using (exists (select 1 from purchase_orders po where po.id = purchase_order_items.purchase_order_id
    and (po.restaurant_id = auth.restaurant_id() or auth.is_super_admin())));

alter table employees enable row level security;
create policy "tenant_all" on employees for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table shifts enable row level security;
create policy "tenant_all" on shifts for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table attendance enable row level security;
create policy "tenant_all" on attendance for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table expenses enable row level security;
create policy "tenant_all" on expenses for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- customers (staff only — not accessible by customer role)
alter table customers enable row level security;
create policy "staff_only" on customers for all
  using (restaurant_id = auth.restaurant_id()
    and auth.user_role() in ('owner','manager','cashier')
    or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table loyalty_points enable row level security;
create policy "staff_only" on loyalty_points for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table coupons enable row level security;
create policy "tenant_all" on coupons for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());
create policy "anon_read" on coupons for select using (is_active = true);

alter table marketing_campaigns enable row level security;
create policy "tenant_all" on marketing_campaigns for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table message_logs enable row level security;
create policy "tenant_read" on message_logs for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());
create policy "tenant_insert" on message_logs for insert
  with check (restaurant_id = auth.restaurant_id());

alter table ai_reports enable row level security;
create policy "tenant_all" on ai_reports for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table forecasts enable row level security;
create policy "tenant_read" on forecasts for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());

alter table integrations enable row level security;
create policy "tenant_all" on integrations for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table external_orders enable row level security;
create policy "tenant_all" on external_orders for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table menu_item_mappings enable row level security;
create policy "tenant_all" on menu_item_mappings for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table webhook_events enable row level security;
create policy "super_admin_only" on webhook_events for all using (auth.is_super_admin());

alter table devices enable row level security;
create policy "tenant_all" on devices for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

alter table audit_logs enable row level security;
create policy "tenant_read" on audit_logs for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());
create policy "insert_always" on audit_logs for insert with check (true);

-- RLS ISOLATION TEST (add to packages/db/src/__tests__/rls-isolation.test.ts):
-- 1. Create restaurant A and restaurant B (seed)
-- 2. Sign in as restaurant A owner
-- 3. Query orders → assert 0 results from restaurant B
-- 4. Sign in as super_admin → assert all rows visible
```

---

## SECTION 11 — UI / DESIGN SYSTEM (Top-Notch — follow exactly)

This section defines the DineNova visual language. Every screen in all 5 apps follows these rules. Claude Code must read this before writing any component.

### 11.1 Design philosophy
- **Warm & trustworthy** — restaurants are personal businesses. UI should feel human, not cold SaaS.
- **Density done right** — kitchen and waiter apps are used under pressure; owner dashboard shows data clearly. No unnecessary whitespace on operational screens.
- **Mobile-first** — Customer, Waiter, Kitchen apps are used on phones/tablets. Owner/Admin are desktop-first but responsive.
- **Accessible** — WCAG 2.1 AA minimum. Sufficient contrast, tap targets ≥ 44×44px.

### 11.2 Color palette (define in `packages/ui/src/theme.ts`)

```typescript
// packages/ui/src/theme.ts
export const colors = {
  // Brand
  brand: {
    50:  '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',   // ← Primary brand: warm orange
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  // Neutrals (warm grey, not cold blue-grey)
  neutral: {
    0:   '#ffffff',
    50:  '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
  },
  // Semantic
  success: { light: '#dcfce7', DEFAULT: '#16a34a', dark: '#166534' },
  warning: { light: '#fef9c3', DEFAULT: '#ca8a04', dark: '#854d0e' },
  error:   { light: '#fee2e2', DEFAULT: '#dc2626', dark: '#991b1b' },
  info:    { light: '#dbeafe', DEFAULT: '#2563eb', dark: '#1e40af' },

  // Surface tokens
  surface: {
    base:     '#fafaf9',   // page background
    card:     '#ffffff',   // card background
    overlay:  'rgba(28,25,23,0.6)', // modal backdrop
    sunken:   '#f5f5f4',  // input background, table rows alternate
  },
  // Status colours (order states — used on table map + KDS)
  status: {
    free:          '#dcfce7',   // green tint
    occupied:      '#fef9c3',   // yellow tint
    billRequested: '#fee2e2',   // red tint
    queued:        '#dbeafe',   // blue tint
    cooking:       '#fef9c3',   // yellow tint
    ready:         '#dcfce7',   // green tint
    paid:          '#f0fdf4',   // very light green
    cancelled:     '#f5f5f4',   // grey
  },
} as const;
```

### 11.3 Typography

```typescript
// packages/ui/src/fonts.ts (Next.js font optimization)
import { Inter, Poppins } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

// Usage: headings → Poppins, body → Inter
```

```css
/* packages/ui/src/globals.css */
:root {
  --font-inter: 'Inter', system-ui, sans-serif;
  --font-poppins: 'Poppins', system-ui, sans-serif;
}

/* Type scale */
.text-display   { font-family: var(--font-poppins); font-size: 2.25rem; font-weight: 700; line-height: 1.2; }
.text-h1        { font-family: var(--font-poppins); font-size: 1.875rem; font-weight: 600; line-height: 1.25; }
.text-h2        { font-family: var(--font-poppins); font-size: 1.5rem;   font-weight: 600; line-height: 1.3; }
.text-h3        { font-family: var(--font-poppins); font-size: 1.25rem;  font-weight: 500; line-height: 1.35; }
.text-body-lg   { font-family: var(--font-inter);   font-size: 1rem;     line-height: 1.6; }
.text-body      { font-family: var(--font-inter);   font-size: 0.875rem; line-height: 1.5; }
.text-caption   { font-family: var(--font-inter);   font-size: 0.75rem;  line-height: 1.4; }
.text-label     { font-family: var(--font-inter);   font-size: 0.75rem;  font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
```

### 11.4 Tailwind config (`packages/config/tailwind.preset.ts`)

```typescript
import type { Config } from 'tailwindcss';

const preset: Config = {
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans:     ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display:  ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand:   { /* all 50-900 from Section 11.2 */ },
        neutral: { /* all from Section 11.2 */ },
        surface: { /* tokens from Section 11.2 */ },
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(28,25,23,0.06), 0 1px 2px rgba(28,25,23,0.04)',
        'card-md': '0 4px 12px rgba(28,25,23,0.08), 0 2px 4px rgba(28,25,23,0.04)',
        'card-lg': '0 8px 24px rgba(28,25,23,0.10), 0 4px 8px rgba(28,25,23,0.06)',
        'bottom':  '0 -4px 12px rgba(28,25,23,0.08)',
      },
      animation: {
        'slide-up':    'slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        'slide-down':  'slideDown 0.25s ease-out',
        'fade-in':     'fadeIn 0.2s ease-out',
        'pulse-ring':  'pulseRing 1.5s cubic-bezier(0.215,0.61,0.355,1) infinite',
        'bounce-in':   'bounceIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        'shimmer':     'shimmer 1.5s linear infinite',
      },
      keyframes: {
        slideUp:   { from: { transform: 'translateY(100%)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideDown: { from: { transform: 'translateY(-8px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        pulseRing: { '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(249,115,22,0.5)' }, '70%': { transform: 'scale(1)', boxShadow: '0 0 0 10px rgba(249,115,22,0)' }, '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(249,115,22,0)' } },
        bounceIn:  { '0%': { transform: 'scale(0.8)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
};
export default preset;
```

### 11.5 Core shared components (`packages/ui/src/components/`)

```
Button          — variants: primary (orange), secondary (outline), ghost, danger, icon
Card            — variants: default (white + shadow), sunken (grey bg), elevated
Badge           — variants: success, warning, error, info, neutral + size sm/md
StatusDot       — animated pulse for live status (green/amber/red)
Avatar          — initials fallback, restaurant logo, user avatar
CurrencyDisplay — always renders ₹X,XX,XXX.XX from paise input
Spinner         — brand-orange circular loader
SkeletonBlock   — shimmer placeholder for loading states
EmptyState      — illustration + heading + CTA for empty lists
Toast           — top-right notifications (success/error/info)
Modal           — bottom-sheet on mobile, centered dialog on desktop
BottomSheet     — mobile-native slide-up panel (used for cart, bill, details)
Tabs            — horizontal scrollable tabs (used on menu categories)
SegmentedControl — compact toggle group (used for filters)
SearchInput     — with debounce, clear button
DataTable       — sortable, filterable, with CSV export
StatCard        — metric card: label + big number + delta % + sparkline
Chart           — recharts wrapper with brand colors + tooltips in IST
```

### 11.6 Customer app UI spec

**Visual language:** Warm, food-photography-friendly, fast.

```
Layout:
  - Sticky header: restaurant logo + name, language selector, cart icon with badge
  - Category tabs: horizontal scroll, pill style, active = brand orange fill
  - Item grid: 2-column on mobile, 3-column on tablet
  - Bottom: fixed CartBar (₹ total + "View Cart" button) when cart > 0

Item card:
  - Full-bleed image (16:9) with lazy loading + blur placeholder
  - Veg/non-veg indicator: green filled circle (veg) / red filled circle (non-veg)
  - Name (Poppins 500), price (Poppins 600 orange), description (Inter grey)
  - Add button: circular +/- counter, orange, 44px tap target
  - Unavailable state: greyed out image + "Sold Out" badge, add button hidden

Cart bottom sheet:
  - Slide up from bottom, 80vh max
  - Item list with qty controls + remove
  - Coupon code input
  - GST breakdown collapsible
  - Total in large Poppins 700
  - "Place Order" CTA — full width, orange, 56px height

Order tracking screen:
  - Vertical stepper: Placed → In Kitchen → Ready → Served
  - Live animation on active step (pulse ring)
  - Estimated time badge
  - Live item status chips per item

Digital bill:
  - Clean invoice layout: restaurant details top, line items, tax breakdown, total
  - "Pay ₹XXX" CTA bottom — triggers Razorpay
  - "Download Bill" secondary button
```

### 11.7 Waiter app UI spec

**Visual language:** High information density, one-handed operation, no clutter.

```
Table map:
  - Grid of table cards (responsive: 3-4 columns on phone)
  - Each card: table label (large, Poppins 700), area label, guest count, time open, status colour bg
  - Status colours from Section 11.2 status tokens
  - "Bill Requested" cards pulse gently
  - FAB (Floating Action Button) bottom-right: "+ Takeaway Order"
  - Filter bar top: All | Occupied | Bill Requested | Free

Session detail:
  - Header: table label + time open + guest count
  - Tabs: Orders | Bill | Actions
  - Order list: order cards with items, status chips per item, waiter name
  - "Add Items" sticky bottom button → opens item picker sheet
  - Actions tab: Transfer Table, Merge Tables, Split Bill (each opens a bottom sheet)

Item picker sheet:
  - Same category tabs + search as customer app
  - Quantity stepper inline
  - Special notes input per item
  - "Add to Order" CTA

Bill sheet:
  - Payment method selector: UPI (QR icon), Card, Cash — pill buttons
  - Amount breakdown
  - Split bill toggle → opens split builder
  - "Settle" CTA
```

### 11.8 Kitchen (KDS) app UI spec

**Visual language:** Maximum readability at 2m distance from tablet. High contrast. No decorative elements.

```
KOT queue layout:
  - Full-width cards, single column
  - Card header: order number (Poppins 700 large) + table label + time elapsed badge
  - Time elapsed: green <10min, amber 10-15min, red >15min (auto-updates)
  - Item rows: item name (large), qty bubble (orange), modifier chips (small grey pills)
  - Item status chips: tap to advance queued→cooking→ready
  - Card background: white when active, light green when all items ready
  - "All Ready" button bottom of card (large, full-width, green)

Top bar:
  - Station filter (pill group)
  - Sound toggle icon button
  - Live order count badge

New order alert:
  - Full-screen flash (brand orange, 300ms) + audio beep
  - New card slides in from top with bounce-in animation
  - Red "NEW" badge fades out after 5s

Empty state:
  - Large checkmark illustration + "All clear — no pending orders" 
  - Background: very light green tint
```

### 11.9 Owner dashboard UI spec

**Visual language:** Professional analytics dashboard. Clean, data-forward. Poppins headings, Inter data.

```
Layout:
  - Left sidebar (240px, collapsible to icon-only on tablet)
  - Sidebar items: icon + label, active = brand bg, hover = neutral-100
  - Top bar: breadcrumb, restaurant name chip, notification bell, avatar menu
  - Content: max-w-7xl, centered, padding

Dashboard (/dashboard):
  - Top row: 4 StatCards (Revenue Today, Orders Today, Avg Ticket, Active Tables)
  - StatCard: metric large (Poppins 700 2.25rem), label small (grey), delta badge (+12% green / -5% red), sparkline (7-day)
  - Revenue chart: BarChart (recharts), last 30 days, brand orange bars, tooltips show ₹ in IST
  - Two columns below: Top Items table | Recent Orders live feed
  - Live feed: realtime, newest on top, order number + table + status chip + total

Menu management:
  - Two-panel: category list left, items grid right
  - Category list: draggable to reorder (react-beautiful-dnd), toggle active
  - Item card: image thumbnail, name, price, veg dot, availability toggle switch
  - Item editor: full-page form with image upload (drag-drop), all fields, translations tab, modifiers tab
  - Image upload: dropzone with preview, crop tool (react-easy-crop)

Analytics:
  - Tabs: Revenue | Items | Staff | Inventory
  - Each tab: date range picker (Today / Week / Month / Custom), export CSV button
  - Revenue: Area chart + table
  - Items: sortable table with margin vs popularity quadrant chart (menu engineering)

Settings:
  - Vertical sub-nav: Profile | GST/FSSAI | Tables | Staff | Plan & Billing | Integrations
```

### 11.10 Admin (Super Admin) app UI spec

**Visual language:** Internal tool — dense, functional, slightly darker. Think Vercel dashboard.

```
Color mode: Dark sidebar (#1c1917) + white content
Layout: Same sidebar+topbar as Owner but darker sidebar

Dashboard metrics:
  - MRR (₹), ARR (₹), Active Restaurants, Total Orders (MTD), Churn %
  - Graphs: MRR over time, New restaurants per month, Plan distribution donut
  
Restaurant list:
  - Data table with: name, plan badge, status (active/trialing/past_due/suspended), MRR, joined date, last active
  - Row actions: View, Suspend, Override Plan, Impersonate (with warning modal + audit note)
  - Plan badge colours: Starter=neutral, Operations=blue, AI Pro=purple, Enterprise=orange

Impersonation modal:
  - Red header "⚠ Impersonating — All actions are audited"
  - Text field: reason (required)
  - Confirm button — logs to audit_logs before proceeding
  - Sticky banner at top of screen while impersonating: "You are viewing as [Restaurant Name]"
```

### 11.11 Framer Motion animation patterns

```typescript
// packages/ui/src/animations.ts — use these variants everywhere

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

export const slideUp = {
  initial: { y: 24, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  exit:    { y: 16, opacity: 0, transition: { duration: 0.15 } },
};

export const slideUpFull = {   // for bottom sheets
  initial: { y: '100%' },
  animate: { y: 0, transition: { type: 'spring', stiffness: 280, damping: 32 } },
  exit:    { y: '100%', transition: { duration: 0.2 } },
};

export const bounceIn = {
  initial: { scale: 0.85, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } },
  exit:    { scale: 0.9, opacity: 0, transition: { duration: 0.15 } },
};

export const staggerChildren = {
  animate: { transition: { staggerChildren: 0.06 } },
};

// New KOT card slide-in (kitchen app)
export const kotCard = {
  initial: { x: -40, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 350, damping: 28 } },
  exit:    { x: 40, opacity: 0, transition: { duration: 0.2 } },
};
```

### 11.12 Dark mode

Support system-preference dark mode on Owner and Admin apps. Customer/Waiter/Kitchen are light-only (operational contexts benefit from consistent lighting).

```typescript
// In tailwind config: darkMode: ['class']
// Toggle via: document.documentElement.classList.toggle('dark')
// Dark surface: bg-neutral-900, cards: bg-neutral-800, text: neutral-100
// Brand orange stays the same in dark mode
```

### 11.13 Loading & error states (required on every data-fetching page)

```
Every page that fetches data must have:
1. Loading state: skeleton blocks matching the layout shape (SkeletonBlock component)
2. Error state: EmptyState component with error icon + "Something went wrong" + Retry button
3. Empty state: EmptyState component with relevant illustration + helpful CTA

Never show a blank white page or a raw error string.
```

### 11.14 Mobile UX rules (Customer, Waiter, Kitchen)

```
- Tap targets: minimum 44×44px (48×48px preferred for primary actions)
- Bottom navigation bar (if used): max 5 items, icon + label
- All modals/sheets: swipe-to-dismiss (framer-motion drag + dragConstraints)
- Inputs: use appropriate inputMode (tel, decimal, numeric, search)
- Long lists: virtualized (use react-virtual or Tanstack Virtual)
- Images: always use next/image with sizes prop set correctly
- Scroll: momentum scrolling on iOS (-webkit-overflow-scrolling: touch)
- No hover-only interactions — every action must be tappable
```

---

## SECTION 12 — CORE DOMAIN FLOWS

### 12.1 Order status machine
```
open → placed → in_kitchen → ready → served → billed → paid
                                                       ↑
                                              (webhook confirms)
Any state → cancelled
```

### 12.2 Payment flow (webhook is the only source of truth)
```
1. Client → Server Action: createRazorpayOrder(amount_paise, order_id)
   → Razorpay API creates Order
   → Insert payments row {status:'created', razorpay_order_id}
   → Return {razorpay_order_id, amount, key_id}

2. Client opens Razorpay Checkout (CDN script)
   → Customer pays via UPI/card

3. Razorpay POST → /functions/razorpay-webhook
   → HMAC-SHA256 verify signature
   → Idempotency check (webhook_events table)
   → On payment.captured:
       payments.status = 'success', signature_verified = true
       orders.status = 'paid'
       table_session.status = 'settled'
       stock_movements inserted (recipe deduction)
       audit_log inserted
   → Mark webhook_events.processed = true

NEVER set payment status from client. Only the webhook.
```

### 12.3 GST helper (`packages/utils/src/gst.ts`)
```typescript
export interface GSTLine {
  subtotal_paise: number;
  cgst_paise: number;
  sgst_paise: number;
  total_paise: number;
}

// Price INCLUDES GST (most common for restaurant menus)
export function gstInclusive(item_total_paise: number, rate: number): GSTLine {
  const base = Math.round(item_total_paise * 100 / (100 + rate));
  const gst  = item_total_paise - base;
  const half = Math.round(gst / 2);
  return { subtotal_paise: base, cgst_paise: half, sgst_paise: gst - half, total_paise: item_total_paise };
}

// Price EXCLUDES GST
export function gstExclusive(net_paise: number, rate: number): GSTLine {
  const gst  = Math.round(net_paise * rate / 100);
  const half = Math.round(gst / 2);
  return { subtotal_paise: net_paise, cgst_paise: half, sgst_paise: gst - half, total_paise: net_paise + gst };
}

// Invoice number: DN/{FY}/{padded_seq}   e.g. DN/2025-26/0042
export function invoiceNumber(seq: number, date = new Date()): string {
  const m = date.getMonth(); // 0-indexed
  const y = date.getFullYear();
  const fy = m >= 3 ? `${y}-${String(y+1).slice(-2)}` : `${y-1}-${String(y).slice(-2)}`;
  return `DN/${fy}/${String(seq).padStart(4,'0')}`;
}
```

---

## SECTION 13 — RAZORPAY WEBHOOK EDGE FUNCTION

```typescript
// supabase/functions/razorpay-webhook/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

async function verifyRazorpaySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const hex = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2,'0')).join('');
  return hex === signature;
}

Deno.serve(async (req) => {
  const body = await req.text();
  const sig  = req.headers.get('x-razorpay-signature') ?? '';
  const ok   = await verifyRazorpaySignature(body, sig, Deno.env.get('RAZORPAY_WEBHOOK_SECRET')!);
  if (!ok) return new Response('Invalid signature', { status: 401 });

  const event = JSON.parse(body);
  const payment = event.payload?.payment?.entity;
  const idemKey = `razorpay:${event.event}:${payment?.id ?? event.payload?.subscription?.entity?.id}`;

  const sb = createClient(Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  // Idempotency check
  try {
    await sb.from('webhook_events').insert({ source:'razorpay', event_type:event.event, idempotency_key:idemKey, payload:event });
  } catch { return new Response('Already processed', { status: 200 }); }

  if (event.event === 'payment.captured') {
    // Update payment row
    const { data: pmnt } = await sb.from('payments').update({
      status: 'success', signature_verified: true,
      razorpay_payment_id: payment.id, updated_at: new Date().toISOString(),
    }).eq('razorpay_order_id', payment.order_id).select('order_id, session_id, restaurant_id').single();

    if (pmnt?.order_id) {
      await sb.from('orders').update({ status: 'paid', updated_at: new Date().toISOString() }).eq('id', pmnt.order_id);
      await sb.from('order_status_history').insert({ order_id: pmnt.order_id, from_status:'billed', to_status:'paid' });
      // Deduct inventory via function call (if recipes exist)
      await sb.rpc('deduct_inventory_for_order', { p_order_id: pmnt.order_id });
    }
    if (pmnt?.session_id) {
      await sb.from('table_sessions').update({ status:'settled', closed_at: new Date().toISOString() }).eq('id', pmnt.session_id);
    }
    await sb.from('audit_logs').insert({ restaurant_id: pmnt?.restaurant_id, action:'payment.captured', entity:'payments', entity_id: payment.id });
  }

  if (event.event === 'subscription.activated' || event.event === 'subscription.charged') {
    const sub = event.payload.subscription.entity;
    await sb.from('subscriptions').update({
      status: 'active',
      current_period_start: new Date(sub.current_start * 1000).toISOString(),
      current_period_end: new Date(sub.current_end * 1000).toISOString(),
    }).eq('razorpay_subscription_id', sub.id);
  }

  if (event.event === 'subscription.halted') {
    await sb.from('subscriptions').update({ status:'past_due' })
      .eq('razorpay_subscription_id', event.payload.subscription.entity.id);
  }

  await sb.from('webhook_events').update({ processed:true, processed_at: new Date().toISOString() }).eq('idempotency_key', idemKey);
  return new Response('OK', { status: 200 });
});
```

---

## SECTION 14 — AI ASSISTANT EDGE FUNCTION

```typescript
// supabase/functions/ai-assistant/index.ts
// PRIVACY RULE: NEVER send PII (customer names/phones/emails) to the model. Only aggregated metrics.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'npm:@google/generative-ai';

Deno.serve(async (req) => {
  const { question, restaurant_id } = await req.json();
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  const sb = createClient(Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  // Rate limit: 20 AI calls per restaurant per day
  const { count } = await sb.from('ai_reports')
    .select('*', { count: 'exact', head: true })
    .eq('restaurant_id', restaurant_id)
    .gte('created_at', new Date(Date.now() - 86400000).toISOString());
  if ((count ?? 0) >= 20) return new Response(JSON.stringify({ error: 'Daily AI limit reached. Try tomorrow.' }), { status: 429 });

  // Fetch aggregated (de-identified) metrics only
  const { data: metrics } = await sb.rpc('get_restaurant_metrics', {
    p_restaurant_id: restaurant_id,
    p_date: new Date().toISOString().split('T')[0],
  });

  const prompt = `You are the AI business assistant for DineNova, a restaurant management platform.
You are speaking with the restaurant owner. Respond in clear, friendly English.

Restaurant metrics (today):
${JSON.stringify(metrics, null, 2)}

Owner's question: "${question}"

Instructions:
- Be specific about numbers from the metrics
- Give 2-4 bullet points with insights
- Suggest 1 concrete action the owner can take today
- If the question is unrelated to business, politely redirect
- NEVER mention customer names, phone numbers, or any personal information
- Format numbers as ₹ amounts (not paise)`;

  const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  const answer = result.response.text();

  await sb.from('ai_reports').insert({
    restaurant_id, type: 'daily_summary', payload: { question, answer, metrics }, model_used: 'gemini-2.5-flash',
  });

  return new Response(JSON.stringify({ answer }), { headers: { 'Content-Type': 'application/json' } });
});
```

---

## SECTION 15 — ENTITLEMENT CHECKER

```typescript
// packages/auth/src/entitlements.ts
import type { SupabaseClient } from '@supabase/supabase-js';

export type Feature =
  | 'inventory' | 'suppliers' | 'staff_management' | 'expenses'
  | 'ai_assistant' | 'ai_forecast' | 'menu_engineering' | 'anomaly_detection'
  | 'whatsapp_marketing' | 'loyalty' | 'multi_branch' | 'franchise' | 'aggregator_integration';

// Always call on the SERVER. Never trust client-side feature flags alone.
export async function can(sb: SupabaseClient, restaurant_id: string, feature: Feature): Promise<boolean> {
  const { data } = await sb.from('subscriptions')
    .select('plans(features), status, trial_end')
    .eq('restaurant_id', restaurant_id)
    .in('status', ['active','trialing'])
    .single();
  if (!data) return false;
  if (data.status === 'trialing' && data.trial_end && new Date(data.trial_end) < new Date()) return false;
  return (data.plans as any)?.features?.[feature] === true;
}

// Usage in every server action that touches a gated feature:
// const ok = await can(supabase, restaurant_id, 'inventory');
// if (!ok) return { success: false, error: 'Upgrade to Operations plan to access inventory.', code: 'FEATURE_GATED' };
```

---

## SECTION 16 — REALTIME SUBSCRIPTIONS

```typescript
// packages/db/src/realtime.ts
import { createClient } from './client';

export function subscribeToKOTs(restaurantId: string, onNew: (payload: any) => void) {
  return createClient()
    .channel(`kots:${restaurantId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'kots', filter: `restaurant_id=eq.${restaurantId}` }, onNew)
    .subscribe();
}

export function subscribeToOrderItems(orderId: string, onChange: (payload: any) => void) {
  return createClient()
    .channel(`order_items:${orderId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'order_items', filter: `order_id=eq.${orderId}` }, onChange)
    .subscribe();
}

export function subscribeToTableSessions(restaurantId: string, onChange: (payload: any) => void) {
  return createClient()
    .channel(`sessions:${restaurantId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'table_sessions', filter: `restaurant_id=eq.${restaurantId}` }, onChange)
    .subscribe();
}

// Always unsubscribe in useEffect cleanup:
// useEffect(() => { const ch = subscribeToKOTs(..., handler); return () => supabase.removeChannel(ch); }, []);
```

---

## SECTION 17 — SECURITY CHECKLIST

Before every PR, Claude Code must verify:

- [ ] RLS enabled on every new table with tenant data
- [ ] No secret in any `NEXT_PUBLIC_*` variable or client bundle
- [ ] All money: `bigint` paise, never floats
- [ ] All webhooks: HMAC signature verified before any action
- [ ] All webhooks: idempotency key checked in `webhook_events`
- [ ] No customer PII sent to free Gemini API (only aggregated metrics)
- [ ] `consent_marketing = true` checked before any WhatsApp marketing send
- [ ] All user inputs: zod-validated on the server, not just the client
- [ ] Audit log written for: void, refund, price change, plan override, delete, impersonation
- [ ] PostgREST grants (`grant ... to authenticated`) in every migration

---

## SECTION 18 — ANALYTICS SQL VIEWS

```sql
-- supabase/migrations/0015_analytics_views.sql

create or replace view daily_revenue as
select
  restaurant_id,
  date_trunc('day', created_at at time zone 'Asia/Kolkata') as day,
  count(*) filter (where status = 'paid') as paid_orders,
  sum(total_paise) filter (where status = 'paid') as revenue_paise,
  avg(total_paise) filter (where status = 'paid') as avg_ticket_paise,
  count(*) filter (where status = 'cancelled') as cancelled_orders
from orders
group by 1, 2;

create or replace view top_menu_items as
select
  oi.menu_item_id, oi.name_snapshot, o.restaurant_id,
  count(*) as order_count,
  sum(oi.qty) as total_qty,
  sum(oi.item_total_paise) as total_revenue_paise
from order_items oi
join orders o on o.id = oi.order_id
where o.status = 'paid'
group by 1, 2, 3;

-- Stored function for AI assistant (aggregated, no PII)
create or replace function get_restaurant_metrics(p_restaurant_id uuid, p_date date)
returns jsonb language plpgsql security definer as $$
declare result jsonb;
begin
  select jsonb_build_object(
    'today_revenue_paise',     coalesce((select sum(total_paise) from orders where restaurant_id=p_restaurant_id and status='paid' and placed_at::date=p_date), 0),
    'yesterday_revenue_paise', coalesce((select sum(total_paise) from orders where restaurant_id=p_restaurant_id and status='paid' and placed_at::date=p_date-1), 0),
    'week_revenue_paise',      coalesce((select sum(total_paise) from orders where restaurant_id=p_restaurant_id and status='paid' and placed_at::date>=p_date-7), 0),
    'today_orders',            coalesce((select count(*) from orders where restaurant_id=p_restaurant_id and status='paid' and placed_at::date=p_date), 0),
    'avg_ticket_paise',        coalesce((select avg(total_paise) from orders where restaurant_id=p_restaurant_id and status='paid' and placed_at::date=p_date), 0),
    'top_3_items',             coalesce((select jsonb_agg(jsonb_build_object('name',name_snapshot,'qty',total_qty)) from top_menu_items where restaurant_id=p_restaurant_id order by total_qty desc limit 3), '[]'::jsonb),
    'low_stock_count',         coalesce((select count(*) from inventory_items where restaurant_id=p_restaurant_id and current_qty <= reorder_level and deleted_at is null), 0),
    'open_orders',             coalesce((select count(*) from orders where restaurant_id=p_restaurant_id and status not in ('paid','cancelled')), 0)
  ) into result;
  return result;
end;
$$;

-- Inventory deduction function (called by webhook)
create or replace function deduct_inventory_for_order(p_order_id uuid)
returns void language plpgsql security definer as $$
declare
  item record;
  ingredient record;
begin
  for item in select oi.menu_item_id, oi.qty, o.restaurant_id
    from order_items oi join orders o on o.id = oi.order_id
    where oi.order_id = p_order_id
  loop
    for ingredient in
      select ri.inventory_item_id, ri.qty_per_serving * item.qty as total_qty
      from recipes r join recipe_ingredients ri on ri.recipe_id = r.id
      where r.menu_item_id = item.menu_item_id
    loop
      update inventory_items
        set current_qty = current_qty - ingredient.total_qty, updated_at = now()
        where id = ingredient.inventory_item_id;
      insert into stock_movements (restaurant_id, inventory_item_id, change_qty, reason, ref_id)
        values (item.restaurant_id, ingredient.inventory_item_id, -ingredient.total_qty, 'sale', p_order_id);
    end loop;
  end loop;
end;
$$;
```

---

## SECTION 19 — SEED DATA

```sql
-- supabase/seed.sql
insert into organizations (id, name) values ('00000000-0000-0000-0000-000000000001','Demo Org');
insert into restaurants (id, org_id, name, slug, gstin, fssai_no, address, city, state, pincode, phone) values
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001',
   'Spice Garden','spice-garden','27AABCU9603R1ZX','11521999000123',
   '12 MG Road','Mumbai','Maharashtra','400001','9876543210');
insert into branches (id, restaurant_id, name, address) values
  ('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000002','Main Branch','12 MG Road, Mumbai');
-- 5 dining tables
insert into dining_tables (restaurant_id, branch_id, label, capacity, area, qr_code) values
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003','T1',4,'Ground Floor','ABCD1234'),
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003','T2',2,'Ground Floor','ABCD1235'),
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003','T3',6,'Rooftop','ABCD1236'),
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003','T4',4,'Rooftop','ABCD1237'),
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000003','T5',8,'Private Room','ABCD1238');
-- Demo menu category + items
insert into menu_categories (id, restaurant_id, name, sort_order) values
  ('00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000002','Starters',1),
  ('00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000002','Mains',2),
  ('00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000002','Beverages',3);
insert into menu_items (restaurant_id, category_id, name, price_paise, is_veg, gst_rate, hsn_sac) values
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000004','Paneer Tikka',29900,true,5,'996331'),
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000004','Chicken 65',34900,false,5,'996331'),
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000005','Butter Chicken',39900,false,5,'996331'),
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000005','Dal Makhani',27900,true,5,'996331'),
  ('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000006','Mango Lassi',14900,true,5,'996331');
-- Starter subscription for demo restaurant
insert into subscriptions (restaurant_id, plan_id, status, trial_end) values
  ('00000000-0000-0000-0000-000000000002',
   (select id from plans where code='mvp'),
   'trialing', now() + interval '14 days');
```

---

## SECTION 20 — WHATSAPP INTEGRATION

```typescript
// packages/integrations/src/whatsapp.ts
// India 2026 rates: marketing ≈ ₹0.88–1.09/msg, utility ≈ ₹0.13–0.15/msg
// Customer-initiated service replies inside 24h window = FREE

export async function sendUtilityMessage({ to, template, params }: {
  to: string; template: string; params: string[];
}) {
  // Utility templates: order confirmation, bill, OTP — low cost
  return _sendTemplate(to, template, params);
}

export async function sendMarketingMessage({ to, template, params, restaurantId, customerId, supabase }: {
  to: string; template: string; params: string[]; restaurantId: string; customerId: string; supabase: any;
}) {
  // MUST check consent before sending marketing
  const { data: customer } = await supabase.from('customers').select('consent_marketing').eq('id', customerId).single();
  if (!customer?.consent_marketing) throw new Error('Customer has not consented to marketing messages');
  return _sendTemplate(to, template, params);
}

async function _sendTemplate(to: string, template: string, params: string[]) {
  const res = await fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp', to, type: 'template',
      template: { name: template, language: { code: 'en' },
        components: [{ type: 'body', parameters: params.map(text => ({ type: 'text', text })) }] },
    }),
  });
  return res.json();
}
```

---

## SECTION 21 — BUILD ORDER (22 tasks, copy-paste to Claude Code)

### SESSION START RITUAL (paste this every single time)
```
Read docs/SPEC.md in full. Confirm you have read it. Then perform the task below.
Follow all naming conventions, SQL patterns, money rules (paise not rupees), UI rules
(Section 11), security rules (Section 17), and zod validation rules exactly.
After completing the task, append a short summary to docs/PROGRESS.md.
```

---

### TASK 0 — Monorepo scaffold
```
Task: Scaffold the complete Turborepo + pnpm monorepo.

1. Create all 5 apps (customer, waiter, kitchen, owner, admin) as Next.js 15 App Router + TypeScript.
   Each app's package.json name: @dinenovaai/{appname}

2. Create all 8 packages with correct names (@dinenovaai/{name}):
   ui, db, auth, validators, ai, integrations, config, utils

3. Root files:
   - turbo.json (exact content from Section 2)
   - pnpm-workspace.yaml (exact content from Section 2)
   - .env.example (exact content from Section 6)

4. packages/config: tsconfig.base.json, eslint.config.js, tailwind.preset.ts (from Section 11.4)

5. packages/ui:
   - Install and configure shadcn/ui
   - Install lucide-react, framer-motion
   - Create theme.ts with full color palette (Section 11.2)
   - Create fonts.ts (Inter + Poppins via next/font, Section 11.3)
   - Create globals.css with type scale (Section 11.3)
   - Create animations.ts (Section 11.11)
   - Create placeholder files for all components in Section 11.5

6. packages/utils: Create money.ts and dates.ts (Section 5.1 and 5.2 exact code)

7. packages/db: Create client.ts, server.ts, service.ts (Section 8.3 exact code)

8. GitHub Actions:
   - .github/workflows/ci.yml
   - .github/workflows/keepalive.yml (Section 7 exact code)

9. Create docs/PROGRESS.md, mark Task 0 done.

Do not write any database or Supabase code yet.
```

---

### TASK 1 — Database foundation (enums + tenancy + auth + billing)
```
Task: Create the database foundation migrations.

Run in this exact order:
  supabase/migrations/0001_enums.sql        — all enums (Section 9, Migration 0001)
  supabase/migrations/0002_tenancy.sql      — orgs, restaurants, branches, users,
                                              memberships, settings, audit_logs (Section 9, Migration 0002)
  supabase/migrations/0003_rls_helpers.sql  — auth.restaurant_id(), auth.user_role(),
                                              auth.is_super_admin() (Section 8.2)
  supabase/migrations/0004_auth_hook.sql    — custom_jwt_claims function (Section 8.1)
  supabase/migrations/0005_billing.sql      — plans, subscriptions, invoices + seed plans (Section 9, Migration 0003)

Register the auth hook in config.toml:
  [auth.hooks.custom_access_token]
  enabled = true
  uri = "pg-functions://postgres/public/custom_jwt_claims"

packages/validators/src/tenancy.ts — zod schemas for createRestaurant, createBranch, createMembership
packages/auth/src/roles.ts — exact code from Section 4

Run: supabase db push (confirm no errors)
Create docs/PROGRESS.md entry.
```

---

### TASK 2 — Database: menu + tables + orders
```
Task: Create all remaining database migrations.

  supabase/migrations/0006_menu.sql            — Section 9, Migration 0004
  supabase/migrations/0007_tables_sessions.sql — Section 9, Migration 0005
  supabase/migrations/0008_orders.sql          — Section 9, Migration 0006
  supabase/migrations/0009_payments.sql        — Section 9, Migration 0007
  supabase/migrations/0010_inventory.sql       — Section 9, Migration 0008
  supabase/migrations/0011_staff_expenses.sql  — Section 9, Migration 0009
  supabase/migrations/0012_customers_marketing.sql — Section 9, Migration 0010
  supabase/migrations/0013_ai_integrations.sql — Section 9, Migration 0011
  supabase/migrations/0014_rls_policies.sql    — ALL RLS policies (Section 10)
  supabase/migrations/0015_analytics_views.sql — views + functions (Section 18)
  supabase/seed.sql                            — demo data (Section 19)

packages/validators/src/: zod schemas for createOrder, createOrderItem,
  updateOrderStatus, createMenuItem, createMenuCategory, createPayment

Write RLS isolation test in packages/db/src/__tests__/rls-isolation.test.ts:
  - Sign in as restaurant A owner, query orders → assert 0 rows from restaurant B
  - Sign in as super_admin → assert all rows visible

Run: supabase db push && supabase db seed
```

---

### TASK 3 — Admin app (super-admin panel)
```
Task: Build the full Admin app (apps/admin) — this is your control panel.

Design: Follow Section 11.10 (dark sidebar #1c1917, white content, Poppins headings)
Use @dinenovaai/ui components. Apply framer-motion fadeIn on page transitions.

Pages and features:

/login
  - Email + password login
  - TOTP MFA setup page (Supabase Auth MFA)
  - Only accessible to super_admin role; redirect others

/dashboard
  - StatCards: MRR (₹), ARR (₹), Active Restaurants, Active Subscriptions, Total Orders (MTD)
  - MRR over time: LineChart (recharts, brand orange line)
  - Plan distribution: DonutChart (Starter/Operations/AI Pro/Enterprise with brand colours)
  - Churn %, New restaurants this month

/restaurants
  - DataTable: name, plan badge, status badge, MRR, city, joined date, last active
  - Plan badge colours: Starter=neutral, Operations=blue-600, AI Pro=purple-600, Enterprise=brand-500
  - Status badges: active=success, trialing=info, past_due=warning, suspended=error
  - Search + filter by plan/status
  - Row action menu: View | Suspend | Override Plan | Impersonate

/restaurants/new
  - Form: org name, restaurant name, slug (auto-slug from name, editable), owner email, owner phone,
          GSTIN, FSSAI number, city, state, plan selection (cards), trial days (default 14)
  - Server action: create org → restaurant → branch (name="Main Branch") →
                   invite/create auth user → membership(role=owner) → subscription(status=trialing)
  - Write audit_log on creation

/restaurants/[id]
  - Tabs: Overview | Subscriptions | Invoices | Staff | Audit Log
  - Suspend toggle (sets is_active=false, shows warning modal)
  - Override Plan button → modal: select plan, reason (required), confirm → update subscription + audit_log
  - Impersonate button → RED warning modal: "All actions are audited. Enter reason." → logs + redirects
    Show sticky orange banner while impersonating: "Viewing as [Restaurant Name] — Exit Impersonation"

/plans
  - List plans with feature/limit JSON editors (jsoneditor or Monaco)
  - Add/edit plan

All server actions use SUPABASE_SERVICE_ROLE_KEY (createServiceClient from @dinenovaai/db).
Route guard: middleware.ts verifies JWT role === 'super_admin', else redirect to /login.
```

---

### TASK 4 — Owner app: auth + menu management
```
Task: Build the Owner app auth layer and menu management module.

Design: Follow Section 11.9 (white sidebar #ffffff bg, brand orange accents, Poppins h1-h3)

Auth:
  - /login: phone OTP (Supabase phone auth) or email/password
  - Middleware: verify role in ['owner','manager'], redirect to /login if not
  - Store active restaurant_id in session cookie (from JWT claims)

/dashboard (skeleton for now — real data in Task 9):
  - 4 StatCards: Today Revenue, Orders, Avg Ticket, Active Tables
  - Last 7 days BarChart (placeholder with dummy data)
  - Recent orders list (realtime — placeholder)
  Apply framer-motion staggerChildren on StatCard entrance

/menu/categories:
  - Category list with drag-to-reorder (Dnd Kit or react-beautiful-dnd)
  - Each row: image thumbnail, name, item count, active toggle switch, edit/delete
  - "+ Add Category" button top right

/menu/categories/new and /menu/categories/[id]:
  - Name, image upload (drag-drop zone with preview), active toggle, sort_order

/menu/items (page per category, or filterable grid):
  - Item cards: 16:9 image, veg/non-veg indicator dot, name, price (₹), availability toggle
  - Fast availability toggle (optimistic UI, server action background)
  - "+ Add Item" button

/menu/items/new and /menu/items/[id]:
  - Tabs: Basic | Translations | Modifiers
  - Basic: name, description, category select, price (₹ input → stored as paise), is_veg (3-way: Veg/Non-Veg/N/A),
           HSN/SAC code, GST rate (0/5/12/18/28% — radio buttons), sort_order, availability toggle
  - Image: drag-drop upload zone → Supabase Storage bucket 'menu-images/{restaurant_id}/'
           Show crop preview, upload on save, store CDN URL
  - Translations tab: 3 sub-tabs (EN/BN/HI), name + description fields each
  - Modifiers tab: multi-select from modifier groups, create new inline

/menu/modifiers:
  - Modifier group list, create/edit/delete
  - Each group: name, required toggle, min/max select, options list with price deltas

All inputs validated with zod from @dinenovaai/validators.
All money: display ₹ in inputs, store paise in DB.
```

---

### TASK 5 — Owner app: tables + QR generation
```
Task: Build table management + QR generation in the Owner app.

/tables:
  - Area-grouped table grid (tabs per area or accordion)
  - Table card: label (large), capacity, QR preview (small), active toggle, edit/delete/QR actions

/tables page has two modes:
  1. List view (default): sortable table with all tables
  2. Visual map: drag-to-position grid (optional, Phase 2)

Add/Edit table form:
  - Label (e.g. "T1", "Rooftop 3"), capacity, area (text input with autocomplete from existing areas), is_active
  - On create: generate qr_code = nanoid(8), check uniqueness in dining_tables before insert

QR actions per table:
  - "View QR" → modal with large QR code (react-qr-code)
    URL encoded: https://order.dinenovaai.com/r/{restaurant.slug}/t/{table.qr_code}
    Below QR: restaurant name + table label in caption
  - "Download PNG" button → renders QR to canvas (html2canvas), downloads as "{label}.png"
  - "Print All QRs" → opens /tables/print in new tab:
    Grid of all QR codes (3 per row), each with label, for browser print
    CSS: @media print { body { margin: 0; } .qr-card { page-break-inside: avoid; } }

Slug note: restaurant.slug is read from the membership's restaurant (fetch once in layout).
```

---

### TASK 6 — Customer app (full QR ordering PWA)
```
Task: Build the complete Customer app as a mobile-first PWA.

Design: Follow Section 11.6. Warm, food-photography-friendly. No login wall for browsing.

PWA setup:
  - next.config.ts: configure next-pwa with runtimeCaching for menu pages
  - manifest.json: name="DineNova Order", theme_color="#f97316", icons at 192/512px
  - Service worker: cache GET /r/[slug]/menu and images (stale-while-revalidate)
  - Offline screen: "Menu is cached — tap items to browse. Ordering needs internet."

/r/[slug]/t/[tableCode]:
  1. Server: validate restaurant by slug (is_active=true), validate table by qr_code
  2. Server: get or create table_session for this table (upsert with status=open)
  3. Client: render menu layout

  Sticky header:
  - Restaurant logo (if set) + name (Poppins 600)
  - Language selector: EN | বাং | हिं (pill group)
  - Cart icon with badge (item count, brand orange)

  Category strip:
  - Horizontal scroll, pill tabs, active = bg-brand-500 text-white
  - Smooth scroll to category section on tab click

  Menu sections (one per category):
  - Section heading (Poppins 600)
  - Item cards (2-col mobile, 3-col tablet):
    - next/image 16:9, blur placeholder, lazy loaded
    - Veg indicator: solid circle (green=veg, red=non-veg) top-left overlay
    - Name (Inter 500), description (Inter grey, 2 lines max with truncate)
    - Price (Poppins 600 brand-600)
    - Add button: if qty=0 → "Add" pill (brand-500); if qty>0 → "-  N  +" counter (44px min)
    - Unavailable: greyed image, "Sold Out" badge, add disabled

  Modifier selection bottom sheet (framer-motion slideUpFull):
  - Item image header
  - Modifier groups with checkboxes/radio
  - Notes input
  - Total price (updates live)
  - "Add to Cart" CTA (green, full width, 56px)

  CartBar (fixed bottom, show when cart.items.length > 0, animate bounceIn):
  - "X items" | "₹XXX" | "View Cart →" (brand-500 bg)

/r/[slug]/t/[tableCode]/cart:
  - BottomSheet or full page with item list
  - Qty controls, remove, notes per item
  - Coupon code input → server action validates coupon
  - Order summary: subtotal, discount (if coupon), tax (collapsible breakdown), total
  - "Place Order" CTA → server action → insert order + order_items + kot → redirect to /track

/r/[slug]/t/[tableCode]/track:
  - Vertical progress stepper: Placed ✓ → In Kitchen → Ready → Served
  - Live via subscribeToOrderStatus (Section 16)
  - Realtime status updates with framer-motion step animations
  - Item chips with status

/r/[slug]/t/[tableCode]/bill:
  - GST invoice layout: restaurant details, item rows, CGST/SGST breakdown, total
  - "Pay ₹XXX with UPI" primary CTA → createRazorpayOrder → open Razorpay Checkout
  - Cash option → show "Ask your waiter to settle"
  - "Download Bill PDF" → link to bills.pdf_url

Auth: anonymous Supabase session for basic flow. "Save your order history" CTA → phone OTP.
```

---

### TASK 7 — Kitchen app (KDS PWA)
```
Task: Build the Kitchen Display System app as a tablet-optimized PWA.

Design: Follow Section 11.8. High contrast, readable at distance. No decorative elements.

Auth:
  - Phone OTP, verify role in ['chef','manager','owner']

/ (KOT queue):
  - Fetch open kots (status != 'cancelled') with order_items
  - Sort: oldest placed_at first
  - Real-time: subscribeToKOTs(restaurantId, handler) — new KOTs slide in from top (kotCard animation)

  Top bar:
  - "Kitchen Display" heading
  - Station filter: "All" + each unique station value (pill group)
  - Sound toggle (🔔/🔕 icon button)
  - Active order count badge (live)

  KOT card:
  - Header: #order_number (Poppins 700 28px) + table label chip + time elapsed badge
    Time elapsed: green bg <10min, amber 10-15min, red >15min — recalculates every 60s
  - Items:
    Each item row: qty bubble (rounded, brand-orange bg) + name (Inter 500 18px)
    Modifier chips: small grey pills below name
    Status chip (right side): tap to advance
      queued → tap → cooking (amber badge)
      cooking → tap → ready (green badge)
  - When ALL items on KOT are ready:
    Card bg turns light green, "✓ All Ready" banner appears
    "Mark Done" button (full width, green, 56px) — advances order status to 'ready'
  - Card footer: station label (if set)

New order alert:
  - Audible beep: Web Audio API (request permission on first user interaction)
    Show "Tap anywhere to enable sound" overlay on first load
  - Visual: full-screen orange flash (300ms) + new card bounces in from top

"Mark out of stock" (long-press or hold button on item):
  - Confirmation toast: "Mark [Item Name] as unavailable?"
  - On confirm: server action sets menu_items.is_available = false
    Also: show "Out of Stock" badge on that item in future KOTs

PWA offline:
  - Service worker queues item status updates (IndexedDB via idb)
  - On reconnect: flush queue in order
  - Show offline banner when navigator.onLine = false
```

---

### TASK 8 — Waiter app (PWA)
```
Task: Build the Waiter app as a phone-optimized PWA.

Design: Follow Section 11.7. Dense, one-handed, fast.

Auth: Phone OTP, verify role in ['waiter','cashier','manager','owner']

/ (table map):
  - Grid of table cards (3-4 cols on phone)
  - Card colours per status (Section 11.2 status tokens)
  - Table card: label (Poppins 700 22px), area text, guest count, time open (if occupied)
  - "Bill Requested" cards: gentle pulse animation
  - Real-time: subscribeToTableSessions updates card status live
  - FAB bottom-right: "+ Takeaway" (brand-orange, 56px circle)
  - Filter bar: All | Occupied | Bill Requested | Free (ScrollArea, pill chips)

/t/[sessionId]:
  - Header: table label + time open + guest count + "Close" back button
  - Tabs: Orders | Bill | Actions
  - Orders tab: list of all orders in session
    Each order card: order number, waiter name chip, items with status, total
    Item status chips are read-only here (chef updates them in Kitchen app)
    "Add Items" sticky bottom button → opens item picker sheet (same UI as customer app)
    Item notes: tap item → inline text input
  - Bill tab: live bill preview (computed from all orders)
    Payment method: UPI | Cash | Card (pill buttons)
    Split Bill toggle → split builder sheet
    "Settle ₹XXX" CTA
  - Actions tab: Transfer Table | Merge Tables (each opens a selection sheet)

Transfer Table sheet:
  - List of free tables (green) + their capacity
  - Tap to select → confirm → server action updates table_session.table_id

Merge Tables sheet:
  - List of other occupied sessions
  - Select session to merge INTO → confirm → server action reassigns all orders from current session

Split Bill sheet:
  - Toggle: "By items" | "Equal share"
  - By items: drag items to assign to each payer (or checkboxes)
  - Equal share: enter number of payers → auto-split total
  - Create bill_splits → each can be settled separately

/orders/new (takeaway):
  - Same item picker + cart as customer app, but for takeaway (no session, no table)
  - Customer name + phone (optional)
```

---

### TASK 9 — Payments + GST invoice + owner analytics
```
Task: Wire up payments, GST invoice generation, and real owner analytics.

1. packages/utils/src/gst.ts — exact code from Section 12.3
   Write unit tests:
   - gstInclusive(11800, 18): subtotal=10000, cgst=900, sgst=900, total=11800
   - gstInclusive(10500, 5): subtotal=10000, cgst=250, sgst=250, total=10500
   - invoiceNumber(42, new Date('2025-06-01')): 'DN/2025-26/0042'

2. supabase/functions/razorpay-webhook/ — exact code from Section 13
   Include HMAC-SHA256 signature verification, idempotency, stock deduction call,
   subscription event handling.

3. packages/integrations/src/razorpay.ts — createRazorpayOrder server action:
   Input: { amount_paise, order_id, restaurant_id }
   → Razorpay SDK: Razorpay.orders.create({ amount, currency: 'INR', receipt: order_id })
   → Insert payments row (status='created', razorpay_order_id, order_id)
   → Return { razorpay_order_id, amount, key_id: RAZORPAY_KEY_ID }

4. Bill PDF generation (triggered on payment.captured webhook):
   Using @react-pdf/renderer, render a PDF with:
   - DineNova branding header (restaurant name, address, GSTIN, FSSAI number)
   - Invoice number (invoiceNumber() from gst.ts, sequential from settings table counter)
   - Date + time (IST)
   - Itemized table: Item | Qty | Rate (₹) | HSN/SAC | GST% | Amount (₹)
   - Subtotals + CGST + SGST + Service Charge (if enabled) + Total
   - Footer: "Service charge is at the discretion of the customer. FSSAI: [number]"
   - Upload PDF to Supabase Storage: 'invoices/{restaurant_id}/{invoice_number}.pdf'
   - Store URL in bills.pdf_url

5. Owner app /dashboard — replace placeholders with real data:
   - Fetch from daily_revenue view for today + yesterday + last 7 days
   - StatCard deltas: today vs yesterday (green if +, red if -)
   - Revenue chart: last 30 days from daily_revenue, BarChart with framer-motion bar entrance
   - Top items: from top_menu_items view, styled as ranked list with medal icons
   - Live orders feed: realtime subscribeToTableSessions, show open sessions with order count + total

Apply framer-motion staggerChildren on every list render.
```

---

### TASK 10 — SaaS plan gating + billing UI
```
Task: Implement subscription enforcement and billing UI.

1. packages/auth/src/entitlements.ts — exact code from Section 15
2. Apply can() check in every server action that touches a gated feature:
   - inventory, suppliers, staff, expenses → check 'inventory'
   - /ai routes → check 'ai_assistant'
   - /marketing routes → check 'whatsapp_marketing'
   - multi_branch → check 'multi_branch'
   Return { success:false, error:'Upgrade to Operations plan', code:'FEATURE_GATED' }

3. UI gating: every gated route checks can() in the Server Component.
   If false: render <UpgradePrompt feature="..." currentPlan="..." /> instead of the page.
   UpgradePrompt: illustration, feature name, what plan unlocks it, "Upgrade Now" CTA.

4. Owner app /settings/billing:
   - Current plan card: name, price, features list with checkmarks, next billing date
   - Usage bars: staff (X/max), branches (X/max), menu items (X/max)
   - "Upgrade Plan" CTA → /settings/billing/upgrade

5. /settings/billing/upgrade:
   - Plan comparison table (3 cols: Operations / AI Pro / Enterprise)
   - Feature rows with ✓/— per plan
   - "Choose [Plan]" button → server action:
     → Razorpay Subscriptions.create({ plan_id: razorpay_plan_id, ... })
     → Insert/update subscriptions row (status='trialing' until first payment)
     → Update subscriptions.razorpay_subscription_id
     → Redirect to Razorpay hosted page or use Razorpay Checkout

6. /settings/billing/invoices:
   - Invoice list: date, amount (₹), status badge, "Download PDF" link
   - Fetch from invoices table

7. Dunning: if subscriptions.status = 'past_due':
   - Show PastDueBanner at top of owner app: "Payment failed. Update payment to restore access."
   - After grace period (7 days): set gated features to blocked (can() returns false for paid features)
```

---

### TASK 11 — Operations: inventory + staff + expenses
```
Task: Build the full Phase 2 Operations module in the Owner app.

Gate all routes: check can(supabase, restaurant_id, 'inventory') first. Show UpgradePrompt if false.

/inventory:
  - Stock table: item name, unit, current qty, reorder level, expiry date, cost/unit, status
  - Status: Low Stock (red badge, current_qty ≤ reorder_level), Expiring Soon (amber, expiry within 7 days), OK (green)
  - "+ Add Item" → form: name, unit, reorder level, expiry date, cost per unit
  - "Add Stock Movement" → modal: item, change qty, reason (purchase/adjustment/wastage), note
  - Stock movements history per item (collapsible)
  - "Link Recipes" tab: for each menu item, set ingredient quantities (creates recipe + recipe_ingredients)

/suppliers:
  - Supplier list with contact details, products list
  - CRUD: name, contact name, phone, email, products (tag input)
  - Per supplier: purchase order history

/suppliers/[id]/orders/new:
  - PO form: line items (inventory item + qty + unit price), notes
  - "Send PO" → status=sent, record ordered_at
  - "Mark Received" per line item → updates received_qty + inserts stock_movements (reason=purchase)
    Full receipt: status=received, record received_at

/staff:
  - Employee list: name, role badge, salary, join date
  - CRUD: name, role (select from role enum), phone, salary (₹ input → paise), salary_type, join_date
  - Link to Supabase auth user (optional — invite by email/phone)

/staff/[id]/attendance:
  - Calendar view (month), daily attendance entry (present/absent/half_day/leave)
  - Clock in/out times

/expenses:
  - Entry form: category (dropdown), amount (₹), date, note, receipt upload (Storage)
  - Monthly expense summary by category (PieChart, recharts)
  - Real Profit = Revenue − COGS (from stock_movements sale reason) − Expenses (this month)
  - Real Profit card at top with ₹ amount and vs last month delta

All deletions: soft delete (deleted_at = now()), not hard delete.
All UI: follow design system Section 11.9 (owner app spec).
```

---

### TASK 12 — AI layer
```
Task: Build the Phase 3 AI module.

Gate: check can(supabase, restaurant_id, 'ai_assistant') → UpgradePrompt if false.

PRIVACY RULE (non-negotiable): Never send customer names, phones, or any PII to the AI.
Only aggregated, de-identified metrics. Enforce in supabase/functions/ai-assistant/.

1. supabase/functions/ai-assistant/ — exact code from Section 14
   - Rate limit: 20 calls/restaurant/day (check ai_reports count)
   - Fetch metrics via get_restaurant_metrics() SQL function (Section 18)
   - Use Gemini 2.5 Flash (GEMINI_API_KEY)
   - Cache result to ai_reports table

2. supabase/functions/ai-forecast/ (Supabase scheduled function, runs 01:00 IST daily):
   - For each active restaurant: compute 7-day per-item moving average by day-of-week (last 8 weeks)
   - Write predictions to forecasts table (method='moving_avg_dow')
   - If recipe data exists: compute ingredient quantities for each predicted order day
   - Write to forecasts with target='ingredient:{inventory_item_id}'
   - STATS compute the numbers; LLM only narrates

3. Menu engineering (pure SQL, no AI for numbers):
   - Query: for each menu_item in last 30 days: order_count + total_revenue + margin (from recipe cost)
   - Classify into quadrants:
     Stars:       above-avg volume AND above-avg margin
     Plowhorses:  above-avg volume, below-avg margin
     Puzzles:     below-avg volume, above-avg margin
     Dogs:        below-avg volume AND below-avg margin
   - Store result in ai_reports (type='menu_engineering', period=last 30 days)
   - LLM generates action text per quadrant (call Gemini once, pass quadrant summary)

4. Anomaly flags (rules-based, no LLM for detection):
   - Void rate per staff > 15% in 7 days → flag
   - Inventory variance > 20% (stock movements vs expected from sales) → flag
   - Cash payment > 50% in one shift → flag
   - Store in ai_reports (type='anomaly')
   - Display as "Review recommended" — never "confirmed fraud"

5. Owner app /ai:
   - Chat interface: text input + send, message bubbles (user=right, AI=left, brand colours)
     Loading: typing indicator (3 animated dots)
     Calls ai-assistant edge function (via fetch to Supabase functions URL with user JWT)
   - /ai/forecast tab:
     7-day revenue forecast chart (AreaChart, recharts, with confidence band as light orange fill)
     Ingredient shopping list table: item | predicted qty | unit
     "How was this calculated?" collapsible explanation (from LLM narration)
   - /ai/menu tab:
     2×2 quadrant chart (scatter plot, recharts, with quadrant labels)
     Item list grouped by quadrant with recommended action text
   - /ai/alerts tab:
     Alert cards per flag: type, description, "Review recommended" badge, date
     Each card: link to relevant section (order history, inventory, etc.)

All AI UI: show "Powered by AI — estimates only" disclaimer. Loading skeletons during fetch.
```

---

### TASK 13 — Marketing engine
```
Task: Build the Phase 4 Marketing module.

Gate: check can(supabase, restaurant_id, 'whatsapp_marketing') → UpgradePrompt if false.

1. packages/integrations/src/whatsapp.ts — exact code from Section 20
   CONSENT RULE: always verify consent_marketing=true before marketing send. Throw if false.

2. supabase/functions/whatsapp-webhook/:
   - GET: verify Meta hub.verify_token → return hub.challenge
   - POST: verify X-Hub-Signature-256 (HMAC-SHA256 with WHATSAPP_APP_SECRET)
   - Update message_logs.status on delivery/read status events
   - Idempotent: check webhook_events before processing

3. Owner app /customers:
   - Customer list: name, phone (masked *****43), total orders, total spent (₹), consent badge, last order date
   - Consent-only filter (show who can receive marketing)
   - Import customers (CSV upload: name, phone)

4. Owner app /marketing/campaigns:
   - Campaign list: name, status badge, sent count, cost (₹), date
   - Status: draft | scheduled | sending | sent | failed
   - "+ New Campaign" → campaign builder:
     Step 1: Name + template name (pre-approved WhatsApp template)
     Step 2: Audience filter (All consented | Repeat customers (>2 orders) | VIP (>₹5k total))
     Step 3: Schedule (send now or pick date/time)
     Preview: "This will send to ~N customers. Estimated cost: ₹X.XX"
     (Cost = eligible_count × rate, where marketing rate from Section 20 comments)
   - "Launch" CTA → server action: insert marketing_campaign, queue sending via edge function

5. Owner app /marketing/loyalty:
   - Config: X spend = Y points, Z points = ₹W discount (store in settings table)
   - Leaderboard: top 10 customers by points balance
   - Customer detail: points history (from loyalty_points.ledger), manual adjust (audited)

6. Owner app /marketing/coupons:
   - Coupon list: code, type, value, uses (X/max), valid dates, active toggle
   - CRUD: code (auto-generate or manual), type (flat ₹/percent %), value, min order, expiry, usage limit
   - Customer-side: coupon code input in cart validates via server action
     → check: active, not expired, under usage limit, min order met
     → apply discount_paise to order

7. Owner app /marketing/content (AI content generator):
   - Form: content type (WhatsApp Message / Instagram Caption / Facebook Post)
          occasion (Festival offer / New item launch / Weekend special / Custom)
          offer details (text input)
          language (EN / BN / HI)
   - "Generate" → calls ai-assistant with a content-generation prompt
   - Output: draft text in styled card with "Copy" button
   - "Regenerate" button for another variation
```

---

### TASK 14 — Enterprise + Swiggy/Zomato integration
```
Task: Build Phase 5 — multi-branch + aggregator integration.

Gate: multi_branch features → can(supabase, id, 'multi_branch')
      aggregator integration → can(supabase, id, 'aggregator_integration')

1. Multi-branch:
   - Owner app nav: branch switcher dropdown (store active branch_id in cookie)
   - /branches: CRUD for branches
   - /dashboard: "All Branches" consolidated view + per-branch breakdown tabs
   - RLS: branch-scoped views use branch_id filter where applicable

2. Franchise controls (Enterprise):
   - /franchise/menu: lock/unlock menu items per branch (override allowed/not from HQ)
   - /franchise/pricing: set pricing rules per branch (multipliers or flat overrides)

3. packages/integrations/src/channel.ts — channel abstraction (see original spec Section 16):
   - InboundOrder interface
   - mapExternalOrder() function: external_orders → orders + order_items via menu_item_mappings

4. supabase/functions/aggregator-inbound/:
   - Accept POST from UrbanPiper/Petpooja webhook
   - Verify provider-specific signature
   - Insert into external_orders (raw payload preserved)
   - Call mapExternalOrder(): resolve each external_item_id via menu_item_mappings
   - If all mapped: create order + order_items + kot (same pipeline as dine-in)
   - If any unmapped: status='pending', notify owner to map items

5. Owner app /settings/integrations:
   - Connect UrbanPiper or Petpooja:
     API key input → test connection → store encrypted in integrations.credentials
     (encrypt with AES-256-GCM, key from INTEGRATION_CREDS_ENCRYPTION_KEY env)
   - Menu sync: "Push Full Menu" button → edge function pushes menu_items to provider
   - Item mapping UI:
     Table: External item name (from provider) | Your item (dropdown select from menu_items)
     "Auto-match by name" button (fuzzy match, 80%+ similarity → auto-map, else manual)
     Save → insert/update menu_item_mappings
   - Integration health: last sync timestamp, error log (last 10 errors), status badge
   - Stock-out sync: toggling is_available=false in kitchen → push to provider (edge function)

Direct Swiggy/Zomato POS API (for later):
   - Same providers as UrbanPiper/Petpooja — add new provider values to channel_type enum
   - Same mapExternalOrder() pipeline — no new code, just new credentials per provider

Update PROGRESS.md.
```

---

## SECTION 22 — GLOSSARY

| Term | Definition |
|---|---|
| **Tenant** | One restaurant account. All data isolated by `restaurant_id` + RLS. |
| **Super Admin** | You (platform operator). `role='super_admin'`. No restaurant restriction in JWT. |
| **Owner** | Restaurant's admin user. `role='owner'`. Scoped to their restaurant. |
| **Session** | `table_sessions` — groups all orders at a table until the bill settles. Enables split/merge. |
| **KOT** | Kitchen Order Ticket — what the kitchen cooks from. |
| **Channel** | Order source: dine_in / takeaway / own_web / swiggy / zomato. All one pipeline. |
| **Paise** | 1 ₹ = 100 paise. All money = `bigint` paise. NEVER floats. |
| **Entitlement** | Feature unlocked by plan. Checked server-side via `can()` before every gated action. |
| **IST** | Asia/Kolkata. Store UTC in DB (`timestamptz`), display IST. |
| **KDS** | Kitchen Display System — the Kitchen app on a tablet. |

---

## SECTION 23 — REVENUE PROJECTION

| Year | Restaurants | Avg ₹/month | MRR | ARR |
|---|---|---|---|---|
| 1 | 50 | ₹2,000 | ₹1,00,000 | ₹12,00,000 |
| 2 | 300 | ₹2,500 | ₹7,50,000 | ₹90,00,000 |
| 3 | 1,000 | ₹3,000 | ₹30,00,000 | ₹3.6 Cr/yr |

Track in admin dashboard: MRR, ARR, monthly churn %, CAC, infra cost per restaurant, WhatsApp cost per restaurant.

---

*END OF SPEC — DineNova AI — dinenovaai.com — June 2026*
*Build order: Section 21. Security: Sections 10 + 17. Money: always paise. UI: always Section 11.*
