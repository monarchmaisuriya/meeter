# Meeter Backend Server

## Project Overview

This is the backend server for Meeter, built with:
- FeathersJS
- TypeScript

## Project Structure

```
server/
├── config/                # Configuration files
│   ├── default.json       # Default configuration
│   ├── test.json          # Test environment config
│   └── custom-environment-variables.json # Environment variables mapping
├── src/                   # Application source
│   ├── core               # Main application setup and configuration
│   ├── services/          # Service definitions
│   ├── hooks/             # Service hooks
│   └── utils/             # Utility functions
└── test/                  # Test files
```

## Environment Variables

Key environment variables (configured in config/custom-environment-variables.json):
- NODE_ENV: Server environment (development/production)
- NODE_SECRET: JWT secret (use `openssl rand -base64 32` to generate a secure secret)
- NODE_PORT: Server port (default: 3030)
- NODE_HOST: Server hostname (default: localhost)
- GOOGLE_CLIENT_ID: Google OAuth client ID
- GOOGLE_CLIENT_SECRET: Google OAuth client secret
- OAUTH_REDIRECT_URL: Client OAuth redirect URL
- ALLOWED_ORIGINS: Allowed origins for CORS

## Setup Instructions

1. Install dependencies:
```
npm install
```

2. Development:
```
npm run dev       # Start development server with hot-reload
```

3. Testing:
```
npm test          # Run all tests
```

4. Production Build:
```
npm run compile     # Create production build
npm start         # Start production server
```

## API Endpoints

- Authentication: /oauth/google
- User services: /users
- Meetings services: /meetings

## Service Schemas

### Users Service
Fields:
- id: number (required)
- googleId: string (required)
- email: string (optional)
- googleAccessToken: string (optional)
- googleRefreshToken: string (optional)
- googleExpiryDate: number (optional)
- idToken: string (optional)
- sub: string (optional)

### Meetings Service
Fields:
- id: string (required)
- title: string (required)
- description: string (optional)
- startDateTime: string (required)
- endDateTime: string (required)
- meetingLink: string (optional)
- calendarLink: string (optional)
- createdBy: string (optional)
- attendees: string[] (optional)

Note: See individual service files for complete endpoint and schema information.