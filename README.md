# CMPNION Hotel Service Management Dashboard

A high-fidelity, premium operations dashboard built for hotel front-desk and service staff to manage guest requests in real time. Designed with a clean Notion/Linear-inspired visual system, responsive mobile views, robust multi-tenancy context switching, and a developer controls panel.

---

## 🎨 Interface & Aesthetics
- **Linear/Notion-Inspired Styling**: Clean typography, light mode default with true black dark mode toggle, generous padding, and flat border-based UI layouts.
- **SLA Breach Warnings**: Displays a pulsing red/amber indicator for orders approaching the 15-minute threshold, and a red border row alert for breached orders.
- **Micro-Animations**: Clean, spring-based drawer transitions and warning indicators using `framer-motion` and native CSS transforms.

---

## 🏗️ Architecture: Feature-Sliced Design (FSD)
The project is built on the **Feature-Sliced Design** architectural methodology. By isolating domain logic into discrete layers, we prevent tight coupling and spaghetti dependencies:

```
src/
├── app/                  # Router setup, global providers, styling boot
├── pages/                # High-level page compositions (Dashboard, Orders, Login, NotFound)
├── widgets/              # Large block components (AppShell, DashboardKpi, OrderList table, OrderDrawer)
├── features/             # Lifecycle actions & mutations (acknowledge-order, cancel-order, approve-extra-bed)
├── entities/             # Business models & API definitions (order schema, dashboard compute, guest interfaces)
├── components/ui/        # Reusable shadcn/ui custom atomic primitives (Button, Table, Sheet, Select)
└── shared/               # Shared libraries (analytics, date formats, currying utilities, Zustand stores)
```

---

## 💾 State Management Taxonomy
We implement a highly deliberate separation of state across three layers:
1. **Server State**: Managed via **TanStack Query v5**. Handles caching, garbage collection, retry policies, and optimistic UI transitions.
2. **URL State**: Managed via **React Router `useSearchParams`**. The search input, category filters, and active tab are persisted directly in the URL query string. This enables bookmarkable filters and deep linking.
3. **Client/UI State**: Managed via **Zustand**. Holds ephemeral client states like drawer open states, theme modes, authentication tokens, and simulation toggles.

---

## 🏨 Multi-Tenancy Architecture
The dashboard supports multi-tenant hotels and hospitality brands natively:
- **Data Scoping**: Every order is associated with a specific `hotelId`.
- **UI context switcher**: Staff can switch between properties (e.g. *The Grand Palace*, *Skyline Boutique*, *Harbor View Inn*) via a selector in the sidebar.
- **API Isolation**: The MSW mock database filters all order endpoints and dashboard metrics by the active `hotelId`, preventing cross-property data leaks.

---

## ⚙️ API & Error Handling Features
1. **Error Simulation**: Toggled via the Developer Panel, enabling testing of fallback UI states (empty lists, failure alerts, and query retry prompts).
2. **Optimistic Updates**: Mutating order statuses immediately reflects in the local cache, reverting to the original snapshot with a toast alert if the API call fails.
3. **Latency and Loading Skeletons**: Visual shimmer card and table skeletons display while fetching backend resources.

---

## 🚀 Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Runtime & Build**: Bun
- **State**: Zustand & TanStack Query v5
- **Linting & Formatting**: Biome (unified, super-fast Rust checker)
- **API Mocking**: Mock Service Worker (MSW) v2
- **Testing**: Bun Test (runner)

---

## 🛠️ Setup & Running

### Prerequisites
Make sure you have [Bun](https://bun.sh) installed.

### 1. Install Dependencies
```bash
bun install
```

### 2. Start Local Development Server
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Linter & Formatter (Biome)
```bash
bun run check  # Runs Biome lint + format verification
bun run format # Applies formatting fixes
```

### 4. Run Tests
```bash
bun test
```

---

## 💡 Technical Discussion & Follow-Up Answers

### 1. What happens if the API takes five seconds to respond?
We handle slow responses gracefully by:
- Displaying shimmery skeleton tables and card lists during initial load.
- Using TanStack Query's `keepPreviousData` (simulated via paginated caching) to prevent sudden layout shifts when filtering or changing pages.
- Applying optimistic status updates for lifecycle mutations, so buttons transition instantly while the API resolves in the background.

### 2. What happens if an order status update fails after the UI has already updated?
Our optimistic mutation hooks follow a strict transaction rollback sequence:
- Cancel outgoing query requests to prevent race conditions.
- Snapshot the current cache state.
- Update the UI status badge immediately.
- If the request fails, catch the error, toast a notification, and restore the snapshot back into the Query Cache.

### 3. A new order arrives while staff is mid-action. How do you surface it without disrupting them?
- **Toast Notifications with CTAs**: We trigger a non-blocking toast warning (*"New request from Room 204"*). This toast contains a *"View"* action, allowing staff to open the detail panel only when they are ready.
- **Unobtrusive Counters**: We increment badge counters without shifting active lists.

### 4. How would you scope the data and UI for a multi-tenant staff view?
- **Data Scoping**: Introduce a `hotelId` or `tenantId` parameter into query request headers.
- **UI Scoping**: Lock staff access using JWT roles mapping to specific property codes. The switcher selector is restricted based on staff credentials.

### 5. If the dashboard had 10,000 orders instead of five, what would you change?
- **Virtualization**: Use `react-window` or `react-virtual` to render only visible rows, keeping DOM nodes low.
- **Windowed Pagination**: Replace infinite scrolling with fast server-side limit queries.
- **Index Optimization**: Apply database indexing on `hotelId`, `status`, and `orderTime` fields.

### 6. What did you intentionally choose not to build, and why?
- **Persistent Backend Database**: Chose MSW in-memory storage to maintain a zero-dependency local setup that boots instantly without database credential configurations.
- **Real WebSockets**: Chose mock timeouts over actual sockets to ensure the take-home works out-of-the-box locally.
