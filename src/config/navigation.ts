export interface NavLink {
  name: string;
  href: string;
  description?: string;
}

export const mainNav: NavLink[] = [
  { name: 'Solutions', href: '/solutions' },
  { name: 'Services', href: '/services' },
  { name: 'Industries', href: '/solutions#industries' },
  { name: 'About', href: '/about' },
  { name: 'Careers', href: '/careers' },
];

export const solutionsNav: NavLink[] = [
  { name: 'Enterprise Technology', href: '/solutions/business-enterprise', description: 'Digital systems designed for operational efficiency.' },
  { name: 'Critical Infrastructure', href: '/solutions/logistics-transport', description: 'Reliable systems built for long-term growth.' },
  { name: 'Renewable Energy & Utilities', href: '/solutions/manufacturing', description: 'Smarter energy solutions for a sustainable future.' },
  { name: 'Healthcare & EMR Systems', href: '/solutions/healthcare', description: 'Integrated clinical software and patient systems.' },
  { name: 'Education & Institutional ERP', href: '/solutions/education', description: 'Campus automation and learning platforms.' },
  { name: 'Financial Infrastructure', href: '/solutions/finance-nbfc', description: 'Core financial workflows and secure transaction processing.' },
];

export const techServicesNav: NavLink[] = [
  { name: 'Software Engineering', href: '/services/software-development', description: 'Custom enterprise applications engineered for scale.' },
  { name: 'Cloud & Infrastructure', href: '/services/erp-solutions', description: 'Resilient digital architecture and ERP deployment.' },
  { name: 'Web Application Platforms', href: '/services/website-development', description: 'High-performance web applications and portals.' },
  { name: 'Mobile Systems (iOS & Android)', href: '/services/android-app-development', description: 'Native and cross-platform mobile solutions.' },
];

export const growthServicesNav: NavLink[] = [
  { name: 'Digital Strategy & Integration', href: '/services/api-integration', description: 'Connecting complex systems and enterprise workflows.' },
  { name: 'UI/UX Design Systems', href: '/services/ui-ux-design', description: 'Human-centered interfaces built for efficiency.' },
  { name: 'Data & Growth Systems', href: '/services/seo', description: 'Performance optimization and analytical clarity.' },
];

export const companyNav: NavLink[] = [
  { name: 'About OHO TECHN', href: '/about', description: 'Our engineering principles and leadership vision.' },
  { name: 'Leadership & Team', href: '/about#leadership', description: 'Meet the people driving technical excellence.' },
  { name: 'Careers', href: '/careers', description: 'Join our team building modern infrastructure.' },
  { name: 'Partner Program', href: '/partner', description: 'Strategic alliances for technology and implementation.' },
  { name: 'Contact Us', href: '/contact', description: 'Get in touch with our solutions team.' },
];

export const legalNav: NavLink[] = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms & Conditions', href: '/terms-and-conditions' },
  { name: 'Refund Policy', href: '/refund-cancellation' },
  { name: 'Cookie Policy', href: '/cookie-policy' },
  { name: 'Disclaimer', href: '/disclaimer' },
];

