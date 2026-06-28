# RailMate Bangladesh — Beta Launch Checklist
**Date:** 2026-06-28  
**Current Status:** 16 bugs fixed, backend verified, auth/search broken

---

## 🔴 CRITICAL BLOCKERS (must fix before ANY user can test)

### 1. Auth: Email magic link redirects to website instead of app
**Problem:** When user clicks the email link, it opens the website, not the app.

**Root Cause:** Supabase Auth doesn't know the app's deep link scheme.

**Fix (in Supabase Dashboard):**
1. Go to https://supabase.com/dashboard/project/ntpyyntgkalolzhdgrbs/auth/url-configuration
2. Under **"Redirect URLs"**, add:
   ```
   exp://192.168.68.105:8090
   com.railmate.bd://
   railmate://
   ```
3. Under **"Site URL"**, set: `https://railmate.com.bd`
4. Click **Save**

**Fix (in app code):**
In `hooks/useAuth.ts`, when calling `signInWithEmail()`, pass the redirect URL:
```ts
const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: 'com.railmate.bd://auth/callback',
  },
});
```

---

### 2. Phone OTP: Twilio trial account blocks ALL phone numbers
**Problem:** Twilio trial can only send SMS to pre-verified numbers.

**Fix Options:**
- **A) Disable phone auth for beta** (fastest — 2 min)
  - Go to Supabase Dashboard → Authentication → Providers → Phone
  - Toggle OFF
  - Users must use email magic link during beta
  
- **B) Upgrade Twilio to paid** (requires credit card)
  - Go to https://www.twilio.com/console/billing
  - Add payment method
  - All phone numbers will work after upgrade

**Recommended:** Option A for now. Add phone auth after beta feedback.

---

### 3. Search returns zero trains
**Problem:** Either trains table is empty, or `days_of_week` is not set correctly.

**Diagnostic:** Run this in Supabase SQL Editor:
```sql
-- Check if trains exist
SELECT COUNT(*) FROM trains WHERE is_active = true;

-- Check days_of_week
SELECT number, name_en, days_of_week, is_active 
FROM trains 
WHERE days_of_week IS NULL OR days_of_week = '{}'
LIMIT 10;

-- Check a real route
SELECT t.number, t.name_en, t.type, t.days_of_week
FROM trains t
JOIN stations s1 ON t.origin_id = s1.id
JOIN stations s2 ON t.destination_id = s2.id
WHERE s1.name_en ILIKE '%Dhaka%'
  AND s2.name_en ILIKE '%Chattogram%'
  AND t.is_active = true;
```

**Fix if trains exist but days_of_week is empty:**
```sql
UPDATE trains 
SET days_of_week = ARRAY[0,1,2,3,4,5,6] 
WHERE days_of_week IS NULL OR days_of_week = '{}';
```

**Fix if trains table is empty:**
You need to seed the database. Contact me with your seed.sql file or run the parse-br-pdf.py script to generate train data.

---

## ⚠️ HIGH PRIORITY (fix before beta announcement)

### 4. Test all 16 bug fixes on real device
- [ ] Icons render (back arrows, tab icons, profile icons)
- [ ] Station picker has dark background
- [ ] Avatar shows initials fallback
- [ ] Community has 4 tabs (All/Following/Verified/My Posts)
- [ ] Quota field removed from search
- [ ] Distance Unit removed from settings
- [ ] Error boundary works (force an error, see recovery screen)

### 5. Verify RLS policies work
Test as authenticated user:
- [ ] Can submit delay report
- [ ] Can vote on community reports
- [ ] Can comment on reports
- [ ] Can save routes
- [ ] Cannot edit other users' data

### 6. Performance check
- [ ] Search results load in <2 seconds
- [ ] Community feed scrolls smoothly
- [ ] No memory leaks (leave app open 10 min, check RAM)

---

## 📋 MEDIUM PRIORITY (fix within first week of beta)

### 7. Seed missing data
- [ ] Train schedules complete (verify 200+ trains)
- [ ] Fares data for major routes
- [ ] Station facilities info

### 8. Analytics & monitoring
- [ ] PostHog events firing (page views, searches, reports)
- [ ] Sentry crash reporting enabled (currently disabled in dev)

### 9. Content polish
- [ ] All Bengali translations reviewed by native speaker
- [ ] Onboarding screens tested with 5 users

---

## 🎯 BETA LAUNCH READY CRITERIA

Before announcing to Facebook groups / Twitter:
- [x] All 16 bugs from audit fixed ✅
- [x] Supabase backend verified (515 stations, RLS enabled) ✅
- [ ] Email auth working (magic link opens app)
- [ ] Search returns results for Dhaka → Chattogram
- [ ] At least 5 manual test users completed a full journey (search → view train → save route)
- [ ] No crashes in 24-hour test period
- [ ] APK build `011b36c8` tested and confirmed stable

---

## 📞 NEXT STEPS (right now)

1. **Fix auth redirect** (5 min)
   - Add deep link URLs to Supabase Dashboard
   - Update signInWithEmail call to pass `emailRedirectTo`

2. **Verify trains exist** (2 min)
   - Run diagnostic SQL queries above
   - Fix `days_of_week` if needed

3. **Test on phone** (10 min)
   - Metro dev server is running — test search immediately
   - Try email auth flow end-to-end

4. **Download new APK** (when build finishes)
   - Install build `011b36c8` on clean device
   - Test cold start → search → auth

---

**Status Check:** Once auth + search work, you're 90% ready for beta launch. The remaining 10% is load testing and content polish.
