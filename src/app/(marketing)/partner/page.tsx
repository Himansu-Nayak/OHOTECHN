import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Partner With Us | OHO TECH',
  description: 'Join the OHO TECH partner ecosystem and grow your business with our software solutions.',
};

const partnerTypes = [
  {
    name: 'Reseller Partner',
    description: 'Sell OHO TECH products to your clients and earn recurring commissions. Ideal for software vendors, IT consultants, and B2B service providers.',
    benefits: [
      'Up to 30% recurring commission',
      'White-label options available',
      'Dedicated account manager',
      'Co-branded marketing materials'
    ]
  },
  {
    name: 'Agency Partner',
    description: 'Use our platforms to deliver better results for your clients. Perfect for marketing agencies, design studios, and creative firms.',
    benefits: [
      'Agency pricing tier',
      'Centralized client management',
      'Priority technical support',
      'Partner directory listing'
    ]
  },
  {
    name: 'Developer Partner',
    description: 'Build integrations and custom apps on top of OHO TECH platforms. Great for freelance developers and software development shops.',
    benefits: [
      'Early access to APIs',
      'Revenue share on marketplace apps',
      'Developer sandbox environment',
      'Technical enablement sessions'
    ]
  }
];

export default async function PartnerPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate pt-24 lg:pt-32 pb-20 bg-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Partner With OHO TECH
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-300 max-w-2xl mx-auto">
            Join our ecosystem of partners. Whether you want to resell our software, use it for your clients, or build on our APIs, we have a program for you.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/contact"
              className="rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
              id="partner-hero-cta"
            >
              Apply to Become a Partner
            </Link>
          </div>
        </div>
      </div>

      {/* Partner Types */}
      <div className="py-20 lg:py-28 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Choose Your Partner Path
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            We offer flexible partnership models designed to align with your business goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partnerTypes.map((type, index) => (
            <div key={index} className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 flex flex-col h-full hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">{type.name}</h3>
              <p className="text-neutral-600 mb-8 flex-grow">{type.description}</p>
              <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">Key Benefits</h4>
              <ul className="space-y-3">
                {type.benefits.map((benefit, i) => (
                  <li key={i} className="flex gap-x-3 text-neutral-600 text-sm">
                    <svg className="h-5 w-5 flex-none text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Benefits */}
      <div className="bg-primary/5 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-6">
                Why partner with us?
              </h2>
              <p className="text-lg text-neutral-600 mb-8">
                We believe in mutual growth. Our partner program provides you with the resources, support, and financial incentives you need to succeed.
              </p>
              
              <dl className="space-y-6">
                <div>
                  <dt className="font-semibold text-neutral-900 text-lg">Revenue Sharing</dt>
                  <dd className="mt-1 text-neutral-600">Industry-leading commission rates and revenue share models.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-neutral-900 text-lg">Marketing Support</dt>
                  <dd className="mt-1 text-neutral-600">Access to a library of marketing assets, co-branded campaigns, and MDF funds for top tiers.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-neutral-900 text-lg">Priority Support</dt>
                  <dd className="mt-1 text-neutral-600">Direct line to our partner engineering and support teams to resolve issues faster.</dd>
                </div>
                <div>
                  <dt className="font-semibold text-neutral-900 text-lg">Training & Enablement</dt>
                  <dd className="mt-1 text-neutral-600">Comprehensive onboarding, sales training, and technical certifications.</dd>
                </div>
              </dl>
            </div>
            
            <div className="bg-white p-10 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">Ready to get started?</h3>
              <p className="text-neutral-600 mb-8">
                Fill out our partner application form and our team will be in touch within 48 hours to discuss next steps.
              </p>
              <Link
                href="/contact"
                className="block w-full text-center rounded-lg bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
                id="partner-bottom-cta"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
