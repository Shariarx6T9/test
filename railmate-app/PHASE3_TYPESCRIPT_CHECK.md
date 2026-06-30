# Phase 3 - TypeScript Verification Guide

## Issue: UNC Path Limitation

Running `npx tsc --noEmit` from Windows accessing WSL via UNC path (`\\wsl.localhost\Ubuntu\...`) is not supported by the TypeScript compiler.

**Error:**
```
CMD.EXE was started with the above path as the current directory.
UNC paths are not supported. Defaulting to Windows directory.
```

## Workaround: Run from Native WSL Terminal

To verify TypeScript compilation for Phase 3:

### Step 1: Open WSL Terminal
```bash
# Open Ubuntu WSL terminal (not PowerShell/CMD)
wsl
```

### Step 2: Navigate to Project
```bash
cd ~/railmate-app/railmate-app
```

### Step 3: Run TypeScript Check
```bash
npx tsc --noEmit
```

### Step 4: Fix Any Errors
If errors are found, address them before deploying.

## Expected Result

All Phase 3 screens use proper TypeScript types:
- ✅ Hook return types from `@tanstack/react-query`
- ✅ Database types from `types/database.types.ts`
- ✅ Component prop interfaces
- ✅ Zustand store types

## Files to Verify

### Core Screens (Phase 3)
- `app/(tabs)/index.tsx` - Home screen
- `app/(tabs)/search.tsx` - Search screen
- `app/search/results.tsx` - Search results
- `app/train-detail.tsx` - Train detail
- `app/(tabs)/live-updates.tsx` - Live updates
- `app/(tabs)/community.tsx` - Community tab
- `app/(tabs)/profile.tsx` - Profile tab
- `app/auth/index.tsx` - Auth sign-in
- `app/auth/verify.tsx` - Auth verify OTP

### Supporting Files
- `components/features/SignInPrompt.tsx` - Guest gate component
- All Phase 2 hooks in `hooks/`
- All Phase 2 API functions in `api/`
- Type definitions in `types/`

## Type Safety Checklist

✅ **No `any` types** (except in library interop)
✅ **All hook calls properly typed**
✅ **All API responses typed from database.types.ts**
✅ **Component props have explicit interfaces**
✅ **Zustand stores use proper type parameters**
✅ **Router params properly typed with useLocalSearchParams**

## Common TypeScript Patterns Used

### 1. TanStack Query Hook
```typescript
const { data, isLoading, error, refetch } = useQuery<ReturnType>({
  queryKey: ['key'],
  queryFn: async () => { /* ... */ },
});
```

### 2. Zustand Store
```typescript
interface StoreState {
  value: string | null;
  setValue: (v: string | null) => void;
}

const useStore = create<StoreState>((set) => ({
  value: null,
  setValue: (value) => set({ value }),
}));
```

### 3. Component Props
```typescript
interface ComponentProps {
  data: DatabaseType;
  onPress?: () => void;
}

export function Component({ data, onPress }: ComponentProps) {
  // ...
}
```

### 4. Router Params
```typescript
const params = useLocalSearchParams<{
  id: string;
  date: string;
}>();
```

## Post-Verification

Once TypeScript check passes:
- ✅ All types are correct
- ✅ No compilation errors
- ✅ Safe to deploy to production

---

**Note:** This guide documents the TypeScript verification process for Phase 3. The UNC path limitation is a known issue with the TypeScript compiler on Windows accessing WSL filesystems. The workaround (running from native WSL terminal) is the recommended approach.
