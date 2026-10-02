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
