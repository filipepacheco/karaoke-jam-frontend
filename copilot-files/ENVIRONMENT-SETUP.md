# Environment Configuration

This project uses environment variables to configure the API connection and other settings.

## Setup

### Development

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your local development settings:
```env
VITE_API_URL=http://localhost:3000
```

### Production

1. The `.env.production` file is used when building for production
2. Update API URL to point to your production backend:
```env
VITE_API_URL=https://api.yourdomain.com
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` |

## Important Notes

- `.env` files are **gitignored** and should never be committed
- `.env.example` serves as a template for new developers
- Always copy `.env.example` to `.env` locally
- Never commit sensitive information to `.env` files
- Use `.env.production` for production builds

## Vite Environment Variables

Vite exposes environment variables prefixed with `VITE_` in your application code via `import.meta.env`:

```typescript
// Access in code
const apiUrl = import.meta.env.VITE_API_URL
```

Environment variables without the `VITE_` prefix are only available in Node.js and will not be exposed to the client.

