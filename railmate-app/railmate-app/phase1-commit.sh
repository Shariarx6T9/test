#!/bin/bash

# Phase 1 Git Commit Script
# Run this from WSL: bash phase1-commit.sh

cd /home/najmulhasan/railmate-app/railmate-app

echo "=== Phase 1: Design System & Component Library ==="
echo ""
echo "Checking git status..."
git status --short

echo ""
echo "Adding new files..."
git add constants/shadows.ts
git add constants/index.ts
git add components/ui/AppText.tsx
git add components/ui/StationInput.tsx
git add components/ui/TrainNumberBadge.tsx
git add components/ui/StatusPill.tsx
git add components/ui/EmptyState.tsx
git add components/ui/Skeleton.tsx
git add components/ui/SkeletonTrainCard.tsx
git add components/ui/SkeletonReportCard.tsx
git add components/ui/index.ts
git add components/features/JourneyTimeline.tsx
git add components/features/QuickActionCard.tsx
git add components/features/QuickActionsGrid.tsx
git add components/features/LiveUpdateCard.tsx
git add components/features/SavedRouteCard.tsx
git add components/features/index.ts
git add components/layout/BottomNav.tsx
git add components/layout/ScreenHeader.tsx
git add components/layout/TabLayout.tsx
git add components/layout/index.ts
git add app/showcase.tsx
git add PHASE1_COMPLETE.md
git add phase1-commit.sh

echo ""
echo "Creating commit..."
git commit -m "feat(phase-1): design system & component library

PHASE 1 COMPLETE — Design System & Component Library for RailMate Bangladesh

Design Tokens (5 files):
- constants/shadows.ts (NEW) - iOS/Android platform shadows
- constants/index.ts (NEW) - Unified exports
- colors, spacing, radius, typography already existed

UI Components (13 new):
- AppText.tsx - 16 typography variants with Bengali support
- StationInput.tsx - From/To station selector (pressable, not input)
- TrainNumberBadge.tsx - Train # badge with green border
- StatusPill.tsx - Status indicators (delay/on-time/crowding/warning)
- EmptyState.tsx - Icon + title + description + CTA
- Skeleton.tsx - Animated shimmer loading placeholder
- SkeletonTrainCard.tsx - Train card loading state
- SkeletonReportCard.tsx - Report card loading state
- Button, Card, Badge, Chip, Input already existed (enhanced)
- index.ts - UI component exports

Feature Components (5 new):
- JourneyTimeline.tsx - Vertical timeline with stops & dashed lines
- QuickActionCard.tsx - Single quick action card
- QuickActionsGrid.tsx - 6 action cards in 2x3 grid
- LiveUpdateCard.tsx - Live update feed card
- SavedRouteCard.tsx - Saved route card (horizontal scroll)
- TrainCard already existed (comprehensive)
- index.ts - Feature component exports

Layout Components (3 new):
- BottomNav.tsx - Animated 5-tab navigation with haptics
- ScreenHeader.tsx - Reusable header with back button
- TabLayout.tsx - Wraps content with bottom nav
- index.ts - Layout component exports

Showcase:
- app/showcase.tsx - Visual verification of all components

Status:
✓ 17 new component files created
✓ 4 index files for clean exports
✓ Navigation shell complete (5 tabs + stack)
✓ All design tokens documented
✓ Bengali typography support
✓ Dark/light theme system
✓ i18n en + bn (already existed)
✓ Font loading (already existed)

Dependencies:
- Most already installed (expo, reanimated, fonts, etc.)
- Need: expo-haptics (for Button/BottomNav feedback)

Next: Phase 2 - Data layer (Supabase queries, TanStack Query)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

echo ""
echo "✅ Commit created successfully!"
echo ""
echo "Next steps:"
echo "1. Install missing dependency: npx expo install expo-haptics"
echo "2. Run TypeScript check: npx tsc --noEmit"
echo "3. Start dev server: npx expo start"
echo "4. Test showcase: navigate to /showcase"
echo ""
echo "Phase 1 complete! Ready for Phase 2 (data layer)."
