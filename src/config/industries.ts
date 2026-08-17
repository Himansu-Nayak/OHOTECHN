export type Product = {
  name: string;
  slug: string;
  shortDescription: string;
};

export type Industry = {
  slug: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
  products: Product[];
};

export const industries: Industry[] = [
  {
    slug: 'education',
    name: 'Education & Vocational Skill Continuum',
    description:
      'Transformational digital solutions for the entire continuum of Vocational Education, Skill Development, e-Learning, Digital Assessment, and e-Governance.',
    iconName: 'GraduationCap',
    color: 'primary',
    products: [
      { name: 'Vocational Skill Development ERP', slug: 'vocational-skill-development-erp', shortDescription: 'Transformational platform for vocational training institutes, skill development continuum, and employability tracking.' },
      { name: 'Digital Assessment & Proctoring Engine', slug: 'digital-assessment-proctoring-engine', shortDescription: 'Secure digital assessments, auto-grading, skill evaluation, and certification portals.' },
      { name: 'e-Governance Educational Portal', slug: 'egovernance-educational-portal', shortDescription: 'e-Governance infrastructure for state skill missions, literacy tracking, accessibility & inclusion.' },
      { name: 'School Management Software', slug: 'school-management-software', shortDescription: 'Complete school administration, attendance, fees, and parent communication.' },
      { name: 'College ERP', slug: 'college-erp', shortDescription: 'End-to-end college management with admissions, exams, and placement modules.' },
      { name: 'University Management System', slug: 'university-management-system', shortDescription: 'Multi-campus university operations, research, and accreditation tracking.' },
      { name: 'Coaching Institute Management', slug: 'coaching-institute-management', shortDescription: 'Batch management, fee tracking, and performance analytics for coaching centres.' },
      { name: 'Learning Management System (LMS)', slug: 'learning-management-system', shortDescription: 'Online courses, interactive e-Learning content, assessments, and certifications.' },
    ],
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    description:
      'Digital health solutions for hospitals, clinics, labs, and pharmacies.',
    iconName: 'Stethoscope',
    color: 'secondary',
    products: [
      { name: 'Hospital Management Software', slug: 'hospital-management-software', shortDescription: 'OPD/IPD, EMR, billing, pharmacy, and lab integration for hospitals.' },
      { name: 'IVF & Fertility Clinic Software', slug: 'ivf-fertility-clinic-software', shortDescription: 'In Vitro Fertilization (IVF) cycle tracking, embryology lab management, follicle monitoring, and specialized fertility EMR.' },
      { name: 'Clinic Management Software', slug: 'clinic-management-software', shortDescription: 'Appointment scheduling, patient records, and billing for clinics.' },
      { name: 'Pathology Lab Software', slug: 'pathology-lab-software', shortDescription: 'Sample tracking, report generation, and lab equipment integration.' },
      { name: 'Pharmacy Billing Software', slug: 'pharmacy-billing-software', shortDescription: 'Inventory, GST billing, expiry tracking, and supplier management.' },
      { name: 'Diagnostic Centre Software', slug: 'diagnostic-centre-software', shortDescription: 'Test management, online reports, and multi-branch operations.' },
      { name: 'Patient Appointment System', slug: 'patient-appointment-system', shortDescription: 'Online booking, doctor schedules, reminders, and queue management.' },
    ],
  },
  {
    slug: 'hotel-hospitality',
    name: 'Hotel & Hospitality',
    description:
      'Technology solutions for hotels, restaurants, resorts, and food delivery businesses.',
    iconName: 'Hotel',
    color: 'accent',
    products: [
      { name: 'Hotel Management Software', slug: 'hotel-management-software', shortDescription: 'Reservations, front desk, housekeeping, and channel management.' },
      { name: 'Restaurant POS Software', slug: 'restaurant-pos-software', shortDescription: 'Table management, order processing, kitchen display, and billing.' },
      { name: 'Resort Management Software', slug: 'resort-management-software', shortDescription: 'Activity booking, spa management, and guest experience tools.' },
      { name: 'Food Delivery Management', slug: 'food-delivery-management', shortDescription: 'Order management, delivery tracking, and restaurant partner integration.' },
      { name: 'Laundry Management Software', slug: 'laundry-management-software', shortDescription: 'Order tracking, pickup/delivery scheduling, and garment management.' },
    ],
  },
  {
    slug: 'retail-ecommerce',
    name: 'Retail & E-Commerce',
    description:
      'Omnichannel retail and e-commerce platforms for modern businesses.',
    iconName: 'ShoppingBag',
    color: 'primary',
    products: [
      { name: 'Retail POS Software', slug: 'retail-pos-software', shortDescription: 'Fast billing, inventory sync, and multi-store retail operations.' },
      { name: 'GST Billing Software', slug: 'gst-billing-software', shortDescription: 'GST-compliant invoicing, returns filing, and tax reports.' },
      { name: 'Inventory Management Software', slug: 'inventory-management-software', shortDescription: 'Stock tracking, reorder alerts, barcode scanning, and warehouse sync.' },
      { name: 'Warehouse Management Software', slug: 'warehouse-management-software', shortDescription: 'Put-away, picking, packing, and dispatch optimisation.' },
      { name: 'Multi-Vendor Marketplace', slug: 'multi-vendor-marketplace', shortDescription: 'Build your own marketplace with vendor onboarding and commission management.' },
      { name: 'E-Commerce Website & App', slug: 'ecommerce-website-app', shortDescription: 'Custom e-commerce stores with mobile apps and payment integration.' },
    ],
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    description:
      'Industry 4.0 solutions for production planning, quality control, and supply chain management.',
    iconName: 'Factory',
    color: 'secondary',
    products: [
      { name: 'Production ERP Software', slug: 'production-erp-software', shortDescription: 'Bill of materials, production planning, and work order management.' },
      { name: 'Supply Chain Management', slug: 'supply-chain-management', shortDescription: 'Procurement, vendor management, and logistics coordination.' },
      { name: 'Quality Control System', slug: 'quality-control-system', shortDescription: 'Inspection management, defect tracking, and compliance reporting.' },
      { name: 'Vendor Management Software', slug: 'vendor-management-software', shortDescription: 'Supplier evaluation, purchase orders, and payment tracking.' },
    ],
  },
  {
    slug: 'business-enterprise',
    name: 'Business & Enterprise',
    description:
      'Enterprise-grade software for core business operations and workforce management.',
    iconName: 'Building2',
    color: 'accent',
    products: [
      { name: 'ERP Software', slug: 'erp-software', shortDescription: 'Unified enterprise resource planning across departments.' },
      { name: 'CRM Software', slug: 'crm-software', shortDescription: 'Lead management, sales pipeline, and customer relationship tools.' },
      { name: 'HRMS Software', slug: 'hrms-software', shortDescription: 'Employee lifecycle management from hiring to exit.' },
      { name: 'Payroll Management', slug: 'payroll-management', shortDescription: 'Salary processing, tax computation, and payslip generation.' },
      { name: 'Attendance Management', slug: 'attendance-management', shortDescription: 'Biometric integration, leave management, and shift scheduling.' },
      { name: 'Helpdesk Management Software', slug: 'helpdesk-management-software', shortDescription: 'Ticket management, SLA tracking, and customer support automation.' },
    ],
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    description:
      'PropTech solutions for builders, brokers, and property management companies.',
    iconName: 'Building',
    color: 'primary',
    products: [
      { name: 'Real Estate CRM', slug: 'real-estate-crm', shortDescription: 'Lead capture, site visit scheduling, and deal closure tracking.' },
      { name: 'Property Management Software', slug: 'property-management-software', shortDescription: 'Tenant management, rent collection, and maintenance tracking.' },
      { name: 'Builder & Broker Management', slug: 'builder-broker-management', shortDescription: 'Project management, inventory tracking, and brokerage commission tools.' },
    ],
  },
  {
    slug: 'finance-nbfc',
    name: 'Finance & NBFC',
    description:
      'Fintech solutions for microfinance, lending, and accounting operations.',
    iconName: 'IndianRupee',
    color: 'secondary',
    products: [
      { name: 'Microfinance Software', slug: 'microfinance-software', shortDescription: 'Group lending, collection management, and regulatory compliance.' },
      { name: 'Loan Management Software', slug: 'loan-management-software', shortDescription: 'Loan origination, EMI calculation, disbursement, and recovery.' },
      { name: 'Accounting & GST Billing', slug: 'accounting-gst-billing', shortDescription: 'Double-entry accounting, GST filing, and financial reporting.' },
    ],
  },
  {
    slug: 'logistics-transport',
    name: 'Logistics & Transport',
    description:
      'Fleet tracking, route optimization, and transport operations management.',
    iconName: 'Truck',
    color: 'accent',
    products: [
      { name: 'Transport Management Software', slug: 'transport-management-software', shortDescription: 'Trip planning, freight billing, and driver management.' },
      { name: 'Fleet Management Software', slug: 'fleet-management-software', shortDescription: 'Vehicle tracking, maintenance scheduling, and fuel management.' },
      { name: 'Courier Management Software', slug: 'courier-management-software', shortDescription: 'Parcel tracking, delivery assignment, and proof of delivery.' },
    ],
  },
  {
    slug: 'salon-spa-fitness',
    name: 'Salon, Spa & Fitness',
    description:
      'Appointment booking, membership, and operations management for wellness businesses.',
    iconName: 'Scissors',
    color: 'primary',
    products: [
      { name: 'Salon Management Software', slug: 'salon-management-software', shortDescription: 'Appointment booking, stylist management, and billing.' },
      { name: 'Spa Management Software', slug: 'spa-management-software', shortDescription: 'Treatment scheduling, therapist allocation, and package management.' },
      { name: 'Gym Management Software', slug: 'gym-management-software', shortDescription: 'Membership plans, trainer scheduling, and workout tracking.' },
    ],
  },
  {
    slug: 'travel-tourism',
    name: 'Travel & Tourism',
    description:
      'Booking engines, itinerary planning, and travel agency management tools.',
    iconName: 'Plane',
    color: 'secondary',
    products: [
      { name: 'Travel Agency Software', slug: 'travel-agency-software', shortDescription: 'Booking management, vendor integration, and commission tracking.' },
      { name: 'Tour Package Management', slug: 'tour-package-management', shortDescription: 'Itinerary builder, pricing engine, and customer portal.' },
      { name: 'Booking Management System', slug: 'booking-management-system', shortDescription: 'Multi-channel booking, calendar sync, and payment processing.' },
    ],
  },
  {
    slug: 'ngo-membership',
    name: 'NGO & Membership',
    description:
      'Donor management, volunteer coordination, and membership tools for non-profits.',
    iconName: 'Heart',
    color: 'accent',
    products: [
      { name: 'NGO Management Software', slug: 'ngo-management-software', shortDescription: 'Project tracking, donor relations, and compliance reporting.' },
      { name: 'Donation Management System', slug: 'donation-management-system', shortDescription: 'Online donations, receipt generation, and campaign tracking.' },
      { name: 'Membership Management Software', slug: 'membership-management-software', shortDescription: 'Member registration, renewals, and event management.' },
    ],
  },
  {
    slug: 'warehouse-distribution',
    name: 'Warehouse & Distribution',
    description:
      'End-to-end warehouse operations, stock control, and barcode-driven distribution.',
    iconName: 'Warehouse',
    color: 'primary',
    products: [
      { name: 'Warehouse Management Software', slug: 'warehouse-management-software-wd', shortDescription: 'Inbound/outbound operations, bin management, and dispatch tracking.' },
      { name: 'Stock Management Software', slug: 'stock-management-software', shortDescription: 'Real-time stock levels, batch tracking, and reorder automation.' },
      { name: 'Barcode Management System', slug: 'barcode-management-system', shortDescription: 'Barcode/QR generation, scanning, and label printing.' },
    ],
  },
];
