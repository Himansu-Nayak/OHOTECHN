'use client';

import * as React from 'react';
import { 
  ShoppingCart, Search, Filter, Printer, Download, MessageSquare, 
  CheckCircle2, Clock, Truck, PackageCheck, AlertCircle, X, 
  ExternalLink, ChevronRight, DollarSign, MapPin, Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';

export interface OrderRecord {
  id: number;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'PENDING' | 'ACCEPTED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  gateway: 'Razorpay' | 'PhonePe' | 'Stripe' | 'Cashfree' | 'COD';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  createdAt: string;
}

export function AdminOrdersView() {
  const { showToast } = useToast();
  const [selectedStatus, setSelectedStatus] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedOrder, setSelectedOrder] = React.useState<OrderRecord | null>(null);

  const [orders, setOrders] = React.useState<OrderRecord[]>([
    {
      id: 101,
      orderNumber: 'ORD-2026-8812',
      customerName: 'Apollo Care Multispeciality Hospital',
      email: 'billing@apollocare.org',
      phone: '+91 98610 12345',
      address: 'Plot 12, Health City, Chandrasekharpur, Bhubaneswar, Odisha 751024',
      items: [
        { name: 'Hospital Management Software (HMS) - Enterprise License', quantity: 1, price: 75000 },
        { name: 'Pharmacy & OPD Biometric Sync Module', quantity: 1, price: 20000 },
      ],
      totalAmount: 95000,
      status: 'DELIVERED',
      gateway: 'Razorpay',
      paymentStatus: 'PAID',
      createdAt: '2026-09-15 11:30 AM',
    },
    {
      id: 102,
      orderNumber: 'ORD-2026-8813',
      customerName: 'Doon Global Public School',
      email: 'principal@doonglobal.edu.in',
      phone: '+91 94370 54321',
      address: 'Sector 5, CDA, Cuttack, Odisha 753014',
      items: [
        { name: 'School Management Software - Multi-Campus Edition', quantity: 1, price: 35000 },
      ],
      totalAmount: 35000,
      status: 'SHIPPED',
      gateway: 'PhonePe',
      paymentStatus: 'PAID',
      createdAt: '2026-09-17 02:45 PM',
    },
    {
      id: 103,
      orderNumber: 'ORD-2026-8814',
      customerName: 'Agarwal Mega Retail Hub',
      email: 'manish@agarwalretail.com',
      phone: '+91 98200 98765',
      address: 'MG Road, Indiranagar, Bangalore, Karnataka 560038',
      items: [
        { name: 'Retail POS & Billing Software (Multi-Store)', quantity: 1, price: 29000 },
        { name: 'Hardware Barcode Scanner Sync Driver', quantity: 2, price: 5000 },
      ],
      totalAmount: 39000,
      status: 'PACKED',
      gateway: 'Cashfree',
      paymentStatus: 'PAID',
      createdAt: '2026-09-17 08:15 PM',
    },
    {
      id: 104,
      orderNumber: 'ORD-2026-8815',
      customerName: 'Bloom Fertility & IVF Center',
      email: 'dr.sunita@bloomivf.in',
      phone: '+91 98840 33221',
      address: 'Anna Nagar, Chennai, Tamil Nadu 600040',
      items: [
        { name: 'IVF & Fertility Clinic Software Suite', quantity: 1, price: 85000 },
      ],
      totalAmount: 85000,
      status: 'ACCEPTED',
      gateway: 'Razorpay',
      paymentStatus: 'PAID',
      createdAt: 'Today, 09:20 AM',
    },
    {
      id: 105,
      orderNumber: 'ORD-2026-8816',
      customerName: 'Kalinga Logistics Solutions',
      email: 'ops@kalingalogistics.com',
      phone: '+91 97780 11223',
      address: 'Paradeep Port Commercial Zone, Odisha 754142',
      items: [
        { name: 'Enterprise HRMS & Payroll System', quantity: 1, price: 55000 },
      ],
      totalAmount: 55000,
      status: 'PENDING',
      gateway: 'COD',
      paymentStatus: 'PENDING',
      createdAt: 'Today, 11:45 AM',
    },
  ]);

  const stages = [
    { key: 'ALL', label: 'All Orders' },
    { key: 'PENDING', label: 'Pending Verification' },
    { key: 'ACCEPTED', label: 'Accepted' },
    { key: 'PACKED', label: 'Packed / Provisioned' },
    { key: 'SHIPPED', label: 'Shipped / Dispatched' },
    { key: 'DELIVERED', label: 'Delivered / Active' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  const handleUpdateStatus = (orderId: number, nextStatus: OrderRecord['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
    showToast(`Order #${orderId} marked as ${nextStatus}`, 'success');
  };

  const handleSendWhatsAppUpdate = (order: OrderRecord) => {
    const text = encodeURIComponent(
      `Hello ${order.customerName},\nYour OHO TECH software order ${order.orderNumber} is now ${order.status}.\nTrack live status or access your portal at https://ohotech.com/profile`
    );
    window.open(`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = selectedStatus === 'ALL' || o.status === selectedStatus;
    const matchesQuery =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-mono">
      {/* Header Bar */}
      <div className="p-5 rounded-2xl bg-[#141416] border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              COMMERCE ENGINE
            </span>
            <span className="text-xs font-mono text-slate-400">
              Total Fulfillments: <strong className="text-white">{orders.length}</strong>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Orders &amp; Invoice Billing Hub
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Manage software delivery lifecycles, print GST tax invoices, and push WhatsApp dispatch notifications.
          </p>
        </div>

        {/* Notice badge from video */}
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 max-w-sm text-[10px] text-amber-300 flex items-start gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
          <span>Note: Pending, Cancelled, Rejected &amp; Refunded orders are not calculated in statistics.</span>
        </div>
      </div>

      {/* Pipeline Status Filter Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1">
          {stages.map((st) => (
            <button
              key={st.key}
              onClick={() => setSelectedStatus(st.key)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap",
                selectedStatus === st.key
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-white/5 text-slate-400 hover:text-white"
              )}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#141416] border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Orders Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="p-4 rounded-2xl bg-[#141416] border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between shadow-lg group space-y-3"
          >
            {/* Top Row: Order # and Status */}
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                    {order.orderNumber}
                  </span>
                  <p className="text-[10px] text-slate-400">{order.createdAt}</p>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                  order.status === 'DELIVERED' ? "bg-emerald-500/20 text-emerald-300" :
                  order.status === 'SHIPPED' ? "bg-cyan-500/20 text-cyan-300" :
                  order.status === 'PACKED' ? "bg-purple-500/20 text-purple-300" :
                  order.status === 'ACCEPTED' ? "bg-blue-500/20 text-blue-300" :
                  order.status === 'CANCELLED' ? "bg-red-500/20 text-red-300" :
                  "bg-amber-500/20 text-amber-300"
                )}>
                  {order.status}
                </span>
              </div>

              {/* Customer Info */}
              <div className="space-y-1 text-xs">
                <p className="font-bold text-slate-200 truncate">{order.customerName}</p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{order.phone}</span>
                </p>
                <p className="text-[10px] text-slate-400 flex items-start gap-1 leading-snug">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{order.address}</span>
                </p>
              </div>

              {/* Items List */}
              <div className="mt-3 p-2 rounded-xl bg-white/5 border border-white/5 space-y-1">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-slate-300">
                    <span className="truncate pr-2">{it.quantity}x {it.name}</span>
                    <span className="shrink-0 font-mono text-emerald-400">₹{it.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Action Strip */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-[10px] text-slate-400">Gateway: <strong className="text-white">{order.gateway}</strong></span>
                <span className="font-black text-sm text-emerald-400">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold text-center cursor-pointer"
                >
                  Manage
                </button>
                <button
                  onClick={() => showToast(`Generating GST Invoice for ${order.orderNumber}...`, 'info')}
                  className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3 h-3" /> Invoice
                </button>
                <button
                  onClick={() => handleSendWhatsAppUpdate(order)}
                  className="py-1.5 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="w-3 h-3" /> WhatsApp
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Transition Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#141416] border border-white/20 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold uppercase">
                  Order Management
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedOrder.orderNumber}</h3>
                <p className="text-xs text-slate-400">{selectedOrder.customerName}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400">Current Stage</span>
                <p className="text-base font-bold text-white mt-0.5">{selectedOrder.status}</p>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Advance Fulfillment Stage:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['PENDING', 'ACCEPTED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as OrderRecord['status'][]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={cn(
                        "py-2 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                        selectedOrder.status === st
                          ? "bg-blue-600 text-white"
                          : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
