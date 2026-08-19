# OHO TECH - Enterprise Software & Digital Solutions Platform

OHO TECH is a full-stack enterprise technology platform featuring high-performance software engineering services, 28+ turnkey live software demo hubs, digital growth solutions, and an integrated Java Spring Boot backend for authentication, product management, cart processing, order management, and contact enquiry workflows.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **State Management**: React Context (`AuthContext`, `CartContext`, `ToastContext`)
- **Email Service**: Resend API (Contact & Quote form notifications)
- **ORM / Database**: Prisma Client (`prisma/schema.prisma`)

### Backend
- **Framework**: Java 17, Spring Boot 3 (REST APIs)
- **Security & Auth**: Spring Security, JWT (JSON Web Tokens), Refresh Tokens
- **Database**: PostgreSQL / MySQL with Spring Data JPA
- **Build Tool**: Apache Maven (`mvnw`)

---

## 📁 Repository Structure

```text
oho_tech/
├── backend/                  # Java Spring Boot Backend Service
│   ├── src/main/java/        # Controllers, Services, Entities, DTOs, Security
│   ├── src/main/resources/   # Application properties & SQL migrations
│   └── pom.xml               # Maven configuration
├── prisma/                   # Prisma Schema & Database Configuration
│   └── schema.prisma
├── src/                      # Next.js Frontend Application
│   ├── api/                  # API Client integration & endpoints
│   ├── app/                  # Next.js App Router pages & API routes
│   │   ├── (marketing)/      # Public marketing pages & product hubs
│   │   └── api/              # Next.js serverless API routes (Resend email delivery)
│   ├── components/           # Reusable UI components & section modules
│   ├── config/               # Service definitions, product data & industries
│   ├── context/              # Authentication & Shopping Cart Providers
│   └── lib/                  # Utilities & API helpers
├── public/                   # Static media assets & product screenshots
├── next.config.ts            # Next.js configuration
├── package.json              # Frontend npm dependencies
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.17+ or v20+
- **npm** or **yarn** / **pnpm**
- **Java JDK**: 17+ (for backend)
- **Maven**: (bundled wrapper included)

---

### 1. Frontend Setup & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   RESEND_API_KEY=your_resend_api_key_here
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:3000`.

---

### 2. Backend Setup & Run

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Configure Database Connection**:
   Update `backend/src/main/resources/application.properties` with your PostgreSQL/MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/ohotech_db
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   ```

3. **Build & Run**:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(On Windows PowerShell, run `.\mvnw.cmd spring-boot:run`)*

   The backend REST API will run at `http://localhost:8080`.

---

## 🔑 Key Features & Integration

- **Authentication System**: User registration, login, JWT token refresh, and user profile sync (`GET /api/auth/me`).
- **Product Ecosystem**: 28 turnkey software products categorized across 13 enterprise industries.
- **Cart & Order Flow**: Full cart management and checkout integration connected to Spring Boot REST endpoints.
- **Dual Contact & Quote Delivery**: Direct email delivery via Resend API (`kampainfraa@gmail.com`) with Spring Boot DB persistence.

---

## 📜 License
Design and Develope by Himansu Nayak
Private Repository — All Rights Reserved © OHO TECH.
