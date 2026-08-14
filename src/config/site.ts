export const siteConfig = {
  name: 'OHO TECH',
  tagline: 'Software, Digital Platforms & Business Growth',
  description:
    'OHO TECH designs and develops custom software applications, web platforms, mobile apps, ERP systems, and data-driven digital growth strategies for businesses.',
  url: 'https://ohotech.com',

  contact: {
    email: 'hello@ohotech.com',
    phone: '+91 98765 43210',
    address: 'Noida, Uttar Pradesh, India',
    hours: 'Mon – Sat, 9:00 AM – 7:00 PM IST',
  },

  social: {
    linkedin: 'https://linkedin.com/company/ohotech',
    twitter: 'https://twitter.com/ohotech',
    instagram: 'https://instagram.com/ohotech',
    facebook: 'https://facebook.com/ohotech',
    youtube: 'https://youtube.com/@ohotech',
  },

  ctas: {
    bookDemo: { label: 'Book a Demo', href: '/book-demo' },
    getQuote: { label: 'Get a Quote', href: '/get-quote' },
    talkToExpert: { label: 'Talk to an Expert', href: '/contact' },
    exploreSolutions: { label: 'Explore Solutions', href: '/solutions' },
    becomePartner: { label: 'Become a Partner', href: '/partner' },
  },
} as const;
