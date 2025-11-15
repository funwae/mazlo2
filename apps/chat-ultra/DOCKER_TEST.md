# Docker Testing Guide

## Quick Start

1. **Navigate to the app directory:**
```bash
cd apps/chat-ultra
```

2. **Set up environment variables:**
```bash
cp .env.docker.example .env.docker
# Edit .env.docker with your actual values
```

3. **Run the test script:**
```bash
./docker-test.sh
```

Or manually:

```bash
# Build the image
docker-compose build

# Start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

## Environment Variables Required

Create `.env.docker` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://user:pass@host:5432/db
OPENAI_API_KEY=sk-your-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing Without Full Setup

If you want to test the build without connecting to services:

```bash
# Build only (no env vars needed)
docker-compose build

# Run with minimal config (will fail on API calls but you can test UI)
docker-compose up
```

## Troubleshooting

### Build fails
- Make sure you're in the `apps/chat-ultra` directory
- Check that `package.json` exists in the root
- Verify Node.js version is 20+

### Container won't start
- Check logs: `docker-compose logs`
- Verify environment variables are set
- Ensure port 3000 is not already in use

### Database connection errors
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure database migrations have been run

### Application errors
- Check browser console for errors
- View container logs: `docker-compose logs -f app`
- Verify all environment variables are set correctly

## Accessing the Application

Once running:
- **Web UI**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart container
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Stop and remove containers
docker-compose down

# Stop, remove containers and volumes
docker-compose down -v

# Execute command in container
docker-compose exec app sh
```

