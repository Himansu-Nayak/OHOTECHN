# OHO TECH Software Reseller Provider Onboarding Checklist

**Purpose**: This checklist serves as the formal operational intake protocol for external software engineering agencies, ISVs, and independent developers onboarding turnkey software products into the OHO TECH Reseller Marketplace.

All information gathered through this checklist is stored securely in the internal OHO TECH administrative vault and is strictly confidential.

---

## 1. Agency & Company Identification
- [ ] **Legal Business Name**: Registered company or LLP name.
- [ ] **Trade Name / Agency Brand**: Market-facing agency name.
- [ ] **Corporate Registration / GSTIN / CIN**: Tax and registration identifiers.
- [ ] **Registered Office Address**: Official headquarters address.
- [ ] **Authorized Contact Person**: Primary executive or account manager.
- [ ] **Direct Contact Email**: Official email for operational correspondence.
- [ ] **Emergency Contact Phone**: Escalation phone number.
- [ ] **Corporate Website**: URL of agency portfolio or corporate presence.

---

## 2. Product Profile & Specifications
- [ ] **Product Name**: Official software title as supplied by the provider.
- [ ] **Assigned Category**: Target industry taxonomy (e.g. Healthcare, Education, FinTech, ERP, Retail POS, E-Commerce).
- [ ] **Technical Architecture Overview**: Monolith / Microservices, languages, frameworks, and backend engine.
- [ ] **Supported Platforms**: Web / Responsive Mobile, Desktop (Windows, macOS), Android, iOS.
- [ ] **Single-Tenant vs Multi-Tenant**: Tenant isolation architecture.
- [ ] **Database Engine Requirements**: PostgreSQL, MySQL, Redis, MongoDB, etc.
- [ ] **Core Functional Modules**: Bulleted list of verified, out-of-the-box features provided by the software.
- [ ] **Unimplemented or Roadmap Disclosures**: Clear statement of any features that are in development or not yet available.

---

## 3. Commercial & Wholesale Pricing Structure
- [ ] **Wholesale Unit Cost (`providerCost`)**: Fixed cost or baseline license cost payable to the agency per sale.
- [ ] **Agreed OHO TECH Margin (`resellerMargin`)**: Minimum agreed reseller markup.
- [ ] **Target Customer Selling Price (`price`)**: Calculated as `providerCost + resellerMargin`.
- [ ] **Billing Model**: One-time perpetual license, monthly subscription, or annual recurring license.
- [ ] **Payment Terms & Settlement Cycle**: Net-15 or Net-30 remittance schedule for wholesale disbursements.
- [ ] **Refund & Cancellation Policy**: Terms governing customer refund requests and liability allocation.

---

## 4. Live Demonstration & Verification Access
- [ ] **Live Interactive Demo URL (`demoUrl`)**: Publicly accessible or credentialed demo sandbox instance.
- [ ] **Demo Access Credentials**: Role accounts (e.g. Administrator, Manager, Customer) configured for demonstration.
- [ ] **Demo Reset Cadence**: Automated daily/weekly database reset mechanism for demo environments.
- [ ] **Offline / Fallback Demo Strategy**: Video walkthrough or guided screenshots if live demo is temporarily unavailable.

---

## 5. Technical Documentation & Developer Assets
- [ ] **User Manual / Knowledge Base (`documentationUrl`)**: Step-by-step customer onboarding guide.
- [ ] **API Documentation**: OpenAPI / Swagger / Postman collection for programmatic integrations (if API integration type).
- [ ] **Webhook Documentation**: Event payloads, signature verification methods, and retry policies (if webhook integration type).
- [ ] **Database Schema & Entity Relationship Diagram**: ERD and migration scripts (Flyway / Liquibase / SQL DDL).

---

## 6. Hosting, Infrastructure & Deployment Requirements
- [ ] **Deployment Responsibility**:
  - `OHO_TECH_VPS`: OHO TECH provisions and manages dedicated VPS.
  - `PROVIDER_CLOUD`: Agency provisions tenant on their managed infrastructure.
  - `CUSTOMER_SELF_HOSTED`: Customer receives installer or Docker bundle for private cloud deployment.
- [ ] **Minimum Server Specifications**:
  - CPU Cores (e.g., 2 vCPU, 4 vCPU)
  - RAM (e.g., 4GB, 8GB, 16GB)
  - Storage & Disk I/O (e.g., 50GB NVMe SSD)
  - Bandwidth & Port requirements (e.g., HTTP 80, HTTPS 443, WebSocket)
- [ ] **Containerization & Automation Assets**: Dockerfile, `docker-compose.yml`, environment configuration template (`.env.example`).
- [ ] **SSL & Domain Configuration Protocol**: Reverse proxy configuration (Nginx / Caddy / Cloudflare).

---

## 7. Support SLAs & Maintenance Responsibilities
- [ ] **Support Responsibility Allocation**:
  - `OHO_TECH`: First-line customer support handled by OHO TECH Support Desk.
  - `PROVIDER`: Second/Third-line bug fixes and core patching handled by provider agency.
  - `SHARED`: Joint triage agreement.
- [ ] **Critical Incident Response SLA**: (e.g. < 4 hours for production outages).
- [ ] **Standard Bug Resolution SLA**: (e.g. < 48 hours for non-blocking issues).
- [ ] **Security Patching Protocol**: Maximum window for patching zero-day vulnerabilities.

---

## 8. Licensing, Seat Limits & Anti-Piracy Handshake
- [ ] **Licensing Model**: Cryptographic hardware license key, seat-based activation, or API token.
- [ ] **Heartbeat & Phone-Home Validation**: Specification of how the deployed software checks license status against OHO TECH License Server (`/api/licenses/validate`).
- [ ] **Device Seat Limit**: Maximum concurrent hardware activations permitted per license.

---

## 9. Branding, White-Labeling & Intellectual Property
- [ ] **White-Label Conformance**: Product UI, headers, emails, and invoices must display OHO TECH branding.
- [ ] **Removal of Agency Contact Details**: Provider contact phone numbers, support emails, and proprietary links must be absent from customer-facing interfaces.
- [ ] **IP & Commercial Distribution Rights**: Warranty that the software does not infringe on third-party intellectual property or violate open-source GPL licenses.

---

## 10. Customer Provisioning & Handover Process
- [ ] **Standard Handover Lead Time**: Time required from verified payment to `LIVE` deployment (e.g., 2 hours, 24 hours, 48 hours).
- [ ] **Automated Handover Payload**:
  - Production Access URL
  - Temporary Administrator Credentials
  - Database Credentials (if self-hosted)
  - Customer Safe Getting Started Guide
- [ ] **Sign-Off Protocol**: Customer acceptance criteria and ticket closure process.
