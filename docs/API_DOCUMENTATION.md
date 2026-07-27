# 🛠️ SmartServe — API & Server Function Documentation

This document details the internal API architecture, Supabase integration, and server-side functions (TanStack Start) that power the SmartServe OS.

---

## 1. Authentication Layer
**Service**: `auth.service.ts`

| Method | Purpose | Input |
|--------|---------|-------|
| `signIn` | Email/Password login | `email, password` |
| `signUp` | New account registration | `email, password, role` |
| `signInWithGoogle` | OAuth2 Integration | - |
| `getProfile` | Fetch RBAC profile data | `userId` |

---

## 2. Order Management
**Service**: `order.service.ts`

| Method | Purpose | Real-time? |
|--------|---------|------------|
| `createOrder` | Persist cart to DB | Yes (Broadcast) |
| `updateStatus` | State machine transitions | Yes (Pub/Sub) |
| `loadOrders` | Fetch branch order history | No |
| `subscribe` | Listen for new orders | Yes |

---

## 3. AI Copilot Integration
**Service**: `ai.service.ts`
**Endpoint**: `/api/copilot` (Server Function)

### Copilot Context Injection
Every AI request injects the following real-time context:
1. **Menu**: Current availability and item list.
2. **Orders**: Active kitchen queue status.
3. **Tables**: Occupancy and reservation status.
4. **Roles**: Custom system prompts for Sommelier, Ops, Manager, or Advisor.

---

## 4. Real-time Pub/Sub
**Service**: `realtime.service.ts`

SmartServe uses a **Hybrid Sync** model:
- **Supabase Realtime**: For cross-device synchronization (Customer phone -> Kitchen Tablet).
- **BroadcastChannel API**: For zero-latency cross-tab synchronization on the same device.

---

## 5. Database Procedures
**Schema**: `public`

### Key Tables
- `profiles`: RBAC and user metadata.
- `orders`: Core transaction ledger.
- `inventory_items`: Stock tracking and thresholds.
- `reservations`: Table booking management.

---

## 🚀 Developer Usage
To run the project locally and interact with these APIs:
1. Copy `.env.local.example` to `.env.local`.
2. Provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Provide `GEMINI_API_KEY` for AI features.
4. Run `bun install && bun dev`.
