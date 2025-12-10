# Supabase Frontend-Backend Integration Troubleshooting

## Issue: 401 Error on `/auth/sync-user` with Email/Password Login

When you login with email/password through the Supabase form, the frontend receives a Supabase access token but the backend rejects it with a 401 error.

### Root Cause
The backend's `/auth/sync-user` endpoint expects a **valid Supabase JWT token** and validates it using your Supabase project's JWT secret. If validation fails, it returns 401.

### Solution: Backend Configuration

Your backend **must** have:

1. **SUPABASE_JWT_SECRET** environment variable set
   - Get this from your Supabase dashboard
   - Go to: Settings → API → JWT Secret
   - Copy the full secret value
   
2. **SUPABASE_URL** environment variable (optional, for additional validation)
   - Get this from: Settings → API → Project URL
   - Format: `https://your-project.supabase.co`

3. **JWT Validation Middleware** that:
   - Extracts the token from `Authorization: Bearer {token}` header
   - Validates the JWT signature using SUPABASE_JWT_SECRET
   - Extracts the `supabaseUserId` from the token claims
   - Uses this to look up or create the musician record

### Backend Endpoint Requirements (`POST /auth/sync-user`)

```
Headers:
  Authorization: Bearer {supabaseAccessToken}

Validation Steps:
1. Extract token from Authorization header
2. Verify JWT signature using SUPABASE_JWT_SECRET
3. Extract 'sub' claim (Supabase user ID)
4. Find or create musician with supabaseUserId = {sub}
5. Return AuthResponseDto with musician data and backend JWT token

Response (200 OK):
{
  "userId": "backend-musician-id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "backend-jwt-token",
  "isNewUser": true
}

Error Responses:
- 400: Supabase not configured (missing SUPABASE_JWT_SECRET)
- 401: Invalid Supabase token (JWT validation failed)
```

### Frontend Behavior

Your frontend is configured correctly:
- ✅ Uses Supabase for email/password and OAuth
- ✅ Sends Supabase token to `/auth/sync-user`
- ✅ Handles sync errors gracefully
- ✅ Continues with Supabase session if backend sync fails (for fallback)

### Testing the Integration

1. **Check backend logs** when you attempt login
   - Should show JWT validation attempt
   - Should show success or specific validation error

2. **Use browser DevTools** Network tab
   - POST to `/auth/sync-user` should show request with Authorization header
   - Response should show either 200 OK or 401 Unauthorized

3. **Verify Supabase configuration**
   - Frontend env vars in `.env`:
     ```
     VITE_SUPABASE_URL=https://zgcfhsgcnuqgxvsycsmo.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGc...
     ```
   - Backend env vars:
     ```
     SUPABASE_JWT_SECRET=wbdRKd+Hg1803olvbUCy2asWWIIiGQ0tYCh3qJgem/tMA+JqzXs/...
     SUPABASE_URL=https://zgcfhsgcnuqgxvsycsmo.supabase.co
     ```

4. **Verify JWT Secret matches**
   - Your Supabase JWT secret should match between frontend and backend
   - Frontend token is issued by Supabase using this secret
   - Backend must validate using the SAME secret

### Quick Debug Checklist

- [ ] Backend has `SUPABASE_JWT_SECRET` environment variable set
- [ ] JWT secret is copied exactly from Supabase dashboard (no extra spaces)
- [ ] Backend JWT validation middleware is implemented
- [ ] `POST /auth/sync-user` endpoint exists and has JWT validation
- [ ] Supabase credentials in frontend `.env` match the Supabase project
- [ ] Supabase project UUID matches in both frontend and backend
- [ ] Backend logs show JWT validation attempts

### Next Steps

If still getting 401:
1. Check backend logs for the exact validation error
2. Verify JWT secret value character-by-character
3. Test JWT validation in isolation (decode the token manually)
4. Ensure middleware is applied to the `/auth/sync-user` endpoint
5. Check if token is expired (Supabase tokens expire after ~1 hour)

