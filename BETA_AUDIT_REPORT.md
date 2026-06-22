# RailMate Bangladesh — Mobile App Beta Readiness Audit
**Date:** 2026-06-22  
**Auditor:** Static analysis + dependency verification (railmate-app)  
**Repo:** github.com/Shariarx6t9/test  
**Verdict: NOT READY FOR BETA**

---

## 1. Executive Summary

The app is architecturally sound and well-structured. The navigation shell, design system, authentication flow, Supabase integration, and community data hooks are all correctly built. However, six issues independently prevent a meaningful beta: fonts are never loaded (every label renders in the system default typeface), a dead `/settings` route crashes the Profile screen, the Community Verified tab always shows empty due to a filter type/status confusion, the Trust Score profile card is scaled against the wrong range making it permanently incorrect, photo upload will crash on Android production builds due to a missing `atob` polyfill, and language switching is inaccessible after onboarding. These must be fixed before any beta invite goes out.

The rest of the report documents every additional issue found, in priority order.

---

## 2. Architecture Findings

**Stack versions (confirmed installed):**
- Expo 52.0.49 / React Native 0.76.9 / Expo Router 4.0.22
- NativeWind 4.1.23 / React Native Reanimated 3.16.1
- TanStack Query v5 / Zustand v5 / Supabase JS v2.45
- `@sentry/react-native` 6.10.0 — **New Architecture enabled**

**Architecture is correct** against the Master Reference: single `search_trains()` RPC shared between website and app, UUID PKs, `days_of_week` inclusion array, Zustand stores with AsyncStorage persistence, TanStack Query for data fetching, error boundaries on all five tab screens.

**One structural issue:** `railmate-screens.jsx` at the root of `railmate-app/` is unexplained dead code. It imports `useState` (flagged by ESLint) and appears to be a leftover design mockup. It should be removed or moved out of the project directory before any store submission — app store reviewers can see submitted JS bundles.

---

## 3. Crash Risks

### CR-1 — CRITICAL: Fonts never loaded → all text renders in system fallback font

**File:** `app/_layout.tsx`  
**Evidence:** `grep -rn "useFonts|loadAsync|from '@expo-google-fonts"` returns zero matches in all `app/**` and `components/**` files.

`@expo-google-fonts/*` packages require an explicit `useFonts()` call. The `expo-font` plugin in `app.json` handles locally bundled assets (`./assets/fonts/`), not npm font packages. Without `useFonts()`, every `fontFamily: 'Inter_600SemiBold'` style silently falls back to the system font. The `expo-font` plugin alone does not load Google Fonts packages.

**Runtime result:** On a clean install, all `Inter_*`, `PlusJakartaSans_*`, `NotoSansBengali_*`, and `JetBrainsMono_*` fontFamily references resolve to the device system font. The entire design system collapses — headlines look identical to body text, Bengali text has no custom font, monospace train times use a proportional font.

**Fix needed:** Add a `useFonts()` call in `app/_layout.tsx` that imports all four font families from their respective `@expo-google-fonts` packages, hold the splash screen until `fontsLoaded` is `true`, and block rendering on `!fontsLoaded`.

---

### CR-2 — CRITICAL: `/settings` route does not exist → navigation crash

**File:** `app/(tabs)/profile.tsx`, line 170  
**Code:** `router.push('/settings' as any)`

No file `app/settings.tsx` or `app/settings/index.tsx` exists. Pressing the "Settings" menu row in the Profile screen pushes a route that Expo Router cannot resolve. On Expo Router 4.x this renders an unhandled route error screen, effectively crashing out of Profile into an unrecoverable state for that navigation session.

**Fix needed:** Create `app/settings.tsx` with at minimum a placeholder screen, or remove the Settings row until the screen exists.

---

### CR-3 — CRITICAL: `atob()` used for photo upload → crashes on Android/Hermes

**File:** `api/community.ts`, line 182  
**Code:** `const byteCharacters = atob(base64);`

`atob` is a browser API. It is not available in React Native's Hermes runtime (used by default in Expo 52 / React Native 0.76). This call succeeds in Expo Go (which polyfills Web APIs) but crashes in production builds with `ReferenceError: Property 'atob' doesn't exist`.

**Fix needed:** Replace the `atob` manual byte loop with `expo-file-system`'s `uploadAsync`, or use the `decode` function from the `base64-js` npm package. The current `expo-file-system` import is already there — use `FileSystem.uploadAsync` directly to the Supabase Storage REST endpoint.

---

### CR-4 — HIGH: Navigation guard missing `router` dependency

**File:** `app/_layout.tsx`, line 89  
**ESLint:** `react-hooks/exhaustive-deps` — missing dependency: 'router'

The navigation redirect `useEffect` omits `router` from its dependency array. In React 18 Strict Mode (used by Expo 52 in development), effects can fire twice. If the `router` reference changes between fires, the stale closure will navigate using a stale router. This is unlikely in production but is a known source of phantom navigation loops in development.

---

## 4. Feature Status Matrix

| Feature | Status | Notes |
|---|---|---|
| Onboarding flow (welcome → features → permissions → auth) | **Working** | Full 4-screen flow present and navigable |
| Guest mode | **Working** | `setGuest(true)` + `finishOnboarding()` correctly wired |
| Phone OTP login | **Working** | `signInWithPhone` → `/auth/otp` flow complete |
| Email magic link login | **Working** | `signInWithEmail` → `/auth/otp` flow complete |
| Google login | **Broken** | Button labeled "Continue with Google" calls `handlePhoneOrGoogle()` which pushes to `/auth/login`. Google OAuth is not implemented. This is a deceptive button — it behaves identically to "Continue with Phone" but is labeled as Google. |
| OTP verification | **Working** | `verifyOTP` correctly handles both phone (sms) and email types |
| Registration | **Working** | `register()` upserts to `users` table |
| Logout | **Working** | `signOut()` tears down subscription, clears auth, navigates to login |
| Language switch | **Broken** | The Profile language row is a `<View>`, not a `<Pressable>`. It has no `onPress`. There is no way to switch language after onboarding without reinstalling. The `setLocale` export from the i18n hook is correct but is never wired to any UI element. |
| Theme switch | **Partially Working** | Theme cycles dark→light→system on press. The Profile theme label reads "System" as an unformatted value (not translated); `t('profile.system')` key exists in both locales. |
| Train search | **Working** | Calls `search_trains()` RPC correctly |
| Station selector | **Working** | Live Supabase query with bilingual search |
| Search results | **Working** | Renders `TrainCard` list; error + empty states present |
| Search results filter button | **Broken** | `<Pressable style={s.filterBtn}>` in `results.tsx` has no `onPress`. Tapping the filter icon does nothing. |
| Train detail | **Working** | Hero image, route timeline, fares section, community insights wired |
| Saved routes | **Working** | Dual-storage (AsyncStorage + Supabase), merge on sign-in, delete |
| Community feed (All/Verified/Mine tabs) | **Partially Working** | "All" and "Mine" tabs work. "Verified" tab always returns empty (see Bug #B-1). |
| Community confirm (vote) | **Working** | Optimistic update + Supabase upsert |
| Community dispute (vote) | **Broken** | Button renders, `onPress` is `() => {/* TODO: wire dispute mutation */}`. Silently does nothing. |
| Community flag report | **Broken** | Alert dialog shows but confirm action is `() => {/* TODO */}`. Report is never flagged. |
| Report submission | **Partially Working** | Form submits to Supabase. Critical gap: `train_id` and `station_id` are never collected or sent — every submitted report is unlinked from any train or station. |
| Photo upload in reports | **Broken in production** | `atob()` crash on Hermes (see CR-3). Works in Expo Go dev only. |
| Live Updates | **Broken** | Entirely static mock data (`MOCK_UPDATES` array). No Supabase connection. Badge count and filter counts are static. "Create Alert" redirects to report submit instead of an alert creation flow. |
| Notifications screen | **Working (minimal)** | Screen exists at `/notifications`, connected to static mock data. No live alerts. |
| Profile screen | **Partially Working** | Trust score/band display is broken (see Bug #B-3). Language row not tappable. Settings row crashes. |
| Journey / Saved routes screen | **Working** | Connected to real `useSavedRoutes`, delete works, empty state correct |
| Leaderboard | **Partially Working** | Live Supabase query. Weekly/Monthly filters have no date column filter — they return all-time data regardless. |
| Badges screen | **Working (mostly)** | Renders badge grid; data is user-level from `useAuthStore` |
| Offline handling | **Partial** | AsyncStorage caches saved routes. Train search and community have no offline fallback — both throw errors if offline. |

---

## 5. Navigation Findings

**Expo Router file tree is complete** for all documented screens. No duplicate route definitions found. Back behavior is correct (stack navigator within each tab).

**Dead routes (cause unhandled navigation error):**

`/settings` — Referenced in `app/(tabs)/profile.tsx` line 170. No corresponding file exists.

**Misleading navigation:**

`/onboarding` — File `app/onboarding.tsx` exists as a redirect to `/onboarding/welcome`. This is intentional and correctly handles the case where Expo Router resolves `/onboarding` before the subdirectory.

`"Create Alert"` in Live Updates — Calls `router.push('/report/submit')`. This navigates to community report submission, not alert creation. These are different user intent flows and should not share a route.

**Navigation guard analysis:**

The three-condition guard in `_layout.tsx` (new user → onboarding, auth user on auth screen → tabs, unauth non-guest after onboarding → login) is logically correct. The `initialized + isLoading` gate prevents premature redirects. However the missing `router` dependency (ESLint warning, line 89) is a latent risk in dev mode.

---

## 6. Translation Findings

**i18n system:** Correct architecture. `useTranslation()` hook wraps `usePrefsStore().language`, falls back en→key, supports `{{param}}` interpolation. `setLocale` is properly aliased to `setLanguage`. 365 keys in both `en.json` and `bn.json` with full parity — no missing translations.

**Critical: `isBengali` hardcoded to `false` in community.tsx**

`app/(tabs)/community.tsx`, line 481:
```ts
const isBengali = false; // hook into useTranslation locale when ready
```

The entire Community screen — reputation card, tier carousel, achievement labels, stats grid, feed header, coming-soon list, empty states — ignores the user's language preference. When a user selects Bengali, Community stays in English. This is the largest localization gap in the app.

**`formattedDate` hardcoded English in home/index.tsx**

Line 62:
```ts
return isToday ? `Today, ${d.toLocaleDateString('en-US', ...)}` : dayStr;
```
The word "Today," is a hardcoded English string. In Bengali mode, the date shows as "Today, June 19" — mixed languages in a single label.

**Other hardcoded strings found in code (not i18n violations from the regex scan, but confirmed via reading):**
- `community.tsx` TrustModal: "How Trust Works", "RailPoints", "Trust Score", "Verification", "Badges", "Got it" — all hardcoded English
- `community.tsx` ReportCard: "Confirm", "Dispute", "Trusted", "Verified", "min late", "Confirmed by N travelers"
- `community.tsx` timestamps: `'just now'`, `'m ago'`, `'h ago'`, `'d ago'`
- `onboarding/auth.tsx`: "Get Started", "Join thousands of smart travelers.", stat labels
- `journey/index.tsx`: `Remove "{routeLabel}"?` — English regardless of locale

---

## 7. Security Findings

**No critical security violations found.** Supabase anon key is the only secret client-side; service role key is not referenced in any client file. RLS is enabled on all user-facing tables. The `supabase.ts` client has graceful fallback placeholders (harmless placeholder.supabase.co) so the app doesn't crash at build time without env vars — but it will fail all API calls silently at runtime. The `.env` file does not exist in the repo.

**Overpermissioned Android manifest (`app.json`):**

Three permissions are declared with no corresponding code:
- `android.permission.RECORD_AUDIO` — No audio recording anywhere in the codebase
- `android.permission.READ_EXTERNAL_STORAGE` — Deprecated since Android 13 (API 33); `expo-image-picker` uses scoped storage and doesn't need this
- `android.permission.WRITE_EXTERNAL_STORAGE` — Same; deprecated and unused

Play Store reviewers will question RECORD_AUDIO specifically. It must be justified or removed.

**`report-photos` Supabase Storage bucket not provisioned:**

`api/community.ts` uploads photos to a bucket named `report-photos`. No migration creates this bucket. Without manual creation in the Supabase Dashboard, every photo upload fails. The `uploadReportPhoto` function throws, which is caught by the mutation's `onError` handler — the user sees an error alert but has no way to know why.

**No `.env` file in repo (correct):** `.env.example` exists. This is the right pattern.

---

## 8. Bug Register

### B-1 — CRITICAL: Community "Verified" tab always empty

**File:** `app/(tabs)/community.tsx`, line 489  
**File:** `api/community.ts`, line 47 (`getCommunityReports`)

```ts
// community.tsx
if (feedFilter === 'verified') return { type: 'VERIFIED' as ReportType };

// api/community.ts
if (filter && 'type' in filter) {
  query = query.eq('report_type', filter.type);  // ← filters report_type column
}
```

`VERIFIED` is a report **status** (stored in the `status` column). `report_type` stores `DELAY`, `CROWD`, `PLATFORM`, `GENERAL`. The Verified tab sends `report_type = 'VERIFIED'` to Postgres, which matches zero rows. The tab always renders the empty state.

**Fix:** The `ReportFilter` type needs a `status` variant: `{ status: 'VERIFIED' }`, and `getCommunityReports` needs a matching branch: `query = query.eq('status', filter.status)`.

---

### B-2 — HIGH: Trust Score displayed against wrong scale

**File:** `app/(tabs)/profile.tsx`, lines 22-47, 106-113

```ts
const TRUST_BANDS = [
  { min: 0, max: 20,  label: 'Explorer' },   // 0-20 range
  { min: 20, max: 50, label: 'Contributor' }, // etc.
  ...
];

const trustScore = user?.trust_score ?? 0;    // DB value: 0.00-5.00
// ...
<Text>{trustScore}/100</Text>                 // shows "1.5/100"
<View style={{ width: `${trustScore}%` }} />  // bar is 1.5% wide
```

The database schema (`Part 07`) defines `trust_score DECIMAL(4,2)` with range 0.00–5.00 and default 1.00. The Profile screen displays it as if it's a 0–100 value. A new user with score 1.0 sees "1.0/100", "1 point to Contributor", and a progress bar that's 1% wide. The `TRUST_BANDS` thresholds (0-20, 20-50, 50-75, 75-90, 90-101) mean every user with a 0-5 DB score is permanently in the "Explorer" band.

**Fix:** Either convert the DB value on read (`trustScore * 20` to map 0–5 → 0–100), or update the TRUST_BANDS to use the 0–5 scale and display `trustScore.toFixed(1) + '/5.0'`.

---

### B-3 — HIGH: Language switch unreachable post-onboarding

**File:** `app/(tabs)/profile.tsx`, lines 159-164

```tsx
<View style={[s.menuRow, s.menuRowBorder]}>   // ← View, not Pressable
  <View style={s.menuIconWrap}><Globe .../></View>
  <Text style={s.menuLabel}>{t('profile.language')}</Text>
  <Text style={s.menuValue}>{language === 'bn' ? 'বাংলা' : 'English'}</Text>
</View>
```

This row is a `View`, not a `Pressable`. Tapping it does nothing. The `setLanguage` function from `usePrefsStore` is available in scope but not connected to any UI element. After onboarding, there is no way to change the app language.

The previously reported crash "setLocale is not a function" is likely explained by this: `setLocale` is correctly exported from `i18n/index.ts` as an alias for `setLanguage`. The crash may have occurred if earlier code tried to call it incorrectly, but the current i18n hook is correct — the gap is only that the UI doesn't call it.

**Fix:** Replace `<View>` with `<Pressable onPress={() => setLanguage(language === 'bn' ? 'en' : 'bn')}>`.

---

### B-4 — HIGH: Google sign-in button is fake

**File:** `app/onboarding/auth.tsx`, lines 46-49

```tsx
<Pressable style={s.googleBtn} onPress={handlePhoneOrGoogle}>
  <GoogleLogo .../><Text>Continue with Google</Text>
</Pressable>
<Pressable style={s.phoneBtn} onPress={handlePhoneOrGoogle}>
  <Phone .../><Text>Continue with Phone</Text>
</Pressable>
```

Both buttons call the same handler `handlePhoneOrGoogle()` which simply calls `finishOnboarding()` and navigates to `/auth/login`. The Google button is visually and semantically distinct but functionally identical to Phone. Google OAuth is not implemented. This is a misleading UI that can cause Play Store review rejection under "deceptive UI" policy.

**Fix:** Remove the Google button until OAuth is implemented, or replace the icon with a generic "Sign In" label.

---

### B-5 — HIGH: Report submission sends no train or station

**File:** `app/report/submit.tsx`, `handleSubmit()` function

The submit screen collects report type, description, delay minutes, location (lat/lng → city name string, not stored), and optional photo. The actual `submitReport()` payload is:
```ts
{ report_type, description, delay_minutes, journey_date }
```
`train_id` and `station_id` are never collected from the user and never included in the payload. Every submitted report is stored with `train_id = null` and `station_id = null`. These reports show in the community feed with no train name and are not searchable by train.

**Fix:** The `ReportSubmitSheet` component (in `components/features/ReportSubmitSheet/`) has train and station search fields already built. The `submit.tsx` screen either needs those same pickers added, or the screen should be replaced with the sheet component.

---

### B-6 — MEDIUM: Dispute button silently does nothing

**File:** `app/(tabs)/community.tsx`, ReportCard component

```tsx
<Pressable onPress={() => {/* TODO: wire dispute mutation */}}>
  <Text>Dispute</Text>
</Pressable>
```

The button renders, is tappable, but has no effect. Users who tap Dispute get no feedback. The `useVoteReport` mutation already supports `voteType: 'DISPUTE'` — this is a wiring gap, not a missing feature.

---

### B-7 — MEDIUM: Flag action silently does nothing

**File:** `app/(tabs)/community.tsx`, `handleFlag` callback

```ts
{ text: 'Flag', style: 'destructive', onPress: () => {/* TODO: wire flag mutation, pass _reportId */} },
```

The alert shows and the user confirms, but the report is never flagged in the database.

---

### B-8 — MEDIUM: `Leaderboard` weekly/monthly filters have no date constraint

**File:** `app/leaderboard/index.tsx`

The leaderboard queries `users` table ordered by `trust_score`, `helpful_vote_count`, or `report_count`. There is no date-based filtering for "This Week" or "This Month" — the query is identical regardless of selected time period. All three tabs return all-time rankings.

---

### B-9 — LOW: Splash screen delay is fixed at 1800ms

**File:** `app/_layout.tsx`, line 58

```ts
setTimeout(() => {
  Animated.timing(fadeAnim, { toValue: 0, duration: 400, ... }).start(() => setSplashDone(true));
}, 1800);
```

The splash fades after exactly 1800ms regardless of whether fonts and auth have loaded. On slower devices, the underlying screen may not be ready when the splash fades. On fast devices, this is 1800ms of unnecessary blocking. This is also the splash dismissal — the native `SplashScreen.hideAsync()` is never called, which means in a production build the native splash screen may behave differently from the JS splash overlay.

---

### B-10 — LOW: Home BDT pill has no press handler

**File:** `app/(tabs)/index.tsx`

The `<Pressable style={s.bdtPill}>` in the top-right corner of the Home screen has no `onPress`. Tapping it does nothing. Either remove the Pressable wrapper or add a handler.

---

## 9. Performance Findings

**FlatList usage:** Correct in Community (reports) and Search Results. `keyExtractor` uses stable UUIDs. `renderItem` uses `useCallback` in Community to prevent unnecessary re-renders.

**`createStyles(colors)` inside `useMemo`:** Correct pattern throughout all screens — styles are recomputed only when `colors` changes (theme switch), not on every render.

**`useStations()` global fetch:** Stations are fetched in both `app/(tabs)/search.tsx` and `app/(tabs)/index.tsx`. TanStack Query deduplicates these — both share the same `['stations']` query key and the same cache. No double-fetch issue.

**Heavy renders:** The Community `FlatList` has `ListHeaderComponent`, `ListFooterComponent`, and `ListEmptyComponent` as inline JSX. These are recreated on every render. They should be extracted to stable component references or wrapped in `useMemo`.

**No image optimization:** `train/[id].tsx` loads a hardcoded Unsplash image URL (`https://images.unsplash.com/photo-...`) for all trains. This has no caching, no lazy loading, no fallback state. On a slow connection the hero section shows nothing until the image loads.

**Bundle size estimate:** Unable to verify without a build. Package count is reasonable. `@opentelemetry/api` is listed as a dependency but appears unused in the app code — it may have been pulled in transitively but adds ~200KB to the bundle if included.

---

## 10. Beta Readiness Score

| Category | Score | Notes |
|---|---|---|
| Stability | 42/100 | Two crash paths (dead `/settings` route, `atob` on prod Android), several silent failures |
| Code Quality | 71/100 | TypeScript: zero errors. ESLint: 27 warnings, zero errors. Clean architecture. Multiple TODO stubs |
| Security | 78/100 | Overpermissioned manifest, unprovisioned storage bucket, no `.env`. No critical leaks |
| UX | 48/100 | Fonts unloaded (design collapses), language switch inaccessible, fake Google button, Verified tab empty |
| Performance | 68/100 | Correct patterns. Fixed splash delay. Inline FlatList components. Hardcoded network image |
| Feature Completeness | 51/100 | 5 tab shell works. Live Updates is 100% mock. Dispute/Flag/Filter wired to TODO. Report missing train/station |

**Overall: 60/100**

**Classification: NOT READY — ALPHA ONLY**

---

## 11. Critical Release Blockers (in priority order)

These must be fixed before inviting any beta tester.

**BLOCKER 1 — Fonts never load**  
Add `useFonts()` in `app/_layout.tsx` with Inter, Plus Jakarta Sans, Noto Sans Bengali, and JetBrains Mono. Gate rendering on `fontsLoaded === true`. Without this, the entire UI renders in the system font — unacceptable for any user-facing test.

**BLOCKER 2 — Dead `/settings` route crashes Profile**  
Create `app/settings.tsx` (even a placeholder) before any test session. Every tester will tap Settings.

**BLOCKER 3 — Community "Verified" tab always empty**  
Fix `ReportFilter` type to distinguish `{ status: 'VERIFIED' }` from `{ type: ReportType }`. Fix `getCommunityReports` to branch correctly. This is one of the three primary community feed views.

**BLOCKER 4 — Language switch unreachable**  
Make the Profile language row a `Pressable` with `onPress`. Without this, any tester who speaks Bengali and was onboarded in English has no recourse.

**BLOCKER 5 — Trust score uses wrong scale**  
DB stores 0-5. Profile displays as 0-100. Every authenticated user sees "Explorer" with a 1% progress bar. Fix the scale before any tester creates an account.

**BLOCKER 6 — `atob()` crash on Android production builds**  
Replace the photo upload base64 conversion with a Hermes-compatible approach. Without this, the report photo feature crashes every Android tester on a production or preview build.

**BLOCKER 7 — Remove or implement Google sign-in**  
A button labeled "Continue with Google" that silently opens the phone login flow is a deceptive UI. Remove the button before any test. Play Store policy prohibits this.

---

## 12. Recommended Next Actions

In order:

1. Add `useFonts()` — one function call + conditional render gate. 30 minutes of work. Unblocks the entire visual experience.
2. Create `app/settings.tsx` placeholder — 15 minutes.
3. Fix Community "Verified" tab filter — `type` → `status` in the filter discriminator. 20 minutes.
4. Make Profile language row tappable — change `<View>` to `<Pressable onPress>`. 5 minutes.
5. Fix trust score scale — pick one: DB scale (0-5) or UI scale (0-100), make them match. 20 minutes.
6. Fix photo upload for Hermes — replace `atob` loop with `FileSystem.uploadAsync` or `base64-js`. 45 minutes.
7. Remove the Google button or stub it clearly as "Coming Soon". 5 minutes.
8. Wire the Dispute mutation — the infrastructure exists in `useVoteReport`. 30 minutes.
9. Add train/station pickers to `report/submit.tsx`. 2-3 hours.
10. Create the `report-photos` Supabase Storage bucket and add its creation to the migration file.
11. Remove `RECORD_AUDIO`, `READ_EXTERNAL_STORAGE`, `WRITE_EXTERNAL_STORAGE` from `app.json`.
12. Fix `isBengali` hardcode in `community.tsx` — replace with `const { isBengali } = useTranslation()`. 5 minutes.
13. Fix `formattedDate` hardcoded "Today," in `home/index.tsx`. Use `t('home.today')` key.
14. Fix `/settings` route and wire Live Updates to real data (Phase 2 feature gate).

Items 1-7 represent approximately 3-4 hours of work. With those done, the app is stable enough for a closed internal test of 5-10 people. The remaining items (8-14) represent another 1-2 days of work for a proper closed beta.

---

*This report was generated by static analysis only. Unable to verify without runtime testing: font rendering behavior in Expo Go vs dev client vs production build, Sentry New Architecture compatibility in production, `expo-location` reverseGeocode accuracy in Bangladesh, Supabase RLS policy enforcement in production, push notification delivery, or RevenueCat sandbox purchase flow.*
