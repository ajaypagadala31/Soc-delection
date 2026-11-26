# SENTINEL-X: Intelligent Security Operations & Threat Response Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/sentinelx/platform)
[![Security](https://img.shields.io/badge/security-A%20-grade-green.svg)](docs/security.md)

> **Detect Faster. Investigate Smarter. Respond Stronger.**

SENTINEL-X is a premium enterprise-grade SOC Detection & Response Platform designed for modern security operations centers. Built with defense-in-depth security architecture, real-time monitoring, and professional SOC workflows.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Security](#security)
- [Getting Started](#getting-started)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

SENTINEL-X combines advanced security controls, real-time threat detection, and intuitive visualizations into a single cohesive platform. Designed for enterprise security teams requiring SOC compliance, incident response capabilities, and MITRE ATT&CK mapping.

### Key Capabilities

- Real-time alert streaming through WebSockets
- Multi-factor authentication (TOTP)
- Role-based access control with 4 distinct roles
- MITRE ATT&CK Enterprise matrix integration
- Wazuh SIEM integration
- Incident investigation workspace
- Threat intelligence enrichment
- IOC (Indicator of Compromise) management
- Comprehensive audit logging
- Automated response workflows

## Features

### Security Features

- **Authentication**: JWT-based with Argon2id password hashing
- **Multi-Factor Authentication**: TOTP support via Google Authenticator
- **RBAC**: Fine-grained permissions with 4 user roles
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Audit Logging**: Complete audit trail of all user actions

### SOC Features

- **Real-time Alerts**: WebSocket-based live alert updates
- **MITRE ATT&CK Mapping**: Interactive matrix with detection coverage
- **Incident Management**: Full lifecycle tracking
- **Detection Rules**: Custom rule creation and testing
- **Alert Investigation**: Evidence view and analyst notes
- **Threat Intelligence**: IOC management and enrichment

### Visualization Features

- **Dashboard**: Security posture summary with metrics
- **Alert Timeline**: Interactive chronological view
- **Severity Distribution**: Donut charts and heatmaps
- **Endpoint Health**: Real-time status visualization
- **Attack Timeline**: MITRE technique timeline

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LOAD BALANCER (NGINX)                         │
└───────────────────────┬─────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
  ┌───────▼──────┐ ┌──────▼───────┐ ┌────▼──────────────┐
  │  Frontend    │ │  API Gateway │ │  WebSocket Server │
  │  (React)     │ │  (Express)   │ │  (Socket.IO)      │
  └───────┬──────┘ └──────┬───────┘ └────┬──────────────┘
          │               │               │
          └───────────────┼───────────────┘
                          │
                ┌─────────▼─────────┐
                │    API Server     │
                │  (Node.js/Express)│
                └─────────┬─────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
  ┌───────▼──────┐ ┌──────▼───────┐ ┌────▼──────────────┐
  │  PostgreSQL  │ │    Redis     │ │ Wazuh Integration │
  │  (Database)  │ │  (Cache/Sess)│ │   (MCP Client)    │
  └──────────────┘ └──────────────┘ └───────────────────┘
```

### Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Backend | Node.js + Express | 18+ |
| Frontend | React + TypeScript | 18 |
| Database | PostgreSQL | 15+ |
| Cache | Redis | 7+ |
| ORM | Prisma | 5.x |
| WebSocket | Socket.IO | 4.x |
| Container | Docker | Latest |

## Security

### Security Controls

- **OWASP Top 10 Compliant**: All 10 categories addressed
- **NIST Framework Aligned**: Identify, Protect, Detect, Respond, Recover
- **MITRE ATT&CK Mapped**: Detection coverage tracking
- **SOC 2 Controls**: Audit logging, access control, monitoring

### Security Documentation

See [docs/security.md](docs/security.md) for comprehensive security documentation including:
- OWASP Top 10 compliance matrix
- Authentication and authorization flow
- API security controls
- Data security measures
- Incident response plan

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for development)
- PostgreSQL 15+ (or Docker)
- Redis 7+ (or Docker)

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/sentinelx/platform.git
cd sentinelx

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Build and start services
docker-compose up -d

# Apply database migrations
docker-compose exec api npx prisma migrate deploy

# Create initial admin user
docker-compose exec api npx ts-node scripts/init-admin.ts
```

### Manual Setup

```bash
# Backend
cd backend
npm install
npm run prisma:migrate
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev
```

### Access the Platform

- **Frontend**: http://localhost:8080
- **API**: http://localhost:3001
- **WebSocket**: ws://localhost:3002
- **Dashboard**: http://localhost:3000 (Grafana)

## Development

### Project Structure

```
sentinelx/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # API controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Entry point
│   ├── prisma/             # Database schema
│   ├── tests/              # Unit and integration tests
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # React hooks
│   │   ├── services/       # API services
│   │   ├── styles/         # Design system
│   │   ├── store/          # State management
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/             # Static assets
│   ├── Dockerfile
│   └── package.json
│
├── docs/                    # Documentation
│   ├── architecture.md    # Architecture docs
│   ├── security.md          # Security docs
│   └── api.md               # API reference
│
├── docker-compose.yml
├── .env.example
├── prisma/
│   └── schema.prisma
└── README.md
```

### Environment Variables

See `.env.example` for all required environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/sentinelx?schema=public
POSTGRES_USER=sentinelx
POSTGRES_PASSWORD=secure_password_change_me
POSTGRES_DB=sentinelx

# JWT
JWT_SECRET=<strong_random_secret>
JWT_REFRESH_SECRET=<strong_random_secret>

# Redis
REDIS_URL=redis://localhost:6379

# Wazuh
WAZUH_BASE_URL=https://localhost:55000
WAZUH_API_USER=admin
WAZUH_API_PASSWORD=admin

# Security
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
RATE_LIMIT_WEBOW_MS=900000
RATE_LIMIT_MAX=100
```

### API Development

```bash
# Run backend in development mode
cd backend
npm run dev

# Run tests
npm test

# Run security audit
npm run dep:audit

# View Prisma Studio
npx prisma studio
```

### Frontend Development

```bash
# Run development server
cd frontend
npm run dev

# Run tests
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## API Documentation

### Authentication Endpoints

```http
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/refresh
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
GET /api/v1/auth/me
```

### Core Endpoints

```http
GET /api/v1/users
POST /api/v1/users
GET /api/v1/users/:id
PUT /api/v1/users/:id
DELETE /api/v1/users/:id

GET /api/v1/alerts
GET /api/v1/alerts/:id
PUT /api/v1/alerts/:id
POST /api/v1/alerts/:id/acknowledge

GET /api/v1/incidents
POST /api/v1/incidents
GET /api/v1/incidents/:id
PUT /api/v1/incidents/:id

GET /api/v1/rules
POST /api/v1/rules
GET /api/v1/rules/:id

GET /api/v1/wazuh/alerts
GET /api/v1/wazuh/agents
```

Full API documentation available in [docs/api.md](docs/api.md).

## Deployment

### Production Deployment

```bash
# Build frontend
cd frontend
npm run build

# Build Docker images
docker-compose build

# Deploy stack
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Apply migrations
docker-compose exec api npx prisma migrate deploy

# Verify deployment
curl http://localhost:8080/health
```

### Kubernetes Deployment

```yaml
# Example Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sentinelx-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sentinelx-api
  template:
    metadata:
      labels:
        app: sentinelx-api
    spec:
      containers:
      - name: api
        image: sentinelx/api:latest
        ports:
        - containerPort: 3001
        envFrom:
        - secretRef:
            name: sentinelx-secrets
```

### Environment Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| JWT_SECRET | JWT signing secret | Yes |
| JWT_REFRESH_SECRET | Refresh token secret | Yes |
| REDIS_URL | Redis connection string | Yes |
| CORS_ORIGINS | Allowed CORS origins | Yes |
| WAZUH_BASE_URL | Wazuh API URL | Conditional |

## Testing

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests (Cypress)
npm run test:e2e

# Security tests
npm run test:security

# Coverage report
npm run test:coverage
```

### Test Coverage Goals

- Unit tests: 80%+ coverage
- Integration tests: 70%+ coverage
- E2E tests: Core flows covered
- Security tests: OWASP ASVS compliant

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Style

- TypeScript with strict mode
- ESLint and Prettier configured
- Follow existing code patterns
- Write unit tests for new features

### Security Review

- All PRs require security review
- Dependency updates require approval
- Sensitive changes require maintainer approval

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

### Security Issues
Report security vulnerabilities to security@sentinelx.org

### General Questions
Open an issue with the "question" label

### Documentation
- [Architecture Documentation](docs/architecture.md)
- [Security Documentation](docs/security.md)
- [API Reference](docs/api.md)

---

**© 2026 SENTINEL-X Team. All rights reserved.**