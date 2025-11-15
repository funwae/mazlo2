# Deployment Guide

## Prerequisites

- Node.js 20+
- PostgreSQL database (via Supabase or self-hosted)
- Supabase account
- OpenAI API key (or other AI provider)

## Environment Variables

Create a `.env.local` file in `apps/chat-ultra/` with:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database (if using direct PostgreSQL connection)
DATABASE_URL=postgresql://user:password@host:5432/database

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Database Setup

1. Run migrations:
```bash
npm run db:migrate
```

2. Verify schema:
```bash
npm run db:studio
```

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Docker Deployment

1. Build image:
```bash
docker build -t chat-ultra .
```

2. Run container:
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -e DATABASE_URL=... \
  -e OPENAI_API_KEY=... \
  chat-ultra
```

Or use docker-compose:
```bash
docker-compose up -d
```

## Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Security Checklist

- [ ] All environment variables are set
- [ ] Database credentials are secure
- [ ] API keys are not exposed in client code
- [ ] HTTPS is enabled
- [ ] Security headers are configured
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured

## Monitoring

- Health check endpoint: `/api/health`
- Usage sessions tracked automatically
- Error tracking via error boundaries

