# EZTaxMate Local Setup Guide

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd eztaxmate
   npm install
   ```

2. **Set up PostgreSQL database**
   ```bash
   # Install PostgreSQL if not already installed
   # macOS: brew install postgresql
   # Ubuntu: sudo apt install postgresql postgresql-contrib
   # Windows: Download from https://www.postgresql.org/download/

   # Create database
   createdb eztaxmate
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values (see details below)
   ```

4. **Initialize database schema**
   ```bash
   npm run db:push
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

## Environment Variables Required

### DATABASE_URL
PostgreSQL connection string format:
```
DATABASE_URL=postgresql://username:password@host:port/database
```

Examples:
- Local: `postgresql://postgres:password@localhost:5432/eztaxmate`
- With specific user: `postgresql://myuser:mypass@localhost:5432/eztaxmate`

### SESSION_SECRET
Random string for encrypting session cookies. Generate with:
```bash
openssl rand -base64 32
```
Or use any random 32+ character string.

### GEMINI_API_KEY
Google Gemini API key for AI features:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your .env file

## Database Schema

The application creates these tables automatically:

### users
- `id` (varchar, primary key) - Unique user identifier
- `username` (varchar, unique) - Login username
- `email` (varchar, unique) - User email
- `password` (varchar) - Hashed password
- `firstName` (varchar, optional) - First name
- `lastName` (varchar, optional) - Last name
- `createdAt` (timestamp) - Account creation time
- `updatedAt` (timestamp) - Last update time

### sessions
- `sid` (varchar, primary key) - Session ID
- `sess` (jsonb) - Session data
- `expire` (timestamp) - Session expiration

### tax_filings
- `id` (serial, primary key) - Filing ID
- `userId` (varchar, foreign key) - Reference to users.id
- `financialYear` (varchar) - Tax year (e.g., "2023-24")
- `status` (varchar) - Filing status: "draft", "completed", "filed"
- `form16Data` (jsonb) - Extracted Form 16 data
- `taxSuggestions` (jsonb) - AI-generated suggestions
- `createdAt` (timestamp) - Creation time
- `updatedAt` (timestamp) - Last update time

### chat_messages
- `id` (serial, primary key) - Message ID
- `userId` (varchar, foreign key) - Reference to users.id
- `message` (text) - User message
- `response` (text) - AI response
- `role` (varchar) - Message role: "user" or "assistant"
- `createdAt` (timestamp) - Message time

### file_uploads
- `id` (serial, primary key) - Upload ID
- `userId` (varchar, foreign key) - Reference to users.id
- `filename` (varchar) - Original filename
- `fileType` (varchar) - MIME type
- `fileSize` (integer) - File size in bytes
- `filePath` (varchar) - Server file path
- `ocrText` (text, optional) - Extracted OCR text
- `status` (varchar) - Processing status
- `createdAt` (timestamp) - Upload time

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Connect to database manually to test
psql -U postgres -d eztaxmate

# Check connection string format
echo $DATABASE_URL
```

### Permission Issues
```bash
# Grant privileges to user
sudo -u postgres psql
CREATE USER myuser WITH PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE eztaxmate TO myuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO myuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO myuser;
```

### Session/Authentication Issues
- Clear browser cookies and try again
- Verify SESSION_SECRET is set and consistent
- Check server logs for authentication errors

### AI Features Not Working
- Verify GEMINI_API_KEY is valid
- Check API quota and rate limits
- Test API key with a simple request

## Development Commands

```bash
# Start development server
npm run dev

# Database operations
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate migration files
npm run db:studio    # Open database browser (if available)

# Type checking
npx tsc --noEmit

# Lint code
npm run lint (if configured)
```

## Production Considerations

- Use strong SESSION_SECRET (32+ random characters)
- Enable SSL for database connections
- Set up proper logging and monitoring
- Configure file upload limits
- Use environment-specific database URLs
- Enable CORS for production domains