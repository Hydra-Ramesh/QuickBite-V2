
---
# 🛡 Auth Service – Production Documentation

## 📌 Overview

The **Auth Service** is a standalone microservice responsible for:

* User authentication via Google OAuth
* JWT token issuance
* Role management
* Protected route authorization
* Structured logging
* Graceful shutdown handling
* MongoDB persistence

This service is designed to operate independently within the QuickBite distributed system.

---

# 🏗 Architecture

This service follows a **Layered Architecture (Clean Architecture inspired)**:

```
Client Request
      ↓
Route Layer
      ↓
Controller Layer
      ↓
Service Layer (Business Logic)
      ↓
Repository Layer (Database Access)
      ↓
MongoDB
```

### Design Principles

* Separation of concerns
* Single responsibility per layer
* Centralized configuration
* Stateless JWT authentication
* Production-safe lifecycle handling
* Microservice-ready deployment

---

# 📁 Project Structure

```
auth-service/
│
├── src/
│   ├── config/
│   │   ├── env.js
│   │   ├── db.js
│   │   ├── logger.js
│   │   └── google.js
│   │
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   │
│   ├── app.js
│   └── server.js
│
├── Dockerfile
├── .env
├── .env.sample
└── README.md
```

---

# 🔐 Authentication Strategy

### Google OAuth Login Flow

1. Client obtains OAuth `code` from Google.
2. Client sends:

```
POST /api/v1/auth/login
```

Body:

```json
{
  "code": "google_oauth_code"
}
```

3. Auth Service:

   * Exchanges code for access token
   * Fetches user profile
   * Creates user if not exists
   * Generates JWT
   * Returns token + user

---

# 🔑 JWT Strategy

### Payload Structure

```json
{
  "id": "user_id",
  "role": "customer"
}
```

### Why Minimal Payload?

* Smaller token size
* No sensitive data exposure
* Safer distributed verification
* Better microservice compatibility

### Token Expiry

Currently:

* Access token: 15 days

Recommended production upgrade:

* Access token: 15 minutes
* Refresh token: 7 days

---

# 🧩 API Endpoints

## 🔐 Login (Google OAuth)

```
POST /api/v1/auth/login
```

Body:

```json
{
  "code": "google_oauth_code"
}
```

Response:

```json
{
  "user": { ... },
  "token": "JWT_TOKEN"
}
```

---

## 🔄 Update User Role

```
PUT /api/v1/auth/role
```

Headers:

```
Authorization: Bearer <token>
```

Body:

```json
{
  "role": "customer"
}
```

Allowed roles:

* customer
* rider
* seller

---

## 👤 Get Profile

```
GET /api/v1/auth/me
```

Headers:

```
Authorization: Bearer <token>
```

---

## ❤️ Health Check

```
GET /health
```

Response:

```json
{
  "service": "auth-service",
  "status": "ok"
}
```

Used by:

* Load balancers
* Kubernetes probes
* Monitoring systems

---

# 🌍 Environment Configuration

All environment variables are validated using Joi.

## Required Variables

```
PORT
NODE_ENV
MONGO_URI
JWT_SECRET
CLIENT_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

If validation fails:

* The application will not start.
* Prevents runtime configuration errors.

---

# 🧠 Logging Strategy

## Morgan

* Logs HTTP requests
* Integrated into Winston stream

## Winston

* Logs application events
* Structured JSON format
* Outputs to stdout (container-friendly)

Production logs are intended to be aggregated by:

* Docker
* Kubernetes
* ELK Stack
* CloudWatch
* Datadog

---

# ⚠ Error Handling

Centralized error middleware:

* All errors are handled consistently
* Errors are logged via Winston
* No raw stack traces exposed in production

Standard error response:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

# 🛑 Graceful Shutdown

Handles:

* SIGTERM
* SIGINT
* Unhandled Promise Rejections
* Uncaught Exceptions

On shutdown:

* Stops accepting new requests
* Closes MongoDB connection
* Exits cleanly

This ensures safe Kubernetes/Docker operation.

---

# 🐳 Docker Deployment

## Build

```bash
docker build -t auth-service .
```

## Run

```bash
docker run -p 5000:5000 --env-file .env auth-service
```

---

# ☁ Microservice Integration

This service is designed to run behind an API Gateway.

```
Client
   ↓
API Gateway
   ↓
Auth Service
   ↓
Other Services (Order, Payment, Restaurant)
```

Other services should:

* Validate JWT locally
* Not call Auth Service for every request
* Use shared verification key if migrating to RS256

---

# 🔐 Security Measures

* Helmet security headers
* JSON body size limit
* JWT verification middleware
* Centralized error handling
* CORS configuration
* Minimal token payload
* Structured logging

---

# 📊 Observability

Current:

* Structured logging
* Health endpoint
* Graceful shutdown

Recommended future:

* Prometheus metrics endpoint
* OpenTelemetry tracing
* Correlation ID middleware

---

# 🧪 Testing Recommendations

* Unit tests for services
* Integration tests for routes
* JWT verification tests
* Mocked repository tests

Recommended tools:

* Jest
* Supertest

---

# 🚀 Future Enterprise Upgrades

* Refresh token rotation
* Redis token storage
* RS256 public/private key JWT
* Rate limiting middleware
* Swagger API documentation
* CI/CD integration
* Distributed tracing

---

# 📌 Production Readiness Checklist

* [x] Layered architecture
* [x] Centralized configuration
* [x] JWT minimal payload
* [x] Error middleware
* [x] Structured logging
* [x] Graceful shutdown
* [x] Health endpoint
* [x] Docker support
* [x] Microservice-ready structure

---

# 🏁 Conclusion

The Auth Service is:

* Production-ready
* Microservice-compliant
* Container-friendly
* Enterprise-structured
* Secure and scalable
* Cleanly layered
* Ready for integration within the QuickBite ecosystem

---

If you want next, I can provide:

* 📊 Full QuickBite distributed system architecture document
* ☸ Kubernetes deployment YAML
* 🔐 RS256 JWT upgrade guide
* 🔁 Refresh token implementation guide
* 📦 Full docker-compose setup for all services

Tell me the next upgrade 🚀
