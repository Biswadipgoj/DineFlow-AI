# DineNova AI — Build Progress

## TASK 0 — Monorepo Scaffold ✅ (2026-06-11)

Built complete Turborepo + pnpm monorepo from spec. All 8 shared packages and 5 Next.js 15 apps scaffolded.

**Packages created:**
- `@dinenovaai/config` — tsconfig base, ESLint config, Tailwind preset with full brand palette
- `@dinenovaai/utils` — money (paise), dates (IST), GST math helpers
- `@dinenovaai/db` — Supabase client/server/service wrappers, realtime subscriptions, TypeScript types
- `@dinenovaai/auth` — role constants, entitlements `can()` checker
- `@dinenovaai/validators` — Zod schemas for tenancy, menu, orders
- `@dinenovaai/ai` — Gemini client wrapper
- `@dinenovaai/integrations` — Razorpay order creation, WhatsApp message sending (with consent gate)
- `@dinenovaai/ui` — full design system: theme colors, fonts (Inter/Poppins), animations, 10 components

**Root files:** package.json, pnpm-workspace.yaml, turbo.json, .env.example, .gitignore

**GitHub Actions:** keepalive.yml (daily Supabase ping), ci.yml (build/typecheck/lint on push)

## TASK 1 & 2 — Database (All Migrations) ✅ (2026-06-11)

All 15 SQL migrations created at `supabase/migrations/`:

| File | Content |
|---|---|
| 0001_enums.sql | 13 Postgres enums |
| 0002_tenancy.sql | organizations, restaurants, branches, users, memberships, settings, audit_logs |
| 0003_rls_helpers.sql | auth.restaurant_id(), auth.user_role(), auth.is_super_admin() |
| 0004_auth_hook.sql | custom_jwt_claims() function for JWT enrichment |
| 0005_billing.sql | plans (with seed data), subscriptions, invoices |
| 0006_menu.sql | menu_categories, menu_items, translations, modifier_groups/options |
| 0007_tables_sessions.sql | dining_tables, table_sessions (unique index for 1 open session/table) |
| 0008_orders.sql | orders, order_items, order_status_history, kots |
| 0009_payments.sql | payments, refunds, bills, bill_splits |
| 0010_inventory.sql | inventory_items, recipes, recipe_ingredients, stock_movements, suppliers, purchase_orders |
| 0011_staff_expenses.sql | employees, shifts, attendance, expenses |
| 0012_customers_marketing.sql | customers (PII-safe), loyalty_points, coupons, marketing_campaigns, message_logs |
| 0013_ai_integrations.sql | ai_reports, forecasts, integrations, external_orders, webhook_events, devices |
| 0014_rls_policies.sql | RLS enabled + policies for all 35+ tables |
| 0015_analytics_views.sql | daily_revenue view, top_menu_items view, get_restaurant_metrics(), deduct_inventory_for_order() |

**Seed data:** Demo org, "Spice Garden" restaurant, 1 branch, 5 tables, 3 categories, 5 menu items, MVP trial subscription.

## TASK 3 — Admin App ✅ (2026-06-11)

Built `apps/admin` (Next.js 15):
- Dark sidebar (`#1c1917`) layout + white content area
- Login page (super_admin only)
- Dashboard with MRR, ARR, restaurant counts
- Restaurants list with plan badges, status badges, and View links
- Middleware: enforces `role === 'super_admin'`

## TASK 4 — Owner App (Auth + Menu + Dashboard) ✅ (2026-06-11)

Built `apps/owner` (Next.js 15):
- White sidebar with brand orange accents
- Login page (owner/manager roles)
- Dashboard with StatCards (live data from `get_restaurant_metrics()`)
- Revenue BarChart (recharts) + Live Orders Feed
- Menu management: category list, item grid
- Tables page: grid with QR code actions
- Middleware: enforces `role in ['owner','manager']`

## TASK 6 — Customer App (QR Ordering PWA) ✅ (2026-06-11)

Built `apps/customer` (Next.js 15 + PWA):
- Menu page at `/r/[slug]/t/[tableCode]` — validates restaurant + table from DB
- Category tab strip (horizontal scroll, brand orange active state)
- 2-column item grid with veg/non-veg indicator, add/qty counter
- Zustand cart store (persisted to localStorage)
- CartBar (fixed bottom, bounceIn animation when items > 0)
- Cart page with GST breakdown, Place Order CTA
- `next-pwa` configured with menu caching

## TASK 7 — Kitchen App (KDS PWA) ✅ (2026-06-11)

Built `apps/kitchen` (Next.js 15 + PWA):
- KOT queue with `kotCard` slide-in animation
- Time elapsed badge (green/amber/red)
- Item status tap-to-advance (queued → cooking → ready)
- All-ready state (green card bg + "Mark Done" button)
- Station filter pill group
- Sound toggle (UI wired, Web Audio API hook point)
- `next-pwa` configured

## TASK 8 — Waiter App (PWA) ✅ (2026-06-11)

Built `apps/waiter` (Next.js 15 + PWA):
- Table map grid with status-coloured cards
- Bill Requested pulse animation
- Filter bar (All/Occupied/Bill Requested/Free)
- FAB for Takeaway orders
- `next-pwa` configured

## SUPABASE EDGE FUNCTIONS ✅ (2026-06-11)

- `razorpay-webhook/` — HMAC-SHA256 signature verify, idempotency check, payment.captured handler, subscription events, inventory deduction RPC call
- `ai-assistant/` — rate-limited (20/day), aggregated metrics only (no PII), Gemini 2.5 Flash, stores to ai_reports
- `whatsapp-webhook/` — GET verify token + POST X-Hub-Signature-256 verify, idempotency

## REMAINING TASKS

- [ ] TASK 9 — Payments (Razorpay Checkout wiring + PDF invoice generation)
- [ ] TASK 10 — SaaS plan gating + billing UI
- [ ] TASK 11 — Operations: Inventory + Staff + Expenses UI
- [ ] TASK 12 — AI module (chat UI, forecast charts, menu engineering quadrant)
- [ ] TASK 13 — Marketing engine (WhatsApp campaigns, loyalty, coupons)
- [ ] TASK 14 — Enterprise (multi-branch, aggregator integrations)
- [ ] RLS isolation test suite
- [ ] GST unit tests
