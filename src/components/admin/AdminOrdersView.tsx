'use client';

import * as React from 'react';
import { 
  ShoppingCart, Search, Eye, Download, CheckCircle2, 
  Clock, Package, X, RefreshCw, AlertCircle, Phone, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { Order, OrderStatus } from '@/api/types';
import { getAdminOrdersApi, updateAdminOrderStatusApi, downloadOrderInvoiceApi } from '@/api/orders';
import { 
  AdminCard, AdminBadge, StatusBadge, AdminButton, 
  AdminEmptyState, AdminTableSkeleton, AdminModal 
} from './AdminUiPrimitives';

export function AdminOrdersView() {
  const { showToast } = useToast();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = React.useState(false);

  const fetchOrders = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await getAdminOrdersApi();
      if (res.success && res.data) {
        setOrders(res.data);
      } else {
        setErrorMsg(res.message || 'Unable to retrieve orders.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to connect to order administration service.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await updateAdminOrderStatusApi(orderId, newStatus);
      if (res.success && res.data) {
        const updated = res.data;
        showToast(`Order #${orderId} status changed to ${newStatus}`, 'success');
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updated);
        }
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update order status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDownloadInvoice = async (orderId: number) => {
    setIsDownloadingPdf(true);
    try {
      const blob = await downloadOrderInvoiceApi(orderId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-order-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast(`Invoice for order #${orderId} downloaded`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to download PDF invoice', 'error');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Search & Filter
  const filteredOrders = React.useMemo(() => {
    return orders.filter((ord) => {
      const matchesStatus = selectedStatus === 'ALL' || ord.status === selectedStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        String(ord.id).includes(q) ||
        ord.user?.name?.toLowerCase().includes(q) ||
        ord.user?.email?.toLowerCase().includes(q) ||
        ord.contactPhone?.includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orders, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Orders &amp; Invoicing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customer purchases, fulfillment lifecycle, and automated invoice PDF generation.
          </p>
        </div>

        <AdminButton
          variant="secondary"
          size="sm"
          onClick={fetchOrders}
          icon={RefreshCw}
        >
          Refresh Orders
        </AdminButton>
      </div>

      {/* 2. Filters & Search */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders by ID, customer name, email, or phone..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer w-full md:w-44"
          >
            <option value="ALL">All Order Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* 3. Orders Table */}
      <AdminCard
        title={
          <span className="flex items-center gap-2">
            <span>Orders Ledger</span>
            <span className="text-xs font-normal text-slate-400">
              ({filteredOrders.length} records)
            </span>
          </span>
        }
      >
        {isLoading ? (
          <AdminTableSkeleton rows={6} cols={6} />
        ) : errorMsg ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-800">{errorMsg}</p>
            <AdminButton variant="secondary" size="sm" onClick={fetchOrders} className="mt-3">
              Retry
            </AdminButton>
          </div>
        ) : filteredOrders.length === 0 ? (
          <AdminEmptyState
            title="No orders found"
            description={
              searchQuery || selectedStatus !== 'ALL'
                ? 'No orders match your filter criteria. Try clearing search.'
                : 'No customer purchases have been recorded yet.'
            }
            icon={ShoppingCart}
          />
        ) : (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-[11px] font-semibold">
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-4 py-3">Client Information</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3">Order Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => {
                  const totalFormatted = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  }).format(Number(ord.totalAmount || 0));

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                        #{ord.id}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-900 block truncate max-w-[180px]">
                          {ord.user?.name || 'Customer'}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                          {ord.user?.email || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap">
                        {ord.items?.length || 0} item{ord.items?.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                        {totalFormatted}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <select
                          value={ord.status}
                          disabled={isUpdatingStatus}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                          className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:border-slate-900 cursor-pointer shadow-2xs"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                        {ord.createdAt
                          ? new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Inspect order details"
                            aria-label={`View details for order #${ord.id}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(ord.id)}
                            disabled={isDownloadingPdf}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Download PDF invoice"
                            aria-label={`Download invoice for order #${ord.id}`}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {/* 4. Structured Order Detail Modal (with Spring Exit Motion) */}
      <AdminModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order #${selectedOrder.id}` : 'Order Details'}
        subtitle={selectedOrder?.createdAt ? `Placed on ${new Date(selectedOrder.createdAt).toLocaleString('en-IN')}` : ''}
        maxWidth="lg"
      >
        {selectedOrder && (
          <div className="space-y-5 text-xs">
            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Customer Information
                </span>
                <p className="font-semibold text-slate-900">{selectedOrder.user?.name || 'Customer'}</p>
                <p className="text-slate-600">{selectedOrder.user?.email}</p>
                <p className="text-slate-600 mt-1 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{selectedOrder.contactPhone || 'No contact phone'}</span>
                </p>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Fulfillment &amp; Address
                </span>
                <p className="text-slate-700 flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                  <span>{selectedOrder.shippingAddress || 'Digital License Delivery'}</span>
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-slate-500">Current Status:</span>
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 mb-2">Itemized Products</h4>
              <div className="border border-slate-200/80 rounded-xl overflow-hidden divide-y divide-slate-100">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between bg-white">
                    <div>
                      <p className="font-semibold text-slate-900">{item.product?.name || 'Software Product'}</p>
                      <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-slate-900">
                      ₹{Number(item.price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Summary */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 text-white font-semibold">
              <span>Total Paid Amount</span>
              <span className="text-sm font-bold">
                ₹{Number(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => handleDownloadInvoice(selectedOrder.id)}
                icon={Download}
                isLoading={isDownloadingPdf}
              >
                Download PDF Invoice
              </AdminButton>
              <AdminButton
                variant="primary"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
