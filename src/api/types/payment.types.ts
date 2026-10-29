export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED';
export type PaymentProvider = 'RAZORPAY' | 'UPI_DIRECT' | 'BANK_TRANSFER' | 'COD' | string;
export type PaymentMethod = 'UPI_QR' | 'UPI_INTENT' | 'UPI' | 'COD' | 'CARD' | 'NETBANKING' | string;

export interface Payment {
  id: number;
  orderId?: number;
  orderStatus?: string;
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
  customerName?: string;
  customerEmail?: string;
  failureReason?: string;
  adminNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionOverviewDto {
  generatedAt: string;
  period: string;
  periodStart?: string;
  periodEnd?: string;
  totalTransactions: number;
  totalVolume: number;
  successfulCount: number;
  successfulAmount: number;
  pendingCount: number;
  pendingAmount: number;
  failedCount: number;
  failedAmount: number;
  refundedCount: number;
  refundedAmount: number;
  reconciliationDiscrepancies: number;
  webhookFailures: number;
  entitlementFailures: number;
}

export interface PaymentConfigDto {
  upiDirectEnabled: boolean;
  codEnabled: boolean;
  razorpayEnabled: boolean;
  merchantName: string;
  upiId: string;
  bankName: string;
  testMode?: boolean;
  demoEnabled?: boolean;
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

export interface ReconciliationAnomalyDto {
  paymentId: number;
  orderId?: number;
  provider?: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  recordedAmount?: number;
  currentPaymentStatus?: string;
  currentOrderStatus?: string;
  anomalyType?: string;
  recommendation?: string;
  detectedAt?: string;
}

export interface PaymentReconciliationReportDto {
  generatedAt: string;
  totalRecordsEvaluated: number;
  matchedCount: number;
  anomalyCount: number;
  anomalies: ReconciliationAnomalyDto[];
}

export interface AdminPaymentActionRequest {
  notes?: string;
  failureReason?: string;
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

export interface UpiCheckoutResponseDto {
  orderId: number;
  paymentId: number;
  merchantVpa: string;
  merchantName: string;
  receiverVpa?: string;
  receiverName?: string;
  amount: number;
  currency: string;
  transactionNote?: string;
  transactionRef?: string;
  upiUri: string;
  intentLinks?: Record<string, string>;
  intentUrls?: {
    gpay?: string;
    phonepe?: string;
    paytm?: string;
    bhim?: string;
    cred?: string;
    [key: string]: string | undefined;
  };
  status?: string;
  slotNumber?: number;
  slotAcquired?: boolean;
  queuePosition?: number;
  expiresInSeconds?: number;
  leaseExpiresAt?: string;
}

export interface UpiCheckoutStatusDto {
  paymentId: number;
  orderId: number;
  paymentStatus: string;
  orderStatus: string;
  amount: number;
  transactionReference?: string;
  verifiedAt?: string;
  isPaid: boolean;
  isExpired: boolean;
  message: string;
}

export interface CounterBillingReceiptDto {
  receiptNumber: string;
  orderId: number;
  paymentId: number;
  cashierName: string;
  cashierId: number;
  customerName?: string;
  customerEmail?: string;
  paymentMethod: string;
  paymentStatus?: string;
  status?: string;
  orderTotal: number;
  amountTotal?: number;
  cashTendered?: number;
  changeReturned?: number;
  changeDue?: number;
  cardTerminalRef?: string;
  cardTerminalId?: string;
  transactedAt?: string;
  notes?: string;
}

export interface PhoneOtpRequestDto {
  phoneNumber: string;
}

export interface PhoneOtpVerifyDto {
  phoneNumber: string;
  otpCode: string;
}
