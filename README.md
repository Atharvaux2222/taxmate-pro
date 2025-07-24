# EZTaxMate - AI-Powered Tax Filing Application

EZTaxMate is a full-stack web application that simplifies income tax return (ITR-1) filing for newly joined employees in India. The app uses AI to automatically extract data from Form 16 documents and provides personalized tax-saving suggestions.

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js with Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Username/password with express-session
- **AI Services**: Google Gemini API for document processing and chatbot
- **File Processing**: Tesseract.js for OCR

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Gemini API key

## Local Setup

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd eztaxmate
npm install
```

### 2. Database Setup

Create a PostgreSQL database and note down the connection details. The application uses the following schema:

- `users` - User accounts with username/password authentication
- `sessions` - Express session storage
- `tax_filings` - Tax filing records with extracted data
- `chat_messages` - AI chatbot conversation history
- `file_uploads` - Uploaded Form 16 file tracking

### 3. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/eztaxmate

# Session Security
SESSION_SECRET=your-secure-random-session-secret-here

# AI Services
GEMINI_API_KEY=your-google-gemini-api-key-here

# Environment
NODE_ENV=development
```

#### Required Environment Variables:

1. **DATABASE_URL**: PostgreSQL connection string
   - Format: `postgresql://username:password@host:port/database`
   - Example: `postgresql://postgres:password@localhost:5432/eztaxmate`

2. **SESSION_SECRET**: Random string for session encryption
   - Generate with: `openssl rand -base64 32`
   - Must be kept secret and consistent across restarts

3. **GEMINI_API_KEY**: Google Gemini API key for AI features
   - Get from: [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Used for Form 16 data extraction and chatbot responses

### 4. Database Migration

The application will automatically create the required tables on first run. To manually run migrations:

```bash
# Push schema to database
npm run db:push

# Generate migrations (if needed)
npm run db:generate
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Features

- **User Authentication**: Username/password registration and login
- **Form 16 Upload**: PDF and image upload with OCR processing
- **AI Data Extraction**: Automatic extraction of tax data from Form 16
- **Tax Suggestions**: Personalized investment recommendations
- **AI Chatbot**: Tax advice and query assistance
- **Dashboard**: Progress tracking and filing status

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login  
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Tax Filing
- `GET /api/tax-filings` - Get user's tax filings
- `POST /api/tax-filings` - Create new tax filing
- `GET /api/tax-filings/:id` - Get specific tax filing

### File Upload
- `POST /api/upload-form16` - Upload and process Form 16

### Chat
- `GET /api/chat/messages` - Get chat history
- `POST /api/chat/message` - Send message to AI chatbot

### Tax Suggestions
- `GET /api/tax-suggestions` - Get personalized tax advice

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running and accessible
- Verify DATABASE_URL format and credentials
- Check firewall and network connectivity

### Authentication Issues  
- Verify SESSION_SECRET is set and consistent
- Clear browser cookies and try again
- Check server logs for session errors

### AI Features Not Working
- Verify GEMINI_API_KEY is valid and has quota
- Check API key permissions for Gemini Pro model
- Monitor rate limits and usage

## Development Notes

- The app uses PostgreSQL for session storage and all data persistence
- File uploads are stored in the `uploads/` directory
- OCR processing happens client-side using Tesseract.js
- AI processing uses Google Gemini Pro model for best results
- All database operations use Drizzle ORM for type safety

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a secure SESSION_SECRET (32+ random characters)
3. Enable SSL for PostgreSQL connections
4. Set up proper CORS origins
5. Configure file upload limits and storage
6. Set up monitoring and logging