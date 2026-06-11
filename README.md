# DineNova AI

**Restaurant management SaaS — "Shopify + AI Copilot for Restaurants"**

Multi-tenant B2B SaaS for Indian restaurants. 5 apps, 1 Supabase database, RLS-enforced tenant isolation.

## Apps

| App | Port | URL | Description |
|-----|------|-----|-------------|
| Customer | 3001 | `order.dinenovaai.com/r/{slug}/t/{tableCode}` | QR menu + ordering (PWA) |
| Waiter | 3002 | `waiter.dinenovaai.com` | Floor staff table map (PWA) |
| Kitchen | 3003 | `kitchen.dinenovaai.com` | KDS kitchen display (PWA) |
| Owner | 3004 | `owner.dinenovaai.com` | Restaurant dashboard |
| Admin | 3005 | `admin.dinenovaai.com` | Platform super-admin |

## Tech Stack

- **Framework**: Next.js 15 App Router + TypeScript
- **Monorepo**: Turborepo + pnpm workspaces
- **DB/Auth/Realtime**: Supabase (Postgres + RLS)
- **Payments**: Razorpay (UPI/card)
- **AI**: Google Gemini 2.5 Flash
- **Styling**: Tailwind CSS v3 + shadcn/ui + Framer Motion
- **PWA**: next-pwa for Customer, Waiter, Kitchen apps

## Money Rule

ALL money is stored as **integer paise** (1 ₹ = 100 paise). Never floats. All DB columns end in `_paise`.

## Quick Start

```bash
pnpm install
cp .env.example .env.local
# Fill in Supabase, Razorpay, Gemini keys

# Run all apps
pnpm dev

# Run single app
pnpm --filter @dinenovaai/owner dev
```

## Database

```bash
# Push migrations
supabase db push

# Seed demo data
supabase db seed
```

## Build Phases

| Phase | Plan | Price | Features |
|-------|------|-------|---------|
| 1 MVP | Starter | ₹999/mo | QR ordering, KDS, digital bill, UPI |
| 2 Operations | Operations | ₹2,999/mo | Inventory, staff, expenses, real profit |
| 3 AI | AI Pro | ₹5,999/mo | AI assistant, forecasts, menu engineering |
| 4 Marketing | AI Pro | bundled | WhatsApp campaigns, loyalty, coupons |
| 5 Enterprise | Custom | custom | Multi-branch, Swiggy/Zomato integration |

## Docs

- `docs/SPEC.md` — complete build specification
- `docs/PROGRESS.md` — task completion log
