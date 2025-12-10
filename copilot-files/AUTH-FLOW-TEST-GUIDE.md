## Auth Flow Testing Guide

### Quick Start

Access the test page: **`http://localhost:5173/?authFlow=true`**

---

## Test Components

### 1. Auth Services Testing

**Test Login with Email**
- Click "Test Login (Email)"
- Backend should:
  - Check if user with email exists
  - If not: create new musician, return token
  - If yes: return existing user, return token
- Expected result: User logged in, email displayed
- localStorage: Should have `auth_token` and `auth_user`

**Test Login with Phone**
- Click "Test Login (Phone)"
- Backend should:
  - Check if user with phone exists
  - If not: create new musician, return token
  - If yes: return existing user, return token
- Expected result: User logged in, phone displayed
- localStorage: Should have `auth_token` and `auth_user`

**Test Logout**
- Click "Test Logout" (only enabled when logged in)
- Backend should clear session
- Frontend should:
  - Clear user from AuthContext
  - Clear localStorage
  - Reset role to 'viewer'
- Expected result: Logged out state, no user data

### 2. Jam Services Testing

**Test Get Jam Details**
- Requires jam to exist in backend with ID `test-jam-1`
- Click "Test Get Jam Details"
- Should return:
  - Jam name
  - Jam status
  - Specialty slots with required/registered counts
- Expected result: Jam info displayed

**Test Most Needed Specialty**
- Requires jam with specialty slots
- Click "Test Most Needed Specialty"
- Should return specialty with most available slots
- Expected result: Specialty name displayed

### 3. Validation Tests

**Test Input Validation**
- Click "Test Input Validation"
- Tests:
  - ✓ Invalid email format → should fail
  - ✓ Valid email format → should pass
  - ✓ Phone too short → should fail
  - ✓ Valid phone format → should pass
- Expected: All 4 validation tests show results

---

## Manual Test Scenarios

### Scenario 1: New User Flow
1. **Fresh browser state** - Clear localStorage
2. **Click "Test Login (Email)"** with `newuser@example.com`
   - ✅ User should be created
   - ✅ Token stored in localStorage
   - ✅ Auth state shows user is logged in
3. **Refresh page** (F5)
   - ✅ User should still be logged in (persistent login)
4. **Click "Check Auth State"**
   - ✅ Should show same user ID

### Scenario 2: Existing User Flow
1. **Login with email** (from Scenario 1)
2. **Click "Test Login (Email)"** with **same email again**
   - ✅ Should return existing user (not create new)
   - ✅ Same user ID
   - ✅ Same token
3. **Check timestamp** in results - should be consistent

### Scenario 3: Phone Login
1. **Click "Test Login (Phone)"** with `9876543210`
   - ✅ New user created with phone
   - ✅ User logged in
   - ✅ Phone displayed in auth state
2. **Click "Test Login (Phone)"** with **same phone**
   - ✅ Should return existing user
   - ✅ Same user ID as before

### Scenario 4: Logout and Re-login
1. **Login with email**
2. **Click "Test Logout"**
   - ✅ localStorage cleared
   - ✅ Auth state cleared
   - ✅ Role reset to 'viewer'
3. **Refresh page**
   - ✅ Should be logged out
4. **Login again with different email**
   - ✅ New user created
   - ✅ Different user ID than before

### Scenario 5: Input Validation
1. **Click "Test Input Validation"**
   - ✅ Shows 4 test cases with pass/fail status
2. **Try manual invalid inputs in login:**
   - `notanemail` → should fail
   - `test@example.com` → should pass
   - `123` → should fail  
   - `1234567890` → should pass

### Scenario 6: Jam Details (if backend has data)
1. **Login first**
2. **Click "Test Get Jam Details"**
   - ✅ Should load jam with ID `test-jam-1`
   - ✅ Show jam name, status, musicians count
3. **Click "Test Most Needed Specialty"**
   - ✅ Should show specialty with most slots available

---

## Expected Error Messages

### Backend Errors
- **User already exists**: "User with this email already exists"
- **Invalid input**: "Please provide email or phone"
- **Validation failed**: "Invalid email format" or "Phone must be 10+ digits"
- **Network error**: "Connection error. Please try again."
- **Server error**: "An error occurred. Please try again later."

### Frontend Validation
- **Invalid email**: "Please enter a valid email address"
- **Invalid phone**: "Please enter a valid phone number (10+ digits)"
- **Empty input**: Button stays disabled

---

## Testing Checklist

### Backend Integration
- [ ] POST `/auth/login` endpoint responds correctly
- [ ] Email login creates user if not exists
- [ ] Email login returns existing user if exists
- [ ] Phone login creates user if not exists
- [ ] Phone login returns existing user if exists
- [ ] Response includes userId, name, email, phone, role, token
- [ ] GET `/auth/logout` clears backend session
- [ ] GET `/jams/:id` returns jam details with specialties

### Frontend Services
- [ ] `authService.loginOrRegister()` handles email
- [ ] `authService.loginOrRegister()` handles phone
- [ ] `authService.logout()` works correctly
- [ ] `jamService.getJamDetails()` fetches jam data
- [ ] `jamService.getMostNeededSpecialty()` calculates correctly
- [ ] Token stored via `setToken()` from auth library
- [ ] Error messages are user-friendly

### Auth Context Integration
- [ ] User data stored in context state
- [ ] User data persisted in localStorage
- [ ] Token stored in localStorage
- [ ] Refresh page maintains login state
- [ ] Role automatically set to 'user' for logins
- [ ] Logout clears all data
- [ ] Viewer role used for non-authenticated users

### Input Validation
- [ ] Email format validation works
- [ ] Phone format validation works (10+ digits)
- [ ] Invalid inputs rejected before API call
- [ ] Phone formatting removed before API call
- [ ] Error messages shown for invalid inputs

### Error Handling
- [ ] Network errors handled gracefully
- [ ] Server errors show friendly messages
- [ ] Validation errors prevent API calls
- [ ] Loading states prevent double-submit
- [ ] Errors cleared on retry

---

## Test Data

### Email Login Test
- **New user**: `testuser@example.com`
- **Existing user**: Login with same email twice

### Phone Login Test
- **New user**: `1234567890` or any 10+ digit number
- **Existing user**: Login with same phone twice

### Invalid Inputs
- **Bad email**: `notanemail`, `test@test`, `@example.com`
- **Bad phone**: `123`, `abc`, `(123)`

### Expected Results Format
```json
{
  "userId": "generated-id",
  "name": "Auto Generated Name",
  "email": "testuser@example.com",
  "phone": "+1234567890",
  "role": "user",
  "token": "jwt-token-here"
}
```

---

## Debugging Tips

### Check localStorage
Open browser DevTools → Application → localStorage
- Key: `auth_token` - should have JWT
- Key: `auth_user` - should have user JSON

### Check Auth Context
- Page shows "Authenticated: ✅ Yes" or "❌ No"
- Role should be 'user' for logged-in users
- Role should be 'viewer' for non-authenticated

### Check Network
Open browser DevTools → Network tab
- POST `/auth/login` should return 200/201
- Response should include token and user data
- Check request/response payloads

### Common Issues
- **401 Unauthorized**: Token not sent or expired
- **404 Not Found**: Endpoint doesn't exist at backend
- **500 Server Error**: Backend error - check server logs
- **localStorage not persisting**: Browser private mode or localStorage disabled

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Verify all auth flows work (email, phone, logout)
2. ✅ Verify input validation prevents bad data
3. ✅ Verify localStorage persistence works
4. ✅ Verify error messages are clear
5. ✅ Verify jam details loading (if applicable)

Then proceed to **Phase 5: Integration**
- Add routing to App.tsx
- Update Navbar with login/logout
- Integrate with actual jam pages
- Build out registration flow

