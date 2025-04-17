# meeter

A meeting scheduling application with Google Single Sign-On (SSO) integration.

### Technology Stack

- Frontend: React + Vite
- Backend: FeathersJS
- Database: In-memory (for simplicity)

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://www.docker.com/compose/)
- [Google OAuth credentials](https://developers.google.com/identity/protocols/oauth2/)

### Project Structure

```
├── web/                 # React frontend application
├── server/              # Feathers backend application
├── docker-compose.yml   # Docker configuration
└── orchestrate.sh       # Project management script
```

### Usage Instructions

1. Setup the web and server applications, view readme.md for each application.

2. Make the orchestrate script executable:

   ```bash
   chmod +x orchestrate.sh
   ```

3. Use the orchestrate script to manage the application:

   ```bash
   # Start in development mode (with hot-reload)
   ./orchestrate.sh --action=start --environment=development

   # Start in production mode
   ./orchestrate.sh --action=start --environment=production

   # Stop the services
   ./orchestrate.sh --action=stop

   # Restart services
   ./orchestrate.sh --action=restart

   # Remove all containers, volumes, and images
   ./orchestrate.sh --action=remove
   ```

   This will start:

   - Web App at http://localhost:5173
   - Server App at http://localhost:3030
