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
