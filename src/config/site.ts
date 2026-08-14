export const siteConfig = {
  name: 'OHO TECH',
  tagline: 'Building Tomorrow\'s Technology Today',
  description:
    'OHO TECH is a modern software and digital technology company delivering innovative software products, custom development, and digital marketing services across 13+ industries.',
  url: 'https://ohotech.com',

  contact: {
    email: 'hello@ohotech.com',
    phone: '+91 98765 43210',
    address: 'Tech Park, Sector 62, Noida, Uttar Pradesh 201301, India',
    hours: 'Mon – Sat, 9:00 AM – 7:00 PM IST',
  },

  social: {
    twitter: 'https://twitter.com/ohotech',
    linkedin: 'https://linkedin.com/company/ohotech',
    facebook: 'https://facebook.com/ohotech',
    instagram: 'https://instagram.com/ohotech',
    youtube: 'https://youtube.com/@ohotech',
  },

  ctas: {
    bookDemo: { label: 'Book a Demo', href: '/book-demo' },
    getQuote: { label: 'Get a Quote', href: '/get-quote' },
    talkToExpert: { label: 'Talk to an Expert', href: '/contact' },
    exploreSolutions: { label: 'Explore Solutions', href: '/solutions' },
    becomePartner: { label: 'Become a Partner', href: '/partner' },
    freeTrial: { label: 'Start Free Trial', href: '/free-trial' },
  },
} as const;

export type NavItem = {
  name: string;
  href: string;
  children?: NavItem[];
};

export const mainNav: NavItem[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Solutions',
    href: '/solutions',
    children: [
      { name: 'Education', href: '/solutions/education' },
      { name: 'Healthcare', href: '/solutions/healthcare' },
      { name: 'Hotel & Hospitality', href: '/solutions/hotel-hospitality' },
      { name: 'Retail & E-Commerce', href: '/solutions/retail-ecommerce' },
      { name: 'Manufacturing', href: '/solutions/manufacturing' },
      { name: 'Business & Enterprise', href: '/solutions/business-enterprise' },
      { name: 'Real Estate', href: '/solutions/real-estate' },
      { name: 'Finance & NBFC', href: '/solutions/finance-nbfc' },
      { name: 'Logistics & Transport', href: '/solutions/logistics-transport' },
      { name: 'Salon, Spa & Fitness', href: '/solutions/salon-spa-fitness' },
      { name: 'Travel & Tourism', href: '/solutions/travel-tourism' },
      { name: 'NGO & Membership', href: '/solutions/ngo-membership' },
      { name: 'Warehouse & Distribution', href: '/solutions/warehouse-distribution' },
    ],
  },
  {
    name: 'Services',
    href: '/services',
    children: [
      { name: 'Software Development', href: '/services/software-development' },
      { name: 'Website Development', href: '/services/website-development' },
      { name: 'Android App Development', href: '/services/android-app-development' },
      { name: 'iOS App Development', href: '/services/ios-app-development' },
      { name: 'Custom Software', href: '/services/custom-software-development' },
      { name: 'ERP Solutions', href: '/services/erp-solutions' },
      { name: 'UI/UX Design', href: '/services/ui-ux-design' },
      { name: 'API Integration', href: '/services/api-integration' },
      { name: 'SEO', href: '/services/seo' },
      { name: 'Social Media Marketing', href: '/services/social-media-marketing' },
      { name: 'Google Ads', href: '/services/google-ads' },
      { name: 'Meta Ads', href: '/services/facebook-meta-ads' },
      { name: 'Branding & Design', href: '/services/branding-graphic-design' },
      { name: 'WhatsApp Marketing', href: '/services/whatsapp-marketing' },
      { name: 'Email Marketing', href: '/services/email-marketing' },
    ],
  },
  { name: 'Products', href: '/products' },
  { name: 'Pricing', href: '/pricing' },
  {
    name: 'Resources',
    href: '/resources',
    children: [
      { name: 'Blog', href: '/resources/blog' },
      { name: 'Case Studies', href: '/case-studies' },
      { name: 'FAQ', href: '/resources/faq' },
    ],
  },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];
