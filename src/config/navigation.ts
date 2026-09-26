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
  { name: 'Custom Software Development', href: '/services/custom-software-development', description: 'Bespoke business platforms, admin systems & custom workflows.' },
  { name: 'Web Development', href: '/services/web-development', description: 'High-performance web applications, customer portals & Next.js engines.' },
  { name: 'Mobile App Development', href: '/services/mobile-app-development', description: 'Native iOS & Android apps with offline SQLite sync & store deployment.' },
  { name: 'UI/UX Design', href: '/services/ui-ux-design', description: 'User-centered spatial interfaces, semantic design tokens & WCAG AAA.' },
  { name: 'AI & Automation', href: '/services/ai-automation', description: 'Enterprise RAG assistants, vector databases & automated workflow bots.' },
  { name: 'Cloud & DevOps', href: '/services/cloud-devops', description: 'Multi-region cloud topologies, Docker containers & automated CI/CD.' },
  { name: 'Maintenance & Support', href: '/services/maintenance-support', description: 'SLA-backed systems support, continuous patching & 24/7 telemetry.' },
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
  { name: 'Case Studies & Work', href: '/work', description: 'Verified enterprise case studies & architecture.' },
  { name: 'Technology Stack', href: '/technology', description: 'Distributed runtimes, stack specs & cloud mesh.' },
  { name: 'Engineering Insights', href: '/insights', description: 'Technical whitepapers & system design articles.' },
  { name: 'Pricing & Plans', href: '/pricing', description: 'Enterprise software pricing, licenses & billing.' },
  { name: 'Software Downloads', href: '/downloads', description: 'Official desktop apps, installers & mobile APKs.' },
  { name: 'Licenses & Keys', href: '/licenses', description: 'License key validation & device activation portal.' },
  { name: 'Partner Program', href: '/partner', description: 'Channel partnerships for technology resellers & agencies.' },
];

export const companyNav: NavLink[] = [
  { name: 'About Us', href: '/about', description: 'Our mission, leadership, and engineering principles.' },
  { name: 'Executive Leadership', href: '/about#director', description: 'Founder governance & technical directorship.' },
  { name: 'Technology Architecture', href: '/technology', description: 'Foundational engineering pillars and runtimes.' },
  { name: 'Engineering Insights', href: '/insights', description: 'Deep-dive technical whitepapers and system designs.' },
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
