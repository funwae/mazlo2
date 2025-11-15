# Chat Ultra — Security and Compliance

## Security Overview

Chat Ultra handles sensitive user data including:
- User authentication credentials
- AI conversations and messages
- Personal information
- API keys (OpenAI, etc.)

Security is a top priority and must be implemented at every layer.

## Authentication Security

### Magic Link Security

**Implementation:**
- Use Supabase Auth (recommended) or NextAuth
- Tokens expire after 1 hour (configurable)
- One-time use tokens
- Secure token generation (cryptographically random)

**Best Practices:**
```typescript
// Generate secure token
import crypto from "crypto";
const token = crypto.randomBytes(32).toString("hex");

// Store with expiration
await db.tokens.create({
  token: hashedToken,
  expiresAt: new Date(Date.now() + 3600000), // 1 hour
  userId: user.id,
});
```

### Session Management

**Secure Session Storage:**
- Use HTTP-only cookies
- Set `Secure` flag (HTTPS only)
- Set `SameSite=Strict` (CSRF protection)
- Set expiration (7 days default)

**Session Rotation:**
- Rotate session tokens on login
- Invalidate old sessions on password change
- Logout invalidates all sessions

### Password Security (if applicable)

If adding password auth later:
- Use bcrypt (cost factor 12+)
- Require strong passwords (12+ chars, mixed case, numbers, symbols)
- Implement rate limiting on login attempts
- Lock account after 5 failed attempts

## API Security

### Authentication

**All API routes require authentication:**
```typescript
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  
  // Proceed with authenticated request
}
```

### Authorization

**Users can only access their own data:**
```typescript
// Verify user owns resource
const room = await db.rooms.findFirst({
  where: { id: roomId, userId: session.user.id },
});

if (!room) {
  return NextResponse.json(
    { error: "Forbidden" },
    { status: 403 }
  );
}
```

### Rate Limiting

**Implement rate limiting to prevent abuse:**

Using Upstash Redis (recommended):
```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: "Rate limit exceeded" },
      { status: 429 }
    );
  }
  
  // Process request
}
```

**Rate Limits:**
- Message sending: 60/minute per user
- API calls: 120/minute per user
- Auth endpoints: 10/minute per IP
- File uploads: 20/minute per user

### Input Validation

**Validate all inputs:**

Using Zod:
```typescript
import { z } from "zod";

const createRoomSchema = z.object({
  name: z.string().min(1).max(255),
  primary_language: z.string().length(5),
});

export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const data = createRoomSchema.parse(body);
    // Process validated data
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid input", details: error.errors },
      { status: 400 }
    );
  }
}
```

### SQL Injection Prevention

**Always use parameterized queries:**

With Drizzle ORM (automatic):
```typescript
// Safe - Drizzle handles parameterization
await db.rooms.findFirst({
  where: eq(rooms.id, roomId),
});
```

**Never do:**
```typescript
// UNSAFE - Don't do this!
const query = `SELECT * FROM rooms WHERE id = '${roomId}'`;
```

### XSS Prevention

**Sanitize user input:**

```typescript
import DOMPurify from "isomorphic-dompurify";

// Sanitize HTML content
const sanitized = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ["p", "br", "strong", "em", "code"],
  ALLOWED_ATTR: [],
});
```

**React automatically escapes:**
- Use React's built-in escaping
- Don't use `dangerouslySetInnerHTML` unless necessary
- Sanitize if using markdown renderer

### CSRF Protection

**Next.js provides CSRF protection:**
- Built into Next.js API routes
- Verify origin header:
```typescript
const origin = request.headers.get("origin");
const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL];

if (!allowedOrigins.includes(origin)) {
  return NextResponse.json(
    { error: "Invalid origin" },
    { status: 403 }
  );
}
```

## Data Security

### Encryption at Rest

**Database:**
- Supabase encrypts data at rest automatically
- Use encrypted columns for sensitive data (if needed)

**API Keys:**
- Encrypt API keys before storing
- Use environment variables (never commit)
- Use Supabase Vault for secrets (if available)

**File Storage:**
- Supabase Storage encrypts files at rest
- Use private buckets for sensitive files

### Encryption in Transit

**HTTPS Only:**
- Vercel provides HTTPS automatically
- Force HTTPS redirects
- Use HSTS header (see Headers section)

**Database Connections:**
- Use SSL for database connections
- Supabase requires SSL by default

### Data Minimization

**Only collect necessary data:**
- Don't store unnecessary user information
- Delete old data (see Data Retention)
- Anonymize logs

### Data Access Control

**Principle of Least Privilege:**
- Users can only access their own data
- Admin access restricted
- Audit data access (log queries)

## Security Headers

### Content Security Policy (CSP)

```typescript
// next.config.js
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://api.openai.com https://*.supabase.co;
    `.replace(/\s{2,}/g, " ").trim(),
  },
];
```

### Other Security Headers

```typescript
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];
```

**Add to Next.js config:**
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};
```

## API Key Security

### Storage

**Never commit API keys:**
- Use `.env` files (gitignored)
- Use Vercel environment variables
- Use Supabase Vault (if available)

**Encrypt sensitive keys:**
```typescript
import crypto from "crypto";

const algorithm = "aes-256-gcm";
const key = Buffer.from(process.env.ENCRYPTION_KEY!, "hex");

function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  // ... encryption logic
}

function decrypt(encrypted: string): string {
  // ... decryption logic
}
```

### Rotation

**Rotate API keys regularly:**
- Quarterly rotation recommended
- Update in environment variables
- Test before deploying

## File Upload Security

### Validation

**Validate file types:**
```typescript
const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error("Invalid file type");
}

if (file.size > MAX_SIZE) {
  throw new Error("File too large");
}
```

**Scan for malware:**
- Use service like VirusTotal API (optional)
- Or rely on Supabase Storage scanning

### Storage

**Use private buckets:**
- Files not publicly accessible
- Generate signed URLs for access
- Expire URLs after use

## GDPR Compliance

### User Rights

**Right to Access:**
- Provide data export functionality
- Export all user data (Rooms, messages, etc.)

**Right to Deletion:**
- Provide account deletion
- Delete all user data
- Anonymize logs

**Right to Portability:**
- Export data in machine-readable format (JSON)
- Room export already provides this

### Data Processing

**Legal Basis:**
- User consent (by using service)
- Contractual necessity (to provide service)
- Legitimate interest (analytics, security)

**Data Minimization:**
- Only collect necessary data
- Delete old data (retention policy)

### Privacy Policy

**Required Content:**
- What data is collected
- How data is used
- Who data is shared with
- User rights
- Contact information

**Create:** `/app/privacy/page.tsx`

### Cookie Policy

**If using cookies:**
- Disclose cookie usage
- Get consent (if required by jurisdiction)
- Provide opt-out

## Data Retention

### Retention Policy

**User Data:**
- Active accounts: Retain indefinitely
- Deleted accounts: Delete after 30 days
- Inactive accounts: Delete after 2 years

**Logs:**
- Error logs: 90 days
- Access logs: 30 days
- Performance logs: 7 days

**Backups:**
- Daily backups: 30 days
- Weekly backups: 90 days

### Deletion Implementation

```typescript
async function deleteUserData(userId: string) {
  // Delete in order (respect foreign keys)
  await db.messages.deleteMany({ where: { room: { userId } } });
  await db.tasks.deleteMany({ where: { room: { userId } } });
  await db.pins.deleteMany({ where: { room: { userId } } });
  await db.threads.deleteMany({ where: { room: { userId } } });
  await db.rooms.deleteMany({ where: { userId } });
  await db.usage_sessions.deleteMany({ where: { userId } });
  await db.users.delete({ where: { id: userId } });
}
```

## Security Audits

### Regular Audits

**Quarterly:**
- Review access logs
- Review error logs
- Review security headers
- Update dependencies

**Annually:**
- Full security audit
- Penetration testing (optional)
- Compliance review

### Dependency Updates

**Keep dependencies updated:**
```bash
# Check for vulnerabilities
pnpm audit

# Update dependencies
pnpm update

# Check for outdated packages
pnpm outdated
```

## Incident Response

### Security Incident Plan

1. **Identify:** Detect security incident
2. **Contain:** Isolate affected systems
3. **Eradicate:** Remove threat
4. **Recover:** Restore services
5. **Learn:** Post-mortem and improvements

### Contact Information

**Security Issues:**
- Email: security@your-domain.com
- Report via: GitHub Security Advisories (if open source)

### Disclosure

**Responsible Disclosure:**
- Provide 90 days for fixes
- Credit researchers (if desired)
- Publish security advisories

## Compliance Checklist

- [ ] Privacy Policy created and linked
- [ ] Terms of Service created and linked
- [ ] Data export functionality implemented
- [ ] Data deletion functionality implemented
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] CSRF protection enabled
- [ ] HTTPS enforced
- [ ] API keys encrypted
- [ ] File uploads validated
- [ ] Error messages don't leak sensitive info
- [ ] Logs don't contain sensitive data
- [ ] Dependencies updated regularly

---

*Security is an ongoing process. Review and update security measures regularly.*

