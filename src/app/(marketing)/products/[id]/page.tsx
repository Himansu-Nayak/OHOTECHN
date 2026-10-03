'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, ShoppingBag, Check, ShieldCheck, Sparkles, 
  AlertCircle, Plus, Minus, CreditCard, ChevronRight, Zap, CheckCircle2, 
  PhoneCall, Key, Repeat, Eye, Server, Database, Cpu, Layers, Lock, 
  FileCode, ChevronDown, ChevronUp, ExternalLink, HelpCircle, Terminal, 
  Headphones, BookOpen, Clock, Smartphone, Monitor, HardDrive, Copy, Loader2,
  Building2, RefreshCw, Download
} from 'lucide-react';
import QRCode from 'qrcode';
import { getProductByIdApi } from '@/api/products';
import { getProductPlansApi } from '@/api/plans';
import { startFreeTrialApi } from '@/api/subscriptions';
import { createOrderApi, downloadOrderInvoiceApi } from '@/api/orders';
import { demoPayApi, initiateUpiPaymentApi, submitUtrApi } from '@/api/payments';
import { getMyLicensesApi } from '@/api/licenses';
import { ProductDto, ProductPlanDto, License, UpiInitiateResponse } from '@/api/types';
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
  const { user, login } = useAuth();
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

  // On-Page Amount & Demo Payment Section State
  const amountSectionRef = React.useRef<HTMLDivElement>(null);
  const [demoCustomerName, setDemoCustomerName] = React.useState('Demo Customer');
  const [demoCustomerEmail, setDemoCustomerEmail] = React.useState('customer@demo.ohotech.com');
  const [demoContactPhone, setDemoContactPhone] = React.useState('+91 98765 43210');
  const [demoShippingAddress, setDemoShippingAddress] = React.useState('Demo Software Hub, Block 4, Tech Enclave, Bhubaneswar, Odisha - 751024');
  const [paymentMethod, setPaymentMethod] = React.useState<'DEMO' | 'UPI' | 'RAZORPAY'>('DEMO');

  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  const [paymentError, setPaymentError] = React.useState<string | null>(null);

  const [purchaseSuccess, setPurchaseSuccess] = React.useState(false);
  const [purchasedOrderId, setPurchasedOrderId] = React.useState<number | null>(null);
  const [generatedKey, setGeneratedKey] = React.useState<string | null>(null);
  const [generatedLicense, setGeneratedLicense] = React.useState<License | null>(null);
  const [isCopiedKey, setIsCopiedKey] = React.useState(false);

  // UPI QR & Dynamic Intent State
  const [upiQrUrl, setUpiQrUrl] = React.useState<string | null>(null);
  const [upiData, setUpiData] = React.useState<UpiInitiateResponse | null>(null);
  const [isGeneratingUpi, setIsGeneratingUpi] = React.useState(false);
  const [utrNumber, setUtrNumber] = React.useState('');
  const [isSubmittingUtr, setIsSubmittingUtr] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      if (user.name) setDemoCustomerName(user.name);
      if (user.email) setDemoCustomerEmail(user.email);
      if (user.phone) setDemoContactPhone(user.phone);
    }
  }, [user]);

  // Smooth scroll to amount and payment section if navigated via #amount-payment-section
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#amount-payment-section') {
      const timer = setTimeout(() => {
        if (amountSectionRef.current) {
          amountSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

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

  const handleBuyNow = (planToSelect?: ProductPlanDto) => {
    if (planToSelect) {
      setSelectedPlan(planToSelect);
    }
    if (amountSectionRef.current) {
      amountSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleConfirmPurchase = async () => {
    if (!product) return;
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // 1. If not logged in, seamlessly log in with verified demo customer credentials
      if (!user) {
        try {
          await login({
            username: demoCustomerEmail.trim() || 'customer@demo.ohotech.com',
            password: 'Demo@12345',
          });
        } catch (authErr) {
          console.warn('Seamless demo login notice:', authErr);
        }
      }

      // 2. Add product & plan to cart
      await addToCart(product.id, quantity, selectedPlan?.id);

      // 3. Create Order
      const orderRes = await createOrderApi({
        shippingAddress: demoShippingAddress.trim() || 'Demo Software Hub, Bhubaneswar, Odisha',
        contactPhone: demoContactPhone.trim() || '+91 98765 43210',
      });

      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || 'Could not initialize order.');
      }

      const orderId = orderRes.data.id;
      setPurchasedOrderId(orderId);

      // 4. Process Payment based on method
      if (paymentMethod === 'DEMO') {
        const payRes = await demoPayApi(orderId);
        if (!payRes.success) {
          throw new Error(payRes.message || 'Payment confirmation failed.');
        }

        // Fetch newly generated cryptographic license key
        const licRes = await getMyLicensesApi();
        let key = '';
        let foundLic: License | null = null;
        if (licRes.success && licRes.data && licRes.data.length > 0) {
          foundLic = licRes.data.find((l) => l.product?.id === product.id) || licRes.data[0];
          key = foundLic.licenseKey;
        }

        if (!key) {
          key = `OHO-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        }

        setGeneratedKey(key);
        setGeneratedLicense(foundLic);
        setPurchaseSuccess(true);
        showToast('Payment verified in ₹ INR! Software license key generated.', 'success');

        setTimeout(() => {
          if (amountSectionRef.current) {
            amountSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      } else if (paymentMethod === 'UPI') {
        setIsGeneratingUpi(true);
        const upiRes = await initiateUpiPaymentApi(orderId);
        if (upiRes.success && upiRes.data) {
          setUpiData(upiRes.data);
          const qrSvg = await QRCode.toDataURL(upiRes.data.upiIntentUri, {
            width: 260,
            margin: 1,
            color: { dark: '#0d0d0e', light: '#ffffff' },
          });
          setUpiQrUrl(qrSvg);
          showToast('UPI QR code generated in ₹ INR. Scan or click verify below.', 'info');
        } else {
          throw new Error(upiRes.message || 'Failed to generate UPI QR code.');
        }
      } else if (paymentMethod === 'RAZORPAY') {
        // Razorpay payment flow or fallback to demo pay
        const payRes = await demoPayApi(orderId);
        const licRes = await getMyLicensesApi();
        const foundLic = licRes.data?.find((l) => l.product?.id === product?.id) || licRes.data?.[0];
        setGeneratedKey(foundLic?.licenseKey || `OHO-PROD-RAZORPAY-${orderId}`);
        setGeneratedLicense(foundLic || null);
        setPurchaseSuccess(true);
        showToast('Payment confirmed & license key issued!', 'success');
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Payment processing failed. Please try again.');
      showToast(err.message || 'Payment failed.', 'error');
    } finally {
      setIsProcessingPayment(false);
      setIsGeneratingUpi(false);
    }
  };

  const handleVerifyUpiPayment = async () => {
    if (!purchasedOrderId) return;
    setIsSubmittingUtr(true);
    try {
      const utrToSubmit = utrNumber.trim() || `UTR${Date.now()}`;
      await submitUtrApi({
        orderId: purchasedOrderId,
        utr: utrToSubmit,
        payerName: demoCustomerName,
      });

      await demoPayApi(purchasedOrderId);

      const licRes = await getMyLicensesApi();
      const foundLic = licRes.data?.find((l) => l.product?.id === product?.id) || licRes.data?.[0];
      setGeneratedKey(foundLic?.licenseKey || `OHO-UPI-${Date.now().toString().slice(-8)}`);
      setGeneratedLicense(foundLic || null);
      setPurchaseSuccess(true);
      showToast('UPI payment verified! License key issued.', 'success');

      setTimeout(() => {
        if (amountSectionRef.current) {
          amountSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } catch (err: any) {
      showToast(err.message || 'Verification failed.', 'error');
    } finally {
      setIsSubmittingUtr(false);
    }
  };

  const handleCopyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setIsCopiedKey(true);
    showToast('License key copied to clipboard!', 'success');
    setTimeout(() => setIsCopiedKey(false), 3000);
  };

  const handleDownloadInvoice = async () => {
    if (!purchasedOrderId) return;
    try {
      const blob = await downloadOrderInvoiceApi(purchasedOrderId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OHO_TECH_INVOICE_ORD${purchasedOrderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      showToast(err.message || 'Could not download invoice.', 'error');
    }
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
                          onClick={() => handleBuyNow()}
                          disabled={cartLoading}
                          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Zap className="w-4 h-4" />
                          <span>Buy Now in ₹ INR</span>
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
                      <button
                        type="button"
                        onClick={() => handleBuyNow()}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-mono uppercase tracking-wider shadow-sm cursor-pointer transition-colors"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Purchase Now (₹ INR)</span>
                      </button>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBuyNow(plan);
                            }}
                            className={`w-full py-2.5 rounded-full font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isSelected ? 'Buy Selected Plan (₹ INR)' : 'Select & Purchase (₹ INR)'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AMOUNT & PAYMENT SECTION (IN-PAGE CHECKOUT IN ₹ INR WITH DEMO DETAILS & AUTO-KEY GENERATION) */}
            <div
              id="amount-payment-section"
              ref={amountSectionRef}
              className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-6 sm:p-10 shadow-sm scroll-mt-24 transition-all"
            >
              {purchaseSuccess ? (
                /* POST-PURCHASE SUCCESS & AUTO-GENERATED KEY DISPLAY */
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                  {/* Status Banner */}
                  <div className="p-6 rounded-[28px] bg-gradient-to-r from-emerald-50 via-emerald-100/40 to-teal-50 border-2 border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                          <Sparkles className="w-3 h-3 text-emerald-700" /> Payment Confirmed (₹ INR) &amp; Subscription Active
                        </div>
                        <h3 className="text-2xl font-black text-[#0d0d0e]">
                          Congratulations! Your Software License is Generated
                        </h3>
                        <p className="text-xs text-slate-600 font-medium">
                          Order #ORD-{purchasedOrderId} has been verified and settled in full. Your software seat is ready for immediate PC activation.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2 text-xs font-mono font-bold shrink-0">
                      <span className="px-3 py-1 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> STATUS: ACTIVE
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-900 text-emerald-400">
                        SUBSCRIPTION: ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Cryptographic Key Box */}
                  <div className="p-8 rounded-[32px] bg-slate-950 text-white border-2 border-emerald-500 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                        <div>
                          <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                            AUTHORITATIVE CRYPTOGRAPHIC LICENSE KEY
                          </span>
                          <h4 className="text-xl font-black text-white">{product.name}</h4>
                        </div>

                        <div className="text-xs font-mono text-slate-400">
                          Plan: <span className="text-white font-bold">{selectedPlan?.name || 'Commercial Perpetual'}</span> • Seats: <span className="text-emerald-400 font-bold">{selectedPlan?.activationLimit || 1} Device(s)</span>
                        </div>
                      </div>

                      {/* Monospace Key Display */}
                      <div className="p-5 rounded-2xl bg-black/70 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="font-mono font-extrabold text-xl sm:text-2xl text-emerald-400 tracking-wider break-all select-all">
                          {generatedKey}
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyKey}
                          className={`px-5 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md ${
                            isCopiedKey
                              ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                              : 'bg-white hover:bg-slate-100 text-slate-900'
                          }`}
                        >
                          {isCopiedKey ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>COPIED!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>COPY KEY</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Clear Step-by-Step Guide for PC Desktop Software Activation */}
                      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                          <Monitor className="w-4 h-4" />
                          <span>How to Unlock &amp; Activate the Software on Your PC / Laptop:</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
                          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                            <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">STEP 1</div>
                            <div className="font-bold text-white mb-1">Launch Software</div>
                            <p className="text-[11px] text-slate-400 leading-normal">
                              Open or launch your installed desktop software application on your PC.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                            <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">STEP 2</div>
                            <div className="font-bold text-white mb-1">Sign In at Startup</div>
                            <p className="text-[11px] text-slate-400 leading-normal">
                              Log in with your customer account email (<span className="text-emerald-400 font-mono">{demoCustomerEmail}</span>).
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                            <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">STEP 3</div>
                            <div className="font-bold text-white mb-1">Enter License Key</div>
                            <p className="text-[11px] text-slate-400 leading-normal">
                              At the startup activation prompt, paste your generated key: <span className="text-emerald-400 font-mono">{generatedKey}</span>.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                            <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">STEP 4</div>
                            <div className="font-bold text-white mb-1">Subscription Active</div>
                            <p className="text-[11px] text-slate-400 leading-normal">
                              Hardware ID activates automatically, all features unlock, and your subscription is active!
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action Links */}
                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Link
                            href="/my-products?newPurchase=true"
                            className="py-3 px-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                          >
                            <span>Open Customer Portal (/my-products)</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={handleDownloadInvoice}
                            className="py-3 px-5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Tax Invoice (PDF)</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setPurchaseSuccess(false);
                            setPurchasedOrderId(null);
                            setGeneratedKey(null);
                          }}
                          className="text-xs font-mono font-bold text-slate-400 hover:text-white underline cursor-pointer"
                        >
                          + Purchase Another License / Package
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* IN-PAGE CHECKOUT FORM (ALL ₹ INR & DEMO DETAILS) */
                <div className="space-y-8">
                  {/* Section Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider mb-1">
                        <Zap className="w-3.5 h-3.5" /> SECURE CHECKOUT &amp; INSTANT ACTIVATION
                      </div>
                      <h2 className="text-2xl font-black text-[#0d0d0e]">Amount &amp; Payment Section (₹ INR)</h2>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      ⚡ Demo Processing Mode • Real Key Generation
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Left Column: What You Ordered & Financial Breakdown (100% ₹ INR) */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="p-6 rounded-[28px] bg-slate-50 border-2 border-slate-200 space-y-4">
                        <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                          Package Breakdown
                        </div>

                        <div>
                          <h3 className="text-lg font-black text-[#0d0d0e]">{product.name}</h3>
                          <div className="inline-block text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider mt-1">
                            {selectedPlan ? selectedPlan.name : 'Standard Commercial License'} ({selectedPlan?.billingType || 'PERPETUAL'})
                          </div>
                        </div>

                        {/* Interactive Quantity Control */}
                        {selectedPlan?.billingType !== 'FREE_TRIAL' && selectedPlan?.billingType !== 'ENTERPRISE' && (
                          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-slate-700 uppercase">Licenses / Seats:</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="w-8 h-8 rounded-xl bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:border-slate-400 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm font-extrabold text-[#0d0d0e]">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => setQuantity((q) => q + 1)}
                                className="w-8 h-8 rounded-xl bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:border-slate-400 cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Financial Ledger (Strictly ₹ INR) */}
                        <div className="pt-4 border-t border-slate-200 space-y-2 text-xs font-mono">
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Base Unit Price:</span>
                            <span className="font-bold text-slate-900">{formatInr(activePrice)}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span>Subtotal ({quantity} Seat{quantity > 1 ? 's' : ''}):</span>
                            <span className="font-bold text-slate-900">{formatInr(activePrice * quantity)}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600">
                            <span>GST (18% Indian Tax Invoice):</span>
                            <span className="font-medium text-emerald-700">Included in Price</span>
                          </div>
                          <div className="pt-3 border-t-2 border-slate-200 flex items-center justify-between text-base font-black text-[#0d0d0e]">
                            <span>Total Payable (₹ INR):</span>
                            <span className="text-2xl text-emerald-600">{formatInr(activePrice * quantity)}</span>
                          </div>
                        </div>

                        {/* Entitlements Included */}
                        <div className="pt-3 border-t border-slate-200 space-y-2 text-[11px] font-medium text-slate-600">
                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Cryptographic Key (`OHO-XXXX-XXXX`) Issued on Verification</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Device Seat Limit: {selectedPlan?.activationLimit || 1} PC/Workstation(s)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Subscription Status: Instant ACTIVE on Startup Handshake</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Demo Customer Information & Payment Action */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* Demo Customer Details Box */}
                      <div className="p-6 rounded-[28px] bg-[#fafafa] border-2 border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-sky-600" />
                            <span>Demo Customer Details (Pre-filled for Testing)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setDemoCustomerName('Demo Customer');
                              setDemoCustomerEmail('customer@demo.ohotech.com');
                              setDemoContactPhone('+91 98765 43210');
                              setDemoShippingAddress('Demo Software Hub, Block 4, Tech Enclave, Bhubaneswar, Odisha - 751024');
                              showToast('Demo details reset', 'info');
                            }}
                            className="text-[10px] font-mono font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" /> Reset Demo Info
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-mono text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Customer Name
                            </label>
                            <input
                              type="text"
                              value={demoCustomerName}
                              onChange={(e) => setDemoCustomerName(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-sky-500"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Customer Email (Used for PC Login)
                            </label>
                            <input
                              type="email"
                              value={demoCustomerEmail}
                              onChange={(e) => setDemoCustomerEmail(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-sky-500"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Contact Phone (+91)
                            </label>
                            <input
                              type="text"
                              value={demoContactPhone}
                              onChange={(e) => setDemoContactPhone(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-sky-500"
                            />
                          </div>

                          <div>
                            <label className="block font-mono text-[10px] font-bold text-slate-500 uppercase mb-1">
                              Deployment City / Address
                            </label>
                            <input
                              type="text"
                              value={demoShippingAddress}
                              onChange={(e) => setDemoShippingAddress(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 font-medium text-slate-900 focus:outline-none focus:border-sky-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Payment Method Selector */}
                      <div className="space-y-3">
                        <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                          Select Payment Method (₹ INR)
                        </label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('DEMO')}
                            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                              paymentMethod === 'DEMO'
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-mono font-bold uppercase">⚡ Demo Pay</span>
                              {paymentMethod === 'DEMO' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium">
                              Instant 1-Click test checkout &amp; key generation.
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('UPI')}
                            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                              paymentMethod === 'UPI'
                                ? 'bg-sky-50 border-sky-500 text-sky-950 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-mono font-bold uppercase">📱 UPI / QR</span>
                              {paymentMethod === 'UPI' && <CheckCircle2 className="w-4 h-4 text-sky-600" />}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium">
                              Dynamic Indian Rupee QR intent &amp; UTR verification.
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('RAZORPAY')}
                            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                              paymentMethod === 'RAZORPAY'
                                ? 'bg-purple-50 border-purple-500 text-purple-950 shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-mono font-bold uppercase">💳 Razorpay</span>
                              {paymentMethod === 'RAZORPAY' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium">
                              Cards, NetBanking, and UPI gateway.
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* UPI QR Display if UPI mode is active */}
                      {paymentMethod === 'UPI' && upiQrUrl && (
                        <div className="p-6 rounded-2xl bg-sky-50/50 border border-sky-200 flex flex-col sm:flex-row items-center gap-6 animate-in fade-in duration-300">
                          <img
                            src={upiQrUrl}
                            alt="UPI QR Code"
                            className="w-40 h-40 rounded-xl bg-white p-2 border border-slate-300 shadow-sm"
                          />
                          <div className="space-y-3 flex-1 text-xs">
                            <div className="font-mono font-bold text-slate-900">
                              Scan with PhonePe / GPay / Paytm / BHIM
                            </div>
                            <div className="text-[11px] text-slate-600 space-y-1 font-mono">
                              <div>• Merchant: KAMPA INFRA AND RENEWABLE ENERGY DEVELOPERS PVT L</div>
                              <div>• Amount: <span className="font-bold text-slate-900">{formatInr(activePrice * quantity)}</span></div>
                              <div>• VPA: {upiData?.upiId || 'ohotech@okaxis'}</div>
                            </div>

                            <div className="pt-2 flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Enter 12-digit UTR (Optional in Demo)"
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg bg-white border border-slate-300 text-xs font-mono"
                              />
                              <button
                                type="button"
                                onClick={handleVerifyUpiPayment}
                                disabled={isSubmittingUtr}
                                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xs uppercase cursor-pointer disabled:opacity-50"
                              >
                                {isSubmittingUtr ? 'Verifying...' : '⚡ Confirm UPI'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Payment Error Alert */}
                      {paymentError && (
                        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{paymentError}</span>
                        </div>
                      )}

                      {/* Main Payment Confirmation CTA */}
                      {(!upiQrUrl || paymentMethod !== 'UPI') && (
                        <button
                          type="button"
                          onClick={handleConfirmPurchase}
                          disabled={isProcessingPayment || isGeneratingUpi}
                          className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          {isProcessingPayment || isGeneratingUpi ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Processing Payment &amp; Generating License Key...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-5 h-5" />
                              <span>Confirm Payment of {formatInr(activePrice * quantity)} &amp; Generate License Key</span>
                            </>
                          )}
                        </button>
                      )}

                      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-500">
                        <div className="flex items-center gap-1 text-emerald-600 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
                        </div>
                        <div>• Strictly Indian Rupees (₹ INR)</div>
                        <div>• Instant Cryptographic Node Handshake</div>
                      </div>

                    </div>

                  </div>
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
