export interface DeveloperAnalyticsDto {
  deviceMetrics: {
    totalActivations: number;
    activeDevices: number;
    deactivatedDevices: number;
    activationsToday: number;
    activationsThisMonth: number;
  };
  downloadMetrics: {
    totalDownloads: number;
    downloadsToday: number;
    downloadsThisMonth: number;
  };
  platformStats: Array<{
    platform: string;
    activationCount: number;
    downloadCount: number;
  }>;
  productStats: Array<{
    productId: number;
    productName: string;
    downloadCount: number;
  }>;
  releaseStats: Array<{
    releaseId: number;
    productName: string;
    version: string;
    platform: string;
    downloadCount: number;
  }>;
  recentActivity: Array<{
    id: number;
    timestamp: string;
    action: string;
    actorEmail: string;
    entityType: string;
    entityId: string;
    description: string;
  }>;
}

export interface DeveloperDiagnosticsDto {
  jvmVersion: string;
  javaVendor: string;
  osName: string;
  osArch: string;
  systemUptimeMs: number;
  heapUsedBytes: number;
  heapMaxBytes: number;
  heapUsedPercent: number;
  activeThreadCount: number;
  dbConnectionUrlMasked: string;
  dbActiveConnections: number;
  dbMaxConnections: number;
  springActiveProfiles: string[];
  rateLimitActiveTrackers: number;
  serverTimestamp: string;
  status: string;
}

export interface ApiKeyDto {
  id: number;
  name: string;
  keyPrefix: string;
  plaintextSecret?: string;
  scope: string;
  active: boolean;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  createdByEmail?: string;
}

export interface CreateApiKeyRequest {
  name: string;
  scope: string;
}

export interface WebhookEventDto {
  id: number;
  provider: string;
  externalEventId?: string;
  externalLeadId?: string;
  eventType: string;
  receivedAt: string;
  status: 'RECEIVED' | 'PROCESSED' | 'FAILED' | 'IGNORED';
  processedAt?: string;
  errorReason?: string;
  payloadSummary?: string;
}

export interface WebhookTestRequest {
  targetUrl: string;
  eventType: string;
}

export interface WebhookTestResponseDto {
  targetUrl: string;
  statusCode: number;
  latencyMs: number;
  success: boolean;
  responseSummary: string;
  dispatchedAt: string;
}
