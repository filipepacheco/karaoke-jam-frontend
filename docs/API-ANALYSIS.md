# API Specification Analysis

**Source**: `.github/swagger.json`  
**API Version**: 0.0.1  
**API Title**: Karaoke Jam API  
**Description**: Backend API para organização de Jam Sessions presenciais em tempo real

---

## API Resources Overview

The backend API provides 5 main resources:

| Resource | Endpoint Base | Portuguese Term | Description |
|----------|---------------|-----------------|-------------|
| **Jams** | `/jams` | Jam Sessions | Jam session events |
| **Musicians** | `/musicos` | Músicos | Registered musicians |
| **Music** | `/musicas` | Músicas | Music catalog |
| **Registrations** | `/inscricoes` | Inscrições | Musician registrations for songs |
| **Schedules** | `/escalas` | Escalas | Performance schedules |

---

## 1. Jams Resource (`/jams`)

### Endpoints

| Method | Path | Operation | Description |
|--------|------|-----------|-------------|
| POST | `/jams` | `JamController_create` | Create a new jam session |
| GET | `/jams` | `JamController_findAll` | List all jams |
| GET | `/jams/{id}` | `JamController_findOne` | Get jam by ID |
| PATCH | `/jams/{id}` | `JamController_update` | Update jam |
| DELETE | `/jams/{id}` | `JamController_remove` | Delete jam |

### DTOs

**CreateJamDto**:
```typescript
{
  name: string              // required
  description?: string
  date?: string            // ISO date-time
  location: string         // required
  hostName: string         // required
  hostContact: string      // required
  qrCode?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'FINISHED'
}
```

**UpdateJamDto**:
```typescript
{
  status?: 'ACTIVE' | 'INACTIVE' | 'FINISHED'
}
```

**JamResponseDto**:
```typescript
{
  id: string
  nome: string
  descricao?: string
  data?: string           // ISO date-time
  qrCode?: string
  status: 'ACTIVE' | 'INACTIVE' | 'FINISHED'
  createdAt: string       // ISO date-time
  updatedAt: string       // ISO date-time
  jamsmusics?: JamMusicaResponseDto[]
}
```

---

## 2. Musicians Resource (`/musicos`)

### Endpoints

| Method | Path | Operation | Description |
|--------|------|-----------|-------------|
| POST | `/musicos` | `MusicoController_create` | Create a new musician |
| GET | `/musicos` | `MusicoController_findAll` | List all musicians |
| GET | `/musicos/{id}` | `MusicoController_findOne` | Get musician by ID |
| PATCH | `/musicos/{id}` | `MusicoController_update` | Update musician |
| DELETE | `/musicos/{id}` | `MusicoController_remove` | Delete musician |

### DTOs

**CreateMusicianDto**:
```typescript
{
  name: string                                          // required
  contact: string                                       // required
  instrument: string                                    // required
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL'  // required
}
```

**UpdateMusicianDto**:
```typescript
{
  name?: string
  contact?: string
  instrument?: string
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL'
}
```

**MusicoResponseDto**:
```typescript
{
  id: string
  nome: string
  instrumento: string
  nivel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PROFESSIONAL'
  contato: string
  createdAt: string       // ISO date-time
}
```

---

## 3. Music Resource (`/musicas`)

### Endpoints

| Method | Path | Operation | Description |
|--------|------|-----------|-------------|
| POST | `/musicas` | `MusicaController_create` | Create a new music |
| GET | `/musicas` | `MusicaController_findAll` | List all musics |
| GET | `/musicas/{id}` | `MusicaController_findOne` | Get music by ID |
| PATCH | `/musicas/{id}` | `MusicaController_update` | Update music |
| DELETE | `/musicas/{id}` | `MusicaController_remove` | Delete music |
| GET | `/musicas/jam/{jamId}` | `MusicaController_findByJam` | Get musics by jam |
| PATCH | `/musicas/{id}/link-jam/{jamId}` | `MusicaController_linkToJam` | Link music to a jam |

### DTOs

**CreateMusicDto**:
```typescript
{
  title: string           // required
  artist: string          // required
  genre?: string
  duration?: number       // seconds
}
```

**UpdateMusicDto**:
```typescript
{
  title?: string
  artist?: string
  genre?: string
  duration?: number
}
```

**MusicaResponseDto**:
```typescript
{
  id: string
  titulo: string
  artista: string
  genero?: string
  duracao?: number
  createdAt: string       // ISO date-time
  inscricoes?: InscricaoResponseDto[]
  escalas?: EscalaResponseDto[]
}
```

**JamMusicaResponseDto** (Junction table):
```typescript
{
  id: string
  jamId: string
  musicaId: string
  musica: MusicaResponseDto
}
```

---

## 4. Registrations Resource (`/inscricoes`)

### Endpoints

| Method | Path | Operation | Description |
|--------|------|-----------|-------------|
| POST | `/inscricoes` | `InscricaoController_create` | Create a new registration |
| GET | `/inscricoes/jam/{jamId}` | `InscricaoController_findByJam` | Get registrations by jam |
| GET | `/inscricoes/musico/{musicoId}` | `InscricaoController_findByMusico` | Get registrations by musician |
| DELETE | `/inscricoes/{id}` | `InscricaoController_remove` | Cancel registration |

### DTOs

**CreateRegistrationDto**:
```typescript
{
  musicianId: string      // required
  jamMusicId: string      // required - ID of JamMusica (link between jam and music)
}
```

**InscricaoResponseDto**:
```typescript
{
  id: string
  musicoId: string
  jamId: string
  jamMusicaId: string
  status: string
  createdAt: string       // ISO date-time
  musico: MusicoResponseDto
}
```

---

## 5. Schedules Resource (`/escalas`)

### Endpoints

| Method | Path | Operation | Description |
|--------|------|-----------|-------------|
| POST | `/escalas` | `EscalaController_create` | Create new schedule |
| GET | `/escalas/jam/{jamId}` | `EscalaController_findByJam` | Get schedules by jam |
| GET | `/escalas/musico/{musicoId}` | `EscalaController_findByMusico` | Get schedules by musician |
| PATCH | `/escalas/{id}` | `EscalaController_update` | Update schedule |
| DELETE | `/escalas/{id}` | `EscalaController_remove` | Remove from schedule |
| PUT | `/escalas/jam/{jamId}/reorder` | `EscalaController_reorderSchedule` | Reorder schedules |

### DTOs

**CreateScheduleDto**:
```typescript
{
  jamId: string                                        // required
  registrationId: string                               // required
  order: number                                        // required
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
}
```

**UpdateScheduleDto**:
```typescript
{
  order?: number
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
}
```

**EscalaResponseDto**:
```typescript
{
  id: string
  jamId: string
  ordem: number
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
  createdAt: string       // ISO date-time
  inscricaoId: string
}
```

**Reorder Request Body**:
```typescript
string[]  // Array of schedule IDs in desired order
```

---

## Health Check Endpoints

| Method | Path | Operation | Description |
|--------|------|-----------|-------------|
| GET | `/` | `AppController_getHello` | Health check endpoint |
| GET | `/health` | `AppController_getHealth` | API health status |

---

## Data Flow

### Typical User Flow:

1. **Create Jam** → POST `/jams` → Get `jamId`
2. **Add Music to Jam** → PATCH `/musicas/{musicId}/link-jam/{jamId}` → Creates `JamMusica`
3. **Musician Registers** → POST `/musicos` → Get `musicianId`
4. **Musician Registers for Song** → POST `/inscricoes` with `musicianId` + `jamMusicId` → Creates `Inscricao`
5. **Create Schedule** → POST `/escalas` with `jamId` + `registrationId` → Creates performance schedule
6. **Reorder Schedule** → PUT `/escalas/jam/{jamId}/reorder` with array of schedule IDs

### Entity Relationships:

```
Jam (1) ←→ (N) JamMusica ←→ (1) Musica
              ↓
           Inscricao (registration for a specific JamMusica)
              ↓
           Escala (schedule entry linking Inscricao to performance order)
```

---

## Important Notes

1. **Portuguese Field Names**: Backend uses Portuguese field names (nome, música, inscrição, escala)
2. **Date Format**: All dates are ISO 8601 format strings
3. **Junction Table**: `JamMusica` links Jams to Music (many-to-many)
4. **Registration Flow**: Musician → Registration → Schedule
5. **Status Enums**: Different resources have different status enums
6. **No Pagination**: Current API doesn't include pagination params (could be added)

---

## API Base URL

**Development**: To be configured via environment variable `VITE_API_URL`  
**Default**: `http://localhost:3000`

---

## Authentication

- JWT tokens expected in `Authorization: Bearer {token}` header
- Token storage: localStorage (frontend implementation)
- No refresh token in current API spec

---

## Next Steps

✅ Step 1 Complete: API analyzed and documented  
✅ Step 2 Complete: TypeScript types created in `src/types/api.types.ts`  
⏭️ Step 3: Setup API Client with Axios  
⏭️ Step 4: Configure API Endpoints  
⏭️ Step 5-10: Build services, hooks, error handling, etc.

