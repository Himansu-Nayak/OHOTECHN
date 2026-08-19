'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, Check, ShieldCheck, Sparkles, AlertCircle, Plus, Minus, CreditCard, ChevronRight, Zap } from 'lucide-react';
import { getProductByIdApi } from '@/api/products';
import { ProductDto } from '@/api/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, loading: cartLoading } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = React.useState<ProductDto | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [quantity, setQuantity] = React.useState<number>(1);

  const productId = params?.id as string;

  React.useEffect(() => {
    if (!productId) return;

    async function fetchDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await getProductByIdApi(productId);
        if (res.success && res.data) {
          setProduct(res.data);
        } else {
          throw new Error(res.message || 'Product not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product details.');
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
    router.push('/checkout');
  };

  const priceFormatted = product
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price * quantity)
    : '';

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-5xl w-full mx-auto" id="product-detail-main">
        
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
            <div className="h-14 bg-slate-100 rounded-full w-full" />
          </div>
        ) : error || !product ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-8">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">Product Not Found</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">{error || 'The requested product could not be located.'}</p>
            <Link
              href="/products"
              className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block"
            >
              Back to Catalog
            </Link>
          </div>
        ) : (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] sm:rounded-[44px] p-8 sm:p-12 lg:p-16 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Product Info Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="inline-block text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider mb-3">
                    {product.serviceType || product.categoryName || 'Enterprise Product'}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black text-[#0d0d0e] tracking-tight mb-4">
                    {product.name}
                  </h1>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {product.description}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Product Highlights</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Full API Integration Supported</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Turnkey Cloud Setup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>24/7 Dedicated Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Multi-Tenant Architecture</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <ShieldCheck className="w-4 h-4" /> Verified Quality Guarantee
                  </div>
                  <div>• SKU: PROD-0{product.id}</div>
                </div>
              </div>

              {/* Purchase Card Right Column */}
              <div className="lg:col-span-5 bg-[#fafafa] border-2 border-slate-200 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Pricing</div>
                  <div className="text-3xl font-black text-[#0d0d0e] mb-1">{priceFormatted}</div>
                  <div className="text-xs text-slate-500 font-medium">Inclusive of all cloud setup fees &amp; license</div>

                  {/* Quantity Selector */}
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <label className="block text-xs font-mono font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Quantity / Licenses
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 rounded-2xl bg-white border border-slate-300 hover:border-slate-400 flex items-center justify-center text-slate-700 font-bold"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-12 text-center text-base font-extrabold text-[#0d0d0e]">
                        {quantity}
                      </span>

                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-10 h-10 rounded-2xl bg-white border border-slate-300 hover:border-slate-400 flex items-center justify-center text-slate-700 font-bold"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-200">
                  <button
                    onClick={handleAddToCart}
                    disabled={cartLoading}
                    className="w-full py-4 px-6 rounded-2xl bg-[#0d0d0e] hover:bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={cartLoading}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Buy Now &amp; Checkout</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
