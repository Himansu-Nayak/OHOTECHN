# OHO TECH Reseller Marketplace — API Contract Specification

## 1. Specification Overview
This document specifies the exact REST API contracts implemented in the OHO TECH Reseller Platform. It defines public endpoints, authenticated customer endpoints, operations developer endpoints, and administrative management endpoints.

---

## 2. Public Catalog Endpoints (Zero Wholesale Leakage)

### 2.1 Get Active Products Catalog
- **Method**: `GET`
- **Path**: `/api/products`
- **Query Parameters**:
  - `page` (integer, default `0`)
  - `size` (integer, default `10`)
  - `search` (string, optional)
  - `category` (long, optional)
- **Response Format**: `ApiResponse<Page<PublicProductDto>>`
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": {
    "content": [
      {
        "id": 28,
        "name": "Event & Ticket Booking Portal",
        "slug": "event-ticket-booking-portal",
        "description": "Seat layout selection, QR ticket generation, gate scanner app, and organizer payout.",
        "price": 48000.00,
        "integrationStatus": "Integration pending provider/API information",
        "deploymentType": "MANAGED_CLOUD",
        "demoUrl": "https://demo.ohotech.com/event-ticket",
        "documentationUrl": "https://docs.ohotech.com/event-ticket",
        "featured": true,
        "stock": 100,
        "imageUrl": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
        "serviceType": "Software",
        "categoryId": 1,
        "categoryName": "E-Commerce & Portals",
        "active": true
      }
    ],
    "totalElements": 28,
    "totalPages": 3
  }
}
```
> **Security Invariant**: `providerCost`, `resellerMargin`, `providerId`, `providerName`, and `commercialTerms` are completely omitted from the serialization schema.

### 2.2 Get Product By ID / Slug
- **Method**: `GET`
- **Path**: `/api/products/{id}` or `/api/products/slug/{slug}`
- **Response Format**: `ApiResponse<PublicProductDto>`

---

## 3. Customer Deployment Endpoints (Ownership Enforced)

### 3.1 Get My Deployments
- **Method**: `GET`
- **Path**: `/api/deployments/my`
- **Security**: Bearer JWT (`ROLE_CUSTOMER`, `ROLE_ADMIN`, `ROLE_DEVELOPER`)
- **Response**: `ApiResponse<List<DeploymentDto>>`
```json
{
  "success": true,
  "message": "Deployments retrieved successfully",
  "data": [
    {
      "id": 1,
      "orderId": 42,
      "productId": 28,
      "productName": "Event & Ticket Booking Portal",
      "userId": 105,
      "licenseId": 88,
      "licenseKey": "OHO-77A2-99BC-E10F",
      "status": "LIVE",
      "targetEnvironment": "MANAGED_CLOUD",
      "accessUrl": "https://client-portal.ohotechn.com",
      "customerNotes": "Your dedicated instance is live. Default administrative credentials sent via encrypted email.",
      "completedAt": "2026-10-02T08:05:00Z"
    }
  ]
}
```
> **Security Invariant**: `adminNotes` is nullified for customers. Access to other customers' deployments is rejected with `403 Forbidden` / `ResourceNotFoundException`.

---

## 4. Administrative Provider Management Endpoints

### 4.1 List Providers
- **Method**: `GET`
- **Path**: `/api/admin/providers`
- **Security**: `ROLE_ADMIN`, `ROLE_SUPER_ADMIN`
- **Response**: `ApiResponse<List<ProviderDto>>`
```json
{
  "success": true,
  "message": "Providers retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "CloudMatrix Labs",
      "companyName": "CloudMatrix Software Technologies Pvt Ltd",
      "contactPerson": "Rajesh Sharma",
      "contactEmail": "partners@cloudmatrix.dev",
      "contactPhone": "+91 98765 43210",
      "website": "https://cloudmatrix.dev",
      "commercialTerms": "40% wholesale discount on retail selling price; net-30 payout terms.",
      "commissionRate": 40.00,
      "technicalIntegrationType": "API",
      "integrationStatus": "ONBOARDING",
      "supportResponsibility": "SHARED",
      "deploymentResponsibility": "OHO_TECH_VPS",
      "contractStatus": "ACTIVE",
      "active": true
    }
  ]
}
```

### 4.2 Create / Update Provider
- **Method**: `POST` / `PUT`
- **Path**: `/api/admin/providers` and `/api/admin/providers/{id}`
- **Security**: `ROLE_ADMIN`

---

## 5. Developer & Operations Provisioning Endpoints

### 5.1 Get Operational Deployments Queue
- **Method**: `GET`
- **Path**: `/api/developer/deployments`
- **Security**: `ROLE_DEVELOPER`, `ROLE_ADMIN`
- **Query Parameters**: `page`, `size`, `status`

### 5.2 Execute Deployment State Machine Transition
- **Method**: `POST`
- **Path**: `/api/developer/deployments/{id}/transition`
- **Security**: `ROLE_DEVELOPER`, `ROLE_ADMIN`
- **Request Body**:
```json
{
  "action": "MARK_LIVE",
  "assignedEngineer": "Himansu Nayak",
  "accessUrl": "https://client-instance.ohotechn.com",
  "customerNotes": "Production deployment verified and ready for client onboarding.",
  "adminNotes": "Allocated 4 vCPU, 8GB RAM on VPS node 3. SSL certificate provisioned via Let's Encrypt."
}
```
- **Response**: Returns updated `DeploymentDto`. Writes transition record to `AuditLog`.

---

## 6. Developer Telemetry, API Vault & Webhook Endpoints

### 6.1 Get Live JVM & Infrastructure Diagnostics
- **Method**: `GET`
- **Path**: `/api/developer/diagnostics`
- **Security**: `ROLE_DEVELOPER`, `ROLE_ADMIN`
- **Response**: `ApiResponse<DeveloperDiagnosticsDto>`
```json
{
  "success": true,
  "message": "System diagnostics telemetry retrieved",
  "data": {
    "jvmVersion": "21.0.2",
    "javaVendor": "Oracle Corporation",
    "osName": "Windows 11 10.0",
    "osArch": "amd64",
    "systemUptimeMs": 3600000,
    "heapUsedBytes": 1450000000,
    "heapMaxBytes": 4294967296,
    "heapUsedPercent": 33.8,
    "activeThreadCount": 42,
    "dbConnectionUrlMasked": "jdbc:postgresql://localhost:5432/OHOTECH",
    "dbActiveConnections": 2,
    "dbMaxConnections": 20,
    "springActiveProfiles": ["production"],
    "rateLimitActiveTrackers": 14,
    "serverTimestamp": "2026-10-02T16:45:00",
    "status": "OPERATIONAL"
  }
}
```

### 6.2 Manage Programmatic API Keys
- **Method**: `GET` / `POST`
- **Path**: `/api/developer/keys`
- **Security**: `ROLE_DEVELOPER`, `ROLE_ADMIN`
- **Create Request**:
```json
{
  "name": "Production Microservice Key",
  "scope": "read_write"
}
```
- **Create Response**: Returns `ApiKeyDto` including one-time unmasked `plaintextSecret`.
- **Revoke Path**: `/api/developer/keys/{id}/revoke` (`POST`)

### 6.3 Webhook Event Delivery Stream & Simulation
- **Method**: `GET`
- **Path**: `/api/developer/webhooks`
- **Security**: `ROLE_DEVELOPER`, `ROLE_ADMIN`
- **Response**: `ApiResponse<List<WebhookEventDto>>` (Top 50 recent events)
- **Simulator Dispatch**: `POST /api/developer/webhooks/test`
  - **Request**: `{ "targetUrl": "https://client-listener.example.com", "eventType": "order.completed" }`
  - **Response**: `{ "statusCode": 200, "latencyMs": 34, "success": true, "responseSummary": "..." }`

---

## 7. Master Reseller API Summary Matrix

| METHOD | PATH | ROLE REQUIRED | REQUEST BODY / PARAMS | RESPONSE PAYLOAD | DB ACTION | SECURITY RULE |
|---|---|---|---|---|---|---|
| `GET` | `/api/products` | `PUBLIC` | `page`, `size`, `search`, `category` | `Page<PublicProductDto>` | Read `products` | Wholesale costs & provider identity strictly quarantined |
| `GET` | `/api/products/{id}` | `PUBLIC` | Path `id` or slug | `PublicProductDto` | Read `products` | 0% disclosure of provider commercial margins |
| `GET` | `/api/deployments/my` | `ROLE_CUSTOMER` | None (User from JWT) | `List<DeploymentDto>` | Read `deployments` | Strict customer isolation; `adminNotes`, `providerId`, `providerName` nullified |
| `GET` | `/api/deployments/{id}` | `ROLE_CUSTOMER` | Path `id` | `DeploymentDto` | Read `deployments` | Ownership check: customer must own the deployment or 403 Forbidden |
| `GET` | `/api/admin/providers` | `ROLE_ADMIN` | `page`, `size`, `search` | `Page<ProviderDto>` | Read `providers` | Confidential wholesale records only visible to Admin |
| `POST` | `/api/admin/providers` | `ROLE_ADMIN` | `ProviderDto` | `ProviderDto` | Insert `providers` | Validates provider name, commercial terms, SLA |
| `PUT` | `/api/admin/providers/{id}` | `ROLE_ADMIN` | `ProviderDto` | `ProviderDto` | Update `providers` | Updates agency terms, contact details, SLA |
| `PATCH`| `/api/admin/providers/{id}/status` | `ROLE_ADMIN` | `{ active: boolean }` | `ProviderDto` | Update `providers` | Toggles provider active state |
| `GET` | `/api/admin/products` | `ROLE_ADMIN` | `page`, `size`, `search`, `category` | `Page<ProductDto>` | Read `products` | Exposes wholesale costs & margins exclusively to Admin |
| `POST` | `/api/admin/products` | `ROLE_ADMIN` | `ProductDto` | `ProductDto` | Insert `products` | Computes selling price = providerCost + resellerMargin |
| `GET` | `/api/admin/deployments` | `ROLE_ADMIN` | `page`, `size`, `status` | `Page<DeploymentDto>` | Read `deployments` | Exposes full operational metadata and confidential admin notes |
| `PUT` | `/api/admin/deployments/{id}/status` | `ROLE_ADMIN` | `status`, `accessUrl`, `assignedEngineer` | `DeploymentDto` | Update `deployments` | Enforces valid `accessUrl` before permitting `LIVE` state |
| `GET` | `/api/developer/diagnostics` | `ROLE_DEVELOPER`, `ROLE_ADMIN` | None | `DeveloperDiagnosticsDto` | JMX MXBeans | Real-time JVM memory, threads, masked DB connection pool |
| `GET` | `/api/developer/keys` | `ROLE_DEVELOPER`, `ROLE_ADMIN` | None | `List<ApiKeyDto>` | Read `api_keys` | Keys scoped to user |
| `POST` | `/api/developer/keys` | `ROLE_DEVELOPER`, `ROLE_ADMIN` | `CreateApiKeyRequest` | `ApiKeyDto` | Insert `api_keys` | Plaintext secret displayed only once at creation |
| `POST` | `/api/developer/keys/{id}/revoke` | `ROLE_DEVELOPER`, `ROLE_ADMIN` | Path `id` | `ApiKeyDto` | Update `api_keys` | Revokes programmatic key immediately |
| `GET` | `/api/developer/webhooks` | `ROLE_DEVELOPER`, `ROLE_ADMIN` | None | `List<WebhookEventDto>` | Read `crm_webhook_events` | Top 50 outbound & inbound webhook deliveries |
| `POST` | `/api/developer/webhooks/test` | `ROLE_DEVELOPER`, `ROLE_ADMIN` | `WebhookTestRequest` | `WebhookTestResponseDto` | Dispatch HTTP + Insert | Validates URL format; logs dispatch and response latency |

