export interface TechCapability {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  detailedDesc: string;
  iconName: string;
  accent: string;
  technologies: string[];
  benchmarks: { label: string; value: string; detail: string }[];
  securityPosture: string;
  topologyBlueprint: string[];
  enterpriseUseCases: string[];
  runtimeCharacteristics: string;
}

export interface AiCapability {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  architecture: string;
  deterministicFallback: string;
  benchmarks: { label: string; value: string; detail: string }[];
  stack: string[];
  enterpriseApplication: string;
  groundedVerification: string;
}

export const TECHNOLOGY_LAYERS: TechCapability[] = [
  {
    id: 'frontend',
    name: 'Frontend Runtimes',
    category: 'Client Layer',
    shortDesc: 'High-concurrency React 19 and Next.js 16 web applications with sub-second hydration.',
    detailedDesc: 'We architect web interfaces using Next.js 16 App Router and React 19 Server Components. By leveraging edge streaming SSR, fine-grained state management, and optimized asset bundling with Turbopack, interfaces achieve instantaneous page loads, zero cumulative layout shifts (CLS), and fluid 120 FPS interaction budgets.',
    iconName: 'Monitor',
    accent: '#10b981',
    technologies: ['Next.js 16 App Router', 'React 19 Server Components', 'TypeScript 5', 'Tailwind CSS 4', 'Turbopack', 'WebAssembly (WASM)', 'GSAP & Lenis Motion'],
    benchmarks: [
      { label: 'First Contentful Paint', value: '< 0.4s FCP', detail: 'Edge-rendered server component baseline' },
      { label: 'Frame Consistency', value: '120 FPS', detail: 'GPU-accelerated composite animations' },
      { label: 'Accessibility Target', value: 'WCAG AAA', detail: 'Screen reader & keyboard deterministic flow' }
    ],
    securityPosture: 'Strict Content Security Policy (CSP), sub-resource integrity (SRI), ephemeral client state tokens, zero inline script evaluation.',
    topologyBlueprint: [
      'Edge CDN Ingress & Static Asset Hydration (Cloudflare Global POPs)',
      'React 19 Streaming SSR Buffers with Suspense Boundaries',
      'Client-Side Optimistic State Cache with Rollback Guarantees',
      'Micro-Frontend Decoupled Shell for Independent Deployment'
    ],
    enterpriseUseCases: [
      'Doctor & Clinician High-Density EHR Consoles',
      'Student Examination Transcripts & Admission Portals',
      'High-Throughput Omnichannel Retail POS Counters'
    ],
    runtimeCharacteristics: 'Stateless edge SSR with sub-50ms TTFB and selective hydration.'
  },
  {
    id: 'backend',
    name: 'Backend Microservices',
    category: 'Compute Core',
    shortDesc: 'Asynchronous Go and Node.js microservices with gRPC inter-service communication.',
    detailedDesc: 'Our backend services are built as isolated, containerized microservices running on Go (Golang) and Node.js. High-throughput data processing is routed through gRPC and Protocol Buffers, while asynchronous jobs execute over AMQP message brokers, ensuring zero single-point-of-failure and instant fault isolation.',
    iconName: 'Server',
    accent: '#06b6d4',
    technologies: ['Go (Golang)', 'Node.js Enterprise Engine', 'Rust Systems Primitives', 'gRPC & Protocol Buffers', 'RabbitMQ / AMQP', 'OpenTelemetry Tracing'],
    benchmarks: [
      { label: 'Execution Latency', value: '< 15ms Avg', detail: 'Microservice handler response time' },
      { label: 'Inter-Service gRPC', value: '< 1.8ms', detail: 'Protocol buffer serialization latency' },
      { label: 'Fault Recovery', value: 'Instant Pod Restart', detail: 'Kubernetes health probe self-healing' }
    ],
    securityPosture: 'Mutual TLS (mTLS) inter-service authentication, container namespace sandboxing, ephemeral storage volumes, read-only root filesystems.',
    topologyBlueprint: [
      'Stateless Horizontal Worker Pods with Auto-Scaling Trigger',
      'High-Throughput gRPC Inter-Service Communication Mesh',
      'Dead-Letter Queue Retry Daemons with Exponential Backoff',
      'OpenTelemetry Distributed Trace Propagation'
    ],
    enterpriseUseCases: [
      'HL7/FHIR Specimen and Diagnostic Telemetry Pipelines',
      'Multi-Campus Timetable & Academic Rule Engines',
      'Asynchronous Bank Payment Webhook Ingestion'
    ],
    runtimeCharacteristics: 'Event-driven, stateless worker nodes with sub-20ms P99 latency.'
  },
  {
    id: 'databases',
    name: 'Databases & Persistence',
    category: 'Data Storage',
    shortDesc: 'ACID-compliant PostgreSQL clusters, Redis distributed caching, and embedded edge SQLite.',
    detailedDesc: 'Persistence architecture combines PostgreSQL with dedicated read replicas, Redis in-memory pub/sub clusters, and embedded SQLite edge databases for offline checkout terminals. Every financial and clinical record update maintains strict ACID transaction boundaries and row-level locks.',
    iconName: 'Database',
    accent: '#3b82f6',
    technologies: ['PostgreSQL 16 Multi-Tenant', 'Redis Enterprise In-Memory', 'SQLite Embedded Edge', 'Apache Kafka Streams', 'pgvector Embeddings'],
    benchmarks: [
      { label: 'Primary Write Master', value: '100% ACID', detail: 'Row-level locking for ledger safety' },
      { label: 'Redis Cache Hit Latency', value: '< 0.8ms', detail: 'In-memory session and token lookups' },
      { label: 'Edge SQLite Lookup', value: '< 12ms', detail: 'Local catalog match on POS counters' }
    ],
    securityPosture: 'AES-256 GCM encryption at rest, TLS 1.3 in-transit, PostgreSQL Row-Level Security (RLS), automated point-in-time recovery (PITR).',
    topologyBlueprint: [
      'Primary Write Master with Synchronous Hot Standby',
      'Dedicated Read Replicas Isolating Public Traffic Spikes',
      'Redis Distributed Lock Manager for Concurrent Transactions',
      'Automated Daily Encrypted WAL Archival & Snapshots'
    ],
    enterpriseUseCases: [
      'Double-Entry Accounting Journal Balancing',
      'Hospital Bed Availability Grid & Triage State',
      'Multi-Outlet Warehouse Inventory Ledger'
    ],
    runtimeCharacteristics: 'Strict relational data consistency with multi-region read scalability.'
  },
  {
    id: 'cloud',
    name: 'Cloud & Multi-Region',
    category: 'Cloud Mesh',
    shortDesc: 'Elastic cloud topologies across AWS and GCP with automated multi-zone failover.',
    detailedDesc: 'Infrastructure is deployed across isolated Virtual Private Clouds (VPCs) on AWS and Google Cloud Platform. Global traffic routing is accelerated via Cloudflare edge networks, ensuring minimal latency worldwide with automated DDoS scrubbing and multi-AZ failover.',
    iconName: 'Globe',
    accent: '#8b5cf6',
    technologies: ['AWS Multi-AZ VPC', 'Google Cloud Compute', 'Cloudflare Enterprise Edge', 'Terraform Declarative IaC', 'Kubernetes (EKS / GKE)', 'Global Anycast DNS'],
    benchmarks: [
      { label: 'Edge Network Latency', value: '< 15ms Global', detail: 'Anycast DNS routing to nearest POP' },
      { label: 'Infrastructure Availability', value: '99.99% SLA', detail: 'Multi-AZ active-passive failover' },
      { label: 'IaC Provisioning', value: '100% Declarative', detail: 'Terraform immutable architecture' }
    ],
    securityPosture: 'Private subnets with zero public database exposure, AWS IAM least-privilege policies, automated DDoS scrubbing at edge.',
    topologyBlueprint: [
      'Multi-Region Active-Passive Standby Topologies',
      'Cloudflare Geo-Distributed Anycast DNS & Edge WAF',
      'Terraform Declared Immutable Cloud Infrastructure',
      'Automated Multi-AZ Database & Kubernetes Failover'
    ],
    enterpriseUseCases: [
      'High-Availability University Exam Result Publishing',
      '24/7 Hotel Reservation Channel Synchronization',
      'Disaster Recovery and Cold Vault Archival'
    ],
    runtimeCharacteristics: 'Elastic containerized clusters with sub-second health-check failover.'
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure & DevOps',
    category: 'DevOps & Telemetry',
    shortDesc: 'Automated CI/CD pipelines, Prometheus telemetry, and air-gapped recovery vaults.',
    detailedDesc: 'We maintain zero-downtime blue/green deployment pipelines using GitHub Actions, containerized Docker builds, and Helm charts. Continuous observability is provided by Prometheus metric scrapers, Grafana dashboards, and automated alert daemons monitoring SLOs.',
    iconName: 'Cpu',
    accent: '#ec4899',
    technologies: ['Docker Multi-Arch', 'GitHub Actions CI/CD', 'Prometheus Metrics', 'Grafana Telemetry', 'Helm Package Manager', 'Air-Gapped S3 Vault'],
    benchmarks: [
      { label: 'Deployment Strategy', value: 'Zero-Downtime', detail: 'Blue/green rolling pod replacement' },
      { label: 'Telemetry Resolution', value: '10-Second Scrapes', detail: 'Prometheus metrics & anomaly alerts' },
      { label: 'Code Sovereignty', value: '100% Client IP', detail: 'Direct delivery into client-owned Git repositories' }
    ],
    securityPosture: 'Cryptographically signed build binaries, container vulnerability scanning, audit logging of all deployment events.',
    topologyBlueprint: [
      'Automated Static Analysis, Unit Testing & Vulnerability Scans',
      'Immutable Multi-Architecture Docker Container Builds',
      'Canary / Blue-Green Deployment Orchestration',
      'Real-Time Prometheus Metrics & Alertmanager Routing'
    ],
    enterpriseUseCases: [
      'Autonomous Nightly Regression Testing Suites',
      'Automated Container Vulnerability Patching',
      'Sovereign Client Code Deployment Handover'
    ],
    runtimeCharacteristics: 'Deterministic container lifecycles with continuous metric observability.'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Systems Core',
    category: 'Business Core',
    shortDesc: 'Multi-tenant partitioning, double-entry financial cores, and role-based access control.',
    detailedDesc: 'Our enterprise foundation provides battle-tested building blocks: tenant database partitioning, fine-grained RBAC permission matrices, double-entry immutable accounting journals, and automated GST/tax calculation engines designed for complex organizational hierarchies.',
    iconName: 'Layers',
    accent: '#f59e0b',
    technologies: ['Multi-Tenant Partitioning', 'Double-Entry ACID Core', 'Role-Based RBAC Matrix', 'GST / Tax Rule Engine', 'Cryptographic Audit Trail', 'Workflow State Machines'],
    benchmarks: [
      { label: 'Journal Balancing', value: 'Zero Imbalance', detail: 'Debit = Credit atomic transaction guarantee' },
      { label: 'Tenant Isolation', value: 'Schema-Level RLS', detail: 'Complete cross-tenant data privacy' },
      { label: 'Audit Trail Append', value: '100% Immutable', detail: 'Cryptographic SHA-256 batch seals' }
    ],
    securityPosture: 'Strict organizational tenant separation, fine-grained ACL/RBAC permissions, immutable ledger seals, tamper-evident audit logs.',
    topologyBlueprint: [
      'Multi-Tenant Tenant-Resolver Middleware',
      'Cryptographic Double-Entry Transaction Ledger',
      'Role-Based Policy Enforcement Interceptor',
      'Automated Financial Amortization & Tax Calculators'
    ],
    enterpriseUseCases: [
      'NBFC Microfinance Loan Origination & EMI Schedules',
      'University Multi-Branch Dean & HOD Governance',
      'Hospital Inter-Departmental Folio Ledger'
    ],
    runtimeCharacteristics: 'Deterministic state machines guaranteeing transactional integrity.'
  },
  {
    id: 'mobile',
    name: 'Mobile & Edge Devices',
    category: 'Device Layer',
    shortDesc: 'Native Kotlin, Swift, and offline Progressive Web Apps with hardware interfacing.',
    detailedDesc: 'Mobile applications are engineered natively using Kotlin for Android and Swift for iOS, alongside offline-first Progressive Web Apps. We interface directly with device hardware: Bluetooth ESC/POS thermal printers, 2D barcode cameras, biometric fingerprint scanners, and GPS route stampers.',
    iconName: 'Radio',
    accent: '#10b981',
    technologies: ['Native Android (Kotlin)', 'Native iOS (Swift)', 'Progressive Web Apps (PWA)', 'ESC/POS Bluetooth Drivers', 'Biometric / Camera APIs', 'SQLite Edge Database'],
    benchmarks: [
      { label: 'Thermal Print Delay', value: '< 200ms', detail: 'Bluetooth SPP/BLE print spooling' },
      { label: 'Offline Storage', value: '100% Functional', detail: 'Local SQLite transaction queue' },
      { label: 'Cold App Launch', value: '< 800ms', detail: 'Optimized native binary startup' }
    ],
    securityPosture: 'SSL Pinning on mobile APIs, encrypted local storage (SQLCipher), hardware biometric device whitelisting.',
    topologyBlueprint: [
      'Native Hardware Drivers & Peripheral Bridge',
      'Encrypted Local SQLite Database & Sync Queue',
      'Asynchronous Background Sync Daemon',
      'Biometric / FaceID Authentication Gate'
    ],
    enterpriseUseCases: [
      'Field Collection Officer Microfinance App',
      'Restaurant Touch Kitchen Display & Waiter Tablet',
      'Campus Biometric Gate Attendance Ingestion Daemon'
    ],
    runtimeCharacteristics: 'Low memory footprint with fail-safe offline transaction recording.'
  },
  {
    id: 'ai',
    name: 'Enterprise AI & Heuristics',
    category: 'Intelligence',
    shortDesc: 'Document OCR parsing, vector search, predictive stock heuristics, and automated workflows.',
    detailedDesc: 'We build enterprise AI capabilities centered on practical utility: automated document OCR (extracting Aadhaar, PAN, invoices), semantic vector similarity search via pgvector, predictive reorder heuristics for supply chains, and automated WhatsApp CRM assistants with deterministic fallback guards.',
    iconName: 'Sparkles',
    accent: '#a855f7',
    technologies: ['PyTorch Runtimes', 'pgvector Similarity Search', 'OCR Identity Parsers', 'Self-Hosted Inference Nodes', 'LangChain / LlamaIndex', 'Predictive Demand Models'],
    benchmarks: [
      { label: 'Document OCR Parsing', value: '< 4.2s Avg', detail: 'Identity & invoice OCR extraction' },
      { label: 'Vector Similarity Match', value: '< 15ms', detail: 'HNSW index search on PostgreSQL' },
      { label: 'Deterministic Guardrails', value: '100% Enforced', detail: 'Rule-based verification fallback' }
    ],
    securityPosture: 'Private tenant sandboxing, zero public training data leakage, on-premise model weight deployment options, strict prompt sanitization.',
    topologyBlueprint: [
      'Document Chunking, OCR Extraction & Normalization',
      'Vector Embedding Generation & pgvector HNSW Indexing',
      'Semantic Router with Rule-Based Guardrails & Validation',
      'Deterministic Output Verification & Business System Hook'
    ],
    enterpriseUseCases: [
      'Sub-45s KYC Document Verification in Fintech',
      'Medical Prescription ICD-10 Search & Cross-Interaction Alerts',
      'Predictive Warehouse Stock Replenishment Triggers'
    ],
    runtimeCharacteristics: 'Hybrid inference with deterministic rule fallback and zero hallucination risk.'
  },
  {
    id: 'integrations',
    name: 'Protocols & Integrations',
    category: 'Integration Layer',
    shortDesc: 'HL7/FHIR medical adapters, bank payment webhooks, and 2-way travel channel managers.',
    detailedDesc: 'Our systems connect with industry-standard protocols and hardware interfaces: HL7 v2/FHIR medical diagnostic machine interfacing, bank payment webhooks (UPI, Razorpay, Cashfree), 2-way OTA hotel channel managers (Booking.com, Agoda), and hardware barcode printer spoolers.',
    iconName: 'Workflow',
    accent: '#06b6d4',
    technologies: ['HL7 v2.x & FHIR R4', 'Bank Payment Webhooks', '2-Way OTA Channel Protocols', 'ESC/POS Thermal Drivers', 'MQTT / WebSocket Event Bus', 'REST / GraphQL APIs'],
    benchmarks: [
      { label: 'Bank Webhook Ack', value: '< 150ms', detail: 'Idempotent signature validation' },
      { label: 'OTA Channel Rate Sync', value: '< 1.8s', detail: '2-way room availability update' },
      { label: 'Lab Analyzer Interfacing', value: 'Serial & TCP', detail: 'Bidirectional automated test intake' }
    ],
    securityPosture: 'HMAC webhook signature validation, mutual TLS client certificates, replay attack prevention with unique nonce checks.',
    topologyBlueprint: [
      'Ingress Webhook Signature Verification & Idempotency Check',
      'Message Transformation & Protocol Parsing (HL7 / JSON / XML)',
      'Asynchronous Event Queue Dispatch to Core Ledgers',
      'Downstream Partner Notification & WebSocket Broadcast'
    ],
    enterpriseUseCases: [
      'Automated Diagnostic Pathology Machine Dispatch',
      'Real-Time Bank Challan & UPI Fee Reconciliation',
      'Multi-Channel Hotel Room Tariff & Inventory Sync'
    ],
    runtimeCharacteristics: 'Idempotent event processing with sub-second downstream fanout.'
  },
  {
    id: 'security',
    name: 'Security & Governance',
    category: 'Governance Core',
    shortDesc: 'Zero-trust architecture, AES-256 GCM encryption, HIPAA/NABH compliance, and SOC-2 controls.',
    detailedDesc: 'Security is embedded at every architectural layer: zero-trust network boundaries, mutual TLS (mTLS) between all microservices, KMS-managed AES-256 GCM encryption at rest and in transit, HIPAA/NABH compliance auditing, and cryptographic hash verification for immutable financial ledgers.',
    iconName: 'ShieldCheck',
    accent: '#10b981',
    technologies: ['Zero-Trust Architecture', 'Mutual TLS (mTLS)', 'AES-256 GCM Encryption', 'KMS Key Management', 'HIPAA & NABH Ready', 'PCI-DSS Tokenization', 'SHA-256 Ledger Seals'],
    benchmarks: [
      { label: 'Encryption Standard', value: 'AES-256 GCM', detail: 'At-rest, in-transit & in-backup' },
      { label: 'Ledger Hash Integrity', value: 'SHA-256 Seals', detail: 'Tamper-evident financial books' },
      { label: 'Audit Trail Reliability', value: '100% ACID', detail: 'Cryptographic append-only logs' }
    ],
    securityPosture: 'Zero-trust network segmentation, hardware security module (HSM) keys, air-gapped snapshots, automated vulnerability alerting.',
    topologyBlueprint: [
      'Mutual TLS (mTLS) Handshake & Ephemeral Session Keys',
      'Cryptographic RBAC Authorization Interceptor',
      'Envelope Encryption via AWS/GCP KMS Hardware Modules',
      'Immutable Cryptographic Audit Logger Appending SHA-256 Blocks'
    ],
    enterpriseUseCases: [
      'HIPAA / NABH Patient Health Record Access Logs',
      'RBI Digital Lending Compliance & KYC Privacy',
      'PCI-DSS Compliant Hotel Payment Card Tokenization'
    ],
    runtimeCharacteristics: 'End-to-end cryptographic isolation with continuous audit verification.'
  }
];

export const AI_INNOVATION_CAPABILITIES: AiCapability[] = [
  {
    id: 'document-ocr',
    title: 'Automated Identity & Invoice OCR Extraction',
    subtitle: 'SUB-4.2S DOCUMENT PARSING',
    category: 'Document Intelligence',
    description: 'Algorithmic computer vision and OCR pipeline that extracts structured JSON data from identity documents (Aadhaar, PAN, Passports), bank statements, and vendor invoices with high precision.',
    architecture: 'Multi-stage image preprocessing -> Tesseract / PaddleOCR neural text detector -> Regex & semantic key-value parser -> Schema validation -> Core database transaction.',
    deterministicFallback: 'If confidence score falls below 95%, the document routes automatically to a dual-reviewer human-in-the-loop verification cockpit with flagged bounding boxes.',
    benchmarks: [
      { label: 'Extraction Latency', value: '< 4.2s Avg', detail: 'Full document ingestion to structured JSON' },
      { label: 'Field Accuracy', value: '99.4% Precision', detail: 'Validated across 10,000+ test documents' },
      { label: 'Human Fallback Rate', value: '< 2.8%', detail: 'Documents requiring manual escalation' }
    ],
    stack: ['Python 3.11', 'Tesseract / PaddleOCR', 'OpenCV Preprocessing', 'PostgreSQL JSONB', 'Go API Gateway'],
    enterpriseApplication: 'FinCore Loan KYC Underwriting, Hospital Triage Patient ID Ingestion, Vendor GST Invoice Processing.',
    groundedVerification: 'Tested against standard Indian identity cards (Aadhaar, PAN) and multi-format GST tax invoices with deterministic validation rules.'
  },
  {
    id: 'predictive-heuristics',
    title: 'Predictive Stock & Reorder Heuristics',
    subtitle: 'SUPPLY CHAIN OPTIMIZATION',
    category: 'Operational Intelligence',
    description: 'Time-series forecasting models and sales velocity heuristics that compute dynamic reorder points (ROP) and safety stock thresholds across multi-store warehouse depots.',
    architecture: 'Historical sales telemetry ingestion -> Moving average and Holt-Winters seasonality decomposition -> Lead time buffer calculation -> Automated PO generator.',
    deterministicFallback: 'Pre-configured static minimum safety thresholds are strictly enforced as hard floor constraints regardless of heuristic predictions.',
    benchmarks: [
      { label: 'Stockout Reduction', value: 'High Reliability', detail: 'Eliminates top-selling SKU stockout drift' },
      { label: 'Calculation Latency', value: '< 120ms', detail: 'Batch calculation across 50,000 SKUs' },
      { label: 'Safety Constraint', value: '100% Enforced', detail: 'Hard minimum inventory buffer floors' }
    ],
    stack: ['Go (Golang) Math Engine', 'PostgreSQL Timescale', 'Redis Cache', 'Automated PO Dispatcher'],
    enterpriseApplication: 'RetailPOS Depot Inventory Replenishment, Hospital Pharmacy Emergency Drug Stock Maintenance.',
    groundedVerification: 'Implemented using deterministic statistical models (safety stock formula + lead time variance) preventing overstock and stockouts.'
  },
  {
    id: 'clinical-nlp',
    title: 'Clinical Prescription & ICD-10 Search Assistant',
    subtitle: 'HEALTHCARE CONTEXT ENGINE',
    category: 'Clinical Intelligence',
    description: 'Semantic diagnostic search assistant that maps physician clinical notes to standardized ICD-10 codes, cross-checks drug allergy interactions, and suggests dosage templates.',
    architecture: 'Semantic text tokenizer -> pgvector HNSW diagnostic embedding search -> Drug interaction rule engine -> Clinician digital approval prompt.',
    deterministicFallback: 'The AI assistant solely provides suggestions; every single prescription line item requires explicit cryptographic doctor signature before commit.',
    benchmarks: [
      { label: 'ICD-10 Search Speed', value: '< 18ms', detail: 'Vector similarity match on 70,000+ codes' },
      { label: 'Drug Interaction Check', value: 'Sub-Millisecond', detail: 'Rule-based cross-allergy validator' },
      { label: 'Doctor Override Rate', value: '100% Unrestricted', detail: 'Physician retains absolute decision authority' }
    ],
    stack: ['Next.js 16', 'pgvector Embeddings', 'PostgreSQL 16', 'HL7 / FHIR Gateway', 'Go Core'],
    enterpriseApplication: 'HealthOS Doctor EHR Charting Console, Outpatient Clinical Consultations.',
    groundedVerification: 'Based on official ICD-10-CM taxonomic embeddings and deterministic pharmacological interaction tables.'
  },
  {
    id: 'intelligent-routing',
    title: 'Automated WhatsApp CRM & Lead Routing Agent',
    subtitle: 'CONVERSATIONAL AUTOMATION',
    category: 'Customer Intelligence',
    description: 'Conversational agent interacting with incoming customer inquiries over official WhatsApp Business APIs, qualifying intent, booking demos, and dispatching to regional managers.',
    architecture: 'Meta WhatsApp Webhook -> Intent classifier & entity extractor -> Dynamic knowledge base retrieval -> Idempotent CRM lead create -> WhatsApp reply push.',
    deterministicFallback: 'Unrecognized intents or complex pricing inquiries immediately escalate to human sales reps via live WebSocket push to the CRM cockpit.',
    benchmarks: [
      { label: 'Response Latency', value: '< 1.2s Avg', detail: 'Webhook receive to WhatsApp reply dispatch' },
      { label: 'Intent Classification', value: '96.2% Precision', detail: 'Structured intent taxonomy' },
      { label: 'Lead Capture Rate', value: '100% Idempotent', detail: 'Zero lost inquiries during peak traffic' }
    ],
    stack: ['Node.js Microservices', 'Meta Graph API', 'Redis Session Store', 'PostgreSQL CRM Core'],
    enterpriseApplication: 'OHO TECH Partner Onboarding, Automated Demo Scheduling, 24/7 Customer Inquiry Triage.',
    groundedVerification: 'Verified using official Meta WhatsApp Cloud API webhooks with zero hallucination fallback rules.'
  }
];
