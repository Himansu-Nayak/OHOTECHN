'use client';

import * as React from 'react';
import {
  Users,
  Search,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Shield,
  ExternalLink,
  ShoppingBag,
  CreditCard,
  Key,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserCheck,
  Building,
  Activity
} from 'lucide-react';
import { getAdminCustomersApi, getCustomer360Api } from '@/api/crm';
import { UserDto, Customer360Dto } from '@/api/types';
import { 
  AdminCard, 
  AdminButton, 
  AdminInput, 
  AdminSelect, 
  AdminBadge, 
  StatusBadge, 
  AdminEmptyState, 
  AdminTableSkeleton,
  AdminModal,
  AdminTabs
} from './AdminUiPrimitives';

export function AdminCustomersView() {
  const [customers, setCustomers] = React.useState<UserDto[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Search & Pagination & Filter
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState('ALL');
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  const [totalElements, setTotalElements] = React.useState(0);

  // Customer 360 Modal
  const [selectedCustomer, setSelectedCustomer] = React.useState<UserDto | null>(null);
  const [customer360, setCustomer360] = React.useState<Customer360Dto | null>(null);
  const [loading360, setLoading360] = React.useState(false);
  const [error360, setError360] = React.useState<string | null>(null);
  const [active360Tab, setActive360Tab] = React.useState<'overview' | 'orders' | 'licenses' | 'crm'>('overview');

  const fetchCustomers = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminCustomersApi(search.trim() || undefined, page, 15);
      if (res.success && res.data) {
        setCustomers(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      } else {
        setError(res.message || 'Failed to load customers');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error fetching customers');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  const handleOpen360 = async (user: UserDto) => {
    setSelectedCustomer(user);
    setLoading360(true);
    setError360(null);
    setCustomer360(null);
    setActive360Tab('overview');

    try {
      const res = await getCustomer360Api(user.id);
      if (res.success && res.data) {
        setCustomer360(res.data);
      } else {
        setError360(res.message || 'Could not load complete Customer 360 records');
      }
    } catch (err: any) {
      setError360(err?.message || 'Failed to retrieve Customer 360 profile');
    } finally {
      setLoading360(false);
    }
  };

  const filteredCustomers = React.useMemo(() => {
    if (roleFilter === 'ALL') return customers;
    return customers.filter(c => {
      const role = c.role ? c.role.replace('ROLE_', '') : 'CUSTOMER';
      return role === roleFilter;
    });
  }, [customers, roleFilter]);

  const formatRole = (role?: string) => {
    if (!role) return 'CUSTOMER';
    return role.replace('ROLE_', '');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Directory &amp; 360° Profiles</h1>
            <AdminBadge variant="outline">{totalElements} Users</AdminBadge>
          </div>
          <p className="text-sm text-slate-500">
            Real registered platform accounts, customer relationship drilldowns, order histories, and enterprise licenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={() => fetchCustomers()}
            disabled={loading}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </AdminButton>
        </div>
      </div>

      {/* Filter Bar */}
      <AdminCard className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <AdminInput
              placeholder="Search by customer name, email, or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="w-full sm:w-56">
            <AdminSelect
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Roles' },
                { value: 'CUSTOMER', label: 'Customer Only' },
                { value: 'ADMIN', label: 'Administrator' },
                { value: 'DEVELOPER', label: 'Developer' },
              ]}
            />
          </div>
        </div>
      </AdminCard>

      {/* Customers Table */}
      <AdminCard className="overflow-hidden">
        {loading ? (
          <div className="p-6">
            <AdminTableSkeleton rows={6} cols={6} />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600">
            <AlertCircle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
            <p className="font-semibold text-sm">{error}</p>
            <AdminButton variant="secondary" size="sm" onClick={() => fetchCustomers()} className="mt-3">
              Retry Connection
            </AdminButton>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4">System Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4 text-right">360° Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((c) => {
                  const roleStr = formatRole(c.role);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                            {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{c.name || 'Unnamed Account'}</div>
                            <div className="text-xs text-slate-400 font-mono">User #{c.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{c.email}</span>
                          </div>
                          {c.phone ? (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{c.phone}</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">No phone provided</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <AdminBadge
                          variant={
                            roleStr === 'ADMIN'
                              ? 'error'
                              : roleStr === 'DEVELOPER'
                              ? 'warning'
                              : 'primary'
                          }
                        >
                          {roleStr}
                        </AdminBadge>
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={c.enabled !== false ? 'ACTIVE' : 'DISABLED'} />
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <AdminButton
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpen360(c)}
                          leftIcon={<ExternalLink className="w-3 h-3" />}
                        >
                          Inspect 360
                        </AdminButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmptyState
            title="No customers found"
            description={search ? 'Try adjusting your search criteria.' : 'Registered users will appear here automatically.'}
            icon={<Users className="w-6 h-6 text-slate-400" />}
          />
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page <strong className="text-slate-900">{page + 1}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({totalElements} total)
            </span>
            <div className="flex gap-2">
              <AdminButton
                variant="secondary"
                size="sm"
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </AdminButton>
              <AdminButton
                variant="secondary"
                size="sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* Customer 360 Drilldown Modal (with Spring Exit Motion) */}
      <AdminModal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title={selectedCustomer ? `Customer 360° Profile: ${selectedCustomer.name || selectedCustomer.email}` : 'Customer Profile'}
        maxWidth="max-w-4xl"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-lg flex items-center justify-center">
                {selectedCustomer.name?.charAt(0).toUpperCase() || 'C'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{selectedCustomer.name}</h3>
                  <AdminBadge variant="primary">{formatRole(selectedCustomer.role)}</AdminBadge>
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                  <span>{selectedCustomer.email}</span>
                  <span>•</span>
                  <span>User ID #{selectedCustomer.id}</span>
                  {selectedCustomer.phone && (
                    <>
                      <span>•</span>
                      <span>{selectedCustomer.phone}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {loading360 ? (
              <div className="py-16 text-center text-slate-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-700" />
                <p className="text-sm font-medium">Aggregating real-time orders, licenses &amp; CRM history...</p>
              </div>
            ) : error360 ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {error360}
              </div>
            ) : customer360 ? (
              <>
                {/* Aggregate Real KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Revenue</div>
                    <div className="text-lg font-bold text-slate-900 mt-1">
                      ₹{(customer360.totalSpent || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Orders Processed</div>
                    <div className="text-lg font-bold text-slate-900 mt-1">
                      {customer360.totalOrdersCount || customer360.orders?.length || 0}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active Licenses</div>
                    <div className="text-lg font-bold text-slate-900 mt-1">
                      {customer360.licenses?.length || 0}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">CRM Inquiries</div>
                    <div className="text-lg font-bold text-slate-900 mt-1">
                      {customer360.totalLeadsCount || customer360.leads?.length || 0}
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs (with Animated Spring Pill Indicator) */}
                <AdminTabs
                  layoutId="customer-360-active-tab"
                  tabs={[
                    { id: 'overview', label: 'Overview & Profile' },
                    { id: 'orders', label: 'Orders', badge: customer360.orders?.length || 0 },
                    { id: 'licenses', label: 'Licenses', badge: customer360.licenses?.length || 0 },
                    { id: 'crm', label: 'CRM Leads', badge: customer360.leads?.length || 0 },
                  ]}
                  activeTab={active360Tab}
                  onChange={(t) => setActive360Tab(t as any)}
                  className="mb-2"
                />

                {/* Tab Views */}
                {active360Tab === 'overview' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Account Credentials</div>
                      <div className="space-y-1.5 text-slate-600">
                        <div><span className="text-slate-400">Full Name: </span><strong className="text-slate-900">{customer360.profile.name}</strong></div>
                        <div><span className="text-slate-400">Email: </span><span className="font-mono text-slate-900">{customer360.profile.email}</span></div>
                        <div><span className="text-slate-400">Phone: </span><span className="font-mono text-slate-900">{customer360.profile.phone || 'None'}</span></div>
                        <div><span className="text-slate-400">Company / Entity: </span><strong className="text-slate-900">{customer360.companyName || 'Not specified'}</strong></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Account Security</div>
                      <div className="space-y-2 text-slate-600">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Account Status:</span>
                          <StatusBadge status={customer360.profile.enabled !== false ? 'ACTIVE' : 'DISABLED'} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Email Verification:</span>
                          <span className="font-medium text-slate-900">{customer360.profile.emailVerified ? 'Verified' : 'Bypassed / Pending'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Member Since:</span>
                          <span className="font-mono text-slate-900">
                            {customer360.profile.createdAt ? new Date(customer360.profile.createdAt).toLocaleDateString() : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {active360Tab === 'orders' && (
                  <div className="space-y-2">
                    {(!customer360.orders || customer360.orders.length === 0) ? (
                      <AdminEmptyState
                        title="No order records"
                        description="This customer has not placed any commercial orders yet."
                        icon={<ShoppingBag className="w-5 h-5 text-slate-400" />}
                      />
                    ) : (
                      customer360.orders.map((o) => (
                        <div key={o.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-900">Order #{o.id}</div>
                            <div className="text-slate-500 mt-0.5">
                              {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''} • {o.items?.length || 0} items
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900">₹{o.totalAmount?.toLocaleString('en-IN')}</div>
                            <div className="mt-1"><StatusBadge status={o.status} /></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {active360Tab === 'licenses' && (
                  <div className="space-y-2">
                    {(!customer360.licenses || customer360.licenses.length === 0) ? (
                      <AdminEmptyState
                        title="No software licenses"
                        description="No software licenses or enterprise seats have been provisioned."
                        icon={<Key className="w-5 h-5 text-slate-400" />}
                      />
                    ) : (
                      customer360.licenses.map((lic) => (
                        <div key={lic.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-mono font-bold text-slate-900">{lic.licenseKey}</div>
                            <div className="text-slate-500 mt-0.5">
                              Product: {lic.product?.name || 'Enterprise License'} • Max Seats: {lic.activationLimit}
                            </div>
                          </div>
                          <StatusBadge status={lic.status} />
                        </div>
                      ))
                    )}
                  </div>
                )}

                {active360Tab === 'crm' && (
                  <div className="space-y-2">
                    {(!customer360.leads || customer360.leads.length === 0) ? (
                      <AdminEmptyState
                        title="No CRM inquiries"
                        description="No inquiries or leads are registered for this account."
                        icon={<MessageSquare className="w-5 h-5 text-slate-400" />}
                      />
                    ) : (
                      customer360.leads.map((lead) => (
                        <div key={lead.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-semibold text-slate-900">{lead.interestedProduct || lead.companyName || 'Lead #' + lead.id}</div>
                            <div className="text-slate-500 mt-0.5">
                              Source: {lead.source} • Priority: {lead.priority}
                            </div>
                          </div>
                          <StatusBadge status={lead.status} />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            ) : null}

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <AdminButton variant="secondary" onClick={() => setSelectedCustomer(null)}>
                Close Profile
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
