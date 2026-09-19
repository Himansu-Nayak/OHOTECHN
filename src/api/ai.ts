import { apiClient } from './client';
import { ApiResponse, ProductDto } from './types';

export interface AiChatRequest {
  conversationId?: number;
  sessionId?: string;
  message: string;
  feature?: 'CHATBOT' | 'SUPPORT' | 'RECOMMENDER';
}

export interface AiChatResponse {
  conversationId: number;
  message: string;
  role: string;
  suggestedQuestions?: string[];
  executedTools?: string[];
  products?: ProductDto[];
  timestamp: string;
}

export interface AiRecommendationRequest {
  query?: string;
  industry?: string;
  budget?: number;
  organizationScale?: 'STARTUP' | 'SME' | 'ENTERPRISE';
}

export interface AiRecommendationResponse {
  summary: string;
  recommendations: ProductDto[];
  implementationAdvice: string;
  estimatedTimeline: string;
}

export interface AiClassificationResponse {
  category: string;
  confidence: number;
  intent: string;
  suggestedAction: string;
}

export interface SemanticSearchResultItem {
  product: ProductDto;
  similarityScore: number;
  matchingContext: string;
}

export interface SemanticSearchResponse {
  query: string;
  results: SemanticSearchResultItem[];
}

export interface DocumentAnalysisResponse {
  documentType: string;
  summary: string;
  keyPoints: string[];
  extractedFields: Record<string, any>;
  confidence: number;
}

export interface ImageAnalysisResponse {
  description: string;
  detectedCategory: string;
  attributes: Record<string, string>;
  altText: string;
  visualQualityRating: string;
}

export interface ProductAiGenerationRequest {
  productName: string;
  category?: string;
  targetAudience?: string;
  keyFeatures?: string;
  specifications?: string;
}

export interface ProductAiGenerationResponse {
  shortDescription: string;
  longDescription: string;
  features: string[];
  seoTitle: string;
  seoDescription: string;
  faq: Array<{ question: string; answer: string }>;
}

export interface AnalyticsInsightResponse {
  executiveSummary: string;
  keyObservations: string[];
  strategicOpportunities: string[];
  recommendedNextSteps: string[];
  generatedAt: string;
}

export interface AIConversationDto {
  id: number;
  title: string;
  feature: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessageDto {
  id: number;
  role: string;
  content: string;
  createdAt: string;
}

// Public / Customer AI APIs
export async function chatWithAi(request: AiChatRequest): Promise<ApiResponse<AiChatResponse>> {
  return apiClient<AiChatResponse>('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function askAiSupport(request: AiChatRequest): Promise<ApiResponse<AiChatResponse>> {
  return apiClient<AiChatResponse>('/api/ai/support', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function getAiRecommendations(request: AiRecommendationRequest): Promise<ApiResponse<AiRecommendationResponse>> {
  return apiClient<AiRecommendationResponse>('/api/ai/product/recommend', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function classifyCustomerQuery(query: string): Promise<ApiResponse<AiClassificationResponse>> {
  return apiClient<AiClassificationResponse>('/api/ai/classify', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}

export async function searchAiProducts(query: string, limit = 5): Promise<ApiResponse<SemanticSearchResponse>> {
  return apiClient<SemanticSearchResponse>('/api/ai/search', {
    method: 'POST',
    body: JSON.stringify({ query, limit }),
  });
}

export async function analyzeAiDocument(file: File, prompt?: string): Promise<ApiResponse<DocumentAnalysisResponse>> {
  const formData = new FormData();
  formData.append('file', file);
  if (prompt) formData.append('prompt', prompt);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/api/ai/document/analyze`, {
    method: 'POST',
    headers,
    body: formData,
  });

  return res.json();
}

export async function analyzeAiImage(file: File, context?: string): Promise<ApiResponse<ImageAnalysisResponse>> {
  const formData = new FormData();
  formData.append('file', file);
  if (context) formData.append('context', context);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/api/ai/image/analyze`, {
    method: 'POST',
    headers,
    body: formData,
  });

  return res.json();
}

export async function getUserAiConversations(): Promise<ApiResponse<AIConversationDto[]>> {
  return apiClient<AIConversationDto[]>('/api/ai/conversations');
}

export async function getAiConversationMessages(id: number): Promise<ApiResponse<AIMessageDto[]>> {
  return apiClient<AIMessageDto[]>(`/api/ai/conversations/${id}`);
}

export async function deleteAiConversation(id: number): Promise<ApiResponse<void>> {
  return apiClient<void>(`/api/ai/conversations/${id}`, {
    method: 'DELETE',
  });
}

// Admin AI APIs
export async function generateAdminProductCopy(request: ProductAiGenerationRequest): Promise<ApiResponse<ProductAiGenerationResponse>> {
  return apiClient<ProductAiGenerationResponse>('/api/admin/ai/product-description', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function applyAdminProductCopy(productId: number, copy: ProductAiGenerationResponse): Promise<ApiResponse<ProductDto>> {
  return apiClient<ProductDto>(`/api/admin/ai/product-description/apply/${productId}`, {
    method: 'POST',
    body: JSON.stringify(copy),
  });
}

export async function summarizeAdminEnquiries(): Promise<ApiResponse<{ summary: string; totalEnquiries: number }>> {
  return apiClient<{ summary: string; totalEnquiries: number }>('/api/admin/ai/summarize-enquiries', {
    method: 'POST',
  });
}

export async function getAdminAnalyticsAiInsight(): Promise<ApiResponse<AnalyticsInsightResponse>> {
  return apiClient<AnalyticsInsightResponse>('/api/admin/ai/analytics-insight', {
    method: 'POST',
  });
}

export async function syncAdminProductEmbeddings(): Promise<ApiResponse<string>> {
  return apiClient<string>('/api/admin/ai/embeddings/sync', {
    method: 'POST',
  });
}
