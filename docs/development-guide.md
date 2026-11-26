# SENTINEL-X Development Guide for VS Code

This guide provides step-by-step instructions for setting up and running SENTINEL-X in Visual Studio Code.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Visual Studio Code** - Latest version
2. **Node.js** - Version 18.x or higher
3. **Docker Desktop** - For containerization
4. **Git** - For version control

## VS Code Extensions Recommendation

Install these extensions for the best development experience:

1. **ESLint** - JavaScript/TypeScript linting
2. **Prettier** - Code formatter
3. **Bracket Pair Colorizer** - Code readability
4. **Auto Rename Tag** - HTML tag management
5. **Path Intellisense** - File path autocomplete
6. **GitLens** - Git enhancements
7. **Tailwind CSS IntelliSense** - CSS classes autocomplete
8. **TypeScript Importer** - Auto-import TypeScript
9. **Docker** - Docker management
10. **Bracket Pair Colorizer 2** - Visual bracket matching

## Workspace Setup

### 1. Open the Project in VS Code

```bash
cd "C:\Users\ajayp\OneDrive\Pictures\Documents\cyber security\Soc delection"
code .
```

Or from VS Code:
1. Open VS Code
2. Press `Ctrl + Shift + P` (Windows) or `Cmd + Shift + P` (Mac)
3. Type "Open Folder"
4. Navigate to the project directory and select it

### 2. Create Workspace File

Create a `.code-workspace` file for consistent settings:

```json
{
  "folders": [
    {
      "name": "SENTINEL-X",
      "path": "."
    },
    {
      "name": "Backend",
      "path": "./backend"
    },
    {
      "name": "Frontend",
      "path": "./frontend"
    }
  ],
  "settings": {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "typescript.tsdk": "node_modules/typescript/lib/typescript.js",
    "files.exclude": {
      "**/dist": true,
      "**/node_modules": true,
      "**/.git": true
    }
  },
  "extensions": {
    "recommendations": [
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode",
      "bradlc.vscode-tailwindcss",
      "ms-azuretools.vscode-docker"
    ]
  }
}
```

## Running the Development Environment

### Option 1: Using Docker (Recommended for Production-like Environment)

#### Step 1: Set Up Environment Variables

```bash
# Copy the example environment file
copy .env.example .env

# Edit .env with your configuration
notepad .env
```

Make sure to update these critical values:
- `JWT_SECRET` - Generate a strong random secret
- `JWT_REFRESH_SECRET` - Different from JWT_SECRET
- `POSTGRES_PASSWORD` - Secure database password
- `WAZUH_BASE_URL` - Your Wazuh instance URL

#### Step 2: Start Docker Compose

```bash
docker-compose up -d
```

This starts all services:
- PostgreSQL database
- Redis cache
- Backend API server
- WebSocket server
- Frontend application
- Monitoring stack (Prometheus, Grafana)
- ELK stack (Elasticsearch, Kibana)

#### Step 3: Verify Services

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f api

# Check health endpoints
curl http://localhost:3001/health
curl http://localhost:3000/health
```

#### Step 4: Run Database Migrations

```bash
docker-compose exec api npx prisma migrate dev --name init
```

### Option 2: Local Development (Without Docker)

#### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
cd ..
```

#### Step 2: Set Up PostgreSQL

If you have PostgreSQL installed locally:
```bash
# Create database and user
psql -U postgres
CREATE USER sentinelx WITH PASSWORD 'secure_password_change_me';
CREATE DATABASE sentinelx OWNER sentinelx;
\q
```

Or use Docker for database only:
```bash
docker run --name sentinelx-postgres -e POSTGRES_USER=sentinelx -e POSTGRES_PASSWORD=secure_password_change_me -e POSTGRES_DB=sentinelx -p 5432:5432 -d postgres:15-alpine
```

#### Step 3: Set Up Redis

```bash
docker run --name sentinelx-redis -p 6379:6379 -d redis:7-alpine
```

#### Step 4: Configure Environment

```bash
# Copy and edit environment
copy .env.example .env
notepad .env
```

#### Step 5: Run Backend

```bash
# Terminal 1 - Backend API
cd backend
npm run dev
```

#### Step 6: Run Frontend

```bash
# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Step 7: Run WebSocket Server

For WebSocket development, you can use the same Express server or run separately:

```bash
# The WebSocket server is integrated with the API server
# In production, it runs as a separate service
```

## VS Code Debugging Setup

### Backend Debug Configuration

Create `.vscode/launch.json` in the backend folder:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend API",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/index.ts",
      "runtimeArgs": ["--loader", "ts-node/esm"],
      "envFile": "${workspaceFolder}/backend/.env",
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Frontend Debug Configuration

For the frontend, the Vite dev server provides built-in debugging:
1. Open the frontend URL: `http://localhost:5173`
2. Open browser DevTools (F12)
3. Use the Sources tab for debugging

### Tasks Configuration

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run Backend",
      "type": "shell",
      "command": "npm run dev",
      "group": "none",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "options": {
        "cwd": "${workspaceFolder}/backend"
      }
    },
    {
      "label": "Run Frontend",
      "type": "shell",
      "command": "npm run dev",
      "group": "none",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "options": {
        "cwd": "${workspaceFolder}/frontend"
      }
    },
    {
      "label": "Run Linting",
      "type": "shell",
      "command": "npm run lint",
      "group": "build",
      "presentation": {
        "reveal": "silent"
      }
    }
  ]
}
```

## Running Tests

### Backend Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run security audit
npm run dep:audit
```

### Frontend Tests

```bash
# Run tests
npm test

# Run with UI
npm run test:ui
```

## Database Management with Prisma Studio

Prisma Studio provides a GUI for database management:

```bash
cd backend
npx prisma studio
```

This opens a web interface at `http://localhost:5555` to:
- View all database tables
- Edit records
- Create new records
- Run raw SQL queries

## Common Development Tasks

### Creating a New Migration

```bash
cd backend
npx prisma migrate dev --name <migration_name>
```

### Generating Prisma Client

```bash
cd backend
npx prisma generate
```

### Resetting Database

```bash
cd backend
npx prisma migrate reset
```

### Building Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build
```

## Troubleshooting

### Port Already in Use

If you get port conflicts:
```bash
# Find process using port
netstat -ano | findstr :3001

# Kill process
taskkill /PID <process_id> /F
```

### Database Connection Issues

1. Check if PostgreSQL is running: `docker ps`
2. Verify connection string in `.env`
3. Check firewall settings
4. Try restarting PostgreSQL: `docker-compose restart postgres`

### WebSocket Connection Issues

1. Ensure the WebSocket server is running
2. Check CORS settings in `.env`
3. Verify the connection URL: `ws://localhost:3002`
4. Check browser console for errors

### Hot Reload Not Working

1. VS Code: Ensure file watching is not limited
2. Check `vite.config.ts` for correct paths
3. Restart dev servers if needed

## Production Build and Deployment

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd ../backend
npm run build
```

### Running with Docker

```bash
# Build images
docker-compose build

# Start production stack
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Useful VS Code Settings

Add these to your `settings.json` (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "editor.tabSize": 2,
  "editor.detectIndentation": false,
  " Prettier: Tab Width": 2,
  "terminal.integrated.cwd": "${fileDirname}",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "breadcrumbs.enabled": true,
  "explorer.openEditors.visible": 10,
  "workbench.editor.limit.enabled": true,
  "workbench.editor.limit.perWindow": 10
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Shift + P` | Command Palette |
| `Ctrl + Shift + E` | Explorer |
| `Ctrl + Shift + F` | Search |
| `Ctrl + Shift + D` | Debug |
| `Ctrl + Shift + U` | Terminal |
| `F5` | Start Debugging |
| `Ctrl + Shift + B` | Run Task |
| `Alt + Up/Down` | Move line up/down |
| `Ctrl + /` | Toggle comment |
| `Ctrl + Shift + O` | Go to Symbol |

## Getting Help

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Open the terminal and run commands manually
3. Check the troubleshooting section
4. Review the documentation in `/docs`