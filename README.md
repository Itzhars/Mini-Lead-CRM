# Mini Lead CRM

A high-performance, strictly typed React + TypeScript customer relationship management (CRM) application, engineered for pipeline tracking, prospect auditing, and smooth drag-and-drop workflow transitions.

🔗 **Live Link**: [https://mini-lead-vyug3qewq-itzhars-projects.vercel.app](https://mini-lead-vyug3qewq-itzhars-projects.vercel.app)

---

## 🌟 Core Highlights
- **Fluid Kanban Board**: Full drag-and-drop prospect stage transitions powered by `@dnd-kit/core` with strict workflow validation.
- **Dossier Profiles**: Comprehensive analytical prospect dossiers complete with audit log history and live status transition controls.
- **Sleek SaaS Aesthetics**: Responsive, interactive layouts with dark/light modes, beautiful custom scrollbars, and glassmorphic navigation headers.
- **Zero-Latency Interactions**: Instant filtering, debounced searching, and TanStack optimistic updates with automatic server rollback protocols.

---

## 🛠️ Technology Stack & Rationale

| Technology | Purpose | Key Selection Rationale |
| :--- | :--- | :--- |
| **React 19 & TypeScript** | Core Runtime & Safety | Strict compile-time checks, type-safe schema definitions, and excellent developer experience. |
| **Vite** | Build Tooling | Lightning-fast Hot Module Replacement (HMR) and optimized Rolldown production builds. |
| **Tailwind CSS v4** | UI Styling | CSS-first modern themes, custom utility hooks, and responsive glassmorphism features. |
| **TanStack Query (v5)** | Server-State Caching | Built-in caching, query invalidations, automatic retries, and clean optimistic rollback capabilities. |
| **React Router DOM** | URL Routing | Synced search filters, nested dashboard layouts, and deep-linkable URLs. |
| **React Hook Form & Zod** | Form Validation | Fully typed client validations, dynamic error reporting, and type inference from schemas. |
| **dnd-kit** | Drag & Drop | Highly accessible, performant pointer grabs compatible with concurrent React engines. |
| **Sonner** | Toaster Feeds | Responsive toast alerts with action dismiss options and smooth entrance animations. |

---

## 📁 Project Architecture & Folder Structure

We follow a scalable **Feature-Based Architecture**, isolating domain-specific concerns inside feature boundaries while keeping core layouts and configurations modular.

```
src/
├── api/                  # Axios HTTP client configurations and interceptors
├── components/           # Reusable generic UI components and skeletons
├── features/             # Isolated domain features
│   └── leads/            # Leads Domain Workspace
│       ├── components/   # Tables, Badges, Forms, and Kanban widgets
│       ├── hooks/        # custom TanStack Query hooks (optimistic updates)
│       ├── pages/        # Directory list, detailed dossier, and board pages
│       ├── schemas/      # Zod validation rules
│       ├── services/     # Axios service calls
│       ├── types/        # TypeScript interfaces and status enums
│       └── utils/        # Transition pipelines and date formatters
├── hooks/                # Application-wide hooks
├── layouts/              # AppLayout container framework
├── pages/                # Landing dashboards and error fallbacks
├── routes/               # Modular router index
└── main.tsx              # Application mount point
```

---

## ⚙️ Architectural Decisions

### 1. State Management Matrix
We treat **Server State** (data fetched from APIs) and **Client State** (routing paths and local toggles) separately:
- **Server State**: Managed strictly through **TanStack Query**. It maintains active dossiers in cache, triggers optimistic visual moves, and invalidates queries dynamically on database updates.
- **Client State**: Synced with the **URL Router Parameters** (e.g. text search query `?search=...` and status `?status=...`). This guarantees that user filters remain deep-linkable and shareable across operations.

### 2. Status Transition Pipeline State Machine
Status updates strictly validate against a centralized CRM pipeline state machine in [status.utils.ts](file:///Users/harshvardhan/Desktop/Mini%20Lead%20%20CRM/src/features/leads/utils/status.utils.ts):

```
[NEW] ───► [CONTACTED] ───► [QUALIFIED] ───► [CONVERTED] (Terminal)
  │             │               │
  └─────────────┴───────────────┴──────────► [LOST] (Terminal)
```
- **Rules**: Outgoing paths are permitted in chronological order. Terminal states (`CONVERTED` and `LOST`) lock records permanently.
- **Implementation**: The UI blocks illegal updates locally inside drag listeners and dropdown menus before triggering database API requests, preventing wasteful network calls.

---

## 🚀 Local Installation & Running Guide

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone the repository and install dependencies
```bash
npm install
```

### 2. Run the Mock Database Server
In a separate terminal tab, spin up the JSON backend db to simulate database read/write queries:
```bash
npx json-server --watch db.json --port 3001
```
*(If a local `db.json` is missing, it will initialize automatically. You can populate it with lead objects matching the [lead.types.ts](file:///Users/harshvardhan/Desktop/Mini%20Lead%20%20CRM/src/features/leads/types/lead.types.ts) spec).*

### 3. Run the Development Client
Start the Vite local development server:
```bash
npm run dev
```
Open mini-lead-vyug3qewq-itzhars-projects.vercel.app in your web browser.

### 4. Build Production Bundle
To build the application and verify production bundle sizes, run:
```bash
npm run build
```

---

## 🔮 Future Enhancements
- **Lead Activity Log Feed**: A live feed capturing historic user action timestamps.
- **Bulk CSV Uploads**: Ingestion workflows to parse and batch upload prospect contact files.
- **Global Dashboard Analytics**: Advanced visual reporting graphs representing status conversions over time.

---

## 🤖 AI Usage Note
AI tools were used to speed up development, improve code structure, and review the project for possible issues. I reviewed and customized the generated suggestions according to the assignment requirements. The main application logic, status handling, UI behavior, and overall integration were understood, tested, and refined during development.
