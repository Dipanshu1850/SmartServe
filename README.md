# 🍽️ SmartServe

<p align="center">
  <strong>SmartServe</strong> is an AI-powered Restaurant Management System that streamlines restaurant operations by connecting customers, kitchen staff, and managers through a real-time order management platform.
</p>

---

# 👥 Team Information

### Team Name
**VibesForReal**

### Team Members

| Member | GitHub |
|--------|--------|
| 👑 **Dipanshu Dhiman** (Team Leader) | [![Dipanshu1850](https://img.shields.io/badge/Dipanshu1850-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Dipanshu1850) |
| **Komal Sharma** | [![Komal-Sharma07](https://img.shields.io/badge/Komal--Sharma07-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Komal-Sharma07) |
| **Jayant** | [![money-xr](https://img.shields.io/badge/money--xr-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/money-xr) |
| **Rahul Singh** | [![Rahul121466](https://img.shields.io/badge/Rahul121466-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Rahul121466) |

### Hackathon
**Vibeathon 6.0**

---

# 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- TanStack Start
- Tailwind CSS
- shadcn/ui

### Backend
- Supabase
- PostgreSQL

### Authentication
- Supabase Auth

### Deployment
- Vercel

---

# 📖 Technical Documentation
- 🏗️ [**Database Schema & ERD**](file:///Users/dipanshu/Desktop/order-wise-ops/docs/DATABASE_SCHEMA.md)
- 🚀 [**Strategic Roadmap & Moat**](file:///Users/dipanshu/Desktop/order-wise-ops/docs/STRATEGY.md)
- 💾 [**Supabase Initial Migration**](file:///Users/dipanshu/Desktop/order-wise-ops/supabase/migrations/20260727000000_initial_schema.sql)

---

# ✅ User Stories Completed

> Aligned with **VibeAthon 6.0** official ranking rubric (Bronze → Silver → Gold → Platinum).

---

## 🥉 BRONZE — User Story 1 · Modern & Intuitive User Experience

Delivered a fine-dining themed, accessible interface for both customers and restaurant management. Role-specific navigation is optimized for context (speed for kitchen staff, depth for managers, simplicity for customers).

- Polished dark fine-dining aesthetic with display typography & icon consistency
- Responsive layout across tablet/mobile/desktop
- Landing page with dashboard previews, role demo cards, platform features, AI capabilities, and tech stack showcase
- **Sandbox Demo Access** on the login page lets judges experience all 4 personas instantly without signup

---

## 🥈 SILVER — User Stories 2 & 3 · Authentication + Digital Operations

### 🔐 User Story 2 — Secure Authentication & RBAC

Powered by **Supabase Auth** with verified industry-standard flows:

- ✅ Email + Password authentication (with Supabase session management)
- ✅ Google OAuth single-sign on (with profile auto-creation on first login)
- ✅ Role-based access control (RBAC) with 4 roles: `customer`, `staff`, `manager`, `owner`
- 🛡️ **Security Note**: All new sign-ups (Email/Google) default to the `customer` role. Admin/Staff privileges are strictly managed by the Team Leader (**Dipanshu Dhiman**) via the database to prevent unauthorized access.
- ✅ `RequireRole` route guard redirects unauthenticated users to `/login` with a `next` param for post-login return, and redirects wrong-role users back to their default dashboard
- ✅ Granular permission matrix (`ROLE_PERMISSIONS`) with 18 capability flags covering view_menu through full_access
- ✅ Automatic profile creation on signup with user_metadata from Google
- ✅ Session-wide audit logging of logins via `AuditService`

### 🧾 User Story 3 — Digitized Core Restaurant Workflows

| Workflow | Implementation |
|----------|----------------|
| **Digital Menu** | Categorized menu (Starters / Mains / Desserts / Drinks) with prices, tags (Veg / GF / Spicy / 21+ etc.), descriptions, dietary hints, availability badges, and Chef's Choice highlights |
| **Live Item Availability** | Inventory-backed `available` count on every menu item; 0-count items render as **Unavailable / 86'd** and are filtered from AI recommendations |
| **Smart Reservations** | Reservation form with time slot + guest count + name/phone + `ReservationService` with live list management + confirmation state |
| **Order Management** | Customer cart → Submit order → Staff kanban → Status transitions (queued → preparing → ready → served) → Customer tracking pipeline + estimated minutes |
| **Queue Management** | Kanban-column kitchen queue with ticket cards, drag-style operations, table ID, ETAs, and ticket grouping by table |
| **Billing** | Order totals computed from item × qty × line prices; totals visible on customer tracking, staff kanban, and manager order rows |
| **Customer Notifications** | Sonner toast notifications + `useNotifications` hook + live dashboard badges (new order, 86'd item, table ready, reservation confirmation) |

---

## 🥇 GOLD — User Story 4 · Restaurant Management Dashboard

Delivered **two** management-level dashboards covering every example listed in the PS:

### 👨‍💼 Manager Dashboard — Daily Operations (`/manager`)
| Category | Capability |
|----------|------------|
| 🗒️ **Orders** | Live Orders Kanban with status columns, filter by table, totals, minutes-lapsed, ticket cards |
| 🍽️ **Tables** | Interactive 2D Table Map with seat count + status indicators (free / occupied / reserved / cleaning) |
| 📦 **Inventory** | Full Inventory Table with reorder-at thresholds, supplier data, AI-driven 86 detection |
| 👥 **Staff** | Staff Management panel with assignments, shift data & role info |
| 🧾 **Customers** | Customer engagement pane with reservation/order history by guest |
| 💰 **Sales** | Revenue by day + Top items by volume cards |
| 📊 **Analytics** | Revenue Bar Chart + Peak Hours histogram + BI metric tiles (Restaurant Health, Revenue Today, Active Orders, Reservations, Guest Satisfaction, Avg Wait Time) |

### 👑 Owner Dashboard — Fleet & Executive View (`/owner`)
| Category | Capability |
|----------|------------|
| 💰 **Revenue / Profit / Financials** | Branch MRR roll-up, chain-wide revenue, profit-margin tiles, exportable report cards |
| 📈 **Business Analytics** | Aggregated Revenue Chart + Peak Hours + Week-over-week composite trends |
| 🗺️ **Branch Performance** | 6-location Branch Grid with Health Score, Occupancy %, Status, Weekly MRR |
| 👥 **Employees / Users / Roles** | Org-level access control, role-mgmt & employee performance tiles |
| 📣 **Marketing** | Campaign outcome tiles & promo performance indicators |

---

## 💎 PLATINUM — User Story 5 · Intelligent Operations (AI-Powered)

Integrated with **Google Gemini** on the server side via TanStack server functions (API keys never exposed to the client). The AI layer has 4 role-trained personas, not a single generic chatbot.

| Intelligent Feature | Implementation |
|---------------------|----------------|
| 🤖 **AI-Powered Assistance** | **Ops Copilot** embedded in every dashboard. 4 personas: (Customer) Sommelier & Food Assistant → menu suggestions, dietary help, wine pairing recommendations, order lookup. (Staff) Shift Operations Assistant → ticket coordination, turn-time guidance. (Manager) Ops Copilot → staffing alerts, inventory, peak hours, kitchen queue velocity. (Owner) Strategic Executive Advisor → multi-branch MRR, margins, marketing. |
| 🎯 **Personalized Recommendations** | Customer AI sommelier makes menu-specific pairings (e.g. Mango Lassi ↔ Butter Chicken) grounded only in items that are actually available with the count shown |
| 📦 **Inventory Prediction** | Inventory forecast cards with below-reorder-threshold detection + AI-generated suggested reorder qty, supplier, and urgency timeline |
| 📈 **Demand Forecasting** | 6-tile Predictive Analytics strip: Revenue, Covers, Peak Hours, Inventory, Staff, Weekend composite — with confidence intervals |
| 🔔 **Smart Notifications** | Sonner + badge notifications for 86'd items, table-ready events, low-stock triggers, incoming reservations, manager AI advisories |
| 💡 **Operational Insights** | 6 KPI Business Intelligence tiles (Restaurant Health, Revenue Today, Active Orders, Reservations, Guest Satisfaction, Avg Wait Time) + 3 Live AI Insight cards surfaced on the homepage & Manager dashboard |

**Server-side implementation details**: Zod input validation, Gemini model auto-discovery with graceful fallback chain (`generateContent → generateText → generateMessage`), rate-limit friendly error responses, menu/order/table context injection into every system prompt so answers are grounded and never invent menu items.

---

## ⭐ Bonus — Additional Innovative Features

| Feature | Description |
|---------|-------------|
| 🔁 **Dual-Layer Realtime** | Supabase Realtime Channels + BroadcastChannel API fallback → cross-device & cross-tab sync with graceful degradation on flaky Wi-Fi |
| 🎮 **Sandbox Persona Explorer** | Demo login ships role-tailored demo sessions; "Explore as Customer / Staff / Manager / Owner" without any signup |
| 🏪 **Multi-Branch from Day One** | Owner dashboard is already architected for 6 restaurants; no single-location hardcoding |
| 🔐 **Granular Permissions** | 18-level `ROLE_PERMISSIONS` capability matrix, not boolean roles |
| 🧭 **Landing-as-Pitch-Deck** | Single scroll homepage includes Hero, BI KPIs, Live sync strip, 4 dashboard previews, AI Copilot, Predictive Analytics, Role Demo cards, Platform features, Fleet Console, Tech Stack, Team credits |

---

### Summary of User Stories per User Persona

### 👤 Customer
- Browse restaurant menu
- Place food orders
- Track order status in real time
- View order history

### 👨‍🍳 Kitchen Staff
- View live kitchen queue
- Accept and prepare orders
- Update order status

### 👨‍💼 Manager
- Monitor all restaurant orders
- Manage active orders
- View today's order dashboard

### ⚙️ System
- Secure authentication
- Role-based access control
- Real-time order synchronization
- Responsive UI
- Live dashboard updates

---

# 🤖 AI Usage

AI tools were extensively used during the development lifecycle.

### Tools Used
- ChatGPT
- Claude
- Cursor
- GitHub Copilot
- Google Gemini

### AI Contributions
- UI/UX ideation
- Component generation
- Database schema planning
- Backend implementation
- Debugging
- Code optimization
- Documentation
- Feature planning

---

# 🌐 Hosted Application

### 🚀 Live Demo

https://smart-serve-puce.vercel.app/

### 📂 GitHub Repository

https://github.com/Dipanshu1850/SmartServe