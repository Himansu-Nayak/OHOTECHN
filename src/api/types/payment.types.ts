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
