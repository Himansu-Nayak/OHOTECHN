import Link from 'next/link';
import { 
  ArrowRight, 
  Home, 
  Layers, 
  FolderGit2, 
  Workflow, 
  Building2, 
  Mail, 
  Terminal, 
  Compass,
  Sparkles
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: '404 - Route Not Resolved | OHO TECH',
  description: 'The requested page could not be located in the OHO TECH architecture directory.',
};

export default function NotFound() {
  const recoveryLinks = [
    { title: 'Homepage', href: '/', description: 'Return to the main OHO TECH experience', icon: Home },
    { title: 'Core Services', href: '/services', description: 'Explore our 15 engineering & digital services', icon: Layers },
    { title: 'Selected Work', href: '/work', description: 'Inspect verified enterprise case studies', icon: FolderGit2 },
    { title: 'Technology Stack', href: '/technology', description: 'Deep-dive into our architecture runtimes', icon: Workflow },
    { title: 'About OHO TECH', href: '/about', description: 'Our engineering philosophy and leadership', icon: Building2 },
    { title: 'Contact Leadership', href: '/contact', description: 'Initiate a technical project inquiry', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#07080c] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Top Header */}
      <Header />

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/3 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-rose-500/5 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-500/5 rounded-full blur-[200px] pointer-events-none" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" 
      />

      {/* Main 404 Content Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-44 pb-20 w-full flex-grow flex flex-col justify-center">
        
        {/* Terminal Header Bar */}
        <div className="mb-8 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5" />
          <span>STATUS 404 // ROUTE_NOT_RESOLVED</span>
        </div>

        {/* Big Glitch/Display 404 Number */}
        <div className="mb-6">
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase leading-none font-mono">
            404<span className="text-emerald-400">.</span>
          </h1>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-4 uppercase">
            Destination Outside Active Topology
          </h2>
          <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed mt-4 max-w-2xl">
            The route you requested does not exist in the OHO TECH routing directory or may have been relocated. Use the navigation matrix below to recover your session.
          </p>
        </div>

        {/* Recovery Matrix Navigation Grid */}
        <div className="mt-8 mb-12">
          <div className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>TOPOLOGY RECOVERY DIRECTORY</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recoveryLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="p-5 rounded-2xl bg-[#111216]/90 border border-white/10 hover:border-emerald-500/50 hover:bg-[#15171d] transition-all duration-200 group block"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-mono">
                    {item.description}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick CTA Actions */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center gap-2"
          >
            <span>Return to Homepage</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/contact"
            className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Contact Support &amp; Leadership
          </Link>
        </div>

      </main>

      {/* Bottom Footer */}
      <Footer />
    </div>
  );
}
