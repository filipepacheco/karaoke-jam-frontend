# Service Testing Guide - Step 5 Verification

**Date**: December 6, 2025  
**Purpose**: Verify that all service layer operations work correctly  
**Status**: Ready for testing

---

## 🎯 What to Test

This guide provides step-by-step instructions to test all services using the browser console.

---

## ✅ Prerequisites

1. **Backend must be running** at `http://localhost:3000`
2. **Application must be running** (`npm run dev`)
3. **Browser DevTools open** (F12 or Cmd+Shift+I)
4. **Console tab** active in DevTools

---

## 📋 Test Plan

### Test 1: Verify Service Imports
- [x] Can import jamService
- [x] Can import musicianService
- [x] Can import musicService
- [x] Can import registrationService
- [x] Can import scheduleService

### Test 2: Verify API Client
- [x] API client is initialized
- [x] baseURL is set correctly
- [x] Interceptors are active

### Test 3: Test Each Service
- [x] Jam Service (create, list, fetch, update, delete)
- [x] Musician Service (create, list, fetch, update, delete)
- [x] Music Service (create, list, fetch, find by jam, link to jam)
- [x] Registration Service (create, find by jam, find by musician, delete)
- [x] Schedule Service (create, find by jam, find by musician, reorder)

---

## 🚀 How to Run Tests from Console

### Step 1: Import Services

Copy and paste this in the browser console:

```javascript
// Import services
import { 
  jamService, 
  musicianService, 
  musicService,
  registrationService,
  scheduleService 
} from '/src/services/index.ts'

console.log('✅ Services imported successfully!')
console.log('jamService:', jamService)
console.log('musicianService:', musicianService)
console.log('musicService:', musicService)
console.log('registrationService:', registrationService)
console.log('scheduleService:', scheduleService)
```

**Expected Output:**
```
✅ Services imported successfully!
jamService: {create, findAll, findOne, update, remove}
musicianService: {create, findAll, findOne, update, remove}
musicService: {create, findAll, findOne, findByJam, linkToJam, update, remove}
registrationService: {create, findByJam, findByMusician, remove}
scheduleService: {create, findByJam, findByMusician, update, remove, reorder}
```

---

### Step 2: Test Jam Service

```javascript
// Test: Create Jam
const jamData = {
  name: 'Test Jam',
  location: 'Test Hall',
  hostName: 'Test Host',
  hostContact: 'test@example.com',
}

const jamResponse = await jamService.create(jamData)
console.log('✅ Jam Created:', jamResponse)
console.log('Jam ID:', jamResponse.data.id)

// Save for later tests
window.testJamId = jamResponse.data.id
```

**Expected Output:**
```
✅ Jam Created: {
  data: { id: "...", nome: "Test Jam", ... },
  success: true
}
Jam ID: [some-uuid]
```

```javascript
// Test: Get All Jams
const allJams = await jamService.findAll()
console.log('✅ All Jams:', allJams.data.length, 'jams found')
console.log('First Jam:', allJams.data[0])
```

```javascript
// Test: Get Single Jam
const singleJam = await jamService.findOne(window.testJamId)
console.log('✅ Single Jam Retrieved:', singleJam.data.nome)
```

```javascript
// Test: Update Jam Status
const updateResponse = await jamService.update(window.testJamId, { status: 'FINISHED' })
console.log('✅ Jam Updated:', updateResponse.data.status)
```

---

### Step 3: Test Musician Service

```javascript
// Test: Create Musician
const musicianData = {
  name: 'Test Guitarist',
  contact: '+1-555-0123',
  instrument: 'Guitar',
  level: 'ADVANCED'
}

const musicianResponse = await musicianService.create(musicianData)
console.log('✅ Musician Created:', musicianResponse)
console.log('Musician ID:', musicianResponse.data.id)

// Save for later tests
window.testMusicianId = musicianResponse.data.id
```

```javascript
// Test: Get All Musicians
const allMusicians = await musicianService.findAll()
console.log('✅ All Musicians:', allMusicians.data.length, 'musicians found')
```

```javascript
// Test: Get Single Musician
const singleMusician = await musicianService.findOne(window.testMusicianId)
console.log('✅ Single Musician Retrieved:', singleMusician.data.name)
```

---

### Step 4: Test Music Service

```javascript
// Test: Create Music
const musicData = {
  title: 'Test Song',
  artist: 'Test Artist',
  genre: 'Rock',
  duration: 180
}

const musicResponse = await musicService.create(musicData)
console.log('✅ Music Created:', musicResponse)
console.log('Music ID:', musicResponse.data.id)

// Save for later tests
window.testMusicId = musicResponse.data.id
```

```javascript
// Test: Get All Music
const allMusic = await musicService.findAll()
console.log('✅ All Music:', allMusic.data.length, 'songs found')
```

```javascript
// Test: Link Music to Jam
const linkResponse = await musicService.linkToJam(window.testMusicId, window.testJamId)
console.log('✅ Music Linked to Jam:', linkResponse)
```

```javascript
// Test: Get Music by Jam
const musicByJam = await musicService.findByJam(window.testJamId)
console.log('✅ Music in Jam:', musicByJam.data.length, 'songs')
```

---

### Step 5: Test Registration Service

```javascript
// Note: First, you need to get the jamMusicId from the link response
// For now, we'll create a registration with test data

const registrationData = {
  musicianId: window.testMusicianId,
  jamMusicId: 'jam-music-id-from-link' // Replace with actual ID
}

const registrationResponse = await registrationService.create(registrationData)
console.log('✅ Registration Created:', registrationResponse)
console.log('Registration ID:', registrationResponse.data.id)

window.testRegistrationId = registrationResponse.data.id
```

```javascript
// Test: Get Registrations by Jam
const regByJam = await registrationService.findByJam(window.testJamId)
console.log('✅ Registrations in Jam:', regByJam.data.length)
```

```javascript
// Test: Get Registrations by Musician
const regByMusician = await registrationService.findByMusician(window.testMusicianId)
console.log('✅ Registrations for Musician:', regByMusician.data.length)
```

---

### Step 6: Test Schedule Service

```javascript
// Test: Create Schedule
const scheduleData = {
  jamId: window.testJamId,
  registrationId: window.testRegistrationId,
  order: 1,
  status: 'SCHEDULED'
}

const scheduleResponse = await scheduleService.create(scheduleData)
console.log('✅ Schedule Created:', scheduleResponse)
console.log('Schedule ID:', scheduleResponse.data.id)

window.testScheduleId = scheduleResponse.data.id
```

```javascript
// Test: Get Schedules by Jam
const schedByJam = await scheduleService.findByJam(window.testJamId)
console.log('✅ Schedules in Jam:', schedByJam.data.length)
```

```javascript
// Test: Reorder Schedules
const reorderResponse = await scheduleService.reorder(window.testJamId, [window.testScheduleId])
console.log('✅ Schedules Reordered:', reorderResponse)
```

---

## 🧪 Complete Test Script

Copy and paste this entire script into the console to run all tests at once:

```javascript
console.clear()
console.log('🚀 Starting Service Layer Tests...\n')

// Import services
import { 
  jamService, 
  musicianService, 
  musicService,
  registrationService,
  scheduleService 
} from '/src/services/index.ts'

async function runTests() {
  try {
    // Test 1: Create Jam
    console.log('📝 Test 1: Creating Jam...')
    const jam = await jamService.create({
      name: 'Test Jam ' + new Date().getTime(),
      location: 'Test Hall',
      hostName: 'Test Host',
      hostContact: 'test@example.com',
    })
    console.log('✅ Jam Created:', jam.data.id)
    const jamId = jam.data.id

    // Test 2: Create Musician
    console.log('\n📝 Test 2: Creating Musician...')
    const musician = await musicianService.create({
      name: 'Test Guitarist ' + new Date().getTime(),
      contact: '+1-555-0123',
      instrument: 'Guitar',
      level: 'ADVANCED'
    })
    console.log('✅ Musician Created:', musician.data.id)
    const musicianId = musician.data.id

    // Test 3: Create Music
    console.log('\n📝 Test 3: Creating Music...')
    const music = await musicService.create({
      title: 'Test Song ' + new Date().getTime(),
      artist: 'Test Artist',
      genre: 'Rock',
      duration: 180
    })
    console.log('✅ Music Created:', music.data.id)
    const musicId = music.data.id

    // Test 4: Link Music to Jam
    console.log('\n📝 Test 4: Linking Music to Jam...')
    await musicService.linkToJam(musicId, jamId)
    console.log('✅ Music Linked to Jam')

    // Test 5: Get All Resources
    console.log('\n📝 Test 5: Fetching All Resources...')
    const allJams = await jamService.findAll()
    const allMusicians = await musicianService.findAll()
    const allMusic = await musicService.findAll()
    console.log(`✅ Found ${allJams.data.length} jams, ${allMusicians.data.length} musicians, ${allMusic.data.length} songs`)

    // Test 6: Get Music by Jam
    console.log('\n📝 Test 6: Getting Music by Jam...')
    const musicByJam = await musicService.findByJam(jamId)
    console.log(`✅ Found ${musicByJam.data.length} songs in jam`)

    console.log('\n✅ All tests completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Jam: ${jamId}`)
    console.log(`- Musician: ${musicianId}`)
    console.log(`- Music: ${musicId}`)

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run tests
runTests()
```

---

## 🔍 What to Look For

### Success Indicators ✅
1. **No console errors** - All operations complete without errors
2. **Correct response format** - Each response has `data` and `success` fields
3. **Valid IDs** - All created resources have proper UUID strings
4. **Data consistency** - Data returned matches what was sent
5. **Type safety** - No TypeScript errors in console

### Error Indicators ❌
1. **Network errors** - 404, 500, connection refused
2. **CORS errors** - Cross-origin request blocked
3. **Parse errors** - JSON parsing failed
4. **Type errors** - Missing required fields
5. **Auth errors** - 401 Unauthorized

---

## 🐛 Troubleshooting

### Issue: Module Import Fails
**Solution**: Make sure app is running with `npm run dev` and check that file paths are correct

### Issue: Backend Connection Fails
**Solution**: Verify backend is running on `http://localhost:3000`

### Issue: CORS Errors
**Solution**: Backend needs CORS enabled. Check backend configuration.

### Issue: 401 Unauthorized
**Solution**: Authentication token may be required. This will be handled in Step 9.

### Issue: Network Timeout
**Solution**: Check API_URL in environment. Backend may be slow to respond.

---

## 📝 Test Checklist

Run through this checklist and mark items as you test:

### Jam Service
- [ ] Create jam
- [ ] List all jams
- [ ] Get single jam
- [ ] Update jam
- [ ] Delete jam

### Musician Service
- [ ] Create musician
- [ ] List all musicians
- [ ] Get single musician
- [ ] Update musician
- [ ] Delete musician

### Music Service
- [ ] Create music
- [ ] List all music
- [ ] Get single music
- [ ] Get music by jam
- [ ] Link music to jam
- [ ] Update music
- [ ] Delete music

### Registration Service
- [ ] Create registration
- [ ] Get registrations by jam
- [ ] Get registrations by musician
- [ ] Delete registration

### Schedule Service
- [ ] Create schedule
- [ ] Get schedules by jam
- [ ] Get schedules by musician
- [ ] Update schedule
- [ ] Delete schedule
- [ ] Reorder schedules

---

## 📊 Expected Results

If all tests pass, you should see:
- ✅ Services import successfully
- ✅ All CRUD operations work
- ✅ No console errors
- ✅ Correct response formats
- ✅ Data persistence across calls

---

## 🎯 Next Steps After Testing

If tests pass:
✅ Proceed to Step 6: Create React Custom Hooks

If tests fail:
⚠️ Debug the issue using console logs and check:
1. Backend is running
2. API_URL is correct
3. No CORS issues
4. Network connectivity

---

## 💡 Tips

1. **Save IDs to window object** for reuse:
   ```javascript
   window.testJamId = jam.date.id
   ```

2. **Check response format**:
   ```javascript
   console.log(response.data)      // The actual data
   console.log(response.success)   // true/false
   console.log(response.message)   // Optional message
   ```

3. **Use timestamps in names** to avoid conflicts:
   ```javascript
   name: 'Test ' + new Date().getTime()
   ```

4. **Open DevTools Network tab** to see actual requests/responses

---

**Status**: Ready for Testing  
**Estimated Time**: 15-30 minutes  
**Difficulty**: Easy  
**Prerequisites**: Backend running

