import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      <Header />
      <main className="flex-1 pt-16 lg:pt-[72px]">{children}</main>
      <Footer />
    </>
  );
}
