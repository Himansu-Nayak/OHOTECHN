'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  ExternalLink,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Package,
  ArrowRight,
  Eye,
  AlertCircle,
  Building,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getMyOrdersApi, downloadOrderInvoiceApi } from '@/api/orders';
import { Order } from '@/api/types';
import { CustomerPortalNav } from '@/components/portal/CustomerPortalNav';
import { cn } from '@/lib/utils';

export default function InvoicesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [downloadingId, setDownloadingId] = React.useState<number | null>(null);

  const fetchInvoices = React.useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getMyOrdersApi();
      if (res.success && res.data) {
        setOrders(res.data);
      } else {
        throw new Error(res.message || 'Failed to fetch billing invoices');
      }
    } catch (err: any) {
      setError(err.message || 'Could not load your invoices');
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleDownloadInvoice = async (orderId: number) => {
    setDownloadingId(orderId);
    try {
      const blob = await downloadOrderInvoiceApi(orderId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tax-invoice-order-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast(`Tax Invoice downloaded for Order #${orderId}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to download tax invoice PDF', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleViewInvoice = async (orderId: number) => {
    setDownloadingId(orderId);
    try {
      const blob = await downloadOrderInvoiceApi(orderId);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      showToast('Opening Tax Invoice in new tab...', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to preview invoice PDF', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  // Only verified/placed orders have tax invoices
  const invoiceOrders = orders.filter((o) => o.status !== 'CANCELLED');

  const filteredInvoices = invoiceOrders.filter((order) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      String(order.id).includes(q) ||
      `inv-oho-${order.id}`.includes(q) ||
      order.shippingAddress?.toLowerCase().includes(q) ||
      order.items?.some((i) => i.product?.name?.toLowerCase().includes(q))
    );
  });

  const totalInvoiced = invoiceOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalTax = totalInvoiced > 0 ? (totalInvoiced * 0.18) / 1.18 : 0;

  if (!user) {
    return (
      <div className="bg-[#f7f7f5] min-h-screen pb-16 pt-28 sm:pt-36 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-slate-300 rounded-[32px] p-8 text-center shadow-sm">
          <FileText className="w-12 h-12 text-sky-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-[#0d0d0e] mb-2">Login Required</h1>
          <p className="text-xs text-slate-500 mb-6">Please sign in to access your tax invoices.</p>
          <Link
            href="/login?redirect=/invoices"
            className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider inline-block"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f5] text-[#0d0d0e] min-h-screen pb-16 pt-28 sm:pt-36 px-3 sm:px-6 lg:px-8">
      <main className="max-w-5xl w-full mx-auto" id="invoices-main">
        <CustomerPortalNav />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-widest">
                Official GST Tax Records
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0d0d0e]">
              Invoices &amp; Billing
            </h1>
            <p className="text-xs font-medium text-slate-600 mt-1">
              Download GST-compliant tax invoices, view transaction records, and manage corporate accounting receipts.
            </p>
          </div>

          <Link
            href="/orders"
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
          >
            <Package className="w-4 h-4" />
            View Orders Timeline
          </Link>
        </div>

        {/* Financial KPI Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Invoices Issued</div>
            <div className="text-2xl font-black text-[#0d0d0e] mt-1">{invoiceOrders.length}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Automated PDF tax receipts</div>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Total Billed</div>
            <div className="text-2xl font-black text-[#0d0d0e] font-mono mt-1">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalInvoiced)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Inclusive of taxes</div>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">GST Component (18%)</div>
            <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalTax)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Input tax credit eligible</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 mb-6 shadow-sm flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Invoice #, order ID, product, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-white border-2 border-slate-200 rounded-[32px] p-6 animate-pulse space-y-3">
                <div className="h-6 bg-slate-100 rounded-lg w-1/4" />
                <div className="h-4 bg-slate-100 rounded-lg w-1/2" />
                <div className="h-16 bg-slate-50 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="bg-white border-2 border-slate-300 rounded-[32px] p-12 text-center my-6 shadow-sm">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-extrabold text-[#0d0d0e] mb-2">No Invoices Available</h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              {searchQuery
                ? 'No invoices match your search query. Try resetting your search.'
                : 'Invoices are automatically generated once software orders are placed and processed.'}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            ) : (
              <Link
                href="/products"
                className="px-6 py-3 rounded-full bg-[#0d0d0e] text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-600 transition-colors inline-block"
              >
                Explore Products Catalog
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((order) => {
              const invoiceNum = `INV-OHO-${order.id}`;
              const formattedDate = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent';

              const formattedTotal = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
              }).format(order.totalAmount || 0);

              const isPaid = order.status === 'CONFIRMED' || order.status === 'PAID';

              return (
                <div
                  key={order.id}
                  className="bg-white border-2 border-slate-300 hover:border-slate-400 rounded-[28px] p-5 sm:p-6 shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-black text-[#0d0d0e]">
                        {invoiceNum}
                      </span>
                      <span
                        className={cn(
                          'text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider',
                          isPaid
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        )}
                      >
                        {isPaid ? 'PAID & ISSUED' : order.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium">
                      Order Reference: <span className="font-bold text-[#0d0d0e]">Order #{order.id}</span> • {order.items?.length || 0} product(s)
                    </div>

                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
                      <Clock className="w-3 h-3" /> {formattedDate}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-0 border-slate-100 shrink-0">
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Amount</div>
                      <div className="text-base font-black text-[#0d0d0e] font-mono">{formattedTotal}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewInvoice(order.id)}
                        disabled={downloadingId === order.id}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                        title="View PDF Invoice"
                      >
                        <ExternalLink className="w-4 h-4 text-sky-600" />
                      </button>

                      <button
                        onClick={() => handleDownloadInvoice(order.id)}
                        disabled={downloadingId === order.id}
                        className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-mono font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
                        title="Download Tax Invoice PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{downloadingId === order.id ? 'Downloading...' : 'PDF'}</span>
                      </button>

                      <Link
                        href={`/orders/${order.id}`}
                        className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                        title="View Full Order Details"
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
