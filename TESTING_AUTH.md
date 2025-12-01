# Quick Test Guide

## Steps to Test Authentication

### 1. Make sure your `.env` file has these variables:
```bash
ACCESS_TOKEN_SECRET=your_secret_key_here
REFRESH_TOKEN_SECRET=your_secret_key_here
DATABASE_URL=your_database_url
```

Generate secrets if needed:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Start the development server:
```bash
npm run dev
```

### 3. Test Login (Terminal or Postman):
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dex@gmail.com","password":"dex12345"}' \
  -v
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "data": {
    "email": "dex@gmail.com",
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

**Check the response headers for:**
```
Set-Cookie: accessToken=eyJhbG...; Path=/; HttpOnly; SameSite=Strict
Set-Cookie: refreshToken=eyJhbG...; Path=/; HttpOnly; SameSite=Strict
```

### 4. Test Protected Route:
```bash
curl http://localhost:3000/api/users \
  -H "Cookie: accessToken=YOUR_TOKEN_HERE" \
  -v
```

Or if you saved cookies from login:
```bash
# Login and save cookies
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dex@gmail.com","password":"dex12345"}' \
  -c cookies.txt

# Use saved cookies
curl http://localhost:3000/api/users \
  -b cookies.txt
```

**Expected Response:**
```json
{
  "users": [...]
}
```

### 5. Check Console Logs:

The server console should show:
```
=== Cookie Debug ===
All cookies: [ 'accessToken=eyJhbG...' ]
Cookie names: [ 'accessToken' ]
Token found: Yes (eyJhbG...)
Token payload: { id: 1, iat: ..., exp: ... }
Authenticated user: { id: 1, email: '...', name: '...', roles: [...], permissions: [...] }
```

## Troubleshooting

### If you see "Unauthorized - No token":
- Check that cookies are being set in the login response
- Check that you're sending cookies in the request
- Look at console logs to see available cookies

### If you see "Token verification failed":
- Check that `ACCESS_TOKEN_SECRET` is set in `.env`
- Make sure you restart the server after changing `.env`
- Check console logs for JWT verification errors

### If you see "User not found":
- Check that the user exists in the database
- Run: `npm run seed:superadmin` to create test user

## Browser Testing

Use the browser DevTools:

1. Open Network tab
2. Login via your login page/form
3. Check Response Headers for `Set-Cookie`
4. Check Application > Cookies for `accessToken`
5. Make request to `/api/users`
6. Check Request Headers for `Cookie`
