# Production-Grade Simulation Store

A modern e-commerce demo website with AI-powered negotiation capabilities. Built with Next.js 14+, TypeScript, and Tailwind CSS.

## Features

- 🛍️ **Premium Product Storefront** - Modern grid layout with responsive design
- 💬 **AI-Powered Negotiation** - Interactive chat widget for price negotiation
- 🎨 **Premium UI/UX** - Glassmorphism, gradients, and smooth animations
- 🎉 **Success Celebrations** - Confetti animations on successful deals
- 🛒 **Smart Cart System** - Persistent cart with negotiated prices
- 📱 **Fully Responsive** - Works seamlessly on all devices

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# ⚙️ INA PLATFORM CONFIGURATION - REPLACE WITH YOUR ACTUAL VALUES

# INA Platform Backend URL (for session initialization)
INA_BACKEND_URL=https://your-ina-platform-backend.com

# INA Orchestrator URL (for chat messaging)
INA_ORCHESTRATOR_URL=https://your-ina-orchestrator.com

# Tenant API Key (for authentication)
TENANT_API_KEY=your-tenant-api-key-here

# Site Configuration
NEXT_PUBLIC_SITE_NAME=TechStore Pro
```

**⚠️ IMPORTANT:** You MUST replace the placeholder values above with your actual INA platform credentials for the negotiation feature to work.

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
demo_website/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── tenant/              # Tenant backend endpoints
│   │       ├── start-negotiation/   # Initialize negotiation session
│   │       └── verify-deal/         # Verify negotiated price
│   ├── product/[id]/            # Product detail pages
│   ├── globals.css              # Global styles with premium design system
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage (product listing)
├── components/                   # React Components
│   ├── ChatWidget.tsx           # Advanced chat interface
│   ├── CheckoutModal.tsx        # Checkout flow
│   ├── Navbar.tsx               # Navigation bar
│   └── ProductCard.tsx          # Product card component
├── data/                        # Mock Database
│   └── products.ts              # Product data with MAM values
├── hooks/                       # Custom React Hooks
├── store/                       # State Management
│   └── cartStore.ts            # Zustand cart store
└── public/                      # Static assets
```

## Integration with INA Platform

### API Endpoints

The application communicates with the INA platform through two main flows:

#### 1. Start Negotiation (`/api/tenant/start-negotiation`)

- **Trigger:** User clicks "Negotiate a Better Price"
- **Action:** Makes server-to-server call to INA Platform `/session/init`
- **Returns:** `session_id` for the negotiation session

#### 2. Orchestrator Messaging (Client-side)

- **Location:** `components/ChatWidget.tsx` (lines 114-147)
- **Current State:** Uses demo simulation logic
- **Integration Point:** Replace the commented code section with actual orchestrator calls

**To integrate with your actual orchestrator:**

1. Open `components/ChatWidget.tsx`
2. Find the comment: `// REPLACE THIS COMMENTED CODE WITH YOUR ACTUAL ORCHESTRATOR CALL`
3. Uncomment and update the orchestrator API call
4. Remove the demo simulation function `handleNegotiationResponse`

### Demo Negotiation Logic

The current implementation includes a demo negotiation simulator that:
- Accepts offers >= 75% of displayed price
- Makes counter-offers for 60-75% range
- Uses simulated delays for realistic UX

This should be replaced with actual orchestrator integration for production use.

## Key Configuration Points

### Where to Update INA Platform URLs:

1. **`.env.local`** - Main configuration (create this file)
   - `INA_BACKEND_URL`
   - `INA_ORCHESTRATOR_URL`  
   - `TENANT_API_KEY`

2. **Backend API** (`app/api/tenant/start-negotiation/route.ts`)
   - Reads from environment variables
   - Makes authenticated calls to INA platform

3. **Chat Widget** (`components/ChatWidget.tsx`, line 114)
   - Replace demo logic with actual orchestrator messaging

## Premium Design Features

- **Custom Color Palette**: Indigo/purple gradients throughout
- **Glassmorphism**: Frosted glass effect on navbar
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Typing Indicators**: Three-dot animation while bot responds
- **Confetti Effect**: Celebration animation on successful negotiation
- **Auto-scroll**: Chat automatically scrolls to latest message
- **Persistent Cart**: Uses Zustand with local storage

## Technologies Used

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (with custom utilities)
- **State Management:** Zustand
- **Icons:** Lucide React
- **Animations:** Canvas Confetti
- **Font:** Inter (Google Fonts)

## Development Notes

The application is fully functional in demo mode without INA platform configuration. The negotiation feature will show appropriate error messages if credentials are missing, but the UI and UX can be fully explored.

## License

This is a demonstration project for showcasing the INA platform integration capabilities.
