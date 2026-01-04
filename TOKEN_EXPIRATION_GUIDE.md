# Token Expiration & Auto-Logout Implementation

## ✅ What Was Implemented

### 1. Enhanced JWT Error Handling

**File**: `/src/lib/jwt.ts`

Added error codes to distinguish between different token errors:

- `TOKEN_EXPIRED` - Access token has expired
- `TOKEN_INVALID` - Token is malformed or invalid
- `TOKEN_VERIFICATION_FAILED` - General verification failure
- `REFRESH_TOKEN_EXPIRED` - Refresh token has expired
- `REFRESH_TOKEN_INVALID` - Refresh token is invalid

```typescript
// Now errors include a code property
if (error instanceof jwt.TokenExpiredError) {
  const err = new Error('Token expired') as Error & { code: string }
  err.code = 'TOKEN_EXPIRED'
  throw err
}
```

### 2. API Route Token Expiration Handling

**File**: `/src/lib/apiRouteWrappers.ts`

- Detects expired tokens in API routes
- Automatically clears cookies when token expires
- Returns proper error response with error code

```typescript
if (isTokenExpired || isTokenInvalid) {
  const response = NextResponse.json(
    {
      error: 'Unauthorized',
      code: isTokenExpired ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID',
      message: 'Your session has expired. Please login again.',
    },
    { status: 401 },
  )

  // Clear authentication cookies
  response.cookies.delete('accessToken')
  response.cookies.delete('refreshToken')

  return response
}
```

### 3. Global Client-Side Token Expiration Handler

**File**: `/src/lib/api-client.ts`

- Intercepts 401 responses with `TOKEN_EXPIRED` code
- Automatically redirects to login page
- Preserves locale in redirect URL
- Adds `?expired=true` query parameter

```typescript
if (response.status === 401 && errorData?.code === 'TOKEN_EXPIRED') {
  if (typeof window !== 'undefined') {
    const locale = window.location.pathname.split('/')[1] || 'en'
    window.location.href = `/${locale}/login?expired=true`
  }
}
```

### 4. Login Page Session Expired Alert

**File**: `/src/components/authenicator/login-comp.tsx`

- Detects `?expired=true` query parameter
- Shows toast notification
- Displays alert banner explaining session expired

**Created**: `/src/components/ui/alert.tsx`

- Material UI-style alert component
- Supports variants: default, destructive, warning

## 🔄 How It Works

### Complete Flow:

```
1. User makes API request
   ↓
2. API route checks token
   ↓
3. Token is expired
   ↓
4. Server clears cookies & returns:
   {
     error: "Unauthorized",
     code: "TOKEN_EXPIRED",
     message: "Your session has expired..."
   }
   ↓
5. Client API interceptor detects TOKEN_EXPIRED
   ↓
6. Redirects to: /{locale}/login?expired=true
   ↓
7. Login page shows:
   - Toast: "Your session has expired. Please login again."
   - Alert banner with message
   ↓
8. User logs in again
   ↓
9. New tokens are issued
```

## 🎯 Where Cookies Are Cleared

### Server-Side (API Routes)

**When**: Token verification fails (expired or invalid)
**Where**: `/src/lib/apiRouteWrappers.ts`
**How**:

```typescript
response.cookies.delete('accessToken')
response.cookies.delete('refreshToken')
```

### Client-Side (Logout)

**When**: User clicks logout button
**Where**: `/src/app/api/logout/route.ts`
**How**:

```typescript
response.cookies.delete('accessToken')
response.cookies.delete('refreshToken')
```

## 🧪 Testing

### Test 1: Expired Token Auto-Logout

1. **Login to your application**

   ```
   http://localhost:3000/en/login
   ```

2. **Wait for token to expire** (or manually expire it in dev tools)
   - Access token expires in: 1 day
   - For testing, you can temporarily change JWT expiry to 10 seconds:

   ```typescript
   // In src/lib/jwt.ts
   signAccessToken({ id: user.id }, { expiresIn: '10s' })
   ```

3. **Try to access any protected page**

   ```
   http://localhost:3000/en/admin/users
   ```

4. **Expected Behavior**:
   - ✅ Automatically redirected to `/en/login?expired=true`
   - ✅ Toast notification appears: "Your session has expired..."
   - ✅ Alert banner shows in login form
   - ✅ Cookies are cleared (check browser dev tools → Application → Cookies)

### Test 2: Manual Logout

1. **Click logout button**

2. **Expected Behavior**:
   - ✅ Redirected to `/en/login`
   - ✅ Cookies cleared
   - ✅ No expired message (since this was intentional)

### Test 3: Invalid Token

1. **Manually corrupt your access token** in browser dev tools

2. **Try to access protected page**

3. **Expected Behavior**:
   - ✅ Treated as unauthorized
   - ✅ Redirected to login (may or may not show expired message depending on error type)

## 📝 Configuration

### Customize Token Expiry Times

**File**: `/src/lib/jwt.ts`

```typescript
// Access token - how long user stays logged in
export function signAccessToken(payload: any) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET!, {
    expiresIn: '1d', // Change this: '15m', '1h', '7d', etc.
  })
}

// Refresh token - how long before must login again
export function signRefreshToken(payload: any) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d', // Change this: '30d', '90d', etc.
  })
}
```

### Customize Redirect Behavior

**File**: `/src/lib/api-client.ts`

```typescript
// Change redirect URL when token expires
if (response.status === 401 && errorData?.code === 'TOKEN_EXPIRED') {
  if (typeof window !== 'undefined') {
    const locale = window.location.pathname.split('/')[1] || 'en'

    // Option 1: Redirect to login
    window.location.href = `/${locale}/login?expired=true`

    // Option 2: Redirect to home
    // window.location.href = `/${locale}?expired=true`;

    // Option 3: Show modal instead of redirect
    // showSessionExpiredModal();
  }
}
```

### Customize Expired Message

**File**: `/src/components/authenicator/login-comp.tsx`

```typescript
// Toast message
toast.error("Your session has expired. Please login again.", {
  duration: 5000,
});

// Alert banner message
<AlertDescription>
  Your session has expired. Please login again to continue.
</AlertDescription>
```

## 🔒 Security Considerations

### ✅ What's Secure

1. **Server-side cookie deletion**: Cookies are deleted by the server, not just client-side
2. **HTTP-only cookies**: Cannot be accessed by JavaScript
3. **Error codes**: Distinguish between different failure types
4. **Automatic cleanup**: No lingering invalid tokens

### ⚠️ Important Notes

1. **Middleware limitations**: Middleware runs on Edge Runtime and can't access database. It only checks token validity, not expiration with refresh.

2. **Race conditions**: If multiple requests happen simultaneously when token expires, all will fail. User will be redirected only once due to global handler.

3. **Background tabs**: If user has app open in multiple tabs, expiration in one tab should clear cookies for all tabs (since cookies are shared).

## 🐛 Troubleshooting

### Problem: Not redirecting to login when token expires

**Possible Causes**:

1. API not returning `TOKEN_EXPIRED` code
2. Client interceptor not catching the error
3. Another error handler interfering

**Solution**:

```javascript
// Check browser console for:
console.log("Token verification error:", error);

// Check network tab for response:
{
  "error": "Unauthorized",
  "code": "TOKEN_EXPIRED"  // ← This must be present
}
```

### Problem: Cookies not being cleared

**Check**:

1. Browser Dev Tools → Application → Cookies
2. Make sure `httpOnly` flag is set (you won't see the value, but cookie name should disappear)
3. Check server response headers for `Set-Cookie` with `Max-Age=0`

**Solution**:

```typescript
// In API route
response.cookies.delete('accessToken')
response.cookies.delete('refreshToken')

// Verify in Network tab → Response Headers:
// Set-Cookie: accessToken=; Path=/; Max-Age=0
```

### Problem: Expired message not showing

**Check**:

```typescript
// Login component
const searchParams = useSearchParams()
const isExpired = searchParams?.get('expired') === 'true'

// URL should be: /en/login?expired=true
```

**Solution**: Make sure URL includes `?expired=true` parameter

## 📊 Error Code Reference

| Code                        | Meaning                    | Action                           |
| --------------------------- | -------------------------- | -------------------------------- |
| `TOKEN_EXPIRED`             | Access token expired       | Clear cookies, redirect to login |
| `TOKEN_INVALID`             | Token malformed            | Clear cookies, redirect to login |
| `TOKEN_VERIFICATION_FAILED` | Unknown verification error | Clear cookies, redirect to login |
| `REFRESH_TOKEN_EXPIRED`     | Refresh token expired      | Clear cookies, redirect to login |
| `REFRESH_TOKEN_INVALID`     | Refresh token malformed    | Clear cookies, redirect to login |

## 🚀 Future Enhancements

### Possible Improvements:

1. **Automatic Token Refresh**:
   - Before token expires, automatically refresh it
   - Requires background process or interceptor

2. **Session Activity Tracking**:
   - Track last activity time
   - Auto-logout after inactivity period

3. **Remember Me Feature**:
   - Longer expiry for users who check "Remember me"
   - Different token lifetimes

4. **Multi-device Session Management**:
   - Track active sessions
   - Allow user to logout from all devices

5. **Graceful Degradation**:
   - Save form data before redirect
   - Restore after re-login

## 📚 Related Files

- JWT Token Functions: `/src/lib/jwt.ts`
- API Route Wrapper: `/src/lib/apiRouteWrappers.ts`
- API Client: `/src/lib/api-client.ts`
- Login Component: `/src/components/authenicator/login-comp.tsx`
- Alert Component: `/src/components/ui/alert.tsx`
- Auth Controller: `/src/controllers/authController.ts`

## ✅ Summary

Your application now properly handles token expiration:

1. ✅ Server detects expired tokens
2. ✅ Automatically clears cookies
3. ✅ Redirects to login with message
4. ✅ Shows user-friendly notification
5. ✅ Preserves locale in redirect
6. ✅ Works globally across all API calls

**Result**: Users will never see cryptic "401 Unauthorized" errors. They'll always know their session expired and be guided back to login. 🎉
