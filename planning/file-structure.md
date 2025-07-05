# Creator Score Miniapp - Modular File Structure

This file structure reflects the **planned modular architecture** where UI components are pure (props-only) and all data fetching is handled by specialized hooks and services.

## Core Architecture Principles

- **Pure UI Components**: All components in `components/` receive data via props only
- **Centralized Data Fetching**: Custom hooks in `hooks/` handle all API calls and business logic
- **Modular Service Layer**: External API interactions split into focused, single-responsibility services
- **Shared Utilities**: Common functions and constants in `lib/`

```plaintext
creator-score-miniapp/
  app/                           # Next.js app directory
    api/                         # API route handlers (proxy to external APIs)
      farcaster-wallets/         # Farcaster wallet resolution
      leaderboard/               # Leaderboard data aggregation
      notify/                    # Notification handling
      talent-credentials/        # Talent Protocol credentials
      talent-score/              # Talent Protocol scores
      talent-socials/            # Social account data
      talent-user/               # User profile data
      wallet-addresses/          # Wallet address resolution
      webhook/                   # Webhook handlers
    [identifier]/                # Dynamic profile routes (Farcaster/GitHub/UUID)
      page.tsx                   # Profile page - uses useProfile* hooks
    leaderboard/                 # Leaderboard page
      page.tsx                   # Leaderboard - uses useLeaderboard* hooks
    settings/                    # Settings page
      page.tsx                   # Settings page (minimal)
    services/                    # Modular service layer
      types.ts                   # Shared interfaces and types
      scoresService.ts           # Score-related functions (Builder/Creator scores)
      credentialsService.ts      # Credential fetching and grouping
      socialAccountsService.ts   # Social account data processing
      leaderboardService.ts      # Leaderboard data and statistics
    layout.tsx                   # App layout with providers
    page.tsx                     # Root page (redirects to leaderboard)
    providers.tsx                # React context providers
    globals.css                  # Global styles
    theme.css                    # Theme customizations

  components/                    # Pure UI components (props-only, no API calls)
    leaderboard/                 # Leaderboard UI components
      LeaderboardRow.tsx         # Individual leaderboard entry
      MinimalProfileDrawer.tsx   # Profile modal overlay
    navigation/                  # Navigation components
      BottomNav.tsx              # Mobile bottom navigation
      Header.tsx                 # Top header with user info
      InfoModal.tsx              # About/info modal
      RequireFarcasterUser.tsx   # Auth gate component
    profile/                     # Profile UI components
      AccountCard.tsx            # Social account display card
      AccountGrid.tsx            # Grid of social accounts
      ProfileHeader.tsx          # Profile header with avatar/stats
      ProfileScreen.tsx          # Main profile layout
      ProfileTabs.tsx            # Profile tabs with score breakdown
      StatCard.tsx               # Individual stat display
      comingSoonCredentials.ts   # Placeholder credentials config
    settings/                    # Settings UI components (empty)
    ui/                          # shadcn/ui primitives
      accordion.tsx              # Collapsible content
      avatar.tsx                 # User avatar component
      badge.tsx                  # Status badges
      button.tsx                 # Button variants
      Callout.tsx                # Alert/info callouts
      card.tsx                   # Content cards
      dialog.tsx                 # Modal dialogs
      drawer.tsx                 # Bottom sheet/drawer
      progress.tsx               # Progress bars
      skeleton.tsx               # Loading skeletons
      tabs.tsx                   # Tab navigation
    FarcasterGate.tsx            # Farcaster authentication gate

  hooks/                         # Custom React hooks (all data fetching)
    useLeaderboard.ts            # Paginated leaderboard data
    useLeaderboardStats.ts       # Leaderboard statistics
    useProfileCreatorScore.ts    # User creator score and breakdown
    useProfileCredentials.ts     # User credentials data
    useProfileSocialAccounts.ts  # User social accounts
    useProfileTotalEarnings.ts   # ETH earnings calculation
    useUserCreatorScore.ts       # Current user's score with FID caching
    useUserNavigation.ts         # Navigation state and user context

  services/                      # External API integration layer (modular)
    neynarService.ts             # Neynar/Farcaster API client

  lib/                           # Shared utilities and configuration
    constants.ts                 # App-wide constants (cache durations, etc.)
    notification-client.ts       # Notification system client
    notification.ts              # Notification helpers
    redis.ts                     # Redis caching utilities
    total-earnings-config.ts     # Total earnings calculation configuration
    user-context.ts              # User context utilities
    user-resolver.ts             # Universal user identifier resolution
    utils.ts                     # Utility functions (formatting, validation)

  public/                        # Static assets
    avatar.png                   # Default avatar
    fc.svg                       # Farcaster icon
    hero.png                     # Hero image
    icon.png                     # App icon
    logo.png                     # App logo
    screenshot.png               # App screenshot
    splash.png                   # Splash screen

  planning/                      # Documentation and planning
    architecture.md              # Core principles and patterns
    development-guide.md         # Development guide and phases
    file-structure.md            # This file
    tasks.md                     # Development tasks

  scripts/                       # Development and utility scripts
    leaderboard-test.ts          # Leaderboard testing script

  # Configuration files
  components.json                # shadcn/ui configuration
  next.config.mjs               # Next.js configuration
  package.json                  # Dependencies and scripts
  postcss.config.mjs            # PostCSS configuration
  tailwind.config.ts            # Tailwind CSS configuration
  tsconfig.json                 # TypeScript configuration
  README.md                     # Project documentation
```

## Key Architectural Patterns

### Data Flow Pattern
```
External APIs → Modular Services → Hooks → Components
```

### Service Layer Architecture
The service layer is designed as focused modules:

- **types.ts**: All shared interfaces and constants
- **scoresService.ts**: Builder/Creator score calculations and API calls
- **credentialsService.ts**: Credential fetching and issuer grouping logic
- **socialAccountsService.ts**: Social account data processing and normalization
- **leaderboardService.ts**: Leaderboard data and statistics

### Hook Naming Convention
- `useProfile*` - Profile-specific data (requires talentUUID)
- `useLeaderboard*` - Leaderboard-related data
- `useUser*` - Current authenticated user data

### Component Interface Standards
- **Page Components**: Accept only routing/identifier props
- **UI Components**: Receive all display data via props
- **No API calls** in any component - all handled by hooks

### Caching Strategy
- **Profile Data**: 5 minutes (user info, social accounts)
- **Score Data**: 30 minutes (computationally expensive)
- **Leaderboard**: 5 minutes with background refresh
- **ETH Prices**: 30 minutes with fallback

### Error Handling Pattern
All hooks return: `{ data, loading, error }` consistently
Components display errors using `Callout` component with graceful fallbacks

## Service Layer Benefits

The modular service architecture provides:
- **Single Responsibility**: Each service handles one domain
- **Easier Testing**: Isolated functions per domain
- **Better Maintainability**: Clear separation of concerns
- **Focused Development**: Work on specific domains independently

## File Organization Rules

1. **Components**: Pure UI only, no business logic
2. **Hooks**: All data fetching, caching, and business logic
3. **Services**: External API abstractions, modular by domain
4. **Lib**: Shared utilities, constants, and configurations
5. **Planning**: All documentation and architectural decisions

This structure enables:
- **Fast development** with clear separation of concerns
- **Easy testing** with isolated business logic
- **Maintainable code** with consistent patterns
- **Reusable components** across different contexts
- **Focused modules** with single responsibilities 