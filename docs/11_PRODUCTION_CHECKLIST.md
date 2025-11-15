# Chat Ultra — Production Checklist

Use this checklist before launching Chat Ultra to production. Complete each section and verify all items.

## Pre-Launch Checklist

### Infrastructure & Deployment

- [ ] **Vercel Project Created**
  - [ ] Project connected to Git repository
  - [ ] Production environment configured
  - [ ] Custom domain configured (if applicable)
  - [ ] SSL certificate active (automatic with Vercel)

- [ ] **Supabase Project Setup**
  - [ ] Production project created
  - [ ] Database migrations run successfully
  - [ ] Storage bucket created (`chat-ultra-files`)
  - [ ] Storage policies configured
  - [ ] Auth providers configured (Email magic links)
  - [ ] Redirect URLs configured

- [ ] **Environment Variables**
  - [ ] All production environment variables set in Vercel
  - [ ] DATABASE_URL points to production Supabase
  - [ ] OPENAI_API_KEY valid and has credits
  - [ ] NEXTAUTH_SECRET generated and secure
  - [ ] Email service API key configured (Resend/SendGrid/Postmark)
  - [ ] NEXT_PUBLIC_APP_URL set to production domain

- [ ] **Database**
  - [ ] All migrations applied
  - [ ] Seed data removed (or kept for demo)
  - [ ] Database backups enabled (Supabase Pro)
  - [ ] Connection pooling configured

### Security

- [ ] **Authentication**
  - [ ] Magic link emails working
  - [ ] Email verification flow tested
  - [ ] Session management working
  - [ ] Logout functionality works

- [ ] **API Security**
  - [ ] All API routes require authentication
  - [ ] Rate limiting implemented
  - [ ] Input validation on all endpoints
  - [ ] SQL injection prevention (parameterized queries)
  - [ ] XSS prevention (input sanitization)

- [ ] **Headers & Policies**
  - [ ] Content Security Policy (CSP) headers set
  - [ ] HSTS header enabled
  - [ ] X-Frame-Options set
  - [ ] X-Content-Type-Options set
  - [ ] Referrer-Policy set

- [ ] **Data Protection**
  - [ ] API keys encrypted at rest
  - [ ] User data encrypted in transit (HTTPS)
  - [ ] File uploads validated (type, size)
  - [ ] File access restricted (private buckets)

### Functionality

- [ ] **Core Features**
  - [ ] User can sign up with magic link
  - [ ] User can log in
  - [ ] User can create Room
  - [ ] User can send message
  - [ ] Mazlo responds correctly
  - [ ] Messages stream properly
  - [ ] User can create Thread
  - [ ] User can pin message
  - [ ] User can create task
  - [ ] User can view trace
  - [ ] Bridge mode works
  - [ ] Room export works (Markdown and JSON)

- [ ] **Health Features**
  - [ ] Usage sessions track correctly
  - [ ] Health dashboard displays stats
  - [ ] Reminders appear at intervals
  - [ ] Limit modals appear when caps reached
  - [ ] Park Room works

- [ ] **Settings**
  - [ ] Provider management works
  - [ ] Health settings save
  - [ ] Theme switching works
  - [ ] Keyboard shortcuts work

### Performance

- [ ] **Page Load**
  - [ ] Landing page loads < 2 seconds
  - [ ] App shell loads < 3 seconds
  - [ ] First Contentful Paint < 1.5s
  - [ ] Time to Interactive < 3s

- [ ] **API Performance**
  - [ ] Room list loads < 200ms
  - [ ] Messages load < 300ms
  - [ ] Message streaming smooth (no lag)
  - [ ] Database queries optimized

- [ ] **Optimization**
  - [ ] Images optimized (Next.js Image)
  - [ ] Fonts optimized (next/font)
  - [ ] Code splitting implemented
  - [ ] Lazy loading for heavy components
  - [ ] Bundle size reasonable (< 500KB initial)

### User Experience

- [ ] **Onboarding**
  - [ ] Welcome tour works
  - [ ] Empty states have helpful copy
  - [ ] Tooltips guide users
  - [ ] First Room creation smooth

- [ ] **Responsive Design**
  - [ ] Mobile (375px) tested and works
  - [ ] Tablet (768px) tested and works
  - [ ] Desktop (1280px+) tested and works
  - [ ] Touch targets adequate (44x44px minimum)

- [ ] **Accessibility**
  - [ ] Keyboard navigation works
  - [ ] Focus states visible
  - [ ] Screen reader compatible (tested)
  - [ ] Color contrast meets WCAG AA
  - [ ] Alt text on images

- [ ] **Error Handling**
  - [ ] Error messages user-friendly
  - [ ] Network errors handled gracefully
  - [ ] 404 page styled
  - [ ] 500 error page styled
  - [ ] Error boundaries catch React errors

### Email & Notifications

- [ ] **Email Service**
  - [ ] Magic link emails sent successfully
  - [ ] Email templates look good
  - [ ] Email deliverability tested
  - [ ] SPF/DKIM/DMARC configured (if custom domain)

- [ ] **Notifications** (if implemented)
  - [ ] In-app notifications work
  - [ ] Browser notifications work (if enabled)
  - [ ] Email notifications work (if enabled)

### Monitoring & Analytics

- [ ] **Error Tracking**
  - [ ] Sentry (or similar) configured
  - [ ] Errors being captured
  - [ ] Error alerts configured

- [ ] **Performance Monitoring**
  - [ ] Vercel Analytics enabled
  - [ ] Core Web Vitals tracked
  - [ ] API performance monitored

- [ ] **Uptime Monitoring**
  - [ ] UptimeRobot/Pingdom configured
  - [ ] Health check endpoint works (`/api/health`)
  - [ ] Alerts configured

- [ ] **Logging**
  - [ ] Structured logging implemented
  - [ ] Logs accessible (Vercel/Supabase)
  - [ ] Log retention configured

### Legal & Compliance

- [ ] **Privacy Policy**
  - [ ] Privacy Policy page created
  - [ ] GDPR compliant
  - [ ] Data collection disclosed
  - [ ] Cookie policy (if using cookies)

- [ ] **Terms of Service**
  - [ ] Terms of Service page created
  - [ ] User agreement clear
  - [ ] Liability limitations stated

- [ ] **GDPR Compliance**
  - [ ] User can request data export
  - [ ] User can request data deletion
  - [ ] Data retention policy defined
  - [ ] Cookie consent (if applicable)

### SEO & Meta Tags

- [ ] **Landing Page SEO**
  - [ ] Meta title set
  - [ ] Meta description set
  - [ ] Open Graph tags set
  - [ ] Twitter Card tags set
  - [ ] Structured data (JSON-LD) added

- [ ] **Technical SEO**
  - [ ] Sitemap.xml generated
  - [ ] Robots.txt configured
  - [ ] Canonical URLs set
  - [ ] 404 page handles missing pages

### Documentation

- [ ] **User Documentation**
  - [ ] Help center created (or planned)
  - [ ] FAQ page created
  - [ ] Keyboard shortcuts documented
  - [ ] Feature guides written

- [ ] **Developer Documentation**
  - [ ] README.md complete
  - [ ] API documentation complete
  - [ ] Deployment guide complete
  - [ ] Contributing guide (if open source)

### Testing

- [ ] **Manual Testing**
  - [ ] All user flows tested
  - [ ] Edge cases tested
  - [ ] Error scenarios tested
  - [ ] Cross-browser tested (Chrome, Firefox, Safari)

- [ ] **Automated Testing**
  - [ ] Unit tests pass
  - [ ] Integration tests pass
  - [ ] E2E tests pass (if implemented)
  - [ ] CI/CD pipeline working

### Backup & Recovery

- [ ] **Backup Strategy**
  - [ ] Database backups automated
  - [ ] Backup retention policy set
  - [ ] Backup restoration tested

- [ ] **Disaster Recovery**
  - [ ] Recovery procedure documented
  - [ ] Rollback procedure tested
  - [ ] Data export functionality works

## Launch Day Checklist

### Pre-Launch (1 hour before)

- [ ] Final database backup taken
- [ ] All team members notified
- [ ] Monitoring dashboards open
- [ ] Support channels ready (if applicable)

### Launch

- [ ] Deploy to production
- [ ] Verify deployment successful
- [ ] Run smoke tests
- [ ] Check error tracking (no critical errors)
- [ ] Monitor performance metrics

### Post-Launch (First 24 hours)

- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Monitor user signups
- [ ] Check email delivery
- [ ] Respond to user feedback
- [ ] Fix critical bugs immediately

## Post-Launch Monitoring

### Daily Checks (First Week)

- [ ] Error rate < 1%
- [ ] API response times normal
- [ ] Database performance normal
- [ ] No critical errors
- [ ] User signups working

### Weekly Checks

- [ ] Review error logs
- [ ] Review performance metrics
- [ ] Review user feedback
- [ ] Check backup status
- [ ] Review security logs

## Rollback Criteria

Rollback immediately if:
- [ ] Critical security vulnerability discovered
- [ ] Database corruption detected
- [ ] > 10% error rate
- [ ] Complete service outage
- [ ] Data loss detected

---

*Complete this checklist before launching to production. Keep a copy for reference and update as needed.*

