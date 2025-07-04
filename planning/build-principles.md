# Creator Score Mini App – Architecture & Core Principles

## PRODUCT PRINCIPLES

- **Principle:** Our apps are optimized for fast, consistent building by "vibe coders" - reusability over customization.
- **User Identification:** Users are identified by a canonical Talent UUID, but can log in or be found via Farcaster, GitHub, or wallet.
- **Dual Authentication:** Automatic environment detection enables Farcaster authentication within MiniApps and Dynamic wallet authentication in browsers, with wallet addresses serving as universal identifiers for reputation scoring.
- **Shared Utilities:** All user lookups and profile loads go through a single resolver that abstracts away the identifier type (Farcaster, GitHub, wallet, Talent UUID). Common logic is extracted into shared services for maintainability and testability.
- **Leaderboard UX:** The current user is always pinned to the top of the leaderboard. Special badges (e.g., "New Builder", "Hall of Fame") can be used to highlight user status and achievements.
- **Advanced Search Callout:** The search page includes a blue callout for advanced search, linking to Talent Index.
- **Profile Modal:** Viewing another user's profile (from Search or Leaderboard) opens a modal overlay (draggable bottom sheet on mobile, side sheet on desktop) rather than navigating away from the current context.
- **Documentation:** All unique or opinionated decisions are documented for clarity; best practices are referenced but not over-explained.

## DESIGN PRINCIPLES

- **Navigation:** Mobile-first with a fixed top header and bottom navigation bar. 
- **Modals:** All secondary flows (menus, about, eligibility, score breakdown, profile overlays, etc.) are implemented as draggable bottom sheets on mobile, always featuring a small horizontal drag handle at the top center. On desktop, these become side sheets or modal dialogs.
- **Color System:** We use a minimal, neutral palette with a single vibrant accent color, applied sparingly and strategically for clarity and focus.
- **Typographic Hierarchy:** Typography follows a clear, documented scale for all text elements, ensuring visual consistency and fast building.
- **Mobile:** The mobile experience is the primary focus, with all layouts and interactions optimized for touch and small screens.
- **Desktop:** The desktop experience is a minimal adaptation: content is centered with max width, bottom nav is hidden, and modals become dialogs or side sheets.
- **Show More/Less:** Long text (e.g., AI summaries) is truncated with a toggle for expanding/collapsing content.
- **Progress Bars:** Progress bars are used throughout the app to visualize activity, scores, and reward progress, and are always minimal and thin.

## TECHNICAL ARCHITECTURE

### Core Architecture Pattern: Modular Data Flow

**CRITICAL**: This app follows a **strict modular architecture** where:

```
External APIs → API Clients → Services → API Routes → Hooks → Pure UI Components
```

#### Layer Responsibilities:
1. **API Clients Layer** (lib/): Abstracted external API interactions with shared utilities
2. **Services Layer**: Domain-specific business logic and data transformations
3. **API Routes Layer**: Server-side endpoints that call services (Next.js API routes)
4. **Hooks Layer**: All data fetching, caching, and state management via API calls
5. **Components Layer**: Pure UI components that receive data via props only

#### Client-Server Separation Rules

**FUNDAMENTAL PRINCIPLE**: Strict separation between client-side and server-side code is mandatory.

**REQUIRED PATTERN**:
```
❌ PROHIBITED: Client Hook → Direct Service Import → External API
✅ REQUIRED: Client Hook → API Route → Service → External API
```

**Architecture Rules**:
- Client-side code (hooks, components) NEVER directly imports server-side services
- All data fetching flows through API routes (`/api/*`)
- Server-side packages (Node.js SDKs) only exist in `/api` routes and `/services`
- This ensures clean separation, smaller client bundles, and prevents runtime errors

### Data Fetching Principles

- **Hook Interface Standard**: All hooks return `{data, loading, error}` consistently
- **Hook Naming**: `useProfile*` for profile data, `useLeaderboard*` for leaderboard, `useUser*` for current user
- **Caching Strategy**: Profile data (5min), expensive computations (30min), leaderboard (5min with refresh)
- **Error Handling**: Graceful fallbacks with skeleton loaders, no crashes

### Component Interface Standards

- **Page Components**: Accept only routing/identifier props, use hooks for data
- **UI Components**: Pure functions receiving all data via props, no API calls
- **Reusability**: Default to shadcn/ui, create custom components only for unique UX needs

### User Resolution System

- **Canonical ID**: Talent UUID is the primary identifier for all users
- **Multi-identifier Support**: Users found via Farcaster, GitHub, wallet, or UUID
- **Universal Resolver**: Single abstraction handles all identifier types
- **Unified Authentication**: Automatic detection between Farcaster (MiniApp) and Dynamic (browser) contexts with seamless user experience

### Tech Stack & Performance

- **Framework**: Next.js 14 (App Router), React 18+, shadcn/ui, Tailwind CSS
- **Authentication**: MiniKit (Farcaster) + Dynamic SDK (wallet-only authentication)
- **State Management**: React hooks + context (no external state library)
- **Caching**: Custom hook-based caching with appropriate TTLs
- **TypeScript**: Strict mode with comprehensive typing throughout

## TAXONOMY

- **User**: An authenticated individual using the app, identified by a Talent UUID.
- **Talent UUID**: The proprietary, canonical unique identifier for a user, created by Talent Protocol.
- **Account**: An external account associated with a user, such as a wallet address, Farcaster, or GitHub.
- **Account Identifier**: A unique value for an account (e.g., FID, fname, wallet address, GitHub username).
- **Account Source**: The platform or service from which an account originates (e.g., Farcaster, ENS, GitHub).
- **Profile**: A Talent Protocol user's public information, which may be viewed by others in the app.
- **Handle**: The human-readable, unique identifier shown publicly for each user (e.g., Farcaster username, ENS) and used in public URLs.
- **Credential**: A Talent API data point scored in the context of a Score, representing a verifiable achievement or attribute.
- **Score**: The sum of all Credentials, representing a user's overall builder status.
- **Data Point**: Any individual metric or value used to calculate Credentials and Score.
- **Session**: The current authenticated context for a user, including authentication method and active accounts.
- **API Client**: An abstracted class that provides a unified interface to external APIs with built-in error handling, validation, and retry logic.
- **Hook**: A custom React hook that encapsulates data fetching, caching, and business logic.
- **Service**: A module that handles domain-specific business logic and data transformations.
- **Component**: A pure UI component that receives data via props and handles only presentation logic. 