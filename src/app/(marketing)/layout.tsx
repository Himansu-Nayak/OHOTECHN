import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MobileStickyCTA } from '@/components/layout/MobileStickyCTA';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16 lg:pt-[72px]">{children}</main>
      <Footer />
      <MobileStickyCTA />
    </>
  );
}
