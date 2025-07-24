# EZTaxMate - AI-Powered ITR Filing App

## Overview

EZTaxMate is a full-stack web application designed to simplify income tax return (ITR-1) filing for newly joined employees in India (0-3 years experience). The app uses AI to automatically extract data from Form 16 documents, provides beginner-friendly explanations of tax terms, offers personalized tax-saving suggestions, and includes an AI-powered chatbot for user queries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and bundling
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **File Upload**: Multer for handling Form 16 uploads
- **Database ORM**: Drizzle ORM for type-safe database operations

### Database Design
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Located in `shared/schema.ts` for type sharing
- **Tables**:
  - `users`: User profile information
  - `sessions`: Session storage for authentication
  - `taxFilings`: Tax filing records with extracted data
  - `chatMessages`: Chat history with AI bot
  - `fileUploads`: File upload tracking

## Key Components

### Authentication System
- Uses Replit's OpenID Connect authentication
- Automatic user creation on first login
- Session-based authentication with PostgreSQL storage
- Protected routes with middleware

### File Processing Pipeline
1. **Upload**: Multer handles file uploads (PDF/images)
2. **OCR**: Tesseract.js extracts text from images
3. **AI Processing**: OpenAI GPT-4 extracts structured data from OCR text
4. **Storage**: Processed data stored in database

### AI Integration
- **OCR Service**: Text extraction from Form 16 documents
- **Data Extraction**: GPT-4 parses OCR text into structured tax data
- **Tax Suggestions**: AI generates personalized investment recommendations
- **Chatbot**: GPT-powered TaxBot for user queries

### User Interface
- **Landing Page**: Marketing page with process explanation
- **Dashboard**: Progress tracking and filing status
- **Upload Flow**: Guided Form 16 upload with validation
- **Tax Savings**: Personalized recommendations display
- **Chat Interface**: AI chatbot for tax queries

## Data Flow

1. **User Authentication**: Google login via Replit Auth
2. **File Upload**: User uploads Form 16 (PDF/image)
3. **OCR Processing**: Extract text from uploaded document
4. **AI Analysis**: GPT-4 processes text and extracts tax data
5. **Data Storage**: Structured data saved to PostgreSQL
6. **Recommendations**: AI generates tax-saving suggestions
7. **User Review**: Dashboard displays extracted data and suggestions
8. **ITR Generation**: Export ITR-1 JSON file (planned feature)

## External Dependencies

### Authentication
- **Replit Auth**: OpenID Connect provider for user authentication
- **Session Storage**: PostgreSQL-backed session management

### AI Services
- **OpenAI GPT-4**: Data extraction and chatbot responses
- **Tesseract.js**: Client-side OCR for document processing

### Database
- **Neon Serverless PostgreSQL**: Cloud database with connection pooling
- **Drizzle ORM**: Type-safe database operations

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Vite HMR for frontend, tsx for backend
- **Type Checking**: Shared TypeScript configuration

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Static Serving**: Express serves built frontend in production

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **Authentication**: Replit Auth environment variables
- **AI Services**: `OPENAI_API_KEY` for GPT-4 access
- **Sessions**: `SESSION_SECRET` for secure session management

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with client/server/shared folders for code sharing
2. **Type Safety**: Shared schema between frontend and backend using Drizzle
3. **File Processing**: Client-side OCR to reduce server load and costs
4. **Authentication**: Replit Auth for simplified OAuth integration
5. **Database**: PostgreSQL for ACID compliance and session storage
6. **AI Integration**: OpenAI for reliable text processing and chatbot functionality