# Test Data Seeding - Quick Start ✅

## The Error That Was Fixed

**Before**: When trying to seed test data, you got:
```
error: "REQUEST_ERROR"
message: "relativeURL.replace is not a function"
```

**After**: The error is completely resolved and test data can be seeded successfully!

## How to Test

### 1. Open the Seed Data Page
Navigate to: `http://localhost:5173/test/seed-data`

### 2. Seed Test Data
- Click the **"Seed Test Data"** button
- Wait for results to display (should show success messages)
- Expected output:
  ```
  ✓ Created 4 test musicians
  ✓ Created 3 test songs
  ✓ Created 4 registrations
  ✓ Created 4 schedules
  ```

### 3. Verify the Data

#### Option A: View in Browse Jams Page
1. Navigate to: `/jams`
2. See jam cards with populated data
3. Card should show musician and song counts

#### Option B: View Jam Details
1. From seed page, click **"View Jam Details"** button
2. Or navigate directly to jam detail page: `/jams/:jamId`
3. Verify these sections are populated:
   - **Repertoire**: Shows 3 songs
   - **Musicians**: Shows 4 registered musicians
   - **Performance Schedule**: Shows 4 performance slots

#### Option C: Check Each Section Individually

**Musicians Created**:
- John Doe (Guitar)
- Jane Smith (Drums)
- Mike Johnson (Bass)
- Sarah Williams (Vocals)

**Songs Created**:
- Bluesette - Toots Thielemans
- All The Things You Are - Jerome Kern
- Girl from Ipanema - Tom Jobim

**Registrations**:
- Each musician linked to the jam with a song

**Performance Schedule**:
- All 4 musicians scheduled with performance order

## What Changed (Technical Details)

### The Issue
Services were trying to use `API_ENDPOINTS.musicians` (an object) as a URL string, causing axios to fail when trying to call `.replace()` on it.

### The Fix
1. **Flattened API Endpoints**: Changed from nested objects to flat URL strings
2. **Added All Missing Endpoints**: Defined all musician, music, registration, and schedule endpoints
3. **Updated Services**: Cast endpoints to strings where needed
4. **Added Missing Method**: Added `jamService.create()` for jam creation

### Example of What Was Fixed
```typescript
// ❌ BEFORE (caused the error)
const API_ENDPOINTS = {
  musicians: {
    list: '/musicians',
    detail: (id) => `/musicians/${id}`,
  }
}
return apiClient.post(API_ENDPOINTS.musicians, data)  // ❌ Passing object!

// ✅ AFTER (works correctly)
const API_ENDPOINTS = {
  musicians: '/musicos',
  musicianById: (id) => `/musicos/${id}`,
}
return apiClient.post(API_ENDPOINTS.musicians as string, data)  // ✅ Passing string!
```

## Troubleshooting

### If still getting the error:
1. **Clear browser cache**: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. **Rebuild**: Run `npm run build`
3. **Restart dev server**: Stop with Ctrl+C, then `npm run dev`
4. **Check backend**: Ensure backend API is running on the configured URL

### If test data doesn't appear:
1. Check browser console for errors (F12)
2. Verify backend API endpoints match the configured URLs
3. Check if backend database is properly initialized
4. Ensure you have proper authentication token if endpoints require it

### If components don't render data:
1. Open browser DevTools (F12)
2. Check the Network tab for API responses
3. Verify the response has the expected data structure
4. Check React Components tab to see state values

## Success Indicators ✅

You'll know everything is working when:

1. ✅ Seed page loads without errors
2. ✅ "Seed Test Data" button works without throwing errors
3. ✅ Success messages appear with created counts
4. ✅ Can navigate to jam detail page with real data
5. ✅ Repertoire section shows songs
6. ✅ Musicians section shows registered musicians
7. ✅ Performance schedule shows lineup
8. ✅ No red error messages in browser console

## Files Modified

- `src/lib/api/config.ts` - API endpoints configuration
- `src/services/musicianService.ts` - Musician API calls
- `src/services/musicService.ts` - Music/song API calls
- `src/services/registrationService.ts` - Registration API calls
- `src/services/scheduleService.ts` - Schedule API calls
- `src/services/jamService.ts` - Added `create()` method

## Documentation

For more details, see: `API-ENDPOINTS-FIX.md`

---

**Status**: Ready to Test ✅
**Date**: December 6, 2025

