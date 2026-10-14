export interface NotificationDto {
  id: number;
  title: string;
  message: string;
  type: 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
  category: 'ORDER' | 'PAYMENT' | 'LICENSE' | 'SUBSCRIPTION' | 'TRIAL' | 'SYSTEM' | 'SECURITY' | 'PRODUCT';
  actionUrl?: string;
  read: boolean;
  createdAt: string;
  readAt?: string;
}

export interface AuditLogDto {
  id: number;
  actorUserId?: number;
  actorName?: string;
  actorEmail?: string;
  actorRole?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  description: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AnalyticsDashboardDto {
  userMetrics: {
    totalUsers: number;
    totalCustomers: number;
    totalAdmins: number;
    newUsersToday: number;
    newUsersThisMonth: number;
  };
  revenueMetrics: {
    totalRevenue: number;
    revenueToday: number;
    revenueThisMonth: number;
    revenueThisYear: number;
    filteredRevenue: number;
  };
  orderMetrics: {
    totalOrders: number;
    confirmedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
  };
  subscriptionMetrics: {
    activeSubscriptions: number;
    trialSubscriptions: number;
    expiredSubscriptions: number;
    suspendedSubscriptions: number;
    expiringSoon: number;
  };
  licenseMetrics: {
    activeLicenses: number;
    expiredLicenses: number;
    revokedLicenses: number;
    suspendedLicenses: number;
  };
  productMetrics: {
    mostPurchasedProducts: Array<{ id: number; name: string; salesCount: number; revenue: number }>;
    trialStarts: number;
  };
  paymentMetrics: {
    successfulPayments: number;
    failedPayments: number;
  };
}

export interface AdminStatsDto {
  totalProducts: number;
  activeProducts?: number;
  totalOrders: number;
  totalUsers: number;
  totalQuotes: number;
  totalRevenue: number;
  activeLicenses?: number;
  activeSubscriptions?: number;
  pendingDeployments?: number;
  liveDeployments?: number;
  failedPayments?: number;
  activeProviders?: number;
  inactiveProviders?: number;
  providerIssues?: number;
  systemStatus: string;
}
