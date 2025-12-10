# Hook Testing Guide

**Date**: December 6, 2025  
**Status**: Ready to Test ✅

---

## 🎯 How to Test Custom Hooks

I've created a comprehensive hook testing infrastructure with an interactive UI!

---

## 🚀 Quick Start - Test Hooks Now

### Step 1: Start Your App
```bash
npm run dev
```

### Step 2: Open Hook Test Page
Navigate to:
```
http://localhost:5173/?hooks=true
```

### Step 3: Test Hooks Interactively
1. Click "Auto-Fill Test IDs" to populate IDs from data
2. Or manually enter IDs in the input fields
3. Watch hooks fetch data in real-time
4. Click "Refresh" on any card to manually refetch
5. Expand "View Data" to see actual responses

---

## 📁 What Was Created

### Testing Components
```
src/components/test/
└── HookTestComponent.tsx         (200+ lines) Interactive hook tester

src/pages/
└── HookTestPage.tsx               (120+ lines) Dedicated test page

src/App.tsx                        Updated with ?hooks=true route
```

---

## 🪝 Hooks Being Tested

### List Hooks (No Parameters)
- ✅ `useJams()` - Get all jams
- ✅ `useMusicians()` - Get all musicians
- ✅ `useAllMusic()` - Get all music

### Single Item Hooks (Need ID)
- ✅ `useJam(id)` - Get jam by ID
- ✅ `useMusician(id)` - Get musician by ID
- ✅ `useMusic(id)` - Get music by ID

### Related Data Hooks
- ✅ `useMusicByJam(jamId)` - Get music for jam
- ✅ `useRegistrationsByJam(jamId)` - Get registrations for jam
- ✅ `useRegistrationsByMusician(musicianId)` - Get registrations for musician
- ✅ `useScheduleByJam(jamId)` - Get schedules for jam
- ✅ `useScheduleByMusician(musicianId)` - Get schedules for musician

**Total: 11 hooks tested**

---

## 🎨 Test Page Features

### Visual Cards for Each Hook
- 📊 Shows loading state with spinner
- ✅ Shows success with green badge and item count
- ❌ Shows errors with red alert
- 🔄 "Refresh" button to manually refetch
- 📋 "View Data" expandable to see raw response

### ID Input Fields
- 📝 Manual input for Jam ID, Musician ID, Music ID
- 🔘 "Auto-Fill Test IDs" button to populate from fetched data
- 🔄 IDs update related hooks automatically

### Real-Time Testing
- ⚡ Hooks fetch data on component mount
- 🔄 Re-fetch when dependencies change
- 📊 Live loading/error/success states
- 💾 See actual API responses

---

## 💻 What You'll See

### For Each Hook:

```
┌─────────────────────────────────────┐
│ useJams()                    🔄     │  ← Hook name + loading spinner
├─────────────────────────────────────┤
│ ✅ 3 items        [Refresh]        │  ← Success badge + refresh button
│                                     │
│ ▼ View Data                        │  ← Expandable data viewer
│   {                                │
│     "id": "...",                   │
│     "nome": "Friday Jam",          │
│     ...                            │
│   }                                │
└─────────────────────────────────────┘
```

---

## ✅ Success Indicators

### Hook Working Correctly If:
- ✅ Shows "Loading..." initially
- ✅ Then shows green badge with count
- ✅ "Refresh" button appears
- ✅ Can expand to see data
- ✅ Data matches expected format

### Hook Has Issues If:
- ❌ Red error alert appears
- ❌ Error message shown
- ❌ No data appears
- ❌ Console has errors (F12)

---

## 🔍 Testing Workflow

### 1. Test List Hooks First
```
1. Open http://localhost:5173/?hooks=true
2. Look at "List Hooks" section
3. Check useJams(), useMusicians(), useAllMusic()
4. Verify they show item counts
5. Click "Refresh" to test manual refetch
```

### 2. Test Single Item Hooks
```
1. Click "Auto-Fill Test IDs" button
2. IDs populate from first items in lists
3. Check "Single Item Hooks" section
4. Verify single items load correctly
5. Try changing IDs manually
```

### 3. Test Related Data Hooks
```
1. With IDs filled, check "Related Data Hooks"
2. Verify useMusicByJam shows music for that jam
3. Verify useRegistrationsByJam shows registrations
4. Try different IDs to test re-fetching
```

---

## 📊 Expected Results

### All Tests Pass ✅
```
✅ useJams() - 3 items
✅ useMusicians() - 5 items
✅ useAllMusic() - 10 items
✅ useJam('123') - 1 item
✅ useMusician('456') - 1 item
✅ useMusic('789') - 1 item
✅ useMusicByJam('123') - 2 items
✅ useRegistrationsByJam('123') - 4 items
... etc
```

### Some Tests Fail ⚠️
```
✅ useJams() - 3 items
❌ useJam('invalid-id') - Error: Not found
✅ useMusicians() - 5 items
❌ useMusicByJam('') - Error: Invalid ID
```

---

## 🐛 Troubleshooting

### Issue: All Hooks Show "Loading..."
**Cause**: Backend not running  
**Solution**: Start backend on http://localhost:3000

### Issue: Red Error: "Network error"
**Cause**: Cannot reach backend  
**Solution**: 
1. Verify backend is running
2. Check `VITE_API_URL` in .env
3. Test: curl http://localhost:3000/health

### Issue: Red Error: "CORS blocked"
**Cause**: Backend CORS not enabled  
**Solution**: Enable CORS on backend for localhost:5173

### Issue: No Data After Loading
**Cause**: Database empty or wrong endpoint  
**Solution**:
1. Check backend logs
2. Verify database has data
3. Check browser Network tab (F12)

### Issue: "Cannot read property 'length'"
**Cause**: Hook expecting array but got object  
**Solution**: Check API response format

---

## 🎯 Test Checklist

Run through this checklist:

### Prerequisites
- [ ] Backend running on localhost:3000
- [ ] Database has test data
- [ ] App running with `npm run dev`
- [ ] Browser at http://localhost:5173/?hooks=true

### List Hooks
- [ ] useJams() loads and shows count
- [ ] useMusicians() loads and shows count
- [ ] useAllMusic() loads and shows count
- [ ] Refresh button works on each

### Single Item Hooks
- [ ] Click "Auto-Fill Test IDs"
- [ ] useJam(id) loads single jam
- [ ] useMusician(id) loads single musician
- [ ] useMusic(id) loads single music
- [ ] Can manually change IDs and see re-fetch

### Related Data Hooks
- [ ] useMusicByJam(jamId) shows music
- [ ] useRegistrationsByJam(jamId) shows registrations
- [ ] useRegistrationsByMusician(musicianId) shows registrations
- [ ] useScheduleByJam(jamId) shows schedules
- [ ] useScheduleByMusician(musicianId) shows schedules

### Functionality
- [ ] Loading states appear during fetch
- [ ] Error states show on failure
- [ ] Success states show on success
- [ ] Refresh buttons work
- [ ] View Data expands correctly
- [ ] Changing IDs triggers re-fetch

---

## 💡 Pro Tips

### Tip 1: Use Browser DevTools
- Press F12 to open DevTools
- Go to Console tab - see hook logs
- Go to Network tab - see API requests
- Check what data is actually returned

### Tip 2: Test Edge Cases
- Try invalid IDs (should show errors)
- Try empty strings (should show errors)
- Try refreshing multiple times
- Try changing IDs quickly

### Tip 3: Check Data Format
- Expand "View Data" to see raw responses
- Verify data structure matches types
- Check for missing fields
- Verify nested data loads correctly

### Tip 4: Test Manual Refresh
- Click refresh after modifying backend data
- Should fetch latest data
- Loading state should appear briefly
- New data should display

---

## 📖 Hook Return Format

Every hook returns this format:
```typescript
{
  data: T | null,         // The fetched data (or null)
  loading: boolean,       // Is request in progress?
  error: string | null,   // Error message (or null)
  refetch: () => void     // Manual refresh function
}
```

---

## 🎨 Component Usage Example

Here's how the test component uses hooks:

```typescript
// Using a list hook
const { data: jams, loading, error, refetch } = useJams()

// Display loading
if (loading) return <Spinner />

// Display error
if (error) return <ErrorAlert message={error} />

// Display data
return (
  <div>
    {jams?.map(jam => <div key={jam.id}>{jam.nome}</div>)}
    <button onClick={refetch}>Refresh</button>
  </div>
)
```

---

## 🚀 Quick Links

**Hook Test Page:**
```
http://localhost:5173/?hooks=true
```

**Service Test Page:**
```
http://localhost:5173/?test=true
```

**Normal App:**
```
http://localhost:5173/
```

---

## 📚 Related Documentation

- `docs/STEP-6-COMPLETE.md` - Hook implementation details
- `src/hooks/` - Hook source code
- `src/components/test/HookTestComponent.tsx` - Test component
- `src/pages/HookTestPage.tsx` - Test page

---

## ✅ Test Completion

### All Tests Pass When:
- ✅ All 11 hooks load data successfully
- ✅ Loading states work correctly
- ✅ Error handling works for invalid data
- ✅ Refresh buttons manually refetch data
- ✅ Changing IDs triggers re-fetching
- ✅ Data format matches TypeScript types

### Ready for Production When:
- ✅ All hooks tested and working
- ✅ No console errors
- ✅ Data displays correctly
- ✅ Error states handled gracefully
- ✅ Loading states show properly

---

**Status**: Hook Testing Infrastructure Complete ✅  
**Access**: http://localhost:5173/?hooks=true  
**Time to Test**: 5-10 minutes  

Happy testing! 🪝

