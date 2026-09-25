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
  role: 'CUSTOMER' | 'ADMIN' | 'DEVELOPER' | 'SUPPORT' | 'ROLE_CUSTOMER' | 'ROLE_ADMIN' | 'ROLE_DEVELOPER' | 'ROLE_SUPPORT' | string;
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
  productPlan?: ProductPlanDto;
  quantity: number;
  price: number;
  itemTotal?: number;
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

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED';
export type PaymentProvider = 'RAZORPAY' | 'UPI_DIRECT' | 'COD';
export type PaymentMethod = 'UPI_QR' | 'UPI_INTENT' | 'COD' | 'CARD' | 'NETBANKING';

export interface Payment {
  id: number;
  orderId?: number;
  provider?: PaymentProvider;
  method?: PaymentMethod;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionReference?: string;
  payerUpiId?: string;
  payerName?: string;
  failureReason?: string;
  adminNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentConfigDto {
  upiDirectEnabled: boolean;
  codEnabled: boolean;
  razorpayEnabled: boolean;
  merchantName: string;
  upiId: string;
  bankName: string;
}

export interface UpiInitiateResponse {
  orderId: number;
  paymentId: number;
  amount: number;
  currency: string;
  upiId: string;
  merchantName: string;
  bankName: string;
  upiIntentUri: string;
  transactionRefNote: string;
}

export interface UtrSubmissionRequest {
  orderId: number;
  utr: string;
  payerUpiId?: string;
  payerName?: string;
  notes?: string;
}

export interface AdminPaymentActionRequest {
  notes?: string;
  failureReason?: string;
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
  externalLeadId?: string;
  externalCampaignId?: string;
  externalAdSetId?: string;
  externalAdSet?: string;
  externalAdId?: string;
  externalAd?: string;
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
  isConverted?: boolean;
  convertedAt?: string;
  convertedById?: number;
  convertedByName?: string;
  convertedUserId?: number;
  convertedUserName?: string;
  convertedUserEmail?: string;
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

export interface TimelineEventDto {
  eventType: string;
  title: string;
  description: string;
  category: string;
  timestamp: string;
  actorName?: string;
  metadata?: string;
}

export interface PaymentDto {
  id: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
}

export interface Customer360Dto {
  profile: UserDto;
  companyName?: string;
  leads: LeadDto[];
  activities: LeadActivityDto[];
  followUps: LeadFollowUpDto[];
  totalLeadsCount: number;
  primaryCrmStatus: string;
  orders: Order[];
  totalOrdersCount: number;
  totalSpent: number;
  payments: Payment[];
  subscriptions: Subscription[];
  licenses: License[];
  deviceActivations: DeviceActivation[];
  availableDownloads: SoftwareReleaseDto[];
  timeline: TimelineEventDto[];
}

export interface CustomerMatchResultDto {
  leadId: number;
  hasExactMatch: boolean;
  matchReason: 'MATCH_BY_EMAIL' | 'MATCH_BY_PHONE' | 'NO_MATCH';
  matchedUser?: UserDto;
  lead: LeadDto;
}

export interface ConvertLeadRequest {
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  initialPassword?: string;
}

export interface LinkCustomerRequest {
  userId: number;
}

export interface CrmMarketingAnalyticsDto {
  totalLeads: number;
  leadsBySource: Record<string, number>;
  leadsByStatus: Record<string, number>;
  leadsByCampaign: Record<string, number>;
  conversionRateBySource: Record<string, number>;
  revenueBySource: Record<string, number>;
}

export interface AdminStatsDto {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalQuotes: number;
  totalRevenue: number;
  systemStatus: string;
}

export type TicketDepartment = 'TECHNICAL' | 'BILLING' | 'SALES' | 'LICENSING' | 'GENERAL';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'ON_HOLD' | 'RESOLVED' | 'CLOSED';

export interface SupportTicketMessageDto {
  id: number;
  ticketId: number;
  senderId?: number;
  senderName: string;
  senderRole: string;
  message: string;
  internalNote: boolean;
  createdAt: string;
}

export interface SupportTicketDto {
  id: number;
  ticketCode: string;
  subject: string;
  description: string;
  department: TicketDepartment;
  priority: TicketPriority;
  status: TicketStatus;
  customerId?: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  assignedToId?: number;
  assignedToName?: string;
  assignedToEmail?: string;
  orderId?: number;
  slaDueAt?: string;
  slaHoursRemaining?: number;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  lastReply?: string;
  messages?: SupportTicketMessageDto[];
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
  department?: TicketDepartment | string;
  priority?: TicketPriority | string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  orderId?: number;
}

export interface TicketReplyRequest {
  message: string;
  internalNote?: boolean;
  newStatus?: TicketStatus | string;
}

export interface TicketStatusUpdateRequest {
  status: TicketStatus | string;
  note?: string;
}

export interface SupportStatsDto {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  urgentTickets: number;
  resolvedToday: number;
  totalEnquiries: number;
  pendingEnquiries: number;
}
