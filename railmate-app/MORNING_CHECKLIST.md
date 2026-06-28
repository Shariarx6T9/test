# RailMate Bangladesh — Morning Test Checklist
**When:** Tomorrow morning (June 29, 2026)  
**Time:** 10 minutes total  
**Goal:** Verify app is ready for beta launch

---

## ✅ THE ZIP FILE QUESTION

**Q: Should I use the "Beta Audit Fixes.zip" file?**  
**A: NO. IGNORE IT COMPLETELY.** ✅

**Why:**
- It's 6 days old (June 22) — we're on June 28
- Audit covers a website we don't have
- Contains broken code that would crash the app
- We already have all fixes (and better ones)

**Full analysis:** See `AUDIT_STATUS_FINAL.md` in the repo

---

## 🎯 3 QUICK TESTS (10 minutes)

### **TEST 1: Search Works (2 minutes)**

```bash
# 1. Connect your Android phone via USB
# 2. Make sure USB debugging is enabled
npx expo start

# 3. Press 'a' for Android (or scan QR code)
# 4. Wait for app to load
```

**In the app:**
1. Tap **Search** tab (bottom navigation)
2. **From:** Dhaka (Kamalapur)
3. **To:** Sylhet
4. Tap **Search Trains** button

**Expected Result:**
- **Aghnibina Express #735** appears in results ✅
- Shows schedule times
- Shows "Active Today" badge

**If train 735 appears → SEARCH WORKS** 🎉

---

### **TEST 2: Auth Works (3 minutes)**

**In the app:**
1. Tap **Profile** tab
2. Tap **Sign In** button
3. Tap **Email** tab (NOT Phone — Twilio is broken)
4. Enter your email
5. Tap **Continue**
6. Check your email inbox
7. Click the magic link

**Expected Result:**
- Link opens the app (not browser) ✅
- You're signed in
- Profile shows your email

**If you're signed in → AUTH WORKS** 🎉

**If link opens browser instead of app:**
- Go to step 3 below (configure Supabase redirects)

---

### **TEST 3: Submit Report Works (2 minutes)**

**In the app (must be signed in):**
1. Tap **Community** tab
2. Tap **+** button (floating action button)
3. Select **Aghnibina Express** (from recent search)
4. Report Type: **Delay**
5. Minutes: **10**
6. Tap **Submit**

**Expected Result:**
- "Report submitted successfully" message ✅
- Report appears in Community feed
- Shows your username

**If report appears → SUBMIT WORKS** 🎉

---

## 🔧 IF AUTH OPENS BROWSER (5 minutes)

**Fix: Configure Supabase Auth Redirects**

1. Go to: https://supabase.com/dashboard/project/ntpyyntgkalolzhdgrbs/auth/url-configuration

2. Under **"Redirect URLs"**, add these (one per line):
   ```
   com.railmate.bd://auth/callback
   railmate://auth/callback
   exp://192.168.68.105:8090
   https://railmatebd.com/auth/callback
   https://www.railmatebd.com/auth/callback
   ```

3. Under **"Site URL"**, set:
   ```
   https://railmatebd.com
   ```

4. Click **Save**

5. **Disable Phone Auth:**
   - Go to: https://supabase.com/dashboard/project/ntpyyntgkalolzhdgrbs/auth/providers
   - Find **Phone** provider
   - Toggle **OFF**
   - Why: Twilio trial blocks all phone numbers

6. **Test auth again** (should open app now)

---

## 🚀 IF ALL 3 TESTS PASS

**YOU'RE READY FOR BETA LAUNCH** 🎉

**Next steps:**
1. Download APK: https://expo.dev/accounts/railmate-bd/projects/railmate/builds/87069f20
2. Install on 2-3 test devices (not connected to dev server)
3. Test search + auth + submit report on clean devices
4. If all work → announce beta to Facebook groups

**Beta announcement template:**
```
🚂 RailMate Bangladesh — Beta Launch!

Find train schedules, report delays, and help fellow travelers.

📱 Download: [APK link]
🌐 Website: railmatebd.com (coming soon)

Features:
✅ Search 133+ trains across 515 stations
✅ Live delay reports from the community
✅ Save your frequent routes
✅ Available in Bengali & English

Join the beta and help us improve!
#RailMateBD #BangladeshRailway
```

---

## 🐛 IF SEARCH DOESN'T WORK

**Diagnostic:**

1. **Check database (Supabase SQL Editor):**
   ```sql
   -- Should return 133
   SELECT COUNT(*) FROM trains 
   WHERE origin_id IS NOT NULL 
     AND destination_id IS NOT NULL;
   
   -- Should return 1 row
   SELECT * FROM trains WHERE number = '735';
   ```

2. **Check app logs:**
   ```bash
   # Watch terminal when you search
   npx expo start
   # Look for errors mentioning "search_trains" or "RPC"
   ```

3. **If database shows 0 trains with routes:**
   - Run migration 004: See `supabase/migrations/004_populate_train_routes.sql`
   - Paste into Supabase SQL Editor and execute

---

## 📋 FULL BETA CHECKLIST

Before announcing publicly:

**Technical:**
- [ ] Search works (test 5 different routes)
- [ ] Auth works (email magic link opens app)
- [ ] Submit report works (all 3 types: delay/crowding/condition)
- [ ] No crashes after 10 minutes of use
- [ ] Icons render correctly (not dark squares)
- [ ] Station picker has dark background (not white)

**Configuration:**
- [ ] Supabase auth redirect URLs added
- [ ] Phone auth disabled (Twilio broken)
- [ ] APK downloaded and tested on clean device

**Content:**
- [ ] Train data verified (133 trains, 515 stations)
- [ ] Major routes work (Dhaka ↔ CTG, Dhaka ↔ Sylhet)
- [ ] Bengali translations reviewed

**Beta Launch:**
- [ ] 5-10 testers recruited
- [ ] Feedback form/channel set up (Discord/Telegram)
- [ ] APK distribution plan (direct download or Google Drive)
- [ ] Announcement ready (Facebook groups, Twitter)

---

## 🎯 SUCCESS CRITERIA

**Beta is LIVE when:**
1. ✅ Search returns results for Dhaka → Sylhet
2. ✅ Email auth opens app (not browser)
3. ✅ Users can submit delay reports
4. ✅ No crashes in first 24 hours
5. ✅ 10+ beta testers actively using

---

**Expected time:** 10 minutes for tests + 5 minutes for Supabase config = **15 minutes total**

**When all tests pass → POST THE BETA ANNOUNCEMENT** 🚀

---

**Good luck! You're 95% done. Just need to verify search works on your device.**
