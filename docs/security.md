# SENTINEL-X Security Documentation

## Executive Summary

SENTINEL-X implements a defense-in-depth security architecture following OWASP Top 10, NIST Cybersecurity Framework, and MITRE ATT&CK guidelines. This document provides comprehensive security controls, testing procedures, and compliance mappings.

## Security Controls Matrix

### Authentication and Identity Security

| Control | Implementation | Standard |
|---------|---------------|----------|
| Secure Password Hashing | Argon2id with memoryCost=65536, timeCost=3, parallelism=4 | OWASP ASVS 2.1 |
| Multi-Factor Authentication | TOTP via speakeasy library, 6 digits, 30-second period | NIST SP 800-63B |
| Password Policy | Minimum 12 chars, uppercase, lowercase, number, special char | NIST SP 800-63B |
| Account Lockout | 5 failed attempts = 30 minute lockout | OWASP ASVS 2.4 |
| Session Expiration | 15 minutes access token, 7 days refresh | OWASP ASVS 2.5 |
| Secure Session Management | HttpOnly, Secure cookies (production), JWT in memory | OWASP Session Management |
| Password Reset | Expiring (1 hour), single-use tokens | OWASP ASVS 2.8 |
| Role-Based Access Control | 4 roles with granular permissions | NIST AC-2 |

### Roles and Permissions

#### Super Admin (superadmin)
- Full system access
- User management
- Role assignment
- Configuration changes
- Audit log access

#### SOC Manager (manager)
- Alert and incident management
- User assignment
- Report generation
- Limited configuration

#### Security Analyst (analyst)
- Alert investigation
- Incident response
- Detection rule viewing
- MITRE ATT&CK mapping

#### Read-only Viewer (viewer)
- Dashboard viewing
- Alert/incident read access
- Report viewing only

### API Security

| Control | Implementation | Standard |
|---------|---------------|----------|
| Input Validation | Zod schemas, Joi validation | OWASP ASVS 5.1 |
| Authentication | JWT Bearer tokens | OWASP ASVS 2.2 |
| Authorization | RBAC middleware | NIST AC-3 |
| Rate Limiting | 100 req/15min per IP | OWASP ASVS 7.4 |
| CORS | Strict allowlist | OWASP ASVS 5.2 |
| CSRF Protection | JWT-based (stateless) | OWASP ASVS 5.3 |
| Security Headers | Helmet.js with CSP, HSTS, X-Frame-Options | OWASP ASVS 10.1 |
| SQL Injection | Prisma ORM (parameterized queries) | OWASP ASVS 3.1 |
| XSS Prevention | sanitize-html, input sanitization | OWASP ASVS 5.4 |
| SSRF Protection | URL allowlists for external connections | OWASP ASVS 13.1 |
| File Validation | Content-Type, size limits, virus scanning | OWASP ASVS 14.1 |
| Error Handling | Generic errors, no stack traces | OWASP ASVS 3.2 |

### Data Security

| Control | Implementation | Standard |
|---------|---------------|----------|
| Encryption in Transit | TLS 1.3 | NIST SP 800-52 |
| Encryption at Rest | PostgreSQL TDE, Argon2id password hashing | NIST SP 800-111 |
| Secrets Management | Environment variables, .env not committed | NIST SP 800-57 |
| Database Least Privilege | Dedicated DB user with minimal permissions | NIST AC-6 |
| Data Retention | Configurable (default 30 days for logs) | NIST 800-88 |
| Backup Strategy | Daily automated backups, 30-day retention | NIST SP 800-34 |
| Audit Logging | Append-only logs, tamper-evident | NIST AU-2 |

## OWASP Top 10 Compliance

### A01:2021 - Broken Access Control
**Remediation:**
- RBAC middleware validates permissions on every request
- Resource ownership checks prevent unauthorized access
- API endpoints verify user has required role/permission
- Test: Automated tests verify each endpoint enforces RBAC

### A02:2021 - Cryptographic Failures
**Remediation:**
- Argon2id for password hashing (memory-hard algorithm)
- TLS 1.3 for all connections (enforced in production)
- JWT with strong secrets (256-bit minimum)
- Database encryption at rest enabled

### A03:2021 - Injection
**Remediation:**
- Prisma ORM uses parameterized queries
- All user input is sanitized with sanitize-html
- SQL keywords and special characters are escaped
- Input validation with Zod schemas

### A04:2021 - Insecure Design
**Remediation:**
- Security requirements defined before development
- Threat modeling performed for each module
- Security review gates in CI/CD pipeline
- Secure defaults in all configurations

### A05:2021 - Security Misconfiguration
**Remediation:**
- Helmet.js sets secure headers by default
- All development secrets are placeholder values
- Debug mode disabled in production builds
- Secure cookie settings (HttpOnly, SameSite, Secure)

### A06:2021 - Vulnerable Components
**Remediation:**
- `npm audit` runs in CI/CD pipeline
- Dependabot alerts for vulnerable dependencies
- Scheduled dependency updates
- Vulnerability scan with Snyk

### A07:2021 - Identification and Authentication Failures
**Remediation:**
- MFA with TOTP (Google Authenticator compatible)
- Account lockout after 5 failed attempts
- Secure session management with JWT
- Password policy enforced on change

### A08:2021 - Software and Data Integrity Failures
**Remediation:**
- Dependency verification with checksums
- Git commit signing encouraged
- CI/CD pipeline security scans
- Container image scanning with Trivy

### A09:2021 - Security Logging and Monitoring Failures
**Remediation:**
- Comprehensive audit logging to PostgreSQL
- ELK stack for centralized log analysis
- WebSocket session tracking
- Alert generation on suspicious activity

### A10:2021 - Server-Side Request Forgery
**Remediation:**
- External API calls use allowlisted domains only
- URL parsing and validation for all user-provided URLs
- Network segmentation isolates Wazuh integration
- Request validation prevents SSRF

## Security Testing Procedures

### Static Analysis (SAST)

1. **ESLint Security Rules**
   ```bash
   npm run lint
   ```
   - Checks for common vulnerabilities
   - Enforces secure coding patterns

2. **Dependency Scanning**
   ```bash
   npm audit
   npm audit fix
   ```
   - Identifies vulnerable packages
   - Automated patching where possible

### Dynamic Analysis (DAST)

1. **OWASP ZAP Scanning**
   ```bash
   npx zap-cli quick-scan -r http://localhost:3001
   ```

2. **API Fuzzing**
   - Postman collection with security tests
   - SQL injection attempts
   - XSS payload testing
   - Authentication bypass attempts

### Penetration Testing Checklist

| Test | Status | Notes |
|------|--------|-------|
| Brute force authentication | ✅ Protected | Rate limiting, account lockout |
| Session hijacking | ✅ Protected | Secure JWT, HTTPS |
| SQL injection | ✅ Protected | Prisma ORM, parameterized queries |
| XSS attacks | ✅ Protected | Input sanitization, CSP |
| CSRF attacks | ✅ Protected | JWT-based auth |
| SSRF | ✅ Protected | URL validation, network isolation |
| IDOR | ✅ Protected | RBAC, resource ownership |
| Privilege escalation | ✅ Protected | Server-side RBAC enforcement |

## Incident Response Plan

### Security Incident Classification

| Severity | Response Time | Affected Users | Notification Required |
|----------|--------------|----------------|----------------------|
| Critical | 15 minutes | Potentially all | Executive, SOC |
| High | 1 hour | Multiple users | SOC, Security |
| Medium | 4 hours | Limited users | SOC only |
| Low | 24 hours | None or few | SOC only |

### Incident Response Steps

1. **Detection**
   - Monitor audit logs
   - SIEM correlation rules
   - WebSocket alert notifications

2. **Containment**
   - Disable affected accounts
   - Block suspicious IPs
   - Isolate affected systems

3. **Eradication**
   - Remove malicious artifacts
   - Patch vulnerabilities
   - Reset compromised credentials

4. **Recovery**
   - Restore from clean backups
   - Verify system integrity
   - Resume normal operations

5. **Lessons Learned**
   - Document root cause
   - Update security controls
   - Improve detection rules

## Audit Logging Specification

### Required Audit Events

| Event | Required Fields |
|-------|--------------|
| LOGIN_SUCCESS | userId, ipAddress, userAgent, timestamp |
| LOGIN_FAILURE | email, ipAddress, userAgent, reason, timestamp |
| LOGOUT | userId, sessionId, ipAddress, timestamp |
| PASSWORD_CHANGE | userId, ipAddress, timestamp |
| MFA_ENABLED | userId, method, ipAddress, timestamp |
| MFA_VERIFIED | userId, method, ipAddress, timestamp |
| USER_CREATE | userId, createdUserId, ipAddress, timestamp |
| USER_DELETE | userId, deletedUserId, ipAddress, timestamp |
| ROLE_ASSIGNED | userId, roleId, assignedBy, timestamp |
| PERMISSION_GRANTED | roleId, permissionId, grantedBy, timestamp |
| API_KEY_CREATED | userId, keyName, createdBy, timestamp |
| RULE_CREATED | ruleId, createdBy, timestamp |
| ALERT_CREATED | alertId, ruleId, source, timestamp |
| INCIDENT_CREATED | incidentId, createdBy, timestamp |
| INCIDENT_ASSIGNMENT | incidentId, assignedTo, assignedBy, timestamp |
| CONFIG_CHANGE | userId, setting, oldValue, newValue, timestamp |

### Audit Log Schema

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
```

## Compliance Mapping

### SOC 2 Type II
| Requirement | Controls Implemented |
|-------------|---------------------|
| Security | All authentication, RBAC, encryption controls |
| Availability | Health checks, monitoring, backups |
| Processing Integrity | Input validation, error handling |
| Confidentiality | Encryption, access control |
| Privacy | Data retention, audit logs |

### GDPR
| Article | Controls |
|---------|----------|
| Art. 32 | Encryption, access control, breach detection |
| Art. 30 | Audit logging, record of processing activities |
| Art. 33 | Incident response, breach notification procedures |
| Art. 35 | DPIA for high-risk processing |

### NIST Cybersecurity Framework
| Function | Controls |
|----------|----------|
| Identify | Asset inventory, risk assessment |
| Protect | Access control, data security, training |
| Detect | Continuous monitoring, anomaly detection |
| Respond | Incident response plan, communications |
| Recover | Backup strategy, improvements |

## Security Verification Checklist

### Pre-Deployment Security Checklist

- [ ] All dependencies up to date
- [ ] No critical vulnerabilities in npm audit
- [ ] Security headers properly configured
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled
- [ ] Audit logging enabled
- [ ] Database migrations applied
- [ ] Environment variables secured
- [ ] SSL/TLS certificates installed
- [ ] Backup strategy verified
- [ ] Monitoring configured
- [ ] Health check endpoints working

### Post-Deployment Security Verification

- [ ] Login/logout functionality working
- [ ] MFA enrollment and verification working
- [ ] Role permissions enforced correctly
- [ ] Protected APIs reject unauthorized users
- [ ] Input validation blocks malicious input
- [ ] Audit logs being generated
- [ ] WebSocket real-time alerts working
- [ ] Error messages don't expose internals

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. **Do not** create public GitHub issues for security problems
2. Email security@sentinelx.org with details
3. Include steps to reproduce
4. Allow 90 days for disclosure after fix

### Security Contact
Email: security@sentinelx.org
PGP Key: [Key available on request]

---

*This security documentation is maintained by the SENTINEL-X Security Team. Last updated: November 2026. Version: 1.0