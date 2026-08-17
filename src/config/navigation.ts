export interface NavLink {
  name: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  name: string;
  href: string;
  children?: NavLink[];
}

export const solutionsNav: NavLink[] = [
  { name: 'Education & LMS', href: '/solutions/education', description: 'SchoolCloud ERP, online exams & fee collection.' },
  { name: 'Healthcare & EMR', href: '/solutions/healthcare', description: 'HealthOS hospital management & patient billing.' },
  { name: 'Hotel & Hospitality', href: '/solutions/hotel-hospitality', description: 'Property management, room booking & POS.' },
  { name: 'Retail & E-Commerce', href: '/solutions/retail-ecommerce', description: 'RetailPOS billing, stock sync & online stores.' },
  { name: 'Manufacturing', href: '/solutions/manufacturing', description: 'Production planning, inventory & supplier tracking.' },
  { name: 'Business Enterprise', href: '/solutions/business-enterprise', description: 'Custom ERP, HRMS payroll & workflow tools.' },
  { name: 'Real Estate', href: '/solutions/real-estate', description: 'Property CRM, lead tracking & tenant management.' },
  { name: 'Finance & NBFC', href: '/solutions/finance-nbfc', description: 'FinCore microfinance, loan origination & EMI sync.' },
  { name: 'Logistics & Transport', href: '/solutions/logistics-transport', description: 'Fleet management, dispatch & consignment tracking.' },
];

export const techServicesNav: NavLink[] = [
  { name: 'Software Development', href: '/services/software-development', description: 'Bespoke software engineered for business operations.' },
  { name: 'Website Development', href: '/services/website-development', description: 'High-performance corporate sites & web applications.' },
  { name: 'Android App Development', href: '/services/android-app-development', description: 'Native Kotlin mobile applications.' },
  { name: 'iOS App Development', href: '/services/ios-app-development', description: 'Native iOS applications for Apple ecosystem.' },
  { name: 'Custom Software', href: '/services/custom-software-development', description: 'Tailored software tools built for your workflows.' },
  { name: 'ERP Solutions', href: '/services/erp-solutions', description: 'Centralized enterprise operations platforms.' },
  { name: 'UI/UX Design', href: '/services/ui-ux-design', description: 'User-centered interface design & design systems.' },
  { name: 'API Integration', href: '/services/api-integration', description: 'Connecting software tools & payment gateways.' },
];

export const growthServicesNav: NavLink[] = [
  { name: 'SEO', href: '/services/seo', description: 'Organic search engine ranking & visibility.' },
  { name: 'Social Media Marketing', href: '/services/social-media-marketing', description: 'Strategic social content & community reach.' },
  { name: 'Google Ads', href: '/services/google-ads', description: 'Targeted search & display lead campaigns.' },
  { name: 'Meta Advertising', href: '/services/facebook-meta-ads', description: 'Facebook & Instagram ad campaigns.' },
  { name: 'Branding & Design', href: '/services/branding-graphic-design', description: 'Brand identity & visual marketing collateral.' },
  { name: 'WhatsApp Marketing', href: '/services/whatsapp-marketing', description: 'Broadcast messaging & customer updates.' },
  { name: 'Email Marketing', href: '/services/email-marketing', description: 'Segmented email campaigns & lead nurture.' },
];

export const resourcesNav: NavLink[] = [
  { name: 'Blog', href: '/resources/blog', description: 'Articles on software engineering & growth.' },
  { name: 'Case Studies', href: '/case-studies', description: 'Real-world software implementation summaries.' },
  { name: 'FAQ', href: '/resources/faq', description: 'Frequently asked questions about our process.' },
];

export const companyNav: NavLink[] = [
  { name: 'About Us', href: '/about', description: 'Our mission, leadership, and engineering principles.' },
  { name: 'Careers', href: '/careers', description: 'Join our technology & growth engineering team.' },
  { name: 'Partner With Us', href: '/partner', description: 'Channel partnerships for agencies & developers.' },
  { name: 'Contact', href: '/contact', description: 'Get in touch with our team for project inquiries.' },
];

export const legalNav: NavLink[] = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms & Conditions', href: '/terms-and-conditions' },
  { name: 'Refund Policy', href: '/refund-cancellation' },
  { name: 'Cookie Policy', href: '/cookie-policy' },
  { name: 'Disclaimer', href: '/disclaimer' },
];
