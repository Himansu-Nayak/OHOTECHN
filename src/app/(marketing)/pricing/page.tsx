import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing | OHO TECH',
  description: 'Flexible pricing plans for our software products and services.',
};

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    price: '₹9,999/mo',
    description: 'Perfect for small businesses getting started with digital transformation.',
    features: [
      'Core software features',
      'Up to 5 users',
      'Basic reporting',
      'Email support',
      'Standard integrations',
    ],
    cta: 'Start Free Trial',
    href: '/book-demo',
    mostPopular: false,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    price: '₹24,999/mo',
    description: 'Ideal for growing companies needing advanced capabilities and scale.',
    features: [
      'Everything in Starter',
      'Up to 25 users',
      'Advanced analytics',
      'Priority email & phone support',
      'Custom integrations',
      'API access',
    ],
    cta: 'Get Started',
    href: '/book-demo',
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    price: 'Custom',
    description: 'Tailored solutions for large organizations with complex requirements.',
    features: [
      'Everything in Professional',
      'Unlimited users',
      'Custom reporting & BI',
      '24/7 dedicated support',
      'On-premise deployment option',
      'SLA guarantee',
      'Dedicated success manager',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    mostPopular: false,
  },
];

const faqs = [
  {
    question: 'Are custom development services included in these plans?',
    answer: 'No, these plans are for our standard software products. Custom development and digital marketing services are quoted separately per project. Visit our Get a Quote page for more details.',
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Prorated charges will be applied to your next billing cycle.',
  },
  {
    question: 'Is there a long-term contract?',
    answer: 'Our standard plans are billed month-to-month or annually. Annual plans come with a significant discount. Enterprise plans typically require a minimum 12-month commitment.',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes, we offer a 14-day free trial for our Starter and Professional plans so you can evaluate our software before committing.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, UPI, and bank transfers for annual subscriptions.',
  },
];

export default async function PricingPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="pt-20 pb-16 text-center lg:pt-28 lg:pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg leading-8 text-neutral-600">
          Choose the plan that best fits your business needs. Custom development and digital marketing services are quoted per project.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-20 lg:pb-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-center">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-3xl p-8 ring-1 ${
                tier.mostPopular
                  ? 'bg-neutral-900 ring-neutral-900 text-white lg:scale-105 z-10'
                  : 'bg-white ring-neutral-200 text-neutral-900'
              } shadow-xl`}
            >
              <h3
                id={tier.id}
                className={`text-lg font-semibold leading-8 ${
                  tier.mostPopular ? 'text-white' : 'text-primary'
                }`}
              >
                {tier.name}
              </h3>
              {tier.mostPopular && (
                <p className="mt-2 text-sm font-semibold text-primary">Most Popular</p>
              )}
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
              </p>
              <p className={`mt-4 text-sm leading-6 ${tier.mostPopular ? 'text-neutral-300' : 'text-neutral-600'}`}>
                {tier.description}
              </p>
              <ul className="mt-8 space-y-3 text-sm leading-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <svg
                      className={`h-6 w-5 flex-none ${tier.mostPopular ? 'text-primary' : 'text-primary'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={tier.mostPopular ? 'text-neutral-300' : 'text-neutral-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`mt-8 block rounded-lg px-3 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.mostPopular
                    ? 'bg-primary text-white hover:bg-primary/90 focus-visible:outline-primary'
                    : 'bg-primary/10 text-primary hover:bg-primary/20 focus-visible:outline-primary'
                }`}
                id={`btn-${tier.id}`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-neutral-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl divide-y divide-neutral-900/10">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-neutral-900 text-center mb-10">
              Frequently asked questions
            </h2>
            <dl className="mt-10 space-y-6 divide-y divide-neutral-900/10">
              {faqs.map((faq, index) => (
                <div key={index} className="pt-6">
                  <dt>
                    <span className="font-semibold text-neutral-900">{faq.question}</span>
                  </dt>
                  <dd className="mt-2">
                    <p className="text-base leading-7 text-neutral-600">{faq.answer}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
