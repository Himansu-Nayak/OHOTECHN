'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, ShoppingBag, Check, ShieldCheck, Sparkles, 
  AlertCircle, Plus, Minus, CreditCard, ChevronRight, Zap, CheckCircle2, 
  PhoneCall, Key, Repeat, Eye, Server, Database, Cpu, Layers, Lock, 
  FileCode, ChevronDown, ChevronUp, ExternalLink, HelpCircle, Terminal, 
  Headphones, BookOpen, Clock, Smartphone, Monitor, HardDrive
} from 'lucide-react';
import { getProductByIdApi } from '@/api/products';
import { getProductPlansApi } from '@/api/plans';
import { startFreeTrialApi } from '@/api/subscriptions';
import { ProductDto, ProductPlanDto } from '@/api/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { softwareDemos } from '@/config/demos';
import { ProductQuickViewModal, isValidLiveDemoUrl } from '@/components/products/ProductQuickViewModal';
import { Product } from '@/config/industries';
import { formatInr } from '@/utils/cartUtils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = React.useState<ProductDto | null>(null);
  const [plans, setPlans] = React.useState<ProductPlanDto[]>([]);
  const [selectedPlan, setSelectedPlan] = React.useState<ProductPlanDto | null>(null);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [quantity, setQuantity] = React.useState<number>(1);
  const [isProcessingTrial, setIsProcessingTrial] = React.useState<boolean>(false);

  // Tab & Interactive State (5 authoritative product tabs)
  const [activeTab, setActiveTab] = React.useState<'overview' | 'modules' | 'security' | 'deployment' | 'requirements'>('overview');
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0);
  const [activeQuickViewProduct, setActiveQuickViewProduct] = React.useState<Product | null>(null);

  const productId = params?.id as string;

  React.useEffect(() => {
    if (!productId) return;

    async function fetchDetailsAndPlans() {
      setLoading(true);
      setError(null);
      try {
        const [prodRes, plansRes] = await Promise.all([
          getProductByIdApi(productId),
          getProductPlansApi(productId).catch(() => ({ success: false, data: [] })),
        ]);

        if (prodRes.success && prodRes.data) {
          setProduct(prodRes.data);
        } else {
          throw new Error(prodRes.message || 'Product not found.');
        }

        if (plansRes.success && plansRes.data && plansRes.data.length > 0) {
          setPlans(plansRes.data);
          // Default to yearly/recommended plan if available, else first plan
          const defaultPlan = plansRes.data.find(p => p.billingType === 'YEARLY') || plansRes.data[0];
          setSelectedPlan(defaultPlan);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    }

    fetchDetailsAndPlans();
  }, [productId]);

  // Find matching software demo if available
  const matchedDemo = React.useMemo(() => {
    if (!product) return null;
    return softwareDemos.find(
      (d) =>
        d.id === product.id ||
        d.title.toLowerCase().trim() === product.name.toLowerCase().trim() ||
        product.name.toLowerCase().includes(d.title.toLowerCase()) ||
        d.title.toLowerCase().includes(product.name.toLowerCase())
    );
  }, [product]);

  const handleOpenLiveDemo = () => {
    if (!product) return;
    const rawDemoUrl = matchedDemo?.mainDemoUrl || matchedDemo?.frontendUrl || matchedDemo?.accounts?.[0]?.url;
    const validDemoUrl = isValidLiveDemoUrl(rawDemoUrl) ? rawDemoUrl : undefined;

    const prodObj: Product = {
      id: product.id,
      name: product.name,
      slug: matchedDemo?.slug || `prod-${product.id}`,
      shortDescription: product.description,
      demoUrl: validDemoUrl,
      features: matchedDemo?.features || [
        'Single-Tenant Cloud Database',
        'Cryptographic Key Licensing',
        'Role-Based Access Control',
        'GST & Invoicing Suite',
      ],
      adminCredentials: {
        email: matchedDemo?.accounts?.[0]?.email || 'admin@demo.ohotech.com',
        password: matchedDemo?.accounts?.[0]?.password || 'Admin@12345',
      },
    };

    setActiveQuickViewProduct(prodObj);
  };

  const handleStartFreeTrial = async () => {
    if (!user) {
      showToast('Please log in to activate your free trial.', 'info');
      router.push('/login');
      return;
    }
    if (!product) return;

    setIsProcessingTrial(true);
    try {
      const res = await startFreeTrialApi(product.id);
      if (res.success) {
        showToast('Your software access is ready! Free trial activated.', 'success');
        router.push('/my-products');
      } else {
        throw new Error(res.message || 'Could not start free trial.');
      }
    } catch (err: any) {
      showToast(err.message || 'Free trial activation failed.', 'error');
    } finally {
      setIsProcessingTrial(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity, selectedPlan?.id);
  };

  const handleBuyNow = async () => {
    if (!user) {
      showToast('Please log in to purchase a software plan.', 'info');
      router.push('/login');
      return;
    }
    if (!product) return;
    await addToCart(product.id, quantity, selectedPlan?.id);
    router.push('/checkout');
  };

  const activePrice = selectedPlan ? selectedPlan.price : (product?.price || 0);
  const priceFormatted = formatInr(activePrice * quantity);

  const faqs = [
    {
      q: 'Can we deploy this software on our own private VPS or AWS / Hostinger cloud?',
      a: 'Yes. All OHO TECH commercial licenses and enterprise packages include single-tenant deployment packages with Docker Compose files, PostgreSQL migration scripts, and Nginx reverse proxy configurations.'
    },
    {
      q: 'How does cryptographic hardware licensing work?',
      a: 'Upon order confirmation, an authoritative license key (OHO-XXXX-XXXX-XXXX) is issued to your account. When the software boots on your server or desktop, it performs an activation handshake verifying your licensed seat limit.'
    },
    {
      q: 'Can OHO TECH engineers build custom modules or integrate our legacy APIs?',
      a: 'Absolutely. We offer tailored engineering sprints, third-party ERP/CRM integrations, custom payment gateway adapters, and dedicated SLA contracts through our Engineering Desk.'
    },
    {
      q: 'What is included in the perpetual full ownership package?',
      a: 'Perpetual Commercial Licenses provide lifetime production usage rights, complete source code access (frontend and backend), automated database schema migrations, and 12 months of standard SLA maintenance.'
    }
  ];

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-6xl w-full mx-auto" id="product-detail-main">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
          <Link href="/products" className="hover:text-sky-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-800 font-bold truncate max-w-xs">{product?.name || 'Product Details'}</span>
        </div>

        {loading ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-8 sm:p-12 animate-pulse space-y-6">
            <div className="h-8 bg-slate-100 rounded-xl w-1/3" />
            <div className="h-12 bg-slate-100 rounded-xl w-2/3" />
            <div className="h-32 bg-slate-50 rounded-2xl border border-slate-100" />
          </div>
        ) : error || !product ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-8">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">Product Not Found</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">{error || 'The requested product could not be located.'}</p>
            <Link href="/products" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block">
              Back to Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Main Product Header Card */}
            <div className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Column: Info */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-block text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider">
                        {product.serviceType || product.categoryName || 'Enterprise Software'}
                      </span>
                      {matchedDemo && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Live Demo Available
                        </span>
                      )}
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight mb-4">
                      {product.name}
                    </h1>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {product.description}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Turnkey Software Capabilities</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Cryptographic Key Licensing (`OHO-XXXX`)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Hardware ID Device Activation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Multi-Platform Installers (Win/Mac/Linux)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>24/7 Priority SLA &amp; Support</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <ShieldCheck className="w-4 h-4" /> Verified Quality Guarantee
                    </div>
                    <div>• SKU: PROD-0{product.id}</div>
                    
                    {/* Live Demo Trigger */}
                    {matchedDemo && (
                      <button
                        type="button"
                        onClick={handleOpenLiveDemo}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white hover:bg-sky-600 text-xs font-mono font-bold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Test-Drive Live Demo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column: Active Selected Plan Summary */}
                <div className="lg:col-span-5 bg-[#fafafa] border-2 border-slate-200 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Selected Plan ({selectedPlan?.name || 'Base License'})
                    </div>
                    <div className="text-3xl font-black text-[#0d0d0e] mb-1">
                      {selectedPlan?.billingType === 'FREE_TRIAL' ? 'FREE' : priceFormatted}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {selectedPlan?.description || 'Includes cloud license, automated updates & standard support.'}
                    </div>

                    {/* Quantity Selector for Paid Plans */}
                    {selectedPlan?.billingType !== 'FREE_TRIAL' && selectedPlan?.billingType !== 'ENTERPRISE' && (
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-3">
                          Quantity / Licenses
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="w-10 h-10 rounded-2xl bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:border-slate-400"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center text-base font-extrabold text-[#0d0d0e]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity((q) => q + 1)}
                            className="w-10 h-10 rounded-2xl bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:border-slate-400"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions based on selected plan */}
                  <div className="space-y-3 pt-6 border-t border-slate-200">
                    {selectedPlan?.billingType === 'FREE_TRIAL' ? (
                      <button
                        onClick={handleStartFreeTrial}
                        disabled={isProcessingTrial}
                        className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{isProcessingTrial ? 'Activating Trial...' : 'Start Free Trial Now'}</span>
                      </button>
                    ) : selectedPlan?.billingType === 'ENTERPRISE' ? (
                      <Link
                        href="/contact"
                        className="w-full py-4 px-6 rounded-2xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 text-center block"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>Contact Enterprise Sales</span>
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={handleAddToCart}
                          disabled={cartLoading}
                          className="w-full py-3.5 px-6 rounded-2xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add Plan to Cart</span>
                        </button>
                        <button
                          onClick={handleBuyNow}
                          disabled={cartLoading}
                          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Zap className="w-4 h-4" />
                          <span>Buy Now &amp; Checkout</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* SELECT PLAN SECTION */}
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-600 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> SELECT YOUR PREFERRED PLAN
                  </div>
                  <h2 className="text-2xl font-black text-[#0d0d0e]">Available Product &amp; License Plans</h2>
                </div>
                <p className="text-xs text-slate-500 font-mono">Choose a trial, subscription, or perpetual lifetime license.</p>
              </div>

              {plans.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Standard Commercial Perpetual License */}
                  <div className="md:col-span-2 p-6 sm:p-8 rounded-[28px] border-2 border-slate-200 bg-[#fafafa] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                          Commercial Perpetual License
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider">
                          Full Package
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-[#0d0d0e] mb-2">{product.name} — Full Ownership</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">
                        Complete turnkey software license delivered with production source code access, automated database migration scripts, single-tenant cloud deployment support, and 12-month SLA maintenance.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-700 mb-6">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Lifetime perpetual usage rights</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Complete backend &amp; frontend source code</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Automated Docker &amp; Cloud scripts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Priority technical support &amp; updates</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">One-time Investment</div>
                        <div className="text-2xl font-black text-[#0d0d0e]">
                          {formatInr(product.price || 35000)}
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold font-mono border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Default Catalog Plan Included
                      </div>
                    </div>
                  </div>

                  {/* Enterprise Customization & SLA Option */}
                  <div className="p-6 rounded-[28px] border-2 border-slate-200 bg-white flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 inline-block mb-3">
                        Enterprise Customization
                      </div>
                      <h4 className="text-base font-extrabold text-[#0d0d0e] mb-2">Need Custom Features or Dedicated Hosting?</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        We provide custom branding, third-party API integrations, dedicated VPS orchestration, and tailored SLA agreements for enterprise teams.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <Link
                        href={`/get-quote?product=${encodeURIComponent(product.name)}`}
                        className="w-full py-3 rounded-full bg-[#0d0d0e] hover:bg-sky-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors text-center flex items-center justify-center gap-1.5 shadow-sm block"
                      >
                        <span>Request Custom SLA</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {plans.map((plan) => {
                    const isSelected = selectedPlan?.id === plan.id;
                    const isTrial = plan.billingType === 'FREE_TRIAL';

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-6 rounded-[28px] border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                          isSelected
                            ? 'bg-[#0d0d0e] text-white border-[#0d0d0e] shadow-lg scale-[1.02]'
                            : 'bg-[#fafafa] text-[#0d0d0e] border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {plan.billingType === 'YEARLY' && (
                          <span className="absolute top-3 right-3 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider">
                            Recommended
                          </span>
                        )}

                        <div>
                          <div className={`text-xs font-mono font-bold uppercase tracking-wider mb-2 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`}>
                            {plan.billingType}
                          </div>

                          <h3 className="text-lg font-black mb-1">{plan.name}</h3>
                          <p className={`text-xs leading-normal mb-4 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                            {plan.description}
                          </p>
                        </div>

                        <div>
                          <div className="text-2xl font-black mb-2">
                            {isTrial ? 'FREE' : formatInr(plan.price)}
                          </div>

                          <div className={`text-[11px] font-mono mb-4 space-y-1 ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                            <div>• Duration: {plan.durationDays || 30} Days</div>
                            <div>• Device Limit: {plan.activationLimit || 1} Device(s)</div>
                            {isTrial && <div>• Trial Days: {plan.trialDays || 14} Days</div>}
                          </div>

                          <button
                            type="button"
                            className={`w-full py-2.5 rounded-full font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isSelected ? 'Selected Plan' : 'Select Plan'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* INTERACTIVE SPECIFICATIONS & TECHNICAL ARCHITECTURE TABS */}
            <div className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-sm">
              
              {/* Tab Navigation Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-200 mb-8 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-[#0d0d0e] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Overview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('modules')}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'modules'
                      ? 'bg-[#0d0d0e] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  <span>Core Modules</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('security')}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'security'
                      ? 'bg-[#0d0d0e] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Security &amp; Licensing</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('deployment')}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'deployment'
                      ? 'bg-[#0d0d0e] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Server className="w-3.5 h-3.5 text-sky-400" />
                  <span>Deployment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('requirements')}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    activeTab === 'requirements'
                      ? 'bg-[#0d0d0e] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>System Requirements</span>
                </button>
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="max-w-3xl">
                    <h3 className="text-xl font-black text-[#0d0d0e] mb-2">{product.name} — Architecture Overview</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {product.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-black text-[#0d0d0e] mb-1">Single-Tenant Isolation</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Dedicated database schemas and isolated service runtime guaranteeing complete enterprise data sovereignty.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                        <Key className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-black text-[#0d0d0e] mb-1">Zero Royalty Lock-In</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Commercial perpetual licenses grant permanent ownership of code and assets on your infrastructure without forced recurring fees.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-black text-[#0d0d0e] mb-1">High-Throughput Core</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Optimized database indexing and caching layers deliver sub-second response times under concurrent multi-user load.
                      </p>
                    </div>
                  </div>

                  {matchedDemo && (
                    <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Eye className="w-6 h-6 text-emerald-600 shrink-0" />
                        <div>
                          <div className="text-xs font-black text-[#0d0d0e]">Interactive Live Demo Ready</div>
                          <div className="text-[11px] text-slate-500">Test-drive the administrator, staff, and customer portals with verified demo accounts.</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenLiveDemo}
                        className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shrink-0 text-center cursor-pointer shadow-xs"
                      >
                        Launch Interactive Demo
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Core Modules */}
              {activeTab === 'modules' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="max-w-2xl">
                    <h3 className="text-xl font-black text-[#0d0d0e] mb-2">Turnkey Modules &amp; Subsystems</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Every module is tested for interoperability, automated billing integration, and audit trail compliance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-sky-600 shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#0d0d0e] mb-1">Multi-Role RBAC &amp; Auth</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Preconfigured roles for Admin, Staff, Student/Patient/Client, and Finance Auditor with granular endpoint permissions.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-600 shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#0d0d0e] mb-1">Automated Invoicing &amp; GST</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Built-in UPI QR generation, bank reference UTR verification, and PDF tax invoice generation with company branding.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-purple-600 shrink-0">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#0d0d0e] mb-1">Cryptographic License Gate</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Machine ID hardware fingerprinting preventing unauthorized distribution while allowing one-click device seat reassignments.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-amber-600 shrink-0">
                        <Headphones className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#0d0d0e] mb-1">Support Desk &amp; SLA Tracking</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Direct communication channel connecting customers with engineering staff, tracked by strict response SLAs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Security & Licensing */}
              {activeTab === 'security' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="max-w-2xl">
                    <h3 className="text-xl font-black text-[#0d0d0e] mb-2">Cryptographic Licensing &amp; Security Controls</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Rigorous node-locking algorithms and commercial protections designed for enterprise compliance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200">
                      <div className="font-mono font-bold text-sky-600 uppercase tracking-wider mb-2">Hardware-Bound Protection</div>
                      <h4 className="text-sm font-black text-[#0d0d0e] mb-2">Machine ID Fingerprinting</h4>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Authoritative `OHO-XXXX-XXXX-XXXX` license verification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Hardware ID hashing prevents unauthorized clone deployment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Customer portal self-service device activation &amp; deactivation</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200">
                      <div className="font-mono font-bold text-emerald-600 uppercase tracking-wider mb-2">Data Protection</div>
                      <h4 className="text-sm font-black text-[#0d0d0e] mb-2">Enterprise Encryption Standards</h4>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>TLS 1.3 encrypted transport for all API and WebSocket endpoints</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>AES-256 encryption at rest for database credentials &amp; tokens</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>Granular Spring Security filters with BCrypt password hashing</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Deployment */}
              {activeTab === 'deployment' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="max-w-2xl">
                    <h3 className="text-xl font-black text-[#0d0d0e] mb-2">Production Deployment Architecture</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Turnkey deployment templates compatible with leading cloud and on-premise infrastructure.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-slate-900 mb-1">Docker Compose</div>
                      <p className="text-[11px] text-slate-500 font-sans mb-3">Multi-container setup with automated networking and volume management.</p>
                      <div className="p-2 rounded-lg bg-slate-900 text-emerald-400 text-[10px]">
                        docker compose up -d
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                        <Database className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-slate-900 mb-1">Database Migrations</div>
                      <p className="text-[11px] text-slate-500 font-sans mb-3">Automated Flyway version-controlled database schema generation.</p>
                      <div className="p-2 rounded-lg bg-slate-900 text-purple-300 text-[10px]">
                        PostgreSQL 16 Relational
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                        <Server className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-slate-900 mb-1">Nginx Reverse Proxy</div>
                      <p className="text-[11px] text-slate-500 font-sans mb-3">Automatic SSL certificate issuance with Let's Encrypt integration.</p>
                      <div className="p-2 rounded-lg bg-slate-900 text-sky-300 text-[10px]">
                        SSL/TLS Port 443
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: System Requirements */}
              {activeTab === 'requirements' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="max-w-2xl">
                    <h3 className="text-xl font-black text-[#0d0d0e] mb-2">System &amp; Hardware Requirements</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Minimum and recommended specifications for reliable production operation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200">
                      <div className="font-mono font-bold text-sky-600 uppercase tracking-wider mb-2">Server Environment</div>
                      <h4 className="text-sm font-black text-[#0d0d0e] mb-3">Host Specifications</h4>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="font-medium text-slate-500">Operating System</span>
                          <span className="font-bold text-slate-900 font-mono">Ubuntu 22.04 LTS / Debian 12</span>
                        </li>
                        <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="font-medium text-slate-500">CPU Compute</span>
                          <span className="font-bold text-slate-900 font-mono">2 vCPU (Min) / 4 vCPU (Rec)</span>
                        </li>
                        <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="font-medium text-slate-500">Memory (RAM)</span>
                          <span className="font-bold text-slate-900 font-mono">4 GB (Min) / 8 GB (Rec)</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="font-medium text-slate-500">Storage</span>
                          <span className="font-bold text-slate-900 font-mono">20 GB NVMe SSD Storage</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#fafafa] border border-slate-200">
                      <div className="font-mono font-bold text-emerald-600 uppercase tracking-wider mb-2">Client Compatibility</div>
                      <h4 className="text-sm font-black text-[#0d0d0e] mb-3">User Devices &amp; Browsers</h4>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="font-medium text-slate-500">Web Browsers</span>
                          <span className="font-bold text-slate-900 font-mono">Chrome 120+, Safari 17+, Edge, Firefox</span>
                        </li>
                        <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="font-medium text-slate-500">Desktop Platforms</span>
                          <span className="font-bold text-slate-900 font-mono">Windows 10/11, macOS, Linux</span>
                        </li>
                        <li className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                          <span className="font-medium text-slate-500">Mobile Compatibility</span>
                          <span className="font-bold text-slate-900 font-mono">Android 10+, iOS 16+ Responsive</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="font-medium text-slate-500">Network Protocols</span>
                          <span className="font-bold text-slate-900 font-mono">HTTPS (Port 443) &amp; WSS</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* ENGINEERING DESK BOTTOM CALLOUT */}
            <div className="bg-[#0d0d0e] text-white rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3 h-3" /> DIRECT ARCHITECT ENGAGEMENT
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2">
                  Need a customized enterprise rollout or data migration?
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our core engineering team can configure dedicated VPS instances, integrate custom payment methods, or conduct an architecture review for your company.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Link
                  href="/support"
                  className="px-5 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors text-center shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Support Desk</span>
                </Link>
                <Link
                  href={`/get-quote?product=${encodeURIComponent(product.name)}`}
                  className="px-5 py-3 rounded-full bg-white hover:bg-sky-50 text-slate-900 font-mono font-bold text-xs uppercase tracking-wider transition-colors text-center shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Request Custom Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Interactive Quick View / Test-Drive Live Demo Modal */}
      {activeQuickViewProduct && (
        <ProductQuickViewModal
          product={activeQuickViewProduct}
          industrySlug="software"
          onClose={() => setActiveQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
