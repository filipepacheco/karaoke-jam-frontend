# Service Testing - Complete Guide

**Date**: December 6, 2025  
**Purpose**: Comprehensive guide to test Step 5 (Service Layer)  
**Status**: Ready for Testing

---

## 📋 Overview

This document provides multiple ways to test the service layer implementations.

### Three Testing Methods

1. **Browser Console Testing** - Direct commands in DevTools
2. **UI Component Testing** - Interactive test component
3. **Unit Testing** - Automated test files (future)

---

## 🎯 Test Objectives

Verify that:
- ✅ All services are properly imported
- ✅ API client is configured correctly
- ✅ All HTTP methods work (GET, POST, PATCH, DELETE, PUT)
- ✅ Responses are properly standardized
- ✅ Error handling works correctly
- ✅ Authentication headers are injected
- ✅ Base URL is correct

---

## ✅ Prerequisites for Testing

### Required
1. **Backend running** on `http://localhost:3000`
2. **Frontend running** with `npm run dev`
3. **No authentication required** (for MVP testing)

### Optional
- Browser DevTools (F12) for console testing
- Network tab for debugging requests

---

## 🚀 Method 1: Browser Console Testing

### Setup

1. Start the application: `npm run dev`
2. Open browser to `http://localhost:3000`
3. Open DevTools: F12 (or Cmd+Shift+I on Mac)
4. Go to **Console** tab

### Quick Test - Copy & Paste

```javascript
// Step 1: Import services
import { jamService, musicianService, musicService } from '/src/services/index.ts'
console.log('✅ Services imported')

// Step 2: Create a jam
const jam = await jamService.create({
  name: 'Quick Test Jam',
  location: 'Test',
  hostName: 'Test',
  hostContact: 'test@test.com'
})
console.log('✅ Jam created:', jam.data.id)

// Step 3: List all jams
const all = await jamService.findAll()
console.log('✅ Total jams:', all.data.length)
```

### Expected Output
```
✅ Services imported
✅ Jam created: [UUID]
✅ Total jams: 1
```

### Full Test Suite

See **docs/TESTING-GUIDE.md** for complete console test scripts.

---

## 🎨 Method 2: UI Component Testing

### Setup

1. Import the test component in your app:

```typescript
// In your App.tsx or a dev routes file
import { ServiceTestComponent } from '@/components/ServiceTestComponent'

// Render it
<ServiceTestComponent />
```

Or use the test page:

```typescript
// In App.tsx
import TestPage from '@/pages/TestPage'

// Render it
<TestPage />
```

### How to Use

1. Navigate to the test page in your browser
2. Click "Test All Services"
3. Check results
4. Click individual service buttons to test specific services

### What It Tests

- ✅ Create jam
- ✅ Create musician  
- ✅ Create music
- ✅ List all resources
- ✅ Error handling

---

## 🧪 Testing Workflow

### Test 1: Verify API Client

```javascript
import { apiClient, API_CONFIG } from '@/lib/api'

console.log('API Base URL:', API_CONFIG.baseURL)
console.log('API Client:', apiClient)
console.log('✅ API Client is ready')
```

**Expected**: Should show `http://localhost:3000` and the client object.

### Test 2: Create Resource

```javascript
import { jamService } from '@/services'

const result = await jamService.create({
  name: 'Test Jam',
  location: 'Hall',
  hostName: 'Host',
  hostContact: 'host@test.com'
})

console.log('Response format:', result)
console.log('Has data?', !!result.data)
console.log('Is success?', result.success)
```

**Expected**:
```
Response format: { data: {...}, success: true }
Has data? true
Is success? true
```

### Test 3: List Resources

```javascript
import { jamService } from '@/services'

const result = await jamService.findAll()
console.log('Number of jams:', result.data.length)
console.log('Is array?', Array.isArray(result.data))
```

**Expected**:
```
Number of jams: 1 (or more)
Is array? true
```

### Test 4: Get Single Resource

```javascript
import { jamService } from '@/services'

// First get all to get an ID
const all = await jamService.findAll()
const firstJamId = all.data[0].id

// Then fetch single
const single = await jamService.findOne(firstJamId)
console.log('Fetched jam:', single.data.nome)
```

**Expected**:
```
Fetched jam: [jam name]
```

### Test 5: Update Resource

```javascript
import { jamService } from '@/services'

const jam = (await jamService.findAll()).data[0]
const updated = await jamService.update(jam.id, { status: 'FINISHED' })
console.log('Updated status:', updated.data.status)
```

**Expected**:
```
Updated status: FINISHED
```

### Test 6: Error Handling

```javascript
import { jamService } from '@/services'

try {
  await jamService.findOne('invalid-id-12345')
} catch (error) {
  console.log('Error caught:', error.message)
  console.log('Status code:', error.statusCode)
}
```

**Expected**:
```
Error caught: [user-friendly message]
Status code: 404 (or similar)
```

---

## 🔍 Success Criteria

### ✅ All Tests Pass If

1. **No console errors** - Red errors mean test failed
2. **Correct response format** - Has `data` and `success`
3. **Valid IDs** - Created resources have UUID strings
4. **Data consistency** - Returned data matches sent data
5. **Proper error handling** - Errors caught and formatted

### ❌ Tests Fail If

1. **Network errors** - Can't reach backend
2. **CORS errors** - Cross-origin not allowed
3. **Type errors** - Missing required fields
4. **Auth errors** - 401 Unauthorized
5. **Malformed responses** - Not matching expected format

---

## 🐛 Debugging Tips

### Issue: Cannot import modules

**Solution**: Make sure app is running with `npm run dev`

```javascript
// This might fail
import { jamService } from '@/services'

// Try full path
import { jamService } from '/src/services/index.ts'
```

### Issue: Network error / Cannot reach backend

**Solution**: Verify backend is running

```bash
# Check if backend is running
curl http://localhost:3000/health

# If not, start backend (in separate terminal)
# (depends on your backend setup)
```

### Issue: CORS error

**Symptoms**: 
```
Access to XMLHttpRequest at 'http://localhost:3000/jams' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution**: Backend needs CORS enabled. Check backend configuration.

### Issue: 401 Unauthorized

**Symptoms**: Error message says "Unauthorized"

**Solution**: This is expected for MVP. Will be handled in Step 9 (Auth).

### Issue: Response format wrong

**Check**:
```javascript
const response = await jamService.create(data)
console.log(response)        // Should have: data, success
console.log(response.data)   // The actual jam object
console.log(response.success)// true
```

---

## 📊 Test Coverage Checklist

### Jam Service ✅
- [ ] Create jam
- [ ] List all jams
- [ ] Get single jam by ID
- [ ] Update jam status
- [ ] Delete jam

### Musician Service ✅
- [ ] Create musician
- [ ] List all musicians
- [ ] Get single musician by ID
- [ ] Update musician
- [ ] Delete musician

### Music Service ✅
- [ ] Create music
- [ ] List all music
- [ ] Get single music by ID
- [ ] Get music by jam
- [ ] Link music to jam
- [ ] Update music
- [ ] Delete music

### Registration Service ✅
- [ ] Create registration
- [ ] Get registrations by jam
- [ ] Get registrations by musician
- [ ] Delete registration

### Schedule Service ✅
- [ ] Create schedule
- [ ] Get schedules by jam
- [ ] Get schedules by musician
- [ ] Update schedule
- [ ] Delete schedule
- [ ] Reorder schedules

---

## 📈 Test Results Report

After running tests, create a report:

```
✅ SERVICE TESTING REPORT
========================

Date: [date]
Backend URL: http://localhost:3000
API Status: Connected

SERVICES TESTED:
✅ Jam Service - 5/5 methods working
✅ Musician Service - 5/5 methods working
✅ Music Service - 7/7 methods working
⏳ Registration Service - Not tested
⏳ Schedule Service - Not tested

RESPONSE FORMAT:
✅ ApiResponse<T> wrapper implemented
✅ data field populated
✅ success field true on success
✅ Error handling working

ISSUES FOUND:
- None

READY FOR STEP 6: YES ✅
```

---

## 🎯 When Tests Are Complete

### ✅ If All Tests Pass
- Proceed to Step 6: Create React Custom Hooks
- Services are production-ready
- Can start building UI components

### ⚠️ If Some Tests Fail
- Check error messages in console
- Verify backend is running
- Check API URL configuration
- Review service implementation
- Fix issues before proceeding

### 🆘 If All Tests Fail
- Verify backend connectivity
- Check DevTools Network tab
- Review CORS configuration
- Check API_URL environment variable
- May need to adjust backend or frontend setup

---

## 📚 Related Files

- **docs/TESTING-GUIDE.md** - Detailed console test commands
- **src/components/ServiceTestComponent.tsx** - Interactive test UI
- **src/pages/TestPage.tsx** - Standalone test page
- **src/__tests__/services/testUtils.ts** - Testing utilities

---

## ⏱️ Estimated Testing Time

- Quick test (1 service): **2-3 minutes**
- Full test (all services): **10-15 minutes**
- Debugging (if issues): **15-30 minutes**

---

## ✅ Sign-Off

Once all tests pass:

- [ ] All services responding correctly
- [ ] Response format standardized
- [ ] Error handling working
- [ ] API client configured properly
- [ ] Ready for Step 6

**Status**: ✅ Ready for Testing  
**Next Step**: Step 6 - React Custom Hooks  
**Blockers**: None

---

## 📞 Support

If tests fail or you have questions:

1. Check **docs/TESTING-GUIDE.md** for command examples
2. Review **docs/STEPS-4-5-COMPLETE.md** for implementation details
3. Check browser console for detailed errors
4. Verify backend is running and accessible

---

**Last Updated**: December 6, 2025  
**Status**: Complete and Ready for Testing

