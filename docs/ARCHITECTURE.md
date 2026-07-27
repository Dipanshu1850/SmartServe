# 🏛️ SmartServe — Enterprise Architecture & System Design Document (SDD)

This document provides a comprehensive, enterprise-grade technical blueprint of the **SmartServe AI-Powered Restaurant Operating System**. It is designed for hackathon judges, technical reviewers, and potential investors.

---

## 🎨 Global Design System
- **Color Palette**: 
  - `Primary`: #6366f1 (Indigo - Logic/Auth)
  - `Secondary`: #10b981 (Emerald - Realtime/Sync)
  - `Accent`: #f59e0b (Amber - AI/Intelligence)
  - `Surface`: #09090b (Zinc - Backgrounds)
- **Visual Styles**: 12px rounded corners, professional icons, isometric flow lines.

---

## 1. High-Level System Architecture
**Purpose**: To provide a holistic view of the SmartServe ecosystem and technology stack dependencies.

```mermaid
graph TD
    subgraph Users
        U1[Customers]
        U2[Staff/Kitchen]
        U3[Managers/Owners]
    end

    subgraph "Frontend Layer (React 18 + TanStack Start)"
        UI[shadcn/ui + Tailwind CSS]
        RTR[TanStack Router]
        QRY[TanStack Query]
    end

    subgraph "Service Layer (Supabase BaaS)"
        SDK[Supabase JS SDK]
        AUTH[Supabase Auth]
        RT[Realtime Engine]
    end

    subgraph "Persistence & Intelligence"
        DB[(PostgreSQL)]
        AI[Google Gemini 1.5 Flash]
    end

    Users --> UI
    UI --> RTR
    RTR --> QRY
    QRY --> SDK
    SDK --> AUTH
    SDK --> DB
    SDK --> RT
    SDK --> AI
    
    style Users fill:#1e1e24,stroke:#3f3f46,color:#fff
    style UI fill:#6366f1,stroke:#818cf8,color:#fff
    style DB fill:#10b981,stroke:#34d399,color:#fff
    style AI fill:#f59e0b,stroke:#fbbf24,color:#fff
```

---

## 2. Complete End-to-End Workflow
**Purpose**: Visualize the lifecycle of an order from customer intent to owner reporting.

```mermaid
flowchart LR
    A[Customer Portal] -->|Login| B[Browse Menu]
    B -->|Live Sync| C[Cart & Checkout]
    C -->|Zod Validate| D[(Supabase DB)]
    D -->|Realtime Broadcast| E[Kitchen Kanban]
    E -->|Status: Ready| F[Manager Dashboard]
    F -->|Ops Copilot| G{AI Analysis}
    G -->|Insights| H[Owner Dashboard]
    H -->|Reports| I[Analytics Engine]

    style G fill:#f59e0b,stroke:#fbbf24,color:#fff
```

---

## 3. Customer Journey Map
**Purpose**: Map user emotional states and system responses during the dining experience.

```mermaid
journey
    title SmartServe Customer Experience
    section Discovery
      Browse Menu: 5: Customer
      Check Live Availability: 4: System
    section Commitment
      Add to Cart: 5: Customer
      Place Order: 4: System
    section Wait
      Track Progress: 5: Customer
      Receive Real-time Status: 5: System
    section Closure
      Enjoy Meal: 5: Customer
      AI Sommelier Suggestion: 4: System
```

---

## 4. Staff Workflow (Kitchen Sync)
**Purpose**: Optimize the "Order-to-Table" velocity for floor and kitchen staff.

```mermaid
stateDiagram-v2
    direction LR
    [*] --> NewOrder: RT Event
    NewOrder --> Preparing: Staff Accepts
    Preparing --> Ready: Mark Cooked
    Ready --> Served: Mark Delivered
    Served --> [*]: covers++
```

---

## 5. Manager Workflow (Ops Control)
**Purpose**: Showcase the centralized management of tables, inventory, and staff.

```mermaid
flowchart TD
    M[Manager Dashboard] --> O[Live Orders]
    M --> I[Inventory Audit]
    M --> R[Reservations Console]
    M --> A[Revenue Analytics]
    I --> T{Threshold Check}
    T -->|Low Stock| AI[AI Ops Copilot]
    AI -->|Recommendation| P[Proactive Staffing/Menu Alert]
```

---

## 6. Authentication Sequence
**Purpose**: Detail the secure JWT-based onboarding and role detection flow.

```mermaid
sequenceDiagram
    participant U as User
    participant S as Supabase Auth
    participant P as Postgres (Profiles)
    participant D as Dashboard

    U->>S: Google/Email Login
    S-->>U: JWT Session
    U->>P: Profile Lookup (id)
    P-->>U: { role: 'manager' }
    U->>D: Redirect to /manager
```

---

## 7. AI Reasoning Workflow
**Purpose**: Explain how Gemini processes restaurant context to provide grounding.

```mermaid
flowchart TD
    Data[Menu + Orders + Tables] --> Context[Prompt Context Builder]
    Context --> Gemini[Gemini 1.5 Flash]
    Gemini --> Zod[Output Validation]
    Zod --> UI[Dashboard Alert]
```

---

## 8. Deployment Architecture
**Purpose**: Technical view of the production environment.

```mermaid
graph LR
    Dev[Developer] --> Git[GitHub]
    Git --> Vercel[Vercel Edge]
    Vercel --> Prod[Production App]
    Prod <--> Supa[Supabase Cloud]
    Prod --> Gem[Gemini API]
```

---

## 9. Security Architecture
**Purpose**: Illustrate data encryption and access control boundaries.

```mermaid
graph TD
    subgraph "Access Control"
        JWT[JWT Bearer Tokens]
        RBAC[Role-Based Access Control]
        RLS[Row Level Security]
    end
    subgraph "Infrastructure Security"
        HTTPS[HTTPS/TLS 1.3]
        ENV[Server-side ENV Keys]
    end
    JWT --> RBAC
    RBAC --> RLS
    HTTPS --> JWT
```

---

## 10. Data Flow Diagram (Level 1)
**Purpose**: Trace data movement between processes and data stores.

```mermaid
flowchart LR
    C[Customer] -- Place Order --> S[SmartServe System]
    S -- Persist --> DB[(Supabase DB)]
    DB -- Broadcast --> K[Kitchen Staff]
    DB -- Aggregate --> M[Manager]
    DB -- Analyze --> AI[Gemini AI]
    AI -- Insights --> O[Owner]
```

---

## 🔗 Related Documentation
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Deep dive into PostgreSQL tables and RLS.
- [STRATEGY.md](./STRATEGY.md) - Business vision, roadmap, and competitive analysis.
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Detailed endpoint and server function specs.
