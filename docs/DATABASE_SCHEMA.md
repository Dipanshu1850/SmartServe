# 📊 Database Architecture & Entity Relationship Diagram (ERD)

## 1. Overview
SmartServe uses a **Relational Schema** designed for ACID compliance and real-time synchronization. The database is hosted on **Supabase (PostgreSQL)**.

## 2. ERD (Visual Representation)

```mermaid
erDiagram
    PROFILES ||--o{ ORDERS : places
    PROFILES ||--o{ RESERVATIONS : makes
    RESTAURANTS ||--o{ MENU_ITEMS : contains
    RESTAURANTS ||--o{ TABLES : has
    RESTAURANTS ||--o{ ORDERS : processes
    TABLES ||--o{ ORDERS : assigned_to
    TABLES ||--o{ RESERVATIONS : booked_for

    PROFILES {
        uuid id PK
        text email
        text full_name
        enum role "customer, staff, manager, owner"
        timestamptz created_at
    }

    RESTAURANTS {
        uuid id PK
        text name
        text address
        uuid owner_id FK
    }

    MENU_ITEMS {
        uuid id PK
        uuid restaurant_id FK
        text name
        decimal price
        int available_qty
        text[] tags
    }

    ORDERS {
        uuid id PK
        uuid table_id FK
        uuid customer_id FK
        jsonb items "Array of {id, name, qty, price}"
        text status "queued, preparing, ready, served"
        decimal total_amount
    }

    RESERVATIONS {
        uuid id PK
        uuid table_id FK
        uuid customer_id FK
        timestamptz reservation_time
        int guest_count
    }
```

## 3. Data Flow & Real-time
We utilize **PostgreSQL Listen/Notify** via Supabase Realtime Channels.
1. **Order Insert**: Triggered from Customer UI.
2. **Staff Broadcast**: Realtime channel pushes the payload to the Kitchen Kanban.
3. **Status Update**: Staff updates status → SQL `UPDATE` → Realtime broadcast → Customer Tracking UI.

## 4. Security (RLS)
- **Profiles**: `auth.uid() == id` (Users only see/edit their own profile).
- **Orders**: 
    - Customers: `auth.uid() == customer_id` (View only their own).
    - Staff/Manager: `true` (View all branch orders).
- **Inventory**: `role IN ('manager', 'owner')` (Only managers can update stock).
