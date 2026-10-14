export interface ProviderDto {
  id: number;
  name: string;
  companyName?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  commercialTerms?: string;
  commissionRate?: number;
  technicalIntegrationType?: string;
  integrationStatus?: string;
  supportResponsibility?: string;
  deploymentResponsibility?: string;
  contractStatus?: string;
  notes?: string;
  active: boolean;
  productsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
