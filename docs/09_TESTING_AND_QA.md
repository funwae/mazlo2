# Chat Ultra — Testing and Quality Assurance

## Testing Strategy

### Unit Tests

**Scope:** Utility functions, helpers, pure business logic

**Tools:**
- Vitest or Jest
- TypeScript for type safety

**Examples:**
- Context builder functions
- Date formatting utilities
- Validation functions
- Design token calculations

### Integration Tests

**Scope:** API routes, database operations, provider integrations

**Tools:**
- Vitest with test database
- Supertest for API testing

**Examples:**
- Room CRUD operations
- Message creation and retrieval
- Task creation and updates
- Health session tracking

### E2E Tests

**Scope:** Critical user flows

**Tools:**
- Playwright or Cypress

**Examples:**
- User signup → Create Room → Send message → Receive response
- Pin message → View Pin → Jump to message
- Create task → Complete task
- Park Room → View on Home

### Visual Regression Tests

**Scope:** UI components and layouts

**Tools:**
- Chromatic or Percy
- Screenshot comparison

**Examples:**
- Component states (hover, active, disabled)
- Responsive layouts
- Dark mode (if implemented)

## QA Checklist

### Design System Compliance

- [ ] All colors use design tokens (no hard-coded colors)
- [ ] All spacing uses spacing scale (4px multiples)
- [ ] All typography follows font size/weight rules
- [ ] All border radius uses defined radius values
- [ ] All shadows use elevation system
- [ ] All components match specifications in 05_COMPONENT_SPECIFICATIONS.md

### Functionality

#### Rooms
- [ ] Create Room works
- [ ] Edit Room name inline
- [ ] Park Room generates summary
- [ ] Export Room (Markdown and JSON)
- [ ] Room status changes (active/paused/archived)
- [ ] Room filters work (status, provider, search)

#### Messages
- [ ] Send message and receive response
- [ ] Messages stream correctly
- [ ] Messages persist in database
- [ ] Message timestamps display correctly
- [ ] Provider tags show on Mazlo messages
- [ ] Message actions work (Why, Pin, Make task)

#### Threads
- [ ] Create new Thread
- [ ] Switch between Threads
- [ ] Messages belong to correct Thread
- [ ] Thread list updates correctly

#### Pins
- [ ] Pin a message
- [ ] Pin appears in left panel
- [ ] Click Pin jumps to message
- [ ] Pin tags work (Decision, Insight, Spec, Link)

#### Tasks
- [ ] Create task from message
- [ ] Create task independently
- [ ] Task appears in Tasks panel
- [ ] Complete task (checkbox)
- [ ] Task filters work (status)
- [ ] Task due dates display

#### Mazlo Panel
- [ ] Trace tab shows steps
- [ ] Tools tab lists available tools
- [ ] Context tab shows Room summary
- [ ] "Why" button opens trace
- [ ] Trace displays correctly

#### Bridge Mode
- [ ] Toggle Bridge mode works
- [ ] Split view displays correctly
- [ ] Translations appear
- [ ] Intent summaries show
- [ ] Tone selector affects translations

#### Health Features
- [ ] Sessions track correctly
- [ ] Health dashboard shows stats
- [ ] Reminders appear at intervals
- [ ] Limit modals appear when caps reached
- [ ] Park Room works from health modal

### Responsive Design

- [ ] Mobile (375px): Sidebar collapses, panels become tabs
- [ ] Tablet (768px): Sidebar icon-only, right panel drawer
- [ ] Desktop (1280px+): Full three-column layout
- [ ] All breakpoints tested (sm, md, lg, xl)

### Performance

- [ ] Page load < 2 seconds
- [ ] Message streaming smooth (no lag)
- [ ] Virtual scrolling works for long lists
- [ ] Database queries optimized (no N+1)
- [ ] Images lazy-loaded
- [ ] No memory leaks

### Accessibility

- [ ] Keyboard navigation works (Tab order)
- [ ] Focus states visible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader compatible (ARIA labels)
- [ ] Alt text on images
- [ ] Form labels associated correctly

### Error Handling

- [ ] Network errors show user-friendly message
- [ ] Provider errors handled gracefully
- [ ] Database errors logged, user sees generic message
- [ ] Validation errors show inline
- [ ] 404 pages styled correctly
- [ ] 500 errors show helpful message

### Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Security

- [ ] Authentication required for all API routes
- [ ] Users can only access their own Rooms
- [ ] API keys encrypted in database
- [ ] Input validation on all forms
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (sanitized inputs)
- [ ] CSRF protection enabled

## Design QA Checklist

### Visual Consistency

- [ ] All buttons follow same style
- [ ] All inputs follow same style
- [ ] All cards follow same style
- [ ] Icons consistent stroke width
- [ ] Spacing consistent throughout
- [ ] Colors consistent (no variations)

### Layout Quality

- [ ] Information hierarchy clear
- [ ] Negative space sufficient
- [ ] Main visual focus obvious
- [ ] No layout breaking at 1280px or 1440px
- [ ] Text truncation works (no overflow)

### Interaction Quality

- [ ] Hover states work on all interactive elements
- [ ] Click feedback immediate (< 100ms)
- [ ] Animations smooth (60fps)
- [ ] Loading states clear
- [ ] Empty states helpful

### Content Quality

- [ ] Copy matches 17_copywriting-and-microcopy.md
- [ ] No placeholder text in production
- [ ] Error messages helpful
- [ ] Success messages clear
- [ ] Tooltips informative

## Performance Benchmarks

### Target Metrics

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

### Database Performance

- Room list query: < 100ms
- Message fetch (50 messages): < 200ms
- Room creation: < 300ms
- Message save: < 50ms

## Testing Workflow

### Before Committing

1. Run type checking: `pnpm type-check`
2. Run linter: `pnpm lint`
3. Run unit tests: `pnpm test`
4. Manual smoke test: Create Room, send message

### Before PR

1. All tests pass
2. Manual QA checklist completed
3. Design review (screenshots)
4. Performance check (Lighthouse)

### Before Release

1. Full E2E test suite
2. Cross-browser testing
3. Security audit
4. Performance audit
5. Accessibility audit

## Bug Reporting Template

```
**Title:** [Brief description]

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- OS: [Linux/macOS/Windows]
- Browser: [Chrome/Firefox/Safari]
- Version: [App version]

**Screenshots:**
[If applicable]

**Additional Context:**
[Any other relevant information]
```

## Continuous Integration

### CI Pipeline

1. **Install dependencies**
2. **Type check**
3. **Lint**
4. **Unit tests**
5. **Integration tests**
6. **Build**
7. **E2E tests** (on staging)

### Deployment

- **Staging:** Auto-deploy on merge to `develop`
- **Production:** Manual deploy from `main` branch
- **Rollback:** Keep previous version for quick rollback

---

*This QA process ensures Chat Ultra meets quality standards. See other docs for detailed specifications.*

