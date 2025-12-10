# Backend: Supabase JWT Validation Implementation

This is a reference for what your backend's `/auth/sync-user` endpoint should implement.

## Required Environment Variables

```env
# Backend .env
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase-dashboard
SUPABASE_URL=https://your-project.supabase.co
```

## Endpoint: POST /auth/sync-user

### Purpose
Exchanges a Supabase JWT token for a backend JWT token and syncs the user to the database.

### Implementation Reference (Node.js/NestJS example)

```typescript
// auth.controller.ts
import { Controller, Post, Headers, HttpException, HttpStatus } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

@Controller('auth')
export class AuthController {
  
  @Post('sync-user')
  async syncSupabaseUser(@Headers('authorization') authHeader: string) {
    try {
      // 1. Extract token from header
      const token = this.extractToken(authHeader)
      if (!token) {
        throw new HttpException('Missing authorization token', HttpStatus.UNAUTHORIZED)
      }

      // 2. Verify Supabase JWT signature
      const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET, {
        algorithms: ['HS256'],
      })

      // 3. Extract Supabase user ID from 'sub' claim
      const supabaseUserId = decoded.sub
      if (!supabaseUserId) {
        throw new HttpException('Invalid token claims', HttpStatus.UNAUTHORIZED)
      }

      // 4. Find or create musician with this supabaseUserId
      const musician = await this.musicianService.findOrCreate({
        supabaseUserId,
        email: decoded.email,
        name: decoded.user_metadata?.name || 'New User',
        phone: decoded.phone,
      })

      // 5. Generate backend JWT token
      const backendToken = jwt.sign(
        {
          musicianId: musician.id,
          email: musician.email,
          role: musician.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      )

      // 6. Return musician data with backend token
      return {
        userId: musician.id,
        name: musician.name,
        email: musician.email,
        phone: musician.phone,
        role: musician.role || 'user',
        token: backendToken,
        isNewUser: musician.isNewUser,
        instrument: musician.instrument,
        genre: musician.genre,
      }
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new HttpException(
          'Invalid Supabase token',
          HttpStatus.UNAUTHORIZED
        )
      }
      throw error
    }
  }

  private extractToken(authHeader: string): string | null {
    if (!authHeader) return null
    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      return null
    }
    return parts[1]
  }
}
```

## Musician Model

Your `Musician` model needs to include:

```typescript
// musician.entity.ts
@Entity()
export class Musician {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true, unique: true })
  supabaseUserId: string  // Required for Supabase sync

  @Column()
  name: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  phone: string

  @Column({ default: 'user' })
  role: 'user' | 'host'  // All start as 'user'

  @Column({ nullable: true })
  instrument: string

  @Column({ nullable: true })
  genre: string

  @Column({ default: false })
  isNewUser: boolean

  @CreateDateColumn()
  createdAt: Date
}
```

## Migration: Add Supabase Columns

```sql
ALTER TABLE musician ADD COLUMN supabase_user_id VARCHAR(255) UNIQUE;
ALTER TABLE musician ADD COLUMN instrument VARCHAR(100);
ALTER TABLE musician ADD COLUMN genre VARCHAR(100);
```

## JWT Token Claims

The Supabase JWT token will have these claims:

```json
{
  "iss": "https://your-project.supabase.co/auth/v1",
  "sub": "user-uuid-from-supabase",
  "aud": "authenticated",
  "exp": 1234567890,
  "iat": 1234567800,
  "email": "user@example.com",
  "phone": "+1234567890",
  "user_metadata": {
    "name": "John Doe"
  }
}
```

## Error Responses

| Status | Scenario |
|--------|----------|
| 200 | Token valid, user synced, token returned |
| 400 | Supabase JWT_SECRET not configured in backend |
| 401 | JWT verification failed, invalid token, or expired token |

## Testing

### Test with cURL

```bash
# Get a Supabase token first by signing in
# Then test the endpoint
curl -X POST http://localhost:3000/auth/sync-user \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -H "Content-Type: application/json"
```

### Test with Postman

1. Get a Supabase token by calling Supabase auth endpoint
2. Copy the token
3. Create POST request to `/auth/sync-user`
4. Add `Authorization: Bearer {token}` header
5. Send request

