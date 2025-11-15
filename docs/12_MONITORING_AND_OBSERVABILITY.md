# Chat Ultra — Monitoring and Observability

## Monitoring Strategy

Chat Ultra requires comprehensive monitoring to ensure:
- **Reliability:** Uptime and availability
- **Performance:** Response times and throughput
- **Errors:** Error rates and types
- **User Experience:** Real user monitoring
- **Business Metrics:** Usage and growth

## Error Tracking

### Sentry Integration

**Recommended:** Sentry for error tracking and performance monitoring.

#### Setup

1. **Install Sentry:**
```bash
pnpm add @sentry/nextjs
```

2. **Initialize Sentry:**
Create `sentry.client.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

Create `sentry.server.config.ts`:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

3. **Wrap API Routes:**
```typescript
import * as Sentry from "@sentry/nextjs";

export default Sentry.withSentry(handler);
```

4. **Add Error Boundaries:**
```typescript
import * as Sentry from "@sentry/nextjs";
import { ErrorBoundary } from "@sentry/react";

export function AppErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      fallback={({ error }) => <ErrorFallback error={error} />}
      beforeCapture={(scope, error) => {
        scope.setTag("component", "App");
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

#### Environment Variables

```bash
NEXT_PUBLIC_SENTRY_DSN="https://..."
SENTRY_DSN="https://..."
SENTRY_ORG="your-org"
SENTRY_PROJECT="chat-ultra"
SENTRY_AUTH_TOKEN="..."
```

### Error Types to Track

- **API Errors:** Failed API requests
- **Database Errors:** Query failures, connection issues
- **Provider Errors:** OpenAI API failures
- **Client Errors:** React errors, unhandled exceptions
- **Validation Errors:** Input validation failures

### Error Alerting

Configure alerts for:
- **Critical Errors:** > 10 errors/minute
- **New Error Types:** First occurrence
- **Error Rate Spike:** > 50% increase
- **Database Errors:** Any database error

## Performance Monitoring

### Vercel Analytics

**Built-in:** Vercel provides analytics automatically.

**Enable:**
1. Vercel Dashboard → Project Settings → Analytics
2. Enable Web Analytics
3. Enable Speed Insights

**Metrics Tracked:**
- Page views
- Unique visitors
- Core Web Vitals (LCP, FID, CLS)
- Geographic distribution
- Device types

### Custom Performance Monitoring

#### API Response Times

Track in Sentry or custom logging:
```typescript
const startTime = Date.now();
try {
  const result = await handler();
  const duration = Date.now() - startTime;
  
  // Log slow requests
  if (duration > 1000) {
    console.warn(`Slow API request: ${duration}ms`);
  }
  
  return result;
} catch (error) {
  const duration = Date.now() - startTime;
  Sentry.captureException(error, {
    tags: { api_duration: duration },
  });
  throw error;
}
```

#### Database Query Performance

Monitor via Supabase Dashboard:
- Query performance
- Connection pool usage
- Slow queries (> 1 second)

#### Provider API Performance

Track OpenAI API:
- Response times
- Token usage
- Rate limit hits
- Error rates

### Performance Budgets

Set targets:
- **Page Load:** < 2 seconds
- **API Response:** < 500ms (p95)
- **Database Query:** < 100ms (p95)
- **Message Streaming:** < 50ms first token

## Uptime Monitoring

### Health Check Endpoint

Create `/app/api/health/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Check database connection
    await db.query("SELECT 1");
    
    // Check OpenAI (optional, may be slow)
    // const openai = new OpenAI();
    // await openai.models.list();
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      checks: {
        database: "ok",
        // openai: "ok",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 503 }
    );
  }
}
```

### Uptime Monitoring Service

**Recommended:** UptimeRobot (free tier available)

**Setup:**
1. Create account at https://uptimerobot.com
2. Add monitor:
   - **Type:** HTTPS
   - **URL:** `https://your-domain.com/api/health`
   - **Interval:** 5 minutes
   - **Alert Contacts:** Email/SMS/Slack

**Alternative:** Pingdom, StatusCake, or custom solution

## Logging

### Structured Logging

Use structured logging for better searchability:

```typescript
import { createLogger } from "@/lib/logger";

const logger = createLogger("api.rooms");

logger.info("Room created", {
  roomId: room.id,
  userId: user.id,
  roomName: room.name,
});

logger.error("Failed to create room", {
  error: error.message,
  userId: user.id,
  stack: error.stack,
});
```

### Log Levels

- **ERROR:** Errors that need attention
- **WARN:** Warnings (slow queries, rate limits)
- **INFO:** Important events (Room created, message sent)
- **DEBUG:** Detailed debugging (development only)

### Log Aggregation

**Vercel Logs:**
- Access via Vercel Dashboard → Logs
- Real-time function logs
- Searchable and filterable

**Supabase Logs:**
- Access via Supabase Dashboard → Logs
- Database query logs
- Auth logs

**Custom Logging:**
- Use service like Logtail, Datadog, or self-hosted (Grafana Loki)

### What to Log

- **API Requests:** Method, path, status, duration
- **User Actions:** Sign up, Room creation, message sent
- **Errors:** Full error context
- **Performance:** Slow operations
- **Security:** Failed auth attempts, suspicious activity

## Analytics

### User Analytics

**Recommended:** PostHog or Plausible (privacy-friendly)

**Track:**
- User signups
- Active users (DAU, WAU, MAU)
- Room creation rate
- Message send rate
- Feature usage (Bridge mode, Pins, Tasks)
- Health feature usage

**Implementation:**
```typescript
import posthog from "posthog-js";

// Track event
posthog.capture("room_created", {
  roomId: room.id,
  roomName: room.name,
});
```

### Business Metrics

Track:
- **Growth:** Signups per day/week
- **Engagement:** Messages per user, Rooms per user
- **Retention:** Daily/weekly active users
- **Health:** Users using health features
- **Revenue:** (if applicable)

### Custom Analytics Dashboard

Create internal dashboard showing:
- Real-time metrics
- User growth charts
- Feature usage charts
- Error rates
- Performance metrics

## Alerting

### Critical Alerts

Set up alerts for:

1. **High Error Rate**
   - > 10 errors/minute
   - Alert: Email + Slack

2. **Service Down**
   - Health check fails
   - Alert: SMS + Email + Slack

3. **Database Issues**
   - Connection pool exhausted
   - Query failures
   - Alert: Email + Slack

4. **Provider API Issues**
   - OpenAI API failures
   - Rate limit exceeded
   - Alert: Email

5. **Performance Degradation**
   - API response time > 2 seconds (p95)
   - Alert: Email

### Alert Channels

- **Email:** For non-urgent alerts
- **Slack:** For team notifications
- **SMS:** For critical alerts (service down)
- **PagerDuty:** For on-call rotation (if applicable)

## Dashboards

### Vercel Dashboard

Monitor:
- Deployments
- Function invocations
- Function duration
- Error rates
- Bandwidth usage

### Supabase Dashboard

Monitor:
- Database performance
- Storage usage
- Auth events
- API usage

### Custom Dashboard (Optional)

Build with:
- **Grafana:** For custom metrics
- **Datadog:** For comprehensive monitoring
- **Custom:** Next.js admin panel

## Log Retention

### Retention Policy

- **Error Logs:** 90 days
- **Access Logs:** 30 days
- **Performance Logs:** 7 days
- **Debug Logs:** 1 day (development only)

### Compliance

- **GDPR:** User data in logs must be anonymized
- **Retention:** Delete logs after retention period
- **Access:** Limit log access to authorized personnel

## Monitoring Best Practices

1. **Start Simple:** Use built-in tools (Vercel, Supabase)
2. **Add Gradually:** Add monitoring as needed
3. **Set Baselines:** Know normal metrics before alerting
4. **Test Alerts:** Ensure alerts work
5. **Review Regularly:** Weekly review of metrics
6. **Document:** Document monitoring setup and procedures

## Cost Considerations

### Free Tier Options

- **Sentry:** 5,000 events/month free
- **UptimeRobot:** 50 monitors free
- **Vercel Analytics:** Included
- **Supabase Logs:** Included

### Paid Options

- **Sentry Pro:** $26/month (more events)
- **Datadog:** $15/host/month
- **Logtail:** $20/month (log aggregation)

---

*This monitoring setup ensures Chat Ultra is reliable, performant, and observable in production.*

