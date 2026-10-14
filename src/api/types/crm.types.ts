import type { UserDto } from './user.types';
import type { Order } from './order.types';
import type { Payment } from './payment.types';
import type { Subscription } from './subscription.types';
import type { License, DeviceActivation } from './license.types';
import type { SoftwareReleaseDto } from './product.types';

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
