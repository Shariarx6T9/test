# PHASE 3 PARTIAL COMPLETE

## ✅ What Was Completed

**Commit:** `d2cb916`  
**Status:** Home screen wired, 60% complete  

### Files Created/Updated
1. **components/features/SignInPrompt.tsx** ✅
   - Reusable component for guest gates
   - Compact and full-screen variants
   - Exported in features/index.ts

2. **app/(tabs)/index.tsx** ✅ (Home Screen - COMPLETE)
   - Wired to useAuth hook (displayName, isGuest)
   - Wired to useSavedRoutes (with loading states)
   - Wired to useCommunityReports (live updates)
   - Proper loading/error/empty states
   - Guest mode with SignInPrompt
   - Zero hardcoded mock data
   - Dev-only Showcase button preserved

3. **app/auth/index.tsx** ✅
   - Phone and email sign-in
   - Mode toggle
   - Guest continue option
   - Error handling

4. **Phase 2 Files Copied** ✅
   - All Phase 2 hooks, API, stores copied into railmate-app/
   - usePremium, useRealtimeReports, useUserProfile
   - api/alerts, api/savedRoutes, api/auth
   - lib/featureGates, lib/notifications
   - Updated authStore and database.types

---

## 🚧 Remaining Work (40%)

### Critical Screens (Must Complete)

1. **app/auth/verify.tsx** (Not Started)
   - OTP input (6 digits)
   - verifyOtp() call
   - Resend with 30s cooldown
   - Redirect after success

2. **app/(tabs)/search.tsx** (Update Required)
   - Station autocomplete with useStations
   - Date picker
   - Class selector chips
   - Recent searches
   - Swap button wired
   - Search validation

3. **app/search/results.tsx** (Update Required)
   - useSearchTrains hook
   - Loading: SkeletonTrainCard x4
   - Error: EmptyState with retry
   - Empty: EmptyState
   - TrainCard list → /train/[id]

4. **app/train/[id].tsx** (Update Required)
   - useTrainDetail hook
   - JourneyTimeline with stops
   - Fare table
   - CommunityReportCard list
   - "Report" button → guest gate or /report/[trainId]

5. **app/(tabs)/live-updates.tsx** (Update Required)
   - useLiveUpdates with filters
   - useRealtimeReports() (ONLY here)
   - Pull-to-refresh
   - Loading/error/empty states
   - LiveUpdateCard list

6. **app/(tabs)/community.tsx** (Update Required)
   - isGuest → SignInPrompt (full screen)
   - Tabs: Recent / My Reports
   - Voting with optimistic updates
   - CommunityReportCard list

7. **app/(tabs)/profile.tsx** (Update Required)
   - isGuest → SignInPrompt
   - useUserProfile hook
   - Avatar, display_name, trust_score
   - Stats from profile
   - Premium badge or upgrade CTA
   - Menu list
   - Sign out with confirmation

8. **app/premium/upgrade.tsx** (Not Started)
   - usePremiumStatus check
   - Dynamic LIMITS table from lib/featureGates
   - usePurchase mutation
   - Loading/error states

9. **app/report/[trainId].tsx** (Not Started)
   - Type selector chips
   - Conditional fields (delay_minutes, crowding level)
   - Optional note (max 200 chars)
   - useSubmitReport mutation
   - Success: router.back() + toast
   - Error: inline message
   - Guest check + redirect

---

## 📝 Key Patterns to Follow

### Loading State
```typescript
{isLoading ? (
  <Skeleton width="100%" height={100} />
) : ...}
```

### Error State
```typescript
{error ? (
  <EmptyState
    iconName="Warning"
    title="Something went wrong"
    description={error.message}
    ctaLabel="Retry"
    onCta={() => refetch()}
  />
) : ...}
```

### Empty State
```typescript
{data.length === 0 ? (
  <EmptyState
    iconName="Icon"
    title="No items"
    description="Description"
  />
) : ...}
```

### Guest Gate
```typescript
{isGuest ? (
  <SignInPrompt message="Sign in to access this feature" />
) : (
  // Authenticated content
)}
```

---

## 🎯 Quick Implementation Guide

### For Each Screen:

1. **Import Phase 2 Hooks**
   ```typescript
   import { useAuth } from '../../hooks/useAuth';
   import { useSearchTrains } from '../../hooks/useTrains';
   // etc.
   ```

2. **Call Hooks**
   ```typescript
   const { user, isGuest } = useAuth();
   const { data, isLoading, error, refetch } = useSearchTrains(...);
   ```

3. **Handle All 3 States**
   - Loading: Skeleton components
   - Error: EmptyState with retry
   - Empty: EmptyState with message

4. **Add Guest Gates Where Needed**
   - Community tab: full-screen SignInPrompt
   - Report buttons: check isGuest → redirect to /auth
   - Profile tab: full-screen SignInPrompt

5. **Zero Mock Data**
   - All data from hooks
   - No hardcoded "Najmul" or numbers
   - Only real user profile data

---

## 🔧 TypeScript Notes

All Phase 2 files are properly typed. When wiring screens:
- Import types from `types/database.types`
- Use proper optional chaining: `user?.display_name`
- All hooks return typed data
- No `any` types

---

## ✅ Quality Checklist (Per Screen)

- [ ] useAuth imported and used
- [ ] Real data from hooks (no mock data)
- [ ] Loading state with Skeleton
- [ ] Error state with EmptyState + retry
- [ ] Empty state with EmptyState
- [ ] Guest gates where required
- [ ] Navigation with router.push()
- [ ] TypeScript: zero errors
- [ ] Imports from Phase 1 components

---

## 🚀 To Complete Phase 3

1. Wire remaining 8 screens following patterns above
2. Run `npx tsc --noEmit` and fix errors
3. Grep for mock data strings ("Najmul", "mock", hardcoded numbers)
4. Test loading/error/empty states on each screen
5. Commit with proper message
6. Push to GitHub

**Estimated Time:** 2-3 hours for all remaining screens

---

## 📚 Reference

- **Phase 1 Components:** components/ui/, components/features/
- **Phase 2 Hooks:** hooks/ (useAuth, useTrains, useStations, useCommunityReports, etc.)
- **Phase 2 API:** api/ (trains.ts, community.ts, alerts.ts, savedRoutes.ts)
- **Phase 2 Stores:** stores/ (authStore, searchStore, prefsStore)
- **Feature Gates:** lib/featureGates.ts (LIMITS constant)

---

**Created:** June 30, 2026  
**Home Screen:** ✅ Complete  
**Remaining:** 8 screens  
**Next:** Wire Search, Results, Train Detail, Live Updates, Community, Profile, Auth Verify, Premium, Report  
