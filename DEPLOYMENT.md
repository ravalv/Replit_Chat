# BBH MakerChat - Deployment Guide

## Production Deployment Checklist

### Required Environment Variables

1. **SESSION_SECRET** (REQUIRED)
   - Generate a strong random secret: `openssl rand -base64 32`
   - Set in environment: `SESSION_SECRET=your-generated-secret`
   - Never use the fallback secret in production

### Session Management

The current implementation uses `memorystore` for session storage, which is suitable for development and single-instance deployments. For production, consider:

1. **Redis Session Store** (Recommended for multi-instance deployments)
   ```bash
   npm install connect-redis redis
   ```
   
2. **PostgreSQL Session Store** (Alternative using existing database)
   ```bash
   npm install connect-pg-simple
   ```

### Audit Logging

Current implementation logs to console. For production compliance:

1. **Structured Logging**
   - Implement Winston or Pino for structured logs
   - Configure log aggregation (ELK, Splunk, CloudWatch)

2. **Database Audit Trail** (Recommended)
   - Create audit_logs table
   - Store all user actions, queries, and feedback
   - Implement append-only constraints
   - Regular backup and retention policies

### Security Hardening

1. **TLS/HTTPS**
   - Enable HTTPS in production
   - Update cookie `secure: true` setting

2. **Rate Limiting**
   - Current: 100 req/min per IP, 5 login attempts/15min
   - Adjust based on expected traffic

3. **Password Policy**
   - Current: Minimum 8 characters
   - Consider adding complexity requirements

4. **CSRF Protection**
   - Already enabled via `sameSite: 'strict'`
   - Verify client app is on same domain

### Role-Based Access Control

- New users default to `external_client` role
- `operations_team` role assignment requires admin approval
- Implement admin panel for role management

### Database

- PostgreSQL database already configured
- Run migrations: `npm run db:push`
- Enable connection pooling for production
- Regular backups recommended

### Monitoring

Recommended metrics to monitor:

- Active sessions
- Login attempts / failures
- API response times
- Rate limit violations
- Query volume by user/role
- Feedback sentiment trends

## Development vs Production

| Feature | Development | Production |
|---------|------------|------------|
| Session Store | MemoryStore | Redis/PostgreSQL |
| Session Secret | Fallback allowed | Required strong secret |
| Audit Logs | Console | Database + Aggregation |
| HTTPS | Optional | Required |
| Password Policy | 8+ chars | Complex requirements |
| Log Retention | N/A | 90 days minimum |

## Compliance Considerations

For financial services compliance:

1. **Data Retention**: Implement query and audit log retention policies
2. **Access Logs**: Track all data access by user and role
3. **Encryption**: Ensure data at rest and in transit encryption
4. **User Privacy**: Implement data export and deletion workflows
5. **Incident Response**: Document security incident procedures
