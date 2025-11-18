# BBH MakerChat

## Overview

BBH MakerChat is an enterprise-grade financial services chatbot application that enables natural language queries about trades, settlements, portfolio analytics, compliance, and financial operations. The application provides a secure, modern interface for financial professionals to interact with financial data through conversational AI, featuring real-time chat, conversation history, query suggestions, and data visualizations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR support
- Three-panel responsive layout: left sidebar (280px fixed), main chat area (flexible), right panel (320px collapsible)

**UI Design System**
- Material Design 3 principles with enterprise customization
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design tokens
- shadcn/ui component library ("new-york" style variant)
- Typography: Inter (primary), IBM Plex Mono (data/numbers)
- Color system using HSL variables with light/dark mode support

**State Management**
- TanStack Query (React Query) for server state and caching
- Local component state for UI interactions
- Session-based authentication state synchronized with backend

**Key UI Components**
- Chat interface with message threading, typing indicators, and feedback mechanisms
- Conversation history with search, bookmarking, and categorization
- Query suggestions panel organized by financial service categories
- Data tables with sorting, filtering, and export capabilities
- Session timeout warnings with countdown timers
- Metric cards for financial KPI display

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- RESTful API design with `/api` prefix for all endpoints
- Session-based authentication using express-session
- In-memory session store (memorystore) for development; production should use Redis or PostgreSQL session store

**Security Implementation**
- Bcrypt password hashing with 10 salt rounds
- Rate limiting: 100 requests/minute per IP for API, 5 login attempts per 15 minutes
- Trust proxy enabled for accurate rate limiting behind proxies/load balancers
- Session timeout: 30 minutes with idle detection (lastActivity checked before update)
- CSRF protection via sameSite:strict cookies
- Secure session cookies with httpOnly flag
- Password strength requirement: minimum 8 characters
- Server-enforced role assignment (prevents privilege escalation)
- Ownership validation on all conversation/message operations (prevents IDOR attacks)
- Audit logging for authentication, queries, and feedback actions
- Required SESSION_SECRET environment variable for production

**API Structure**
- Authentication routes: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/session`
- Conversation routes: `/api/conversations` (CRUD operations)
- Message routes: `/api/conversations/:id/messages` (create, retrieve, feedback)
- AI response generation: Mock implementation (`server/mockAI.ts`) provides templated responses with categorization

**Data Access Layer**
- Storage abstraction via `IStorage` interface
- Implementation: `DbStorage` class using Drizzle ORM
- Supports user, conversation, and message CRUD operations
- Transaction support through Drizzle's database client

### Database Schema

**Technology**: PostgreSQL via standard `pg` driver (compatible with Neon and other PostgreSQL providers)

**Core Tables**

1. **users**
   - id (UUID primary key, auto-generated)
   - username (unique text)
   - password (hashed text)
   - role (text: "external_client" or "operations_team")
   - created_at (timestamp)

2. **conversations**
   - id (UUID primary key, auto-generated)
   - user_id (foreign key to users, cascade delete)
   - title (text, auto-generated from first query)
   - category (text, categorized by AI)
   - is_bookmarked (boolean)
   - created_at, updated_at (timestamps)

3. **messages**
   - id (UUID primary key, auto-generated)
   - conversation_id (foreign key to conversations, cascade delete)
   - role (text: "user" or "assistant")
   - content (text)
   - has_table, has_chart (boolean flags for response metadata)
   - feedback (text: "up" or "down" or null)
   - created_at (timestamp)

**ORM & Migrations**
- Drizzle ORM for type-safe database operations
- Schema defined in `shared/schema.ts` with Zod validation schemas
- Migrations managed via `drizzle-kit push` command
- Database URL configuration via `DATABASE_URL` environment variable

### Authentication & Authorization

**Strategy**: Session-based authentication with server-side session storage

**User Roles**
- `external_client`: Client-facing role for registered users
- `operations_team`: Internal operations team role

**Role Selection**
- Users select their role during registration via radio buttons
- Available options: External Client (default) or Operations Team
- Role is validated and stored in the database during account creation

**Session Management**
- 30-minute session timeout with automatic expiration
- 25-minute warning dialog with session extension capability
- Activity tracking via `lastActivity` timestamp in session data
- Session data includes: userId, username, role, lastActivity

**Security Considerations**
- Password validation occurs server-side
- Sessions invalidated on logout
- Rate limiting prevents brute force attacks
- Production requires SESSION_SECRET environment variable

## External Dependencies

### Core Infrastructure
- **PostgreSQL Database**: Standard PostgreSQL connection via `pg` driver (compatible with Neon, AWS RDS, etc.)
- **Database URL**: Required environment variable `DATABASE_URL` for connection string
- **Connection Pooling**: Uses node-postgres Pool for efficient connection management

### Session & Storage
- **memorystore**: In-memory session storage for development (not suitable for production multi-instance deployments)
- **connect-pg-simple**: Available for PostgreSQL-backed session storage (recommended for production)
- **Recommended**: Redis with `connect-redis` for production session store

### UI Component Libraries
- **Radix UI**: 20+ primitive components (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with PostCSS
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library
- **cmdk**: Command menu component
- **date-fns**: Date manipulation and formatting

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Build tool with HMR and development server
- **Drizzle Kit**: Database schema management and migrations
- **esbuild**: Production bundling for server code

### Compliance & Audit Requirements
- **Current**: Console-based audit logging
- **Production Requirements** (per DEPLOYMENT.md):
  - Structured logging (Winston or Pino recommended)
  - Log aggregation system (ELK, Splunk, or CloudWatch)
  - Database audit trail table with append-only constraints
  - Regular backup and retention policies

### AI Response System
- **Current**: Mock AI implementation in `server/mockAI.ts`
- Provides templated responses for financial query categories
- Categorizes queries into 8 financial service categories
- Generates conversation titles from user queries
- **Future**: Integration with actual AI/LLM service (OpenAI, Anthropic, etc.)

### Google Fonts CDN
- Inter font family (weights: 400, 500, 600, 700)
- IBM Plex Mono (weights: 400, 500, 600)