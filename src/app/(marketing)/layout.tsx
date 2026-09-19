import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PageTransition } from '@/components/ui/PageTransition';
import { AIChatWidget } from '@/components/ai/AIChatWidget';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 pt-16 lg:pt-[72px] outline-none">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <AIChatWidget />
    </>
  );
}
