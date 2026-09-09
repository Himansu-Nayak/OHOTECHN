'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  Plus, 
  Minus, 
  CreditCard, 
  ChevronRight, 
  Zap, 
  CheckCircle2, 
  PhoneCall, 
  Key, 
  Repeat,
  Monitor,
  Laptop,
  Smartphone,
  Globe,
  HelpCircle,
  Clock,
  Server,
  Download,
  Lock
} from 'lucide-react';
import { getProductByIdApi } from '@/api/products';
import { getProductPlansApi } from '@/api/plans';
import { startFreeTrialApi } from '@/api/subscriptions';
import { ProductDto, ProductPlanDto } from '@/api/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Tilt3D } from '@/components/ui/Tilt3D';

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

  const productId = params?.id as string;

  const fetchDetailsAndPlans = React.useCallback(async () => {
    if (!productId) return;
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
      } else {
        // Fallback default plans if product has no custom plan records
        const fallbackPlans = getDefaultPlans(Number(productId), prodRes.data?.price || 35000);
        setPlans(fallbackPlans);
        setSelectedPlan(fallbackPlans[1]); // Yearly
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  React.useEffect(() => {
    fetchDetailsAndPlans();
  }, [fetchDetailsAndPlans]);

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
        showToast('Your software access is ready! 14-day trial activated.', 'success');
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
    showToast(`Added ${quantity} license(s) of ${product.name} to cart.`, 'success');
  };

  const handleBuyNow = async () => {
    if (!user) {
      showToast('Please sign in to proceed to checkout.', 'info');
      router.push('/login');
      return;
    }
    if (!product) return;
    await addToCart(product.id, quantity, selectedPlan?.id);
    router.push('/checkout');
  };

  const activePrice = selectedPlan ? selectedPlan.price : (product?.price || 35000);
  const priceFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(activePrice * quantity);

  const getProductImage = (prod: ProductDto) => {
    if (prod.imageUrl && prod.imageUrl.startsWith('/') && !prod.imageUrl.endsWith('LOGO.png')) {
      return prod.imageUrl;
    }
    const name = prod.name.toLowerCase();
    if (name.includes('school') || name.includes('college') || name.includes('university') || name.includes('lms') || name.includes('education')) {
      return '/ecosystem_education.png';
    }
    if (name.includes('hospital') || name.includes('clinic') || name.includes('health') || name.includes('pathology') || name.includes('ivf') || name.includes('pharmacy')) {
      return '/ecosystem_healthcare.png';
    }
    if (name.includes('pos') || name.includes('retail') || name.includes('grocery') || name.includes('jewellery') || name.includes('garments') || name.includes('billing')) {
      return '/images/3d-enterprise-node.jpg';
    }
    if (name.includes('growth') || name.includes('seo') || name.includes('marketing') || name.includes('ad')) {
      return '/images/3d-digital-growth.jpg';
    }
    return '/images/3d-software-dev.jpg';
  };

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8 selection:bg-[#0d0d0e] selection:text-white">
      <main className="max-w-6xl w-full mx-auto" id="product-detail-main">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
          <Link href="/products" className="hover:text-sky-600 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Products Catalog
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-800 font-bold truncate max-w-xs">{product?.name || 'Product Details'}</span>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-8 sm:p-12 animate-pulse space-y-6">
              <div className="h-8 bg-slate-100 rounded-xl w-1/3" />
              <div className="h-12 bg-slate-100 rounded-xl w-2/3" />
              <div className="h-40 bg-slate-50 rounded-2xl border border-slate-100" />
            </div>
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-8 animate-pulse space-y-4">
              <div className="h-6 bg-slate-100 rounded-xl w-1/4" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-44 bg-slate-50 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        ) : error || !product ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-8 shadow-sm">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">Product Not Found</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">{error || 'The requested product could not be located in our catalog.'}</p>
            <Link href="/products" className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block hover:bg-sky-600 transition-colors">
              Back to Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* Main Product Hero Card */}
            <ScrollReveal yOffset={25} duration={0.75}>
              <div className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Column: Product Information & Specs */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="inline-block text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider">
                        {product.serviceType || product.categoryName || 'Enterprise Turnkey Software'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        SKU: PROD-0{product.id}
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight mb-4 leading-tight">
                      {product.name}
                    </h1>

                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {product.description}
                    </p>
                  </div>

                  {/* Turnkey Software Capabilities Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Turnkey Software Capabilities</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Cryptographic License Key (`OHO-XXXX`)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Hardware Device Activations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Digital Binary Releases (.zip / .exe / .dmg)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>24/7 Production SLA &amp; Support</span>
                      </div>
                    </div>
                  </div>

                  {/* Platforms & Assurance */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs font-mono text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">Supported OS:</span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        <Monitor className="w-3.5 h-3.5 text-sky-600" /> Windows 10/11
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        <Laptop className="w-3.5 h-3.5 text-emerald-600" /> macOS 12+
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        <Globe className="w-3.5 h-3.5 text-amber-600" /> Cloud Web
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                      <ShieldCheck className="w-4 h-4" /> Verified Quality SLA
                    </div>
                  </div>
                </div>

                {/* Right Column: Active Selected Plan Summary Box */}
                <div className="lg:col-span-5 bg-[#fafafa] border-2 border-slate-200 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Selected License Plan
                    </div>
                    <div className="text-lg font-black text-[#0d0d0e]">
                      {selectedPlan?.name || 'Standard Enterprise License'}
                    </div>

                    <div className="text-3xl font-black text-[#0d0d0e] mt-2 mb-1">
                      {selectedPlan?.billingType === 'FREE_TRIAL' ? 'FREE' : priceFormatted}
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      {selectedPlan?.description || 'Includes cloud license key, device activations, automated updates, and SLA support.'}
                    </p>

                    {/* Quantity Selector for Paid Plans */}
                    {selectedPlan?.billingType !== 'FREE_TRIAL' && selectedPlan?.billingType !== 'ENTERPRISE' && (
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-3">
                          License Seats / Quantity
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="w-10 h-10 rounded-2xl bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:border-slate-400 cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center text-base font-extrabold text-[#0d0d0e]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity((q) => q + 1)}
                            className="w-10 h-10 rounded-2xl bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:border-slate-400 cursor-pointer"
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
                        <span>{isProcessingTrial ? 'Activating Trial...' : 'Start 14-Day Free Trial'}</span>
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
          </ScrollReveal>

          {/* Plan Selection Section */}
          <ScrollReveal yOffset={25} duration={0.7}>
            <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-sky-600 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" /> AUTHORITATIVE SERVER-SIDE PLANS
                  </div>
                  <h2 className="text-2xl font-black text-[#0d0d0e]">Choose Your Procurement Tier</h2>
                </div>
                <p className="text-xs text-slate-500 font-mono">Select a monthly subscription, annual plan, or perpetual lifetime license.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => {
                  const isSelected = selectedPlan?.id === plan.id;
                  const isTrial = plan.billingType === 'FREE_TRIAL';

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={cn(
                        'p-6 rounded-[28px] border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden',
                        isSelected
                          ? 'bg-[#0d0d0e] text-white border-[#0d0d0e] shadow-xl scale-[1.02]'
                          : 'bg-[#fafafa] text-[#0d0d0e] border-slate-200 hover:border-slate-400'
                      )}
                    >
                      {plan.billingType === 'YEARLY' && (
                        <span className="absolute top-3 right-3 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider">
                          Best Value
                        </span>
                      )}

                      <div>
                        <div className={cn('text-xs font-mono font-bold uppercase tracking-wider mb-2', isSelected ? 'text-sky-400' : 'text-slate-500')}>
                          {plan.billingType}
                        </div>

                        <h3 className="text-lg font-black mb-1">{plan.name}</h3>
                        <p className={cn('text-xs leading-normal mb-4', isSelected ? 'text-slate-300' : 'text-slate-600')}>
                          {plan.description}
                        </p>
                      </div>

                      <div>
                        <div className="text-2xl font-black mb-2">
                          {isTrial ? 'FREE' : `₹${plan.price.toLocaleString('en-IN')}`}
                        </div>

                        <div className={cn('text-[11px] font-mono mb-4 space-y-1', isSelected ? 'text-slate-400' : 'text-slate-500')}>
                          <div>• Duration: {plan.durationDays || (isTrial ? 14 : 365)} Days</div>
                          <div>• Device Activations: {plan.activationLimit || 1} Device(s)</div>
                          {isTrial && <div>• Trial Days: {plan.trialDays || 14} Days</div>}
                        </div>

                        <button
                          type="button"
                          className={cn(
                            'w-full py-2.5 rounded-full font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5',
                            isSelected
                              ? 'bg-emerald-500 text-white'
                              : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100'
                          )}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isSelected ? 'Active Plan' : 'Select Plan'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>

          {/* System Requirements & FAQ */}
          <ScrollReveal yOffset={25} duration={0.7}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#0d0d0e]">
                  <Server className="w-5 h-5 text-sky-600" />
                  <h3 className="text-lg font-extrabold">System &amp; Hardware Requirements</h3>
                </div>
                <div className="space-y-3 text-xs font-mono text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Desktop &amp; POS Systems:</strong>
                    Intel/AMD x64 or Apple Silicon, 4GB RAM minimum (8GB recommended), 2GB free storage.
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Cloud / Web Server:</strong>
                    Docker 24+, Node.js 20+ / Java 21 LTS, PostgreSQL 15+, SSL Termination.
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-slate-900 block mb-1">Mobile Access:</strong>
                    Android 10+ / iOS 15+ for mobile management companion apps.
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-slate-300 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#0d0d0e]">
                  <HelpCircle className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-extrabold">Procurement FAQ</h3>
                </div>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-[#0d0d0e] block mb-1">How are license keys issued?</strong>
                    Keys are cryptographically generated and displayed instantly in your Customer Portal upon successful payment.
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-[#0d0d0e] block mb-1">Can I transfer a license to a new PC?</strong>
                    Yes! Manage or deactivate registered devices anytime from the "License Keys" dashboard.
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-[#0d0d0e] block mb-1">Is source code included?</strong>
                    Lifetime &amp; Enterprise tiers include full source code repositories and deployment SLA assistance.
                  </div>
                </div>
              </div>

            </div>
          </ScrollReveal>

          </div>
        )}

      </main>
    </div>
  );
}

function getDefaultPlans(productId: number, basePrice: number): ProductPlanDto[] {
  return [
    {
      id: productId * 10 + 1,
      productId: productId,
      name: '14-Day Free Evaluation',
      description: 'Test all features with 1 active device seat before purchase.',
      price: 0,
      currency: 'INR',
      billingType: 'FREE_TRIAL',
      durationDays: 14,
      activationLimit: 1,
      trialDays: 14,
      active: true,
    },
    {
      id: productId * 10 + 2,
      productId: productId,
      name: 'Annual Subscription',
      description: 'Includes full cloud deployment, software updates, and 3 device seats.',
      price: basePrice,
      currency: 'INR',
      billingType: 'YEARLY',
      durationDays: 365,
      activationLimit: 3,
      trialDays: 0,
      active: true,
    },
    {
      id: productId * 10 + 3,
      productId: productId,
      name: 'Perpetual Lifetime License',
      description: 'One-time payment for lifetime access, 10 device seats, and full updates.',
      price: Math.round(basePrice * 2.2),
      currency: 'INR',
      billingType: 'LIFETIME',
      durationDays: 3650,
      activationLimit: 10,
      trialDays: 0,
      active: true,
    },
    {
      id: productId * 10 + 4,
      productId: productId,
      name: 'Enterprise Multi-Site SLA',
      description: 'Unlimited device seats, custom source code branch, and dedicated engineering support.',
      price: Math.round(basePrice * 4.5),
      currency: 'INR',
      billingType: 'ENTERPRISE',
      durationDays: 365,
      activationLimit: 999,
      trialDays: 0,
      active: true,
    },
  ];
}
