# API Configuration

## Default Setup

By default, the API client uses **relative URLs** (`/api`) which means it will make requests to the same origin where your Next.js app is running.

- **Development**: `http://localhost:3000/api`
- **Production**: `https://yourdomain.com/api`

## Environment Variables

### `NEXT_PUBLIC_API_URL` (Optional)

Override the default API base URL if you need to connect to a different backend server.

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

**Important**: The `NEXT_PUBLIC_` prefix is required for client-side environment variables in Next.js.

## Usage

The `ApiClient` in `src/lib/api-client.ts` automatically handles:

- ✅ Base URL configuration
- ✅ Request/response handling
- ✅ Error handling
- ✅ Cookie credentials
- ✅ JSON serialization

### Example API Calls

```typescript
// Login - POST /api/login
await authApi.login({ email: 'user@example.com', password: 'password123' });

// Get current user - GET /api/me
await authApi.getMe();

// Logout - POST /api/logout
await authApi.logout();
```

## Same-Origin vs Cross-Origin

### Same-Origin (Default - Recommended)

```
Frontend: http://localhost:3000
API: http://localhost:3000/api
✅ Cookies work automatically
✅ No CORS issues
```

### Cross-Origin (If using separate backend)

```
Frontend: http://localhost:3000
API: http://localhost:4000/api
⚠️ Requires CORS configuration
⚠️ Requires credentials: 'include'
```

## Next.js API Routes

Your API routes are located in:

- `src/app/api/login/route.ts`
- `src/app/api/logout/route.ts`
- `src/app/api/users/route.ts`
- etc.

These are automatically available at `/api/*` paths.
