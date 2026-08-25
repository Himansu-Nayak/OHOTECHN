export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp?: string;
  path?: string;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'DEVELOPER' | 'ROLE_CUSTOMER' | 'ROLE_ADMIN' | 'ROLE_DEVELOPER' | string;
  enabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  user: UserDto;
}

export interface ProductDto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  serviceType?: string;
  categoryId?: number;
  categoryName?: string;
  active: boolean;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface CartItem {
  id: number;
  product: ProductDto;
  quantity: number;
  price: number;
}

export interface Cart {
  id: number;
  user?: UserDto;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface OrderItem {
  id: number;
  product: ProductDto;
  quantity: number;
  price: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: number;
  user?: UserDto;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  contactPhone: string;
  createdAt: string;
  payments?: Payment[];
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface ContactEnquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: string;
  createdAt: string;
}

export type BillingType = 'FREE_TRIAL' | 'MONTHLY' | 'YEARLY' | 'LIFETIME' | 'ONE_TIME' | 'ENTERPRISE';

export interface ProductPlanDto {
  id: number;
  productId: number;
  productName?: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  billingType: BillingType;
  durationDays?: number;
  activationLimit?: number;
  trialDays?: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'SUSPENDED';

export interface Subscription {
  id: number;
  user?: UserDto;
  product: ProductDto;
  productPlan?: ProductPlanDto;
  order?: Order;
  status: SubscriptionStatus;
  startDate?: string;
  expiryDate?: string;
  autoRenew: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type LicenseStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'SUSPENDED';

export interface License {
  id: number;
  user?: UserDto;
  product: ProductDto;
  productPlan?: ProductPlanDto;
  subscription?: Subscription;
  licenseKey: string;
  status: LicenseStatus;
  activationLimit: number;
  activationCount: number;
  issuedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeviceActivation {
  id: number;
  licenseId?: number;
  deviceIdentifier: string;
  deviceName?: string;
  operatingSystem?: string;
  applicationVersion?: string;
  activatedAt?: string;
  lastSeenAt?: string;
  active: boolean;
}

export type Platform = 'WINDOWS' | 'MACOS' | 'LINUX' | 'ANDROID' | 'IOS' | 'WEB';

export interface SoftwareReleaseDto {
  id: number;
  productId: number;
  productName?: string;
  version: string;
  releaseNotes?: string;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  platform: Platform;
  active: boolean;
  releaseDate?: string;
  createdAt?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

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

export type LeadSource =
  | 'WEBSITE'
  | 'CONTACT_FORM'
  | 'QUOTE_REQUEST'
  | 'DEMO_REQUEST'
  | 'WEBSITE_PRODUCT'
  | 'FACEBOOK'
  | 'INSTAGRAM'
  | 'WHATSAPP'
  | 'LINKEDIN'
  | 'GOOGLE_ADS'
  | 'REFERRAL'
  | 'PARTNER'
  | 'MANUAL'
  | 'OTHER';

export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'DEMO_SCHEDULED'
  | 'DEMO_COMPLETED'
  | 'QUOTE_SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST'
  | 'FOLLOW_UP';

export type LeadPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface LeadDto {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  companyName?: string;
  designation?: string;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  interestedProduct?: string;
  interestedProductId?: number;
  interestedProductName?: string;
  source: LeadSource;
  sourceDetails?: string;
  campaign?: string;
  medium?: string;
  landingPage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  status: LeadStatus;
  priority: LeadPriority;
  assignedToId?: number;
  assignedToName?: string;
  assignedToEmail?: string;
  contactEnquiryId?: number;
  estimatedValue?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
}

export interface CreateLeadRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  companyName?: string;
  designation?: string;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  interestedProduct?: string;
  interestedProductId?: number;
  source?: LeadSource;
  sourceDetails?: string;
  campaign?: string;
  medium?: string;
  landingPage?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  assignedToId?: number;
  contactEnquiryId?: number;
  estimatedValue?: number;
  notes?: string;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
}

export interface UpdateLeadRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  designation?: string;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  interestedProduct?: string;
  interestedProductId?: number;
  source?: LeadSource;
  sourceDetails?: string;
  campaign?: string;
  medium?: string;
  landingPage?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  assignedToId?: number;
  estimatedValue?: number;
  notes?: string;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
}

export type ActivityType = 'CALL' | 'EMAIL' | 'WHATSAPP' | 'MEETING' | 'DEMO' | 'FOLLOW_UP' | 'NOTE';
export type FollowUpStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';

export interface LeadActivityDto {
  id: number;
  leadId: number;
  type: ActivityType;
  description: string;
  performedById?: number;
  performedByName?: string;
  performedByEmail?: string;
  scheduledAt?: string;
  createdAt: string;
}

export interface CreateActivityRequest {
  type: ActivityType;
  description: string;
  scheduledAt?: string;
}

export interface LeadFollowUpDto {
  id: number;
  leadId: number;
  leadName?: string;
  leadEmail?: string;
  companyName?: string;
  assignedUserId?: number;
  assignedUserName?: string;
  assignedUserEmail?: string;
  scheduledAt: string;
  title: string;
  notes?: string;
  status: FollowUpStatus;
  createdAt: string;
  completedAt?: string;
}

export interface CreateFollowUpRequest {
  title: string;
  scheduledAt: string;
  notes?: string;
  assignedUserId?: number;
}

export interface UpdateFollowUpRequest {
  status?: FollowUpStatus;
  notes?: string;
  scheduledAt?: string;
  assignedUserId?: number;
}

export interface PipelineStageDto {
  status: LeadStatus;
  stageName: string;
  count: number;
  totalValue: number;
  leads: LeadDto[];
}

export interface FollowUpDashboardDto {
  todayFollowUps: LeadFollowUpDto[];
  overdueFollowUps: LeadFollowUpDto[];
  upcomingFollowUps: LeadFollowUpDto[];
  todayCount: number;
  overdueCount: number;
  upcomingCount: number;
}



