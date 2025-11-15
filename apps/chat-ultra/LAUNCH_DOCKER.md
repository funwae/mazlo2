# Launch Chat Ultra with Docker

## Quick Launch Instructions

### Option 1: Using the Test Script (Recommended)

```bash
cd apps/chat-ultra
./docker-test.sh
```

### Option 2: Manual Launch

1. **Navigate to the app directory:**
```bash
cd apps/chat-ultra
```

2. **Create environment file:**
```bash
cp .env.docker.example .env.docker
# Edit .env.docker with your actual values
```

3. **Build and start:**
```bash
docker-compose build
docker-compose up -d
```

4. **View logs:**
```bash
docker-compose logs -f
```

5. **Access the app:**
Open http://localhost:3000 in your browser

## Docker Permission Issues

If you get permission errors, try:

```bash
# Option 1: Use sudo (not recommended for production)
sudo docker-compose build
sudo docker-compose up -d

# Option 2: Add your user to docker group (recommended)
sudo usermod -aG docker $USER
# Then log out and log back in
```

## Required Environment Variables

Before launching, make sure `.env.docker` contains:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key
- `NEXT_PUBLIC_APP_URL` - App URL (default: http://localhost:3000)

## Testing Without Full Setup

To test the Docker build without connecting to services:

```bash
# Build only (no env vars needed)
docker-compose build

# The build will succeed even without env vars
# You'll need env vars when running the container
```

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop container
docker-compose down

# Restart container
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Execute shell in container
docker-compose exec app sh

# View container status
docker-compose ps
```

## Troubleshooting

### Build Fails
- Ensure you're in `apps/chat-ultra` directory
- Check that `package.json` exists in project root
- Verify Docker is running: `docker ps`

### Container Won't Start
- Check logs: `docker-compose logs`
- Verify `.env.docker` exists and has all required variables
- Ensure port 3000 is available: `lsof -i :3000`

### Application Errors
- Check browser console
- View container logs: `docker-compose logs -f app`
- Verify database connection
- Check Supabase project is active

## Next Steps After Launch

1. **Run database migrations:**
   - Access the container: `docker-compose exec app sh`
   - Run: `npm run db:migrate`

2. **Test the application:**
   - Visit http://localhost:3000
   - Try logging in
   - Create a room
   - Send a message

3. **Check health endpoint:**
   - Visit http://localhost:3000/api/health

