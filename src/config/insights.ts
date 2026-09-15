export type InsightCategory = 
  | 'All'
  | 'AI & Automation'
  | 'Software Engineering'
  | 'Enterprise Technology'
  | 'Product Development'
  | 'Digital Transformation'
  | 'Technology'
  | 'Company Updates';

export interface InsightArticle {
  slug: string;
  number: string;
  category: InsightCategory;
  categoryDisplay: string;
  title: string;
  subtitle: string;
  abstract: string;
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    initials: string;
  };
  accent: string;
  tags: string[];
  keyPrinciples: string[];
  sections: {
    heading: string;
    subheading?: string;
    content: string[];
    codeSnippet?: {
      language: string;
      filename: string;
      code: string;
    };
    callout?: {
      type: 'note' | 'tip' | 'architecture';
      title: string;
      text: string;
    };
  }[];
  verdict: string;
}

export const INSIGHT_CATEGORIES: InsightCategory[] = [
  'All',
  'AI & Automation',
  'Software Engineering',
  'Enterprise Technology',
  'Product Development',
  'Digital Transformation',
  'Technology',
  'Company Updates'
];

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    slug: 'distributed-ledger-architecture',
    number: '01',
    category: 'Software Engineering',
    categoryDisplay: 'Distributed Systems & FinTech',
    title: 'Designing High-Throughput Double-Entry Financial Ledgers with Strict ACID Guarantees',
    subtitle: 'TRANSACTION INTEGRITY AT SCALE',
    abstract: 'How to build mathematically balanced, immutable double-entry financial transaction engines that withstand network partitioning, prevent race conditions, and achieve sub-millisecond execution.',
    publishedAt: 'September 2026',
    readTime: '6 min read',
    author: {
      name: 'Himansu Nayak (MCA)',
      role: 'Head of Technology & Systems Architecture, OHO TECH',
      initials: 'HN'
    },
    accent: '#10b981',
    tags: ['Distributed Systems', 'Double-Entry Accounting', 'PostgreSQL', 'Go (Golang)', 'ACID', 'Event Sourcing'],
    keyPrinciples: [
      'Every debit transaction must have an equal and opposite credit transaction in the same atomic commit.',
      'Ledger tables are append-only; state is derived via immutable event fold rather than mutable updates.',
      'Distributed lock managers must enforce strict chronological sequence per account partition.',
      'Cryptographic SHA-256 hash chaining guarantees tamper-evident compliance audit trails.'
    ],
    sections: [
      {
        heading: '1. The Pitfalls of Mutable Balances in Enterprise FinTech',
        subheading: 'Why storing a balance integer column is an architectural anti-pattern',
        content: [
          'In early-stage architectures, engineers frequently create an "accounts" table with a numerical "balance" column and execute updates like UPDATE accounts SET balance = balance + 500 WHERE id = 42. In high-concurrency environments, this approach quickly disintegrates due to lock contention, non-deterministic race conditions, and an inability to audit historical discrepancies.',
          'Double-entry bookkeeping is a 700-year-old mathematical invariant: the sum of all debits must equal the sum of all credits across every transaction boundary. In modern distributed systems, we translate this into an immutable append-only event ledger.'
        ],
        callout: {
          type: 'architecture',
          title: 'The Invariant Constraint',
          text: 'Transactions that fail to balance debits and credits to zero (sum = 0) are rejected at the database trigger layer before touching storage buffers.'
        }
      },
      {
        heading: '2. Implementing Strict Atomic Balance Checks in Go and SQL',
        subheading: 'Enforcing atomicity with row-level locking and deterministic transaction ordering',
        content: [
          'To prevent deadlocks when two concurrent transfers occur between Account A and Account B simultaneously, the system must sort account UUIDs lexicographically before acquiring database row locks.',
          'By ordering lock acquisition deterministically, no cyclic wait condition can materialize between worker threads.'
        ],
        codeSnippet: {
          language: 'go',
          filename: 'ledger_service.go',
          code: `func (s *LedgerService) ExecuteTransfer(ctx context.Context, tx TransferRequest) (*LedgerResult, error) {
    // 1. Sort accounts to guarantee deterministic lock hierarchy
    firstID, secondID := sortAccountIDs(tx.SourceAccountID, tx.DestinationAccountID)

    dbTx, err := s.db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelSerializable})
    if err != nil {
        return nil, err
    }
    defer dbTx.Rollback()

    // 2. Lock accounts in ordered sequence
    if err := s.lockAccounts(ctx, dbTx, firstID, secondID); err != nil {
        return nil, fmt.Errorf("lock acquisition failed: %w", err)
    }

    // 3. Append dual immutable ledger entries
    debitEntry := NewLedgerEntry(tx.SourceAccountID, -tx.Amount, "DEBIT", tx.ReferenceID)
    creditEntry := NewLedgerEntry(tx.DestinationAccountID, tx.Amount, "CREDIT", tx.ReferenceID)

    if err := s.appendEntries(ctx, dbTx, debitEntry, creditEntry); err != nil {
        return nil, err
    }

    return &LedgerResult{Status: "COMMITTED", Hash: debitEntry.Hash}, dbTx.Commit()
}`
        }
      },
      {
        heading: '3. Cryptographic Audit Chaining and High-Volume Replays',
        subheading: 'Preventing retroactive state tampering with SHA-256 block trees',
        content: [
          'Every ledger batch calculates a cryptographic SHA-256 digest encompassing the prior entry hash, timestamp, account IDs, and monetary quantities. Any unauthorized modification to an archival row breaks the verification chain immediately.',
          'At scale, point-in-time snapshots are generated every 24 hours while keeping raw ledger logs indefinitely for regulatory compliance.'
        ]
      }
    ],
    verdict: 'Immutable double-entry event sourcing eliminates accounting drift, guarantees 100% auditable financial records, and delivers zero-downtime ledger throughput.'
  },
  {
    slug: 'enterprise-ai-document-pipeline',
    number: '02',
    category: 'AI & Automation',
    categoryDisplay: 'Enterprise AI & Automation',
    title: 'Building Hallucination-Free Document OCR & Verification Pipelines with Self-Hosted Models',
    subtitle: 'ACCURACY & DATA SOVEREIGNTY FOR HIGH-VOLUME KYC & INVOICING',
    abstract: 'How OHO TECH designs sovereign AI pipelines that extract structured data from identity documents and GST tax invoices in under 4.2 seconds with strict deterministic validation schemas and zero external data leaks.',
    publishedAt: 'September 2026',
    readTime: '7 min read',
    author: {
      name: 'Himansu Nayak (MCA)',
      role: 'Head of Technology & Systems Architecture, OHO TECH',
      initials: 'HN'
    },
    accent: '#8b5cf6',
    tags: ['AI Integration', 'Document OCR', 'PyTorch', 'pgvector', 'Data Sovereignty', 'Zero Hallucination'],
    keyPrinciples: [
      'Raw LLM text output is never ingested directly; every extracted field must conform to strict JSON schemas with regex checksums.',
      'Optical Character Recognition runs on self-hosted GPU containers within the customer private cloud boundary.',
      'Low-confidence extraction scores (< 0.88) automatically trigger asynchronous human-in-the-loop review queues.',
      'Vector embeddings are partitioned by tenant ID using PostgreSQL pgvector with zero cross-organization leakage.'
    ],
    sections: [
      {
        heading: '1. The Danger of Unbounded LLM Extraction in Enterprise Systems',
        subheading: 'Why generative text models fail in regulated tax and compliance environments',
        content: [
          'Generative AI models are probabilistic by nature. In financial, medical, and identity workflows, a 1% hallucination rate on invoice GSTIN numbers or PAN identifiers can trigger regulatory penalties and reconciliation failures.',
          'OHO TECH employs a dual-stage deterministic pipeline: high-resolution computer vision extracts raw text glyphs with bounding box coordinates, followed by a constrained parser that enforces exact schema validation before any database record is created.'
        ],
        callout: {
          type: 'tip',
          title: 'Deterministic Verification Rule',
          text: 'Every extracted GSTIN number is verified against the official Luhn-based checksum algorithm before being approved for ledger posting.'
        }
      },
      {
        heading: '2. Structuring the Asynchronous PyTorch & Redis Worker Mesh',
        subheading: 'Processing 10,000 document pages per hour with bounded memory footprint',
        content: [
          'Document uploads stream directly to private S3-compatible object storage via pre-signed URLs. An AMQP message triggers isolated PyTorch OCR workers running on Kubernetes pods.',
          'Extracted tokens hydrate into typed TypeScript contracts, calculate spatial confidence scores, and persist to PostgreSQL within 4.2 seconds.'
        ],
        codeSnippet: {
          language: 'python',
          filename: 'ocr_pipeline_worker.py',
          code: `def process_document_payload(document_buffer: bytes, tenant_id: str) -> ExtractionResult:
    # 1. Image preprocessing: deskew, normalize contrast, crop margins
    preprocessed_img = image_preprocessor.normalize(document_buffer)
    
    # 2. Extract OCR tokens with bounding boxes & confidence vectors
    tokens = self_hosted_ocr_engine.detect_glyphs(preprocessed_img)
    
    # 3. Apply deterministic regex schemas for PAN, Aadhaar, and GSTIN
    validated_fields = {}
    for rule in COMPLIANCE_SCHEMAS["INVOICE_V2"]:
        match = rule.extract_and_validate(tokens)
        if match.confidence < 0.88 or not match.is_checksum_valid():
            return trigger_human_review_queue(document_buffer, tenant_id, match.reason)
        validated_fields[rule.key] = match.value
        
    return ExtractionResult(status="AUTO_VERIFIED", fields=validated_fields, latency_ms=1420)`
        }
      }
    ],
    verdict: 'Combining self-hosted neural OCR with strict deterministic schema validation delivers rapid document automation while preserving 100% data sovereignty and zero hallucination risk.'
  },
  {
    slug: 'multi-tenant-hospital-isolation',
    number: '03',
    category: 'Enterprise Technology',
    categoryDisplay: 'Healthcare Engineering & Cloud',
    title: 'Architecting Zero-Leakage Multi-Tenant Hospital & Clinical Clouds',
    subtitle: 'HIPAA & NABH COMPLIANT ROW-LEVEL SECURITY & ENCRYPTED ISOLATION',
    abstract: 'A deep-dive blueprint for multi-hospital cloud SaaS architectures that combine database partition isolation, role-based cryptography, and sub-second OPD triage.',
    publishedAt: 'August 2026',
    readTime: '7 min read',
    author: {
      name: 'Japabandhu Kampa',
      role: 'Founder & Director, OHO TECH',
      initials: 'JK'
    },
    accent: '#06b6d4',
    tags: ['Healthcare EMR', 'PostgreSQL RLS', 'HIPAA Compliance', 'Zero-Trust', 'Next.js 16', 'WebSockets'],
    keyPrinciples: [
      'Tenant context must be established at the reverse proxy gateway and bound to the database session connection.',
      'Row-Level Security (RLS) policies at the database layer act as the impenetrable barrier against cross-tenant data leaks.',
      'Protected Health Information (PHI) fields undergo envelope encryption with tenant-specific KMS keys.',
      'Emergency room triage channels operate on local offline caches to prevent internet outage disruptions.'
    ],
    sections: [
      {
        heading: '1. Multi-Tenancy Patterns: Database per Tenant vs Shared Schema with RLS',
        subheading: 'Balancing infrastructure overhead with sovereign regulatory security',
        content: [
          'Deploying a separate database for every small clinic creates unsustainable DevOps overhead. Conversely, relying solely on application-level WHERE hospital_id = ? clauses in SQL queries creates catastrophic risk of human developer error causing cross-tenant leaks.',
          'The optimal solution is a unified database schema enforced by native PostgreSQL Row-Level Security (RLS). When the application opens a connection pool session, it sets a session variable SET LOCAL app.current_hospital_id = ?, rendering unauthorized records completely invisible to the database engine.'
        ],
        codeSnippet: {
          language: 'sql',
          filename: 'tenant_isolation_rls.sql',
          code: `-- Enable Row Level Security on Patient Chart Table
ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;

-- Create policy restricting queries to active tenant context
CREATE POLICY hospital_isolation_policy ON patient_records
    AS RESTRICTIVE
    USING (hospital_id = current_setting('app.current_hospital_id', true)::uuid);

-- Secure Session Variable Setter executed on every connection checkout
CREATE OR REPLACE FUNCTION set_tenant_context(p_tenant_id uuid)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_hospital_id', p_tenant_id::text, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;`
        }
      },
      {
        heading: '2. Real-Time Clinical Specimen Tracking with Event Streams',
        subheading: 'Sub-second lab diagnostic dispatch using Redis pub/sub and WebSockets',
        content: [
          'When a doctor orders a diagnostic panel in OPD, the order payload publishes to a partitioned Redis stream. Pathology analyzer machines ingest the barcoded sample and publish results back via mTLS WebSocket, updating the physician dashboard in under 300 milliseconds.'
        ]
      }
    ],
    verdict: 'PostgreSQL Row-Level Security combined with session-level tenant tokens provides enterprise hospital networks with bank-grade isolation and peak clinical agility.'
  },
  {
    slug: 'offline-first-pos-synchronization',
    number: '04',
    category: 'Product Development',
    categoryDisplay: 'Edge Computing & Retail',
    title: 'Offline-First State Synchronization for Multi-Location Retail Depots',
    subtitle: 'ZERO-LATENCY COUNTER BILLING & INVENTORY CONVERGENCE',
    abstract: 'Designing offline-capable desktop POS billing terminals that maintain 100% operational continuity during network outages and synchronize seamlessly without race conditions upon reconnection.',
    publishedAt: 'August 2026',
    readTime: '5 min read',
    author: {
      name: 'Himansu Nayak (MCA)',
      role: 'Head of Technology & Systems Architecture, OHO TECH',
      initials: 'HN'
    },
    accent: '#3b82f6',
    tags: ['Edge Computing', 'Retail POS', 'SQLite', 'CRDT', 'Offline-First', 'TypeScript'],
    keyPrinciples: [
      'The local checkout terminal must never block on network I/O for barcode scanning or thermal printing.',
      'Transactions are written to an encrypted local WAL log and assigned a cryptographically deterministic UUID.',
      'Reconciliation uses conflict-free replicated data types (CRDTs) to resolve multi-depot inventory adjustments.',
      'GST invoice sequences are pre-allocated in batches to maintain unbroken chronological numbering.'
    ],
    sections: [
      {
        heading: '1. The Fragility of Cloud-Only Point-of-Sale Architectures',
        subheading: 'Why a 500ms network timeout destroys supermarket counter throughput',
        content: [
          'When a busy retail store processes 500 customers per hour, a 2-second cloud network lag creates massive queues at physical checkout counters. If internet connectivity drops, cloud-only systems halt completely.',
          'An offline-first architecture embeds a lightweight, high-speed SQLite engine locally inside the desktop terminal. Product catalogs, pricing rules, tax tables, and customer loyalty lookups execute in under 10 milliseconds locally.'
        ]
      },
      {
        heading: '2. Asynchronous Reconciliation via WebSocket Sync Daemon',
        subheading: 'Bi-directional synchronization without duplicate billing',
        content: [
          'Every completed receipt generates an idempotent transaction payload signed with the counter device key. When internet connectivity is present, the local sync daemon streams payloads to the central cloud cluster via WebSocket.',
          'If the connection drops, payloads buffer locally in the encrypted SQLite queue and automatically drain sequentially upon reconnection.'
        ],
        codeSnippet: {
          language: 'typescript',
          filename: 'syncDaemon.ts',
          code: `export class POSSyncDaemon {
  private syncQueue: LocalQueue;
  private socket: WebSocket | null = null;

  async processOfflineQueue(): Promise<void> {
    const pendingTransactions = await this.syncQueue.getPending(50);
    if (pendingTransactions.length === 0) return;

    for (const tx of pendingTransactions) {
      try {
        const ack = await this.transmitWithRetry(tx);
        if (ack.status === 'CONFIRMED') {
          await this.syncQueue.markSynced(tx.id, ack.serverTimestamp);
        }
      } catch (err) {
        console.warn('Sync pause: network unreachable. Queued safely.');
        break;
      }
    }
  }
}`
        }
      }
    ],
    verdict: 'Offline-first terminal architectures guarantee zero checkout downtime, eliminate depot stockout surprises, and provide an invincible retail counter experience.'
  },
  {
    slug: 'legacy-migration-strangler-fig',
    number: '05',
    category: 'Digital Transformation',
    categoryDisplay: 'Enterprise Modernization',
    title: 'Migrating High-Risk Enterprise Monoliths Using the Incremental Strangler Fig Pattern',
    subtitle: 'ZERO-DOWNTIME LEGACY MODERNIZATION WITHOUT CODE DISRUPTIONS',
    abstract: 'How to incrementally replace decades-old monolithic ERP systems with modern microservices, Next.js frontends, and automated CDC data replication without risking business downtime.',
    publishedAt: 'August 2026',
    readTime: '6 min read',
    author: {
      name: 'Japabandhu Kampa',
      role: 'Founder & Director, OHO TECH',
      initials: 'JK'
    },
    accent: '#ec4899',
    tags: ['Digital Transformation', 'Strangler Fig', 'Change Data Capture', 'Legacy Modernization', 'Debezium', 'Kafka'],
    keyPrinciples: [
      'Never attempt "Big Bang" rewrites on live operational enterprise software.',
      'Deploy an intelligent reverse-proxy routing layer in front of the legacy monolith on Day 1.',
      'Use Change Data Capture (CDC) with Debezium to replicate database mutations in real time without modifying legacy code.',
      'Migrate individual domain boundaries incrementally (e.g. Billing -> Inventory -> Patient Chart).'
    ],
    sections: [
      {
        heading: '1. The Fallacy of the "Big Bang" Software Overhaul',
        subheading: 'Why 70% of complete system rewrites fail or run years over schedule',
        content: [
          'Attempting to rewrite an entire 15-year-old enterprise software stack in a single secret development phase is the highest-risk strategy in enterprise IT. Business logic has evolved over years, edge cases are undocumented, and user muscle memory is deeply entrenched.',
          'The Strangler Fig pattern provides an orderly migration pathway: modern microservices are placed alongside the legacy core, intercepting specific URL paths and database events one service at a time until the legacy core can be safely decommissioned.'
        ],
        callout: {
          type: 'architecture',
          title: 'Routing Layer Topology',
          text: 'An edge API gateway evaluates request paths: new endpoints route to Go/Node microservices, while legacy unmigrated routes pass transparently to the original backend.'
        }
      },
      {
        heading: '2. Real-Time Data Synchronization with Change Data Capture (CDC)',
        subheading: 'Bi-directional synchronization during multi-month migration phases',
        content: [
          'By attaching Debezium to the legacy database transaction log (WAL/Binlog), every insert and update publishes to Apache Kafka streams instantly. Modern microservices ingest these streams and maintain their own optimized read-models without locking the legacy database.'
        ]
      }
    ],
    verdict: 'The Strangler Fig methodology turns risky enterprise overhauls into a predictable, non-disruptive evolution with zero operational downtime.'
  },
  {
    slug: 'edge-computed-academic-portals',
    number: '06',
    category: 'Technology',
    categoryDisplay: 'Cloud Scaling & Edge Architecture',
    title: 'Scaling Campus ERP to 100,000 Concurrent Student Sessions During Exam Result Release',
    subtitle: 'EDGE CACHING & DYNAMIC READ REPLICAS',
    abstract: 'How OHO TECH architected a high-concurrency educational results pipeline utilizing edge-computed HTML streams, Redis cache tiers, and serverless background PDF compilers.',
    publishedAt: 'July 2026',
    readTime: '6 min read',
    author: {
      name: 'OHO TECH Engineering Team',
      role: 'Systems Architecture Group',
      initials: 'OT'
    },
    accent: '#f59e0b',
    tags: ['Next.js 16', 'Edge CDN', 'Redis', 'High Concurrency', 'Cloudflare Workers', 'PostgreSQL'],
    keyPrinciples: [
      'Grade sheet release days create 50x traffic spikes within a 10-minute window; database ingress must be protected with edge caches.',
      'Static grade sheet templates compile ahead of time; student data hydrates via signed edge tokens.',
      'Dynamic PDF certificate generation is offloaded to asynchronous background queues with pre-warmed serverless workers.',
      'Rate limiting by IP and student roll number prevents automated scraping bots from overwhelming auth endpoints.'
    ],
    sections: [
      {
        heading: '1. Deconstructing the 100K Concurrent Spike Phenomenon',
        subheading: 'Why traditional monoliths crash when semester results go live',
        content: [
          'When a university announces semester grades at 4:00 PM, 60,000 students and their parents refresh the portal simultaneously. Traditional monolithic servers crash within seconds due to database connection pool exhaustion.',
          'By leveraging Next.js Server Components at the edge paired with distributed Redis cache clusters, 98% of result requests are served directly from edge memory in under 40 milliseconds without touching the primary relational database.'
        ]
      }
    ],
    verdict: 'Decoupled edge caching and read replicas convert crushing exam release traffic spikes into a smooth, instantaneous student user experience.'
  },
  {
    slug: 'event-driven-microservices-in-go',
    number: '07',
    category: 'Software Engineering',
    categoryDisplay: 'Backend Systems & Microservices',
    title: 'Sub-15ms Event Pipelines with Go, Redis Streams and gRPC',
    subtitle: 'ASYNC MESSAGE PASSING FOR ENTERPRISE SOFTWARE',
    abstract: 'Practical patterns for structuring modular Go microservices communicating over protobuf schemas and asynchronous message streams with zero single-point-of-failure.',
    publishedAt: 'July 2026',
    readTime: '5 min read',
    author: {
      name: 'Himansu Nayak (MCA)',
      role: 'Head of Technology & Systems Architecture, OHO TECH',
      initials: 'HN'
    },
    accent: '#14b8a6',
    tags: ['Go (Golang)', 'gRPC', 'Protocol Buffers', 'Redis Streams', 'Microservices', 'OpenTelemetry'],
    keyPrinciples: [
      'Prefer binary protocol buffers (protobuf) over JSON for high-frequency inter-service RPC calls.',
      'Dead-letter queues (DLQ) with exponential backoff prevent transient errors from stalling consumer worker threads.',
      'Distributed OpenTelemetry trace headers must propagate across every network and queue boundary.',
      'Services must boot in under 200ms to facilitate instantaneous horizontal pod auto-scaling.'
    ],
    sections: [
      {
        heading: '1. Why Binary Serialization Outperforms JSON at Scale',
        subheading: 'Reducing payload serialization CPU overhead by 70%',
        content: [
          'In microservice architectures handling tens of thousands of internal queries per second, JSON serialization and string parsing consume over 40% of CPU cycles. Replacing JSON with gRPC and Protocol Buffers reduces CPU utilization and cuts latency to under 3 milliseconds per hop.'
        ]
      }
    ],
    verdict: 'Event-driven Go microservices communicating over gRPC deliver maximum CPU efficiency, resilience against cascading failures, and predictable sub-15ms system latency.'
  },
  {
    slug: 'oho-tech-2026-roadmap-sovereign-code',
    number: '08',
    category: 'Company Updates',
    categoryDisplay: 'Engineering Roadmap & Policy',
    title: 'OHO TECH 2026 Architecture Manifesto: Why Digital Sovereignty Is the Only Sustainable Enterprise Model',
    subtitle: '100% CODE HANDOVER, MODULAR ECOSYSTEMS & PRIVACY-FIRST RUNTIMES',
    abstract: 'Our foundational commitment to client intellectual property ownership, vendor-neutral cloud deployments, and battle-tested vertical platforms engineered for long-term independence.',
    publishedAt: 'June 2026',
    readTime: '4 min read',
    author: {
      name: 'Japabandhu Kampa',
      role: 'Founder & Director, OHO TECH',
      initials: 'JK'
    },
    accent: '#e11d48',
    tags: ['Company Updates', 'Code Sovereignty', 'Open Architecture', 'Multi-Cloud', 'Enterprise Strategy'],
    keyPrinciples: [
      'Clients receive full Git source code repositories and deployment manifests upon project delivery.',
      'No hidden per-seat licensing fees or proprietary database locks.',
      'All architectures run on standard container runtimes (Docker, Kubernetes) deployable on any cloud or on-premise hardware.',
      'Direct access to lead system architects without sales intermediary layers.'
    ],
    sections: [
      {
        heading: '1. The SaaS Commoditization Trap',
        subheading: 'Why monthly subscription software becomes an enterprise liability',
        content: [
          'Over the past decade, enterprises have become burdened by compounding monthly SaaS licensing fees for software they will never own. When vendors alter pricing tiers or discontinue APIs, organizations have no recourse.',
          'OHO TECH provides an alternative: bespoke, high-performance software built on modular foundations that the client owns in perpetuity. You control your database schemas, your container configurations, and your deployment roadmap.'
        ]
      }
    ],
    verdict: 'True digital sovereignty gives organizations permanent control over their critical data assets, operational workflows, and technology spend.'
  }
];

export function getInsightArticle(slug: string): InsightArticle | undefined {
  return INSIGHT_ARTICLES.find((a) => a.slug === slug);
}

export function getNextInsightArticle(currentSlug: string): InsightArticle {
  const currentIndex = INSIGHT_ARTICLES.findIndex((a) => a.slug === currentSlug);
  if (currentIndex === -1 || currentIndex === INSIGHT_ARTICLES.length - 1) {
    return INSIGHT_ARTICLES[0];
  }
  return INSIGHT_ARTICLES[currentIndex + 1];
}

export function getRelatedInsightArticles(currentSlug: string, count: number = 2): InsightArticle[] {
  const current = getInsightArticle(currentSlug);
  if (!current) return INSIGHT_ARTICLES.slice(0, count);

  // Match same category first, fallback to remaining articles
  const sameCategory = INSIGHT_ARTICLES.filter(
    (a) => a.slug !== currentSlug && a.category === current.category
  );
  const others = INSIGHT_ARTICLES.filter(
    (a) => a.slug !== currentSlug && a.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, count);
}
