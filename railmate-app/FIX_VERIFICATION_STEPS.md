# MANUAL VERIFICATION REQUIRED

## Environment Limitation
TypeScript compiler (`npx tsc`) cannot run from Windows accessing WSL via UNC path (`\\wsl.localhost\...`). This is a known tsc limitation.

## Commands YOU Must Run

Open **native WSL terminal** (Ubuntu, not PowerShell/CMD):

```bash
# Navigate to project
cd ~/railmate-app/railmate-app

# 1. Run TypeScript check
npx tsc --noEmit

# 2. Start dev server
npx expo start

# 3. Check for console errors on cold start
# Watch for any red errors in terminal or device console
```

## Known Issues to Fix

### CRITICAL: Missing useAuth Exports

**Files broken:**
- `app/(tabs)/index.tsx` line 20
- `app/(tabs)/profile.tsx` line 18

**Problem:** These files import properties that useAuth doesn't export:
- `displayName`
- `avatarUrl`
- `isGuest`
- `isPremium`

**Fix in progress:** Adding computed properties to useAuth hook return value.

---

**This file tracks what I cannot verify from this environment.**
