# SENTINEL-X Architecture Documentation

## System Overview

SENTINEL-X is a modern Security Operations Center (SOC) Detection & Response Platform designed for enterprise security teams. This document provides comprehensive architecture documentation, security controls, and implementation details.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LOAD BALANCER (NGINX)                         │
│  - SSL/TLS termination                                             │
│  - Rate limiting                                                     │
│  - Reverse proxy                                                     │
│  - DDoS protection                                                   │
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
                │    API Server   │
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

## Technology Stack

### Backend
| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Runtime | Node.js | 18+ | Server-side JavaScript |
| Framework | Express.js | 4.x | REST API framework |
| Database | PostgreSQL | 15+ | Relational database |
| ORM | Prisma | 5.x | Type-safe database client |
| Cache | Redis | 7.x | Session store, pub/sub |
| Authentication | JWT | - | Token-based auth |
| MFA Library | speakeasy | 2.x | TOTP generation/validation |
| Password Hashing | argon2 | 0.31 | Secure password hashing |
| WebSocket | Socket.IO | 4.x | Real-time communication |

### Frontend
| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | React | 18.x | Component library |
| Language | TypeScript | 5.x | Type-safe JavaScript |
| Routing | React Router | 6.x | Client-side routing |
| State | React Query | 3.x | Server state management |
| UI Library | Material-UI | 5.x | Component library |
| Forms | React Hook Form | 7.x | Form validation |
| Charts | Chart.js / Recharts | 4.x/2.x | Data visualization |
| Socket | Socket.IO Client | 4.x | Real-time updates |

### Infrastructure
| Component | Technology | Purpose |
|-----------|------------|---------|
| Container | Docker | Containerization |
| Orchestration | Docker Compose | Service orchestration |
| Reverse Proxy | Nginx | HTTP server, routing |
| Monitoring | Prometheus + Grafana | Metrics, dashboards |
| Logging | Winston + ELK | Structured logging |
| CI/CD | GitHub Actions | Automation |

## Security Architecture

### Defense-in-Depth Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    Internet/WAN                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────┐
│                    Cloudflare WAF                           │
│  - DDoS Protection                                          │
│  - OWASP Core Ruleset                                       │
│  - Rate Limiting                                            │
└─────────────────────────────┬─────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────┐
│                    Load Balancer (NGINX)                    │
│  - SSL/TLS termination                                      │
│  - Request validation                                       │
│  - Access control                                           │
└─────────────────────────────┬─────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────┐
│                    API Gateway Layer                        │
│  - Rate limiting (100 req/min)                              │
│  - CORS validation                                          │
│  - Request size limits                                      │
│  - API key authentication                                   │
└─────────────────────────────┬─────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────┐
│                    Application Layer                        │
│  - JWT validation                                           │
│  - RBAC enforcement                                         │
│  - Input validation                                         │
│  - Output encoding                                          │
│  - Business logic                                           │
└─────────────────────────────┬─────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────┐
│                    Data Layer                               │
│  - Database encryption at rest                             │
│  - Connection pooling                                       │
│  - Row-level security                                       │
│  - Audit logging                                            │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
1. User submits credentials (POST /api/v1/auth/login)
   ↓
2. Server validates email/password
   ↓
3. Check MFA status
   |→ If MFA enabled: Prompt for MFA code
   |   ↓
   |   Verify TOTP code
   |   ↓
   |   If valid: Generate tokens
   ↓
4. If MFA not required: Generate tokens
   ↓
5. Return accessToken + refreshToken
   ↓
6. Store accessToken in memory
   ↓
7. Store refreshToken in httpOnly cookie (in production)

Token Generation:
┌─────────────────────────────────────┐
│ Access Token (15 min)               │
│ - Contains: userId, mfaVerified     │
│ - Signed with: JWT_SECRET           │
│                                     │
│ Refresh Token (7 days)              │
│ - Contains: userId                  │
│ - Signed with: JWT_REFRESH_SECRET   │
└─────────────────────────────────────┘
```

### Authorization Flow

```
Request Flow:
┌─────────────────────────────────────────────────────────────────┐
│ 1. Client sends request with JWT token                        │
└────────────────────────┬──────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ 2. Auth Middleware                                            │
│    - Verify JWT signature                                     │
│    - Check token expiration                                   │
│    - Load user including roles and permissions                │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ 3. RBAC Middleware                                            │
│    - Check required role(s) for endpoint                   │
│    - Verify user has permission for resource                 │
└────────────────────────┬─────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────────┐
│ 4. Route Handler                                              │
│    - Process request                                        │
│    - Log audit event                                        │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Core Tables

#### Users Table
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `passwordHash`: String (Argon2id)
- `firstName`: String
- `lastName`: String
- `isActive`: Boolean
- `isMfaEnabled`: Boolean
- `mfaSecret`: String (Encrypted)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `lastLoginAt`: DateTime (Nullable)
- `failedLoginAttempts`: Integer
- `lockedUntil`: DateTime (Nullable)

#### Roles Table
- `id`: UUID (Primary Key)
- `name`: String (Unique)
- `description`: String
- `level`: Integer (For ordering)
- `createdAt`: DateTime

#### Permissions Table
- `id`: UUID (Primary Key)
- `resource`: String (e.g., 'user', 'alert', 'incident')
- `action`: String (e.g., 'read', 'write', 'delete')
- `description`: String

#### UserRole Table (Junction)
- `userId`: UUID (Foreign Key -> users.id)
- `roleId`: UUID (Foreign Key -> roles.id)
- Primary Key: (userId, roleId)

#### AuditLog Table
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key -> users.id, Nullable)
- `action`: String
- `resourceType`: String
- `resourceId`: String (Nullable)
- `ipAddress`: String (Nullable)
- `userAgent`: String (Nullable)
- `details`: JSON
- `createdAt`: DateTime

#### DetectionRule Table
- `id`: UUID (Primary Key)
- `name`: String
- `description`: String (Nullable)
- `ruleType`: String
- `severity`: String
- `mitreAttackTechnique`: String (Nullable)
- `mitreAttackTactic`: String (Nullable)
- `condition`: JSON
- `response`: JSON (Nullable)
- `isActive`: Boolean
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `firedCount`: Integer
- `createdBy`: UUID (Nullable)

#### Alert Table
- `id`: UUID (Primary Key)
- `ruleId`: UUID (Nullable, Foreign Key -> detection_rules.id)
- `title`: String
- `description`: String (Nullable)
- `severity`: String
- `status`: String ('open', 'acknowledged', 'closed')
- `source`: String (Nullable)
- `sourceId`: String (Nullable)
- `alertData`: JSON (Nullable)
- `assignedTo`: UUID (Nullable, Foreign Key -> users.id)
- `createdAt`: DateTime
- `acknowledgedAt`: DateTime (Nullable)
- `closedAt`: DateTime (Nullable)

#### Incident Table
- `id`: UUID (Primary Key)
- `title`: String
- `description`: String (Nullable)
- `severity`: String
- `status`: String ('open', 'in_progress', 'resolved', 'closed')
- `priority`: String (Nullable)
- `category`: String (Nullable)
- `mitreAttackTechnique`: String (Nullable)
- `relatedAlerts`: String[] (Array of alert IDs)
- `assignedTo`: UUID (Nullable, Foreign Key -> users.id)
- `createdBy`: UUID (Nullable, Foreign Key -> users.id)
- `createdAt`: DateTime
- `updatedAt`: DateTime
- `resolvedAt`: DateTime (Nullable)

#### WazuhAgent Table
- `id`: UUID (Primary Key)
- `agentId`: Integer (Unique)
- `name`: String
- `ipAddress`: String (Nullable)
- `os`: String (Nullable)
- `version`: String (Nullable)
- `status`: String ('active', 'offline', 'disconnected')
- `lastSeen`: DateTime (Nullable)
- `registeredAt`: DateTime
- `lastApiSync`: DateTime (Nullable)

#### WazuhAlert Table
- `id`: UUID (Primary Key)
- `wazuhAgentId`: Integer (Foreign Key -> wazuh_agents.agent_id)
- `alertId`: String
- `ruleId`: Integer (Nullable)
- `level`: Integer (Nullable)
- `description`: String (Nullable)
- `fullLog`: String (Nullable)
- `rawAlert`: JSON (Nullable)
- `receivedAt`: DateTime
- `ingestedAt`: DateTime

## API Security Controls

### OWASP Top 10 Mitigation

| OWASP Category | Controls Implemented |
|----------------|---------------------|
| A01:2021 - Broken Access Control | RBAC middleware, route guards, resource-level permissions |
| A02:2021 - Cryptographic Failures | Argon2id password hashing, TLS 1.3, JWT signing |
| A03:2021 - Injection | Prisma ORM (parameterized queries), input validation, sanitizers |
| A04:2021 - Insecure Design | Security-by-design principles, threat modeling |
| A05:2021 - Security Misconfiguration | Secure defaults, config management, security headers |
| A06:2021 - Vulnerable Components | Dependency scanning (npm audit), regular updates |
| A07:2021 - Identification/Auth Failures | MFA, secure session management, password policies |
| A08:2021 - Software & Data Integrity | CI/CD security, dependency verification |
| A09:2021 - Security Logging | Audit logging, SIEM integration, alerting |
| A10:2021 - Server-Side Request Forgery | Network isolation, input validation, allowlists |

### Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: accelerometer=(), camera=(), geolocation=(), microphone=()
```

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 5 requests | 15 minutes |
| API (general) | 100 requests | 15 minutes |
| Refresh Token | 5 requests | 1 hour |
| MFA Verify | 3 requests | 15 minutes |

### CORS Configuration

```javascript
{
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  headers: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400,
}
```

## WebSocket Real-Time Architecture

### Connection Flow

```
1. Client connects to WS server
   ↓
2. Client sends JWT token in auth params
   ↓
3. Server validates JWT
   ↓
4. Server joins user to rooms:
   - user:{userId}
   - role-based rooms (admin, manager, analyst, viewer)
   - Global rooms (alerts, incidents, all)
   ↓
5. Server stores session in Redis
   ↓
6. Client receives connection confirmation
```

### Event Broadcasting

| Event | Channel | Payload |
|-------|---------|---------|
| alert.created | alerts, all | Alert object |
| alert.updated | alerts, user:{assignedTo} | Alert object |
| alert.acknowledged | alerts | {alertId, userId} |
| incident.created | incidents, all | Incident object |
| incident.updated | incidents | Incident object |

## Deployment Architecture

### Docker Compose Services

```
┌─────────────────┐
│  sentryx-postgres  │
│  (Database)      │
│  Port: 5432      │
└─────────────────┘
       │
       │
┌─────────────────┐
│  sentinelx-redis  │
│  (Cache/Session) │
│  Port: 6379      │
└─────────────────┘
       │
       ├──────────────┐
       │              │
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  sentinelx-api    │ │  sentinelx-web  │ │  sentinelx-nginx  │
│  (Backend API)   │ │  (WebSocket)   │ │  (Reverse Proxy)  │
│  Port: 3001      │ │  Port: 3002    │ │  Port: 80/443    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
       │
       │
┌──────────────────────────────────┐
│  sentinelx-frontend                │
│  (React App)                      │
│  Internal (via nginx)            │
└──────────────────────────────────┘
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/sentinelx?schema=public
POSTGRES_USER=sentinelx
POSTGRES_PASSWORD=secure_password_change_me
POSTGRES_DB=sentinelx

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=<strong_random_secret>
JWT_REFRESH_SECRET=<strong_random_secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Wazuh
WAZUH_BASE_URL=https://localhost:55000
WAZUH_API_USER=admin
WAZUH_API_PASSWORD=admin

# Security
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
RATE_LIMIT_WEBOW_MS=900000
RATE_LIMIT_MAX=100

# MFA
MFA_ISSUER=SENTINEL-X
MFA_DIGITS=6
MFA_PERIOD=30
```

## Monitoring and Observability

### Metrics Collected

- API response times (p50, p95, p99)
- Error rates by endpoint
- Authentication success/failure rates
- Database query performance
- WebSocket connection counts
- Memory and CPU usage

### Health Check Endpoints

- `GET /health` - Basic health check
- `GET /metrics` - Prometheus metrics
- `GET /api/v1/health` - API health check

## Disaster Recovery

### Backup Strategy

1. **Database**: Daily logical backups, retained for 30 days
2. **Redis**: RDB snapshots every 1 hour
3. **Logs**: Elasticsearch index snapshots, retained for 90 days
4. **Configuration**: Version controlled in Git

### Recovery Time Objectives

| Resource | RTO | RPO |
|----------|-----|-----|
| Database | 4 hours | 1 hour |
| Cache | 1 hour | 0 |
| Logs | 8 hours | 1 hour |

## Known Limitations

1. **Single Node**: Currently deployed as a single-node application. Production deployments should use Kubernetes or Docker Swarm for high availability.

2. **Wazuh Integration**: This implementation uses the Wazuh REST API. A more robust solution would use the Wazuh manager's ElasticSearch integration for real-time log streaming.

3. **File Uploads**: File upload functionality is not implemented in this version. Production deployments should use a dedicated object storage service (S3, MinIO).

4. **Email Notifications**: Email/SMS notification systems require additional configuration and a third-party email service provider.

5. **SSO Integration**: SAML/OAuth2 integration requires additional configuration and an identity provider.

## Future Improvements

1. **Microservices Architecture**: Split into separate services (Auth, SOC, SIEM, WebSocket)
2. **Event-Driven Architecture**: Implement Kafka/RabbitMQ for event sourcing
3. **Multi-Tenant Support**: Add organization-based tenancy
4. **Advanced Analytics**: Integrate machine learning models for threat detection
5. **Mobile Application**: Native mobile app for incident response
6. **GraphQL API**: Add GraphQL endpoint alongside REST API