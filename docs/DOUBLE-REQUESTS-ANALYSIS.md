# 🔍 Double Network Requests - Analysis & Solutions

**Date**: December 6, 2025  
**Issue**: Hooks making duplicate network requests  
**Status**: 2 Causes Identified

---

## 🐛 Two Causes of Double Requests

### Cause #1: React Strict Mode (Development Only) ✅ EXPECTED

**What is it?**
- React's `<StrictMode>` intentionally calls hooks twice in development
- This helps detect side effects and impure code
- **Only happens in development, NOT in production**

**Location**: `src/main.tsx`
```typescript
<StrictMode>
  <App />
</StrictMode>
```

**Why it exists:**
- Helps find bugs early
- Tests that your hooks are pure
- Verifies cleanup functions work correctly

**Result:**
- Each hook runs twice on mount
- Network requests appear duplicated
- Console logs appear twice
- **This is NORMAL and EXPECTED in development**

---

### Cause #2: Potential Double useEffect Issue ⚠️ POSSIBLE ISSUE

**In `useQuery.ts` we have TWO useEffect calls:**

```typescript
// useEffect #1 - Updates ref when fetchFn changes
useEffect(() => {
  fetchFnRef.current = fetchFn
}, [fetchFn])

// useEffect #2 - Calls fetch when deps change
useEffect(() => {
  fetch()
}, [depsKey, fetch])
```

**Potential Problem:**
- If `fetchFn` changes on initial mount
- useEffect #1 runs → updates ref
- useEffect #2 also runs → calls fetch
- Both run at nearly same time
- Could cause timing issues

---

## 🎯 What You're Seeing

### Expected Behavior (Strict Mode):
```
Network Tab:
1. Request to /jams (first render)
2. Request to /jams (second render - StrictMode)
3. ✅ This is NORMAL in development
```

### Unexpected Behavior (if there's a bug):
```
Network Tab:
1. Request to /jams
2. Request to /jams
3. Request to /jams (third time!)
4. ❌ This would indicate a real issue
```

---

## 🔍 How to Diagnose

### Test 1: Count Network Requests
```
1. Open http://localhost:5173/?hooks=true
2. Open Network tab (F12)
3. Clear all requests
4. Refresh page
5. Count requests to same endpoint
```

**If you see 2 requests per hook:**
- ✅ This is Strict Mode (expected)
- No action needed

**If you see 3+ requests per hook:**
- ⚠️ There might be a bug
- Need to investigate further

---

### Test 2: Disable Strict Mode (Temporarily)

**Edit `src/main.tsx`:**
```typescript
// Before
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// After (test only - DO NOT commit)
createRoot(document.getElementById('root')!).render(
  <App />
)
```

**Then refresh and check Network tab:**
- If now seeing 1 request per hook → It was just Strict Mode ✅
- If still seeing 2+ requests → There's a real bug ⚠️

**Important**: Re-enable StrictMode after testing!

---

## ✅ Solution Options

### Option 1: Keep Strict Mode (RECOMMENDED)

**Do this if:**
- Only seeing 2 requests per hook
- This is normal development behavior
- Production builds won't have this issue

**Action:**
- No changes needed
- This is expected React behavior
- Helps catch bugs early

---

### Option 2: Optimize useQuery (If Real Issue)

**Do this if:**
- Seeing 3+ requests per hook
- Or if timing issues occur

**Fix**: Combine the two useEffect calls

```typescript
export function useQuery<T>(
  fetchFn: () => Promise<T>,
  dependencies: unknown[] = []
): UseQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetchFnRef = useRef(fetchFn)
  const depsKey = JSON.stringify(dependencies)
  
  // Single useEffect for everything
  useEffect(() => {
    // Update ref
    fetchFnRef.current = fetchFn
    
    // Then fetch
    const fetch = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const result = await fetchFnRef.current()
        setData(result)
        setError(null)
      } catch (err) {
        const apiError = err as ApiError
        setError(apiError.message || 'An error occurred')
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetch()
  }, [depsKey]) // Only depend on depsKey
  
  // Stable refetch function
  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchFnRef.current()
      setData(result)
      setError(null)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'An error occurred')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])
  
  return {
    data,
    loading,
    error,
    refetch,
  }
}
```

---

### Option 3: Disable Strict Mode (NOT RECOMMENDED)

**Only do this if:**
- You're absolutely sure it's causing issues
- You understand the trade-offs
- You're debugging a specific problem

**Trade-offs:**
- Won't catch potential bugs
- Won't detect impure code
- React team recommends keeping it enabled
- Production bundles don't include StrictMode anyway

---

## 📊 Understanding Strict Mode

### What Strict Mode Does:

1. **Double Invokes Functions** (Development only):
   - Renders components twice
   - Calls useEffect twice
   - Calls useState initializers twice

2. **Why?**
   - Catches accidental side effects
   - Verifies idempotent operations
   - Tests cleanup functions

3. **Production Behavior:**
   - Strict Mode is automatically removed
   - No double renders
   - No double network requests
   - Normal single execution

---

## 🧪 Quick Test Script

### Check if it's Strict Mode:

```javascript
// In browser console
let renderCount = 0

// Create a test hook
function TestHook() {
  renderCount++
  console.log('Render count:', renderCount)
  return null
}

// If you see count go 1, 2 quickly → Strict Mode
// If you see count go 1, 2, 3, 4 → Real issue
```

---

## 💡 Best Practices

### Do:
- ✅ Keep Strict Mode enabled
- ✅ Write idempotent hooks (can run twice safely)
- ✅ Proper cleanup in useEffect
- ✅ Test in production mode before deployment

### Don't:
- ❌ Disable Strict Mode without good reason
- ❌ Rely on hooks running only once
- ❌ Put side effects in render
- ❌ Forget that dev ≠ production behavior

---

## 🎯 Recommendation

### If Seeing 2 Requests Per Hook:
**Action**: Keep as-is
- This is normal Strict Mode behavior
- Helps catch bugs
- Won't affect production
- ✅ No changes needed

### If Seeing 3+ Requests Per Hook:
**Action**: Apply Option 2 (optimize useQuery)
- Consolidate useEffect calls
- Reduce timing issues
- Maintain functionality
- ⚠️ Needs code update

---

## 📝 Summary

| Scenario | Requests | Cause | Action |
|----------|----------|-------|--------|
| 2 per hook | Expected | Strict Mode | None needed ✅ |
| 3+ per hook | Bug | Double useEffect | Fix useQuery ⚠️ |
| 1 per hook | Production | No Strict Mode | Expected ✅ |

---

## 🔧 Quick Fix (If Needed)

If you determine there's a real issue and want to fix it:

1. **Test first**: Temporarily disable Strict Mode
2. **Count requests**: Still seeing duplicates?
3. **If yes**: Apply Option 2 optimization
4. **If no**: Re-enable Strict Mode, it's normal

---

**Status**: Analysis Complete  
**Most Likely**: Strict Mode causing double requests (expected)  
**Action**: Test with Strict Mode disabled to confirm  
**Documentation**: Complete

---

**To test**: 
1. Temporarily comment out `<StrictMode>` in main.tsx
2. Refresh and check Network tab
3. If down to 1 request → It was Strict Mode (expected) ✅
4. If still 2+ requests → Apply optimization fix ⚠️

