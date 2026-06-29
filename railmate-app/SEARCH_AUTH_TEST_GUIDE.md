# Search & Auth Testing Guide
**Date:** June 29, 2026  
**Status:** Ready for testing after Supabase config

---

## 🔧 Changes Made

### 1. Auth Deep Linking Fixes
- ✅ `lib/supabase.ts`: Changed `detectSessionInUrl: false` → `true`
- ✅ `app/auth/callback.tsx`: Created deep link handler route
- ✅ `hooks/useAuth.ts`: Added `emailRedirectTo: 'railmatebd://auth/callback'`

### 2. Code Review Completed
- ✅ Search API: Tier 1 + Tier 2 implementation verified
- ✅ Auth flow: Email OTP path traced and validated
- ✅ Deep linking scheme: `railmatebd://` confirmed in `app.json`

---

## ⚙️ Required Supabase Configuration

**BEFORE TESTING AUTH**, configure redirect URLs in Supabase dashboard:

### Step 1: Add Redirect URLs
Go to: https://supabase.com/dashboard/project/ntpyyntgkalolzhdgrbs/auth/url-configuration

Under **"Redirect URLs"**, add these (one per line):
```
railmatebd://auth/callback
com.railmate.bd://auth/callback
exp://192.168.68.105:8090
https://railmatebd.com/auth/callback
https://www.railmatebd.com/auth/callback
```

### Step 2: Set Site URL
Under **"Site URL"**, set:
```
https://railmatebd.com
```

### Step 3: Disable Phone Auth
Go to: https://supabase.com/dashboard/project/ntpyyntgkalolzhdgrbs/auth/providers

- Find **Phone** provider
- Toggle **OFF** (reason: Twilio trial blocks all numbers)

### Step 4: Save Changes
Click **Save** button at the top/bottom of the page.

---

## 🧪 Test 1: Search Functionality

### Prerequisites
- Expo dev server running (`npx expo start`)
- Android device connected via USB (or emulator running)
- Database has train data (133 trains, 515 stations)

### Test Steps
1. **Launch App**
   ```bash
   # In terminal where expo is running
   Press 'a' for Android (or scan QR code)
   ```

2. **Navigate to Search**
   - Wait for app to load
   - Tap **Search** tab in bottom navigation

3. **Select Stations**
   - Tap **"From"** field
   - Search or select: **Dhaka (Kamalapur)**
   - Tap **"To"** field
   - Search or select: **Sylhet**

4. **Search**
   - Date should default to today
   - Tap **"Search Trains"** button

### Expected Results
✅ **Success Criteria:**
- Search results page loads within 2-3 seconds
- **Train #735 (Aghnibina Express)** appears in results
- Shows departure time, arrival time, duration
- Shows "Active Today" or "On Time" badge
- Can tap train to see details

❌ **Failure Indicators:**
- "No trains found" message
- Empty results list
- Network error message
- App crashes

### Troubleshooting Search Issues

**If no trains appear:**
```sql
-- Run in Supabase SQL Editor:
SELECT COUNT(*) FROM trains 
WHERE origin_id IS NOT NULL 
  AND destination_id IS NOT NULL;
-- Expected: 133

-- Check specific train:
SELECT * FROM trains WHERE number = '735';
-- Should have origin_id and destination_id populated
```

**If train appears but no schedule:**
- This is OK! Train will show as "Schedule being verified"
- Means Tier 1 (route exists) works, but Tier 2 (timetable) is missing
- Check `train_stops` table for train #735 entries

---

## 🧪 Test 2: Email Authentication

### Prerequisites
- Supabase redirect URLs configured (see above)
- Valid email address you can access
- App installed on device (not just dev server)

### Test Steps

1. **Navigate to Auth**
   - Tap **Profile** tab
   - Tap **"Sign In"** button

2. **Select Email Auth**
   - Tap **"Email"** tab (NOT Phone)
   - You should see warning: "বেটা চলাকালীন, ইমেইল দিয়ে সাইন ইন করুন।"

3. **Enter Email**
   - Type your email address
   - Tap **"Continue"** button

4. **Check Email**
   - Open your email inbox (on phone or computer)
   - Look for email from Supabase (subject: "Confirm your email")
   - **Click the magic link** in the email

5. **Verify Redirect**
   - Link should open the RailMate app (NOT browser)
   - You should see: "Signing you in..." screen briefly
   - Then redirected to main app (tabs)

6. **Verify Sign-In**
   - Go to **Profile** tab
   - Should show your email address
   - **"Sign Out"** button visible

### Expected Results

✅ **Success Criteria:**
- Magic link opens the app (not browser)
- Brief "Signing you in..." spinner shows
- Redirected to main app within 1-2 seconds
- Profile tab shows signed-in state
- Email address visible

❌ **Failure Indicators:**
- Magic link opens in browser instead of app
- Stays in browser, doesn't redirect to app
- Returns to app but not signed in
- Error message shown

### Troubleshooting Auth Issues

**If link opens browser instead of app:**

1. **Verify Supabase redirect URLs are saved**
   - Check: https://supabase.com/dashboard/project/ntpyyntgkalolzhdgrbs/auth/url-configuration
   - Must include: `railmatebd://auth/callback`

2. **Check app scheme configuration**
   ```bash
   # In railmate-app directory:
   cat app.json | grep scheme
   # Should output: "scheme": "railmatebd"
   ```

3. **Test deep link manually**
   ```bash
   # Android:
   adb shell am start -a android.intent.action.VIEW -d "railmatebd://auth/callback"
   # Should open the app to callback screen
   ```

4. **Check logs**
   ```bash
   # In terminal where expo is running:
   # Look for errors mentioning "auth" or "callback"
   ```

**If app opens but doesn't sign in:**
- Check terminal logs for Supabase errors
- Verify `detectSessionInUrl: true` in `lib/supabase.ts`
- Check network connection (magic link needs to fetch session)

---

## 🧪 Test 3: Submit Community Report

### Prerequisites
- **Must be signed in** (complete Test 2 first)
- Have searched for a train (complete Test 1 first)

### Test Steps

1. **Navigate to Community**
   - Tap **Community** tab in bottom navigation

2. **Create Report**
   - Tap **"+"** floating action button (bottom right)

3. **Select Train**
   - Should see **Aghnibina Express #735** (from recent search)
   - Tap to select it

4. **Fill Report**
   - Report Type: Select **"Delay"**
   - Minutes: Enter **10**
   - (Optional) Add note: "Test report"

5. **Submit**
   - Tap **"Submit"** button
   - Wait for confirmation

6. **Verify**
   - Should see: "Report submitted successfully" message
   - Report appears in Community feed
   - Shows your username/email
   - Shows train #735
   - Shows "10 min delay"

### Expected Results

✅ **Success Criteria:**
- Report form submits without errors
- Success message appears
- Report visible in feed within 3 seconds
- Report shows correct train, delay time, and your user info

❌ **Failure Indicators:**
- "You must be signed in" error (auth failed)
- Network error on submit
- Report doesn't appear in feed
- Report shows "Anonymous" instead of your name

---

## 📊 Database Verification Queries

Run these in Supabase SQL Editor to verify data:

### Check Train Data
```sql
-- All active trains with routes
SELECT 
  number, 
  name_en, 
  origin_id, 
  destination_id,
  is_active
FROM trains 
WHERE origin_id IS NOT NULL 
  AND destination_id IS NOT NULL
  AND is_active = true
LIMIT 10;
```

### Check Train #735 Specifically
```sql
-- Aghnibina Express details
SELECT 
  t.number,
  t.name_en,
  s1.name_en as origin,
  s2.name_en as destination,
  t.days_of_week
FROM trains t
LEFT JOIN stations s1 ON t.origin_id = s1.id
LEFT JOIN stations s2 ON t.destination_id = s2.id
WHERE t.number = '735';
```

### Check Train Stops (Schedule)
```sql
-- Train #735 stops
SELECT 
  ts.sequence,
  s.name_en,
  ts.arrival_time,
  ts.departure_time,
  ts.halt_minutes
FROM train_stops ts
JOIN trains t ON ts.train_id = t.id
JOIN stations s ON ts.station_id = s.id
WHERE t.number = '735'
ORDER BY ts.sequence;
```

### Check Recent Community Reports
```sql
-- Last 10 reports
SELECT 
  cr.id,
  t.number as train_number,
  t.name_en as train_name,
  cr.report_type,
  cr.delay_minutes,
  cr.reported_at,
  u.email as reporter
FROM community_reports cr
JOIN trains t ON cr.train_id = t.id
LEFT JOIN users u ON cr.user_id = u.id
ORDER BY cr.reported_at DESC
LIMIT 10;
```

---

## 🐛 Common Issues & Solutions

### Issue: "No trains found" for Dhaka → Sylhet

**Diagnosis:**
```sql
-- Check if train #735 has origin/destination populated
SELECT number, name_en, origin_id, destination_id 
FROM trains WHERE number = '735';
```

**Solution:**
If `origin_id` or `destination_id` is NULL:
```sql
-- Run migration 004_populate_train_routes.sql
-- (Should already be done per commit f29a54c)
```

---

### Issue: Magic link opens browser

**Diagnosis:**
1. Check Supabase redirect URLs are saved
2. Verify `app.json` has `"scheme": "railmatebd"`
3. Check `detectSessionInUrl: true` in `lib/supabase.ts`

**Solution:**
```bash
# Re-add redirect URLs in Supabase dashboard
# Rebuild app:
npx expo start --clear
```

---

### Issue: Auth callback screen shows but doesn't sign in

**Diagnosis:**
Check terminal logs for errors:
```bash
# Look for:
# - "AuthCallback Error"
# - Supabase auth errors
# - Network timeouts
```

**Solution:**
```bash
# Clear app data and try again:
# Android: Settings > Apps > RailMate > Storage > Clear Data
# Then re-run auth flow
```

---

### Issue: Community report shows "Anonymous"

**Diagnosis:**
User profile not created in `users` table.

**Solution:**
```sql
-- Check if user exists:
SELECT * FROM users WHERE email = 'your@email.com';

-- If missing, sign out and sign in again
-- Or create profile manually:
INSERT INTO users (id, email, display_name)
VALUES ('[user-id-from-auth]', 'your@email.com', 'Your Name');
```

---

## ✅ Test Completion Checklist

Mark each as you complete it:

### Pre-Test Setup
- [ ] Supabase redirect URLs added
- [ ] Phone auth disabled in Supabase
- [ ] Expo dev server running
- [ ] Android device connected

### Test 1: Search
- [ ] Search tab loads
- [ ] Station selector opens (dark background)
- [ ] Can select Dhaka → Sylhet
- [ ] Search button works
- [ ] Train #735 appears in results
- [ ] Can tap train to see details

### Test 2: Auth
- [ ] Login screen loads
- [ ] Email tab selected
- [ ] Can enter email and submit
- [ ] Magic link email received
- [ ] Magic link opens app (not browser)
- [ ] "Signing you in..." screen shows
- [ ] Redirected to main app
- [ ] Profile shows signed-in state

### Test 3: Community Report
- [ ] Community tab loads
- [ ] Can tap "+" button
- [ ] Recent train (#735) appears
- [ ] Can fill delay report
- [ ] Report submits successfully
- [ ] Report appears in feed
- [ ] Shows correct user info

---

## 🚀 Next Steps After All Tests Pass

1. **Download Production APK**
   - URL: https://expo.dev/accounts/railmate-bd/projects/railmate/builds/87069f20
   - Install on 2-3 clean devices (not dev server)

2. **Test on Clean Devices**
   - Fresh install (no dev server)
   - Test search, auth, report on each device
   - Monitor for crashes

3. **Beta Launch**
   - If all tests pass on clean devices
   - Announce in Facebook groups
   - Monitor feedback channel

---

## 📞 Support

**If tests fail:**
1. Check terminal logs for errors
2. Run database verification queries
3. Try troubleshooting steps above
4. Document exact error messages for debugging

**Success Metrics:**
- ✅ Search returns results within 3 seconds
- ✅ Auth completes without browser redirect
- ✅ Reports submit and appear in feed

---

**Good luck with testing! 🚂**
