export type DemoAccount = {
  role: string;
  url?: string;
  username?: string;
  email?: string;
  password?: string;
};

export type SoftwareDemo = {
  id: number;
  title: string;
  slug: string;
  category: 'education' | 'healthcare' | 'erp' | 'real-estate' | 'retail' | 'ecommerce' | 'services' | 'finance';
  description: string;
  frontendUrl?: string;
  mainDemoUrl?: string;
  accounts: DemoAccount[];
  features: string[];
  badgeColor: 'emerald' | 'amber' | 'sky' | 'indigo' | 'rose' | 'teal';
  imagePlaceholder?: string;
};

export const softwareDemos: SoftwareDemo[] = [
  {
    id: 1,
    title: 'School Management Software',
    slug: 'school-management-software',
    category: 'education',
    description: 'Complete K-12 school administration, student attendance, fees management, report cards, and parent portal.',
    frontendUrl: 'https://dpsbelamegh.com/',
    accounts: [
      { role: 'Admin Login', url: 'https://dpsbelamegh.com/site/login', email: 'admin@gmail.com', password: '123456' },
      { role: 'Student Login', url: 'https://dpsbelamegh.com/site/userlogin', email: 'std176', password: 'nn9yrg' },
    ],
    features: ['Student & Teacher Portal', 'Automated Fee Receipts', 'Exam & Marks Card Engine', 'Parent SMS Alerts'],
    badgeColor: 'sky',
  },
  {
    id: 2,
    title: 'University Management Software',
    slug: 'university-management-software',
    category: 'education',
    description: 'Multi-department university ERP with course catalog, semester registration, examination module, and student portals.',
    accounts: [
      { role: 'Admin Login', url: 'https://university.whitevelvetevents.in/admin/login', email: 'admin@mail.com', password: 'admin1234' },
      { role: 'Student Login', url: 'https://university.whitevelvetevents.in/student/login', email: 'student@mail.com', password: 'student1234' },
    ],
    features: ['Multi-Campus ERP', 'Semester Exam Module', 'Course Registration', 'Faculty Dashboard'],
    badgeColor: 'indigo',
  },
  {
    id: 3,
    title: 'Hospital Management Software (HMS)',
    slug: 'hospital-management-software',
    category: 'healthcare',
    description: 'Comprehensive hospital ERP covering OPD/IPD, EMR, Doctor schedules, Pharmacy, Diagnostic Lab, and Billing.',
    mainDemoUrl: 'https://hospitalms.whitevelvetevents.in/',
    accounts: [
      { role: 'Admin Login', url: 'https://hospitalms.whitevelvetevents.in/', email: 'admin@hms.com', password: '12345678' },
      { role: 'Doctor / Nurse / Lab / Pharmacy', url: 'https://hospitalms.whitevelvetevents.in/', email: 'Select Role at Login', password: 'Available in Demo' },
    ],
    features: ['OPD & IPD Management', 'Electronic Medical Records (EMR)', 'Pharmacy & Lab Integration', 'Multi-Role Access'],
    badgeColor: 'emerald',
  },
  {
    id: 4,
    title: 'HR & Payroll Management Software',
    slug: 'hr-payroll-management-software',
    category: 'erp',
    description: 'End-to-end employee HRMS with attendance tracking, automated salary slips, leave management, and tax deductions.',
    mainDemoUrl: 'https://wagewise.flyfusion.co.in/',
    accounts: [
      { role: 'Company Admin', url: 'https://wagewise.flyfusion.co.in/', email: 'company@example.com', password: '1234' },
      { role: 'HR Manager', url: 'https://wagewise.flyfusion.co.in/', email: 'hr@example.com', password: '1234' },
    ],
    features: ['Automated Payslip Generator', 'Attendance & Leave Sync', 'PF & Tax Calculation', 'Employee Self-Service'],
    badgeColor: 'amber',
  },
  {
    id: 5,
    title: 'Real Estate / Property Booking Software',
    slug: 'real-estate-property-booking',
    category: 'real-estate',
    description: 'Property listing portal with interactive unit booking, installment plans, lead management, and agent commission tracking.',
    frontendUrl: 'https://realestate.backbenchers.org.in/',
    accounts: [
      { role: 'Admin Panel', url: 'https://realestate.backbenchers.org.in/admin', username: 'admin', password: 'admin' },
    ],
    features: ['Property Booking Engine', 'Installment Schedule Tracker', 'Lead Management CRM', 'Broker Commission'],
    badgeColor: 'rose',
  },
  {
    id: 6,
    title: 'Property Accounts Management Software',
    slug: 'property-accounts-management',
    category: 'real-estate',
    description: 'Specialized accounting software for property managers, tenant rent collection, maintenance bills, and building ledgers.',
    mainDemoUrl: 'http://demo.erealestate.eaccount.xyz/',
    accounts: [
      { role: 'Admin Login', url: 'http://demo.erealestate.eaccount.xyz/', email: 'admin@eaccount.xyz', password: '1234' },
    ],
    features: ['Tenant Rent Invoicing', 'Maintenance Expense Ledger', 'Building Account Audit', 'GST Rent Filing'],
    badgeColor: 'teal',
  },
  {
    id: 7,
    title: 'Computer Training Center Management',
    slug: 'computer-training-center-management',
    category: 'education',
    description: 'Complete institute management for IT & Vocational training centers, student enrollment, course certification, and instructor schedules.',
    frontendUrl: 'https://dwarkeswariteducare.com/',
    accounts: [
      { role: 'Super Admin', email: 'admin@demo.com', password: 'admin' },
      { role: 'Organization Login', email: 'organization@demo.com', password: 'organization' },
      { role: 'Instructor Login', email: 'instructor@demo.com', password: 'instructor' },
      { role: 'Student Portal', email: 'student@demo.com', password: 'student' },
    ],
    features: ['Institute Franchise Network', 'Course Certification Engine', 'Student Batch Schedules', 'Online Exam Portal'],
    badgeColor: 'sky',
  },
  {
    id: 8,
    title: 'College Admission Management Software',
    slug: 'college-admission-management',
    category: 'education',
    description: 'Streamlined online college admissions, merit list generation, document verification, and tuition fee collection portal.',
    accounts: [
      { role: 'Admin Login', url: 'https://university.whitevelvetevents.in/admin/login', email: 'admin@mail.com', password: 'admin1234' },
      { role: 'Student Portal', url: 'https://university.whitevelvetevents.in/student/login', email: 'student@mail.com', password: 'student1234' },
    ],
    features: ['Online Merit List Generator', 'Document Verification Portal', 'Tuition Fee Gateway', 'Seat Allocation'],
    badgeColor: 'indigo',
  },
  {
    id: 9,
    title: 'Gym & Fitness Center Management Software',
    slug: 'gym-fitness-center-management',
    category: 'services',
    description: 'Membership management for gyms, fitness clubs, trainer scheduling, automated WhatsApp renewal alerts, and biometric attendance.',
    mainDemoUrl: 'https://gym.flyfusion.in/users/login',
    accounts: [
      { role: 'Admin Login', url: 'https://gym.flyfusion.in/users/login', username: 'tausif', password: '123456' },
    ],
    features: ['Membership Expiry Alerts', 'Trainer Slot Booking', 'Diet & Workout Planner', 'POS Supplement Store'],
    badgeColor: 'emerald',
  },
  {
    id: 10,
    title: 'Pathology / Diagnostic Lab Management',
    slug: 'pathology-diagnostic-lab-management',
    category: 'healthcare',
    description: 'Pathology lab software for patient registration, sample barcoding, test report generation, and online patient PDF download.',
    mainDemoUrl: 'https://pathology.whitevelvetevents.in/admin/',
    accounts: [
      { role: 'Admin Login', url: 'https://pathology.whitevelvetevents.in/admin/', username: 'admin', password: 'admin' },
    ],
    features: ['Sample Barcode Sync', 'Automated Test Reports', 'Online Report PDF Download', 'Doctor Referral Commission'],
    badgeColor: 'rose',
  },
  {
    id: 11,
    title: 'Retail POS / Billing / Inventory Software',
    slug: 'retail-pos-billing-inventory',
    category: 'retail',
    description: 'High-speed retail counter billing software with barcode scanning, stock ledger, WhatsApp receipt dispatch, and GST reports.',
    mainDemoUrl: 'https://sreedemo.whitevelvetevents.in/login',
    accounts: [
      { role: 'POS Billing Login', url: 'https://sreedemo.whitevelvetevents.in/login', username: 'hasan', password: '123456' },
    ],
    features: ['Thermal Printer & Barcode Sync', 'WhatsApp Invoice Delivery', 'Batch & Expiry Stock', 'Daily Cash Reconciliation'],
    badgeColor: 'amber',
  },
  {
    id: 12,
    title: 'Production ERP Management Software',
    slug: 'production-erp-management',
    category: 'erp',
    description: 'Factory manufacturing ERP with Bill of Materials (BOM), raw material tracking, production stage monitoring, and dispatch logging.',
    mainDemoUrl: 'https://erp.flyfusion.in/login',
    accounts: [
      { role: 'Super Admin', url: 'https://erp.flyfusion.in/login', username: 'superadmin@admin.com', password: 'superadmin@2025' },
    ],
    features: ['Bill of Materials (BOM)', 'Raw Material Inventory', 'Work Order Stage Tracking', 'Factory Quality Control'],
    badgeColor: 'teal',
  },
  {
    id: 13,
    title: 'Pharmacy Billing & Stock Management',
    slug: 'pharmacy-billing-stock-management',
    category: 'healthcare',
    description: 'Specialized chemist & pharmacy billing software with medicine substitute lookup, batch expiry alerts, and GST filing.',
    mainDemoUrl: 'https://breezdemo.whitevelvetevents.in/login',
    accounts: [
      { role: 'Pharmacy Billing', url: 'https://breezdemo.whitevelvetevents.in/login', username: 'billingsolutions', password: 'samir1975!' },
    ],
    features: ['Medicine Substitute Search', 'Batch & Expiry Alerts', 'Doctor Prescription Upload', 'GST Return Export'],
    badgeColor: 'emerald',
  },
  {
    id: 14,
    title: 'Garments & Boutique Billing Software',
    slug: 'garments-boutique-billing',
    category: 'retail',
    description: 'Fashion retail & boutique POS with size/color matrix barcode printing, tailoring status tracking, and customer loyalty rewards.',
    mainDemoUrl: 'https://sreedemo.whitevelvetevents.in/login',
    accounts: [
      { role: 'Boutique Billing', url: 'https://sreedemo.whitevelvetevents.in/login', username: 'hasan', password: '123456' },
    ],
    features: ['Size & Color Matrix', 'Custom Tailoring Orders', 'Barcode Tag Generator', 'Loyalty Discounts'],
    badgeColor: 'amber',
  },
  {
    id: 15,
    title: 'Parking Management Software',
    slug: 'parking-management-software',
    category: 'services',
    description: 'Smart parking space management with entry/exit ticket generation, RFID/number plate scanner integration, and hourly tariff billing.',
    mainDemoUrl: 'https://parking.theteachersworld.com/login',
    accounts: [
      { role: 'Admin Login', url: 'https://parking.theteachersworld.com/login', email: 'admin@gmail.com', password: '123456' },
    ],
    features: ['Thermal Receipt Entry Pass', 'Hourly & Flat Tariff Rates', 'Vehicle Type Slots', 'Daily Collection Summary'],
    badgeColor: 'sky',
  },
  {
    id: 16,
    title: 'E-Commerce Website CMS (Casa & Rubaaz)',
    slug: 'ecommerce-website-cms',
    category: 'ecommerce',
    description: 'Full-featured online store with payment gateway integration, order tracking, inventory sync, and multi-currency support.',
    frontendUrl: 'https://casa.theteachersworld.com/',
    accounts: [
      { role: 'Casa Store Admin', url: 'https://casa.theteachersworld.com/', email: 'admin@admin.com', password: '12345678' },
      { role: 'Rubaaz Store Admin', url: 'https://rubaaz.theteachersworld.com', email: 'admin@gmail.com', password: 'password' },
    ],
    features: ['Payment Gateway Integration', 'Order Status Tracking', 'Product Catalog Manager', 'Coupon Code Engine'],
    badgeColor: 'indigo',
  },
  {
    id: 17,
    title: 'Order Management & Distribution System',
    slug: 'order-management-distribution-system',
    category: 'erp',
    description: 'Supply chain order booking platform connecting manufacturers, distributors, and retail shop owners.',
    mainDemoUrl: 'https://porder.whitevelvetevents.in/',
    accounts: [
      { role: 'Admin Panel', url: 'https://porder.whitevelvetevents.in/', email: 'admin@gmail.com', password: '12345678' },
      { role: 'Distributor Portal', url: 'https://porder.whitevelvetevents.in/', email: 'mahtab@gmail.com', password: '123456789' },
      { role: 'Retailer Portal', url: 'https://porder.whitevelvetevents.in/', email: 'hasan@gmail.com', password: '123456' },
    ],
    features: ['Multi-Tier Distribution', 'Field Salesperson Booking', 'Discounts & Scheme Manager', 'Invoice Dispatch'],
    badgeColor: 'teal',
  },
  {
    id: 18,
    title: 'Job Portal Management Software',
    slug: 'job-portal-management-software',
    category: 'services',
    description: 'Online job portal platform for recruiters, employer job postings, resume submissions, and candidate screening.',
    mainDemoUrl: 'http://www.job.backbenchers.org.in/admin',
    accounts: [
      { role: 'Admin Login', url: 'http://www.job.backbenchers.org.in/admin', username: 'buyer@buyer.com', password: 'buyer123456' },
      { role: 'Job Seeker', email: 'seeker@jobsportal.com', password: 'seek123456' },
      { role: 'Employer Portal', email: 'employer@jobsportal.com', password: 'emp123456' },
    ],
    features: ['Employer Job Posting', 'Resume Parser & Search', 'Application Screening', 'Interview Scheduler'],
    badgeColor: 'rose',
  },
  {
    id: 19,
    title: 'News Portal & Media CMS',
    slug: 'news-portal-media-cms',
    category: 'services',
    description: 'High-traffic news website CMS with breaking news banners, video embedding, journalist author accounts, and ad spaces.',
    frontendUrl: 'http://rrootofly.in/demo/news/',
    accounts: [
      { role: 'CMS Admin Login', url: 'https://rrootofly.in/demo/news/admin/login', email: 'administrator@gmail.com', password: '1234' },
    ],
    features: ['Breaking News Ticker', 'Category & Author Management', 'Google AdSense Slots', 'Social Media Auto Share'],
    badgeColor: 'sky',
  },
  {
    id: 20,
    title: 'Dental Clinic Management Software',
    slug: 'dental-clinic-management',
    category: 'healthcare',
    description: 'Specialized dental EHR software with interactive tooth charting, treatment planning, appointment reminders, and billing.',
    frontendUrl: 'https://dental.theteachersworld.com/',
    accounts: [
      { role: 'Dental Admin', url: 'https://dental.theteachersworld.com/login', username: 'admin@gmail.com', password: '123456' },
    ],
    features: ['Interactive Tooth Charting', 'Dental Treatment Plan', 'SMS Appointment Reminder', 'Dental Invoice Billing'],
    badgeColor: 'emerald',
  },
  {
    id: 21,
    title: 'Company ERP Management Software',
    slug: 'company-erp-management',
    category: 'erp',
    description: 'Integrated corporate ERP covering sales orders, purchase management, double-entry accounting, inventory, and GST reports.',
    mainDemoUrl: 'https://erp.flyfusion.co.in/login',
    accounts: [
      { role: 'Company Admin', url: 'https://erp.flyfusion.co.in/login', email: 'company@example.com', password: '1234' },
      { role: 'Accountant Login', url: 'https://erp.flyfusion.co.in/login', email: 'accountant@example.com', password: '1234' },
    ],
    features: ['Double-Entry Accounting', 'Purchase & Sales Orders', 'GST Invoicing', 'Executive Financial Dashboard'],
    badgeColor: 'amber',
  },
  {
    id: 22,
    title: 'Microfinance Management Software',
    slug: 'microfinance-management-software',
    category: 'finance',
    description: 'Microfinance CRM software for Self-Help Groups (SHG), loan disbursement, daily/weekly collection tracking, and interest calculators.',
    mainDemoUrl: 'https://sunstar.theteachersworld.com/crm/dashboard',
    accounts: [
      { role: 'Super Admin', url: 'https://sunstar.theteachersworld.com/crm/dashboard', username: 'admin', password: 'admin' },
      { role: 'Branch Manager', username: 'BRANCH0001', password: 'kuchu501' },
      { role: 'Member Portal', username: 'kaleshwar27518', password: 'Anmol@123' },
    ],
    features: ['SHG Group Management', 'Daily/Weekly EMI Collection', 'Automated Interest Calculator', 'Loan Approval Workflow'],
    badgeColor: 'teal',
  },
  {
    id: 23,
    title: 'Matrimonial Website CMS (ShubVibha)',
    slug: 'matrimonial-website-cms',
    category: 'services',
    description: 'Complete matchmaking portal with profile creation, horoscope matching, privacy controls, and paid membership packages.',
    frontendUrl: 'https://shubvibha.com/',
    accounts: [
      { role: 'Admin Panel', url: 'https://shubvibha.com/admin', email: 'admin@gmail.com', password: '12345678' },
    ],
    features: ['Matchmaking Search Engine', 'Horoscope Compatibility', 'Profile Photo Privacy', 'Paid Package Upgrade'],
    badgeColor: 'rose',
  },
  {
    id: 24,
    title: 'Library Management Software',
    slug: 'library-management-software',
    category: 'education',
    description: 'Digital library management with barcode cataloging, book issuance, return tracking, overdue fine calculation, and e-books.',
    mainDemoUrl: 'https://library.newmedilife.in/',
    accounts: [
      { role: 'Library Admin', url: 'https://library.newmedilife.in/#/app/admin/login', username: 'admin@lms.com', password: 'Available in Demo' },
    ],
    features: ['Barcode Book Search', 'Issue & Return Tracker', 'Overdue Fine Calculator', 'Digital E-Book Repository'],
    badgeColor: 'sky',
  },
  {
    id: 25,
    title: 'Church Management Software',
    slug: 'church-management-software',
    category: 'services',
    description: 'Church administration platform for member directory, donation collection, event management, and volunteer scheduling.',
    mainDemoUrl: 'https://church.flyfusion.co.in/',
    accounts: [
      { role: 'Admin Login', url: 'https://church.flyfusion.co.in/access/login', email: 'admin@site.com', password: '123456' },
    ],
    features: ['Member Directory', 'Donation Receipt Generator', 'Service & Event Planner', 'SMS Broadcasts'],
    badgeColor: 'indigo',
  },
  {
    id: 26,
    title: 'Transport & Fleet Management Software',
    slug: 'transport-fleet-management',
    category: 'services',
    description: 'Vehicle booking and fleet management with trip scheduling, driver assignment, fuel consumption logging, and maintenance alerts.',
    mainDemoUrl: 'https://backbenchers.org.in/vehiclebook/',
    accounts: [
      { role: 'Fleet Admin', url: 'https://backbenchers.org.in/vehiclebook/', email: 'admin@gmail.com', password: 'admin@2020' },
    ],
    features: ['Vehicle Booking Scheduler', 'Driver Duty Assignment', 'Fuel & Expense Tracker', 'Vehicle Maintenance Alerts'],
    badgeColor: 'teal',
  },
  {
    id: 27,
    title: 'Salon Management Software',
    slug: 'salon-management-software',
    category: 'services',
    description: 'Beauty salon & spa management with appointment booking, stylist commission tracking, service package billing, and SMS reminders.',
    mainDemoUrl: 'https://salon.flyfusion.co.in',
    accounts: [
      { role: 'Admin Panel', url: 'https://salon.flyfusion.co.in/admin', username: 'admin', password: 'admin' },
    ],
    features: ['Stylist Appointment Booking', 'Service Package Invoicing', 'Stylist Commission Tracker', 'WhatsApp Appointment Alert'],
    badgeColor: 'amber',
  },
  {
    id: 28,
    title: 'Hostel Management Software',
    slug: 'hostel-management-software',
    category: 'education',
    description: 'Hostel accommodation software for room allocation, mess management, gate pass logging, and monthly hostel fee receipts.',
    mainDemoUrl: 'https://hostel.flyfusion.co.in/login',
    accounts: [
      { role: 'Hostel Warden / Admin', url: 'https://hostel.flyfusion.co.in/login', username: 'admin@gmail.com', password: '123456' },
    ],
    features: ['Room & Bed Allocation', 'Mess Fee & Menu Management', 'Student Gate Pass Logger', 'Monthly Fee Receipts'],
    badgeColor: 'indigo',
  },
];
