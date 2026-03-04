# TechStore Pro — AI-Powered Negotiation Storefront

A full-stack Next.js e-commerce demo that lets shoppers negotiate product prices in real time through an AI chat agent. The frontend is built with the Next.js **App Router**; the B2B proxy layer uses the legacy **Pages Router** API routes so that secret credentials never reach the browser.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [Pages & Routing](#pages--routing)
6. [Components](#components)
7. [Data Layer](#data-layer)
8. [State Management](#state-management)
9. [API Routes](#api-routes)
10. [Negotiation Flow — End-to-End](#negotiation-flow--end-to-end)
11. [Security Model](#security-model)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router + Pages Router hybrid) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| State | Zustand 5 (with `persist` middleware) |
| Icons | Lucide React |
| Animations | canvas-confetti |
| Runtime | React 19 |

---

## Project Structure

```
demo_website/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Geist fonts, global CSS)
│   ├── globals.css               # Global styles & Tailwind directives
│   ├── page.tsx                  # Home / Product Listing page
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx          # Product Detail page (negotiation entry point)
│   └── cart/
│       └── page.tsx              # Shopping Cart page
│
├── components/                   # Shared React components
│   ├── Navbar.tsx                # Sticky top navigation bar
│   ├── Sidebar.tsx               # Desktop category filter sidebar
│   ├── MobileCategoryBar.tsx     # Mobile horizontal category scroll bar
│   ├── ProductCard.tsx           # Grid card with image, title, price
│   ├── ChatWidget.tsx            # Floating AI negotiation chat widget
│   └── CheckoutModal.tsx         # Order summary + simulated payment modal
│
├── pages/
│   └── api/
│       └── start-session.ts      # B2B Secure Proxy — POSTs to INA platform
│
├── data/
│   └── products.ts               # Mock product catalogue + helper functions
│
├── store/
│   └── cartStore.ts              # Zustand cart store (persisted to localStorage)
│
├── public/                       # Static assets
├── .env.local                    # Secret environment variables (never committed)
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (see section below)
cp .env.local .env.local   # edit the placeholder values

# 3. Run the dev server
npm run dev
```

App is available at **http://localhost:3000**.

### Other Scripts

```bash
npm run build   # Production build
npm run start   # Serve the production build
npm run lint    # ESLint
```

---

## Environment Variables

Stored in `.env.local` (never committed to source control).

| Variable | Scope | Description |
|---|---|---|
| `TENANT_API_KEY` | **Server only** | API key for authenticating with the INA Platform. Sent as `X-API-Key` header in server-to-server calls. **Never exposed to the browser.** |
| `INA_PLATFORM_INIT_URL` | **Server only** | Full URL of the INA Platform session-init endpoint. Called only from `pages/api/start-session.ts`. |
| `NEXT_PUBLIC_INA_ORCHESTRATOR_CHAT_URL` | **Browser + Server** | Full URL of the INA Orchestrator chat endpoint. Called directly from `ChatWidget.tsx` in the browser (cross-origin). Requires CORS to be configured on the orchestrator side. |

> **Why the split?** `TENANT_API_KEY` and `INA_PLATFORM_INIT_URL` must stay server-side only — they never appear in client bundles. The `NEXT_PUBLIC_` prefix is intentionally used only for the orchestrator chat URL, which is a safe, public-facing endpoint authenticated via `session_id`.

---

## Pages & Routing

### `/` — Home / Product Listing (`app/page.tsx`)

- Renders the hero section, desktop `Sidebar`, mobile `MobileCategoryBar`, and a responsive product grid of `ProductCard` components.
- Category filtering is done client-side in state (`selectedCategory`); no server round-trip needed.
- Products are sourced from `getAllProducts()` in the data layer.

### `/product/[id]` — Product Detail (`app/product/[id]/page.tsx`)

This is the core page driving the entire negotiation flow. It manages all shared negotiation state:

| State | Type | Purpose |
|---|---|---|
| `negotiatedPrice` | `number \| null` | Final deal price; drives the price strikethrough UI |
| `showCheckout` | `boolean` | Opens the `CheckoutModal` |
| `showChat` | `boolean` | Renders the `ChatWidget` |
| `sessionId` | `string \| null` | INA Platform session token (fetched via proxy) |
| `chatHistory` | `ChatMessage[]` | Lifted message history, shared with `ChatWidget` |
| `isAwaitingNetwork` | `boolean` | Global loading flag shared with `ChatWidget` |

**`handleNegotiateClick`** — fired when the user clicks "Negotiate a Better Price":
1. Sets `isAwaitingNetwork = true` and disables the button.
2. POSTs `{ productId }` to `/api/start-session` (the B2B proxy).
3. Saves the returned `session_id`, sets `showChat = true`, clears the loading flag.

**`handleDealAccepted(price)`** — called by `ChatWidget` on a successful negotiation:
- Sets `negotiatedPrice`, which triggers the strikethrough UI and reveals the "Claim Offer & Checkout" button.

### `/cart` — Shopping Cart (`app/cart/page.tsx`)

- Reads cart items from the Zustand store.
- Displays each item's original price, negotiated price, savings, and quantity controls.
- Shows total original price, total savings, and final payable amount.

---

## Components

### `Navbar.tsx`

- Sticky glassmorphism navbar (TailwindCSS `backdrop-blur`).
- Brand logo links to `/`.
- Cart icon shows an animated badge with the live item count from `useCartStore`.

### `Sidebar.tsx`

- Desktop-only (`hidden md:block`). Sticky, positioned below the navbar.
- Reads unique product categories from `getUniqueCategories()`.
- Highlights the active category with a gradient pill; inactive items slide on hover.

### `MobileCategoryBar.tsx`

- Horizontal scrollable category bar shown only on mobile.
- Same filtering logic as `Sidebar`, different visual treatment.

### `ProductCard.tsx`

- `<Link>` wrapper navigating to `/product/[id]`.
- Uses `next/image` with `fill` layout and `object-cover`.
- Hover effect: image scales up, gradient overlay fades in, "View Details →" text appears.
- Displays `displayed_price` only — `mam` is never rendered here.

### `ChatWidget.tsx`

The negotiation chat interface. Accepts all negotiation state as **props** (lifted to the parent page so the Product Detail page can react to deal events).

**Props:**

| Prop | Type | Description |
|---|---|---|
| `productId` | `string` | Used to scope the negotiation context |
| `productName` | `string` | Shown in the welcome greeting |
| `displayedPrice` | `number` | Starting price shown in the greeting |
| `sessionId` | `string \| null` | Pre-fetched session token from the parent |
| `chatHistory` | `ChatMessage[]` | Shared message history (lifted state) |
| `setChatHistory` | `Dispatch` | Appends messages (user + AI) |
| `isAwaitingNetwork` | `boolean` | Shows typing indicator; disables input |
| `setIsAwaitingNetwork` | `Dispatch` | Set to `true` before fetch, `false` in `finally` |
| `onDealAccepted` | `(price: number) => void` | Called when the AI confirms a deal |

**`onSubmit` handler (External Dispatch):**
1. Prevents default form submission.
2. Appends user message to `chatHistory` instantly (Optimistic UI) and clears the input field.
3. Sets `isAwaitingNetwork = true`.
4. `fetch POST` to `NEXT_PUBLIC_INA_ORCHESTRATOR_CHAT_URL` with body `{ session_id, user_text }`.
5. Appends `response.response_text` to `chatHistory` as `role: 'ai'`.
6. **Success Protocol:** if `response.negotiation_status === "deal_accepted"`, sets `dealAccepted = true` (disables input field permanently), fires confetti, and calls `onDealAccepted(response.final_price)`.
7. Always sets `isAwaitingNetwork = false` in `finally`.

**`startNegotiation`** — fires when the widget UI is first opened. Posts the welcome greeting from the AI into `chatHistory` (session is always pre-provided by the parent).

### `CheckoutModal.tsx`

- Full-screen backdrop modal with order summary: original price (strikethrough), negotiated price, savings.
- Mock payment form (card number, MM/YY, CVC) pre-filled with test values.
- "Pay Now" simulates a 2-second payment processing delay then shows a success state.

---

## Data Layer

**`data/products.ts`**

### `Product` Interface

```typescript
export interface Product {
  id: string;
  title: string;
  description: string;
  high_res_image_url: string;
  displayed_price: number;
  mam: number;         // Minimum Acceptable Margin — SECRET, server-side only
  category: string;
}
```

> **`mam` is confidential.** It is the minimum price the seller will accept. It is never sent to the browser — only forwarded from the server-side API route to the INA Platform.

### Current Catalogue

| ID | Title | Displayed Price | MAM | Category |
|---|---|---|---|---|
| `smartphone-001` | Premium Smartphone Pro | $899 | $650 | Phones |
| `laptop-001` | Ultra-Thin Laptop Elite | $1,299 | $950 | Laptops |
| `headphones-001` | Wireless Noise-Cancelling Headphones | $349 | $220 | Audio |
| `smartwatch-001` | Advanced Fitness Smartwatch | $279 | $180 | Wearables |

### Helper Functions

| Function | Returns | Description |
|---|---|---|
| `getProductById(id)` | `Product \| undefined` | Single product lookup by ID |
| `getAllProducts()` | `Product[]` | Full catalogue |
| `getUniqueCategories()` | `string[]` | Sorted unique category list |

---

## State Management

**`store/cartStore.ts`** — Zustand store persisted to `localStorage` under the key `cart-storage`.

### `CartItem` shape

```typescript
interface CartItem {
  productId: string;
  productName: string;
  negotiatedPrice: number;   // What the user actually pays
  originalPrice: number;     // Listed price (for savings display)
  savings: number;           // originalPrice - negotiatedPrice
  quantity: number;
  imageUrl: string;
}
```

### Store Actions

| Action | Description |
|---|---|
| `addToCart(item)` | Adds item or increments quantity if it already exists |
| `removeFromCart(productId)` | Removes item by product ID |
| `updateQuantity(productId, qty)` | Updates quantity (minimum 1) |
| `clearCart()` | Empties the cart |
| `getTotalPrice()` | Sum of `negotiatedPrice × quantity` across all items |
| `getTotalSavings()` | Sum of `savings × quantity` across all items |
| `getOriginalTotal()` | Sum of `originalPrice × quantity` across all items |

---

## API Routes

### `POST /api/start-session` (`pages/api/start-session.ts`)

The **B2B Secure Proxy**. Sits between the browser and the INA Platform. The browser only calls this endpoint — it never has access to `TENANT_API_KEY` or `INA_PLATFORM_INIT_URL`.

**Request body:**
```json
{ "productId": "smartphone-001" }
```

**Logic:**
1. Validates the request method (405 if not POST).
2. Validates `productId` is present (400 if missing).
3. Looks up the product via `getProductById`. Returns 404 if not found.
4. Makes a **server-to-server** `fetch` to `INA_PLATFORM_INIT_URL`:
   - Header: `X-API-Key: <TENANT_API_KEY>`
   - Body: `{ context_id, asking_price, mam }` — **`mam` is only ever sent server-to-server**
5. Parses the INA Platform response and returns `{ session_id }` to the browser.

**Success response:**
```json
{ "session_id": "abc-123-..." }
```

**Error responses:**

| Status | Condition |
|---|---|
| 400 | `productId` missing from request body |
| 404 | Product not found in catalogue |
| 405 | Non-POST method |
| 5xx | INA Platform returned a non-OK response (forwarded) |

---

## Negotiation Flow — End-to-End

```
Browser                   Next.js Server              INA Platform
  │                             │                           │
  │  Click "Negotiate Price"    │                           │
  │─────────────────────────────▶                           │
  │  POST /api/start-session    │                           │
  │  { productId }              │                           │
  │                             │  POST INA_PLATFORM_INIT_URL
  │                             │  X-API-Key: <secret>      │
  │                             │  { context_id,            │
  │                             │    asking_price, mam }    │
  │                             │──────────────────────────▶│
  │                             │  { session_id }           │
  │                             │◀──────────────────────────│
  │  { session_id }             │                           │
  │◀────────────────────────────│                           │
  │                             │                           │
  │  ChatWidget opens           │                           │
  │                             │                           │
  │  User sends message         │                           │
  │  POST NEXT_PUBLIC_INA_ORCHESTRATOR_CHAT_URL (direct)   │
  │  { session_id, user_text }  │                           │
  │─────────────────────────────────────────────────────── ▶│
  │  { response_text,           │                           │
  │    negotiation_status,      │                           │
  │    final_price? }           │                           │
  │◀─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
  │                             │                           │
  │  if negotiation_status      │                           │
  │  === "deal_accepted":       │                           │
  │  → disable input            │                           │
  │  → confetti 🎉              │                           │
  │  → show negotiated price    │                           │
  │  → "Claim Offer" button     │                           │
  │                             │                           │
  │  User clicks "Claim Offer"  │                           │
  │  → addToCart()              │                           │
  │  → CheckoutModal opens      │                           │
```

---

## Security Model

| Concern | Implementation |
|---|---|
| `TENANT_API_KEY` exposure | Env var without `NEXT_PUBLIC_` — never bundled into client JS |
| `mam` (floor price) exposure | Read server-side only in `start-session.ts`; not returned to browser in any response |
| Session hijacking | `session_id` is scoped to a single `context_id` on the INA Platform side |
| Unauthenticated proxy abuse | Gateway should be extended with rate-limiting or authentication middleware in production |
| CORS on chat endpoint | `NEXT_PUBLIC_INA_ORCHESTRATOR_CHAT_URL` must allow the storefront origin |
