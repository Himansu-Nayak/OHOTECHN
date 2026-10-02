'use client';

import * as React from 'react';
import { 
  Package, Search, Plus, Edit3, Trash2, CheckCircle2, 
  X, RefreshCw, AlertCircle, AlertTriangle, ArrowRight, Layers,
  ChevronLeft, ChevronRight, ToggleLeft, ToggleRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/context/ToastContext';
import { ProductDto, ProviderDto } from '@/api/types';
import { 
  getAdminProductsApi, 
  createAdminProductApi, 
  updateAdminProductApi, 
  updateAdminProductStatusApi, 
  deleteAdminProductApi,
  getCategoriesApi 
} from '@/api/products';
import { getAllActiveProvidersApi } from '@/api/providers';
import { 
  AdminCard, AdminBadge, StatusBadge, AdminButton, 
  AdminInput, AdminSelect, AdminEmptyState, AdminTableSkeleton, 
  AdminModal, AdminConfirmDialog 
} from './AdminUiPrimitives';

export function AdminProductsView() {
  const { showToast } = useToast();
  const [products, setProducts] = React.useState<ProductDto[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [providers, setProviders] = React.useState<ProviderDto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Pagination & Filtering
  const [page, setPage] = React.useState(0);
  const [pageSize] = React.useState(10);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Partial<ProductDto> | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Destructive Delete Confirmation
  const [productToDelete, setProductToDelete] = React.useState<ProductDto | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const fetchCategories = React.useCallback(async () => {
    try {
      const res = await getCategoriesApi();
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (e) {
      console.warn('Failed to load categories', e);
    }
  }, []);

  const fetchProducts = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const activeParam = statusFilter === 'ACTIVE' ? true : statusFilter === 'INACTIVE' ? false : undefined;
      const catParam = selectedCategory ? Number(selectedCategory) : undefined;
      const res = await getAdminProductsApi(page, pageSize, searchQuery, catParam, activeParam);
      if (res.success && res.data) {
        setProducts(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
        setTotalElements(res.data.totalElements || 0);
      } else {
        setErrorMsg(res.message || 'Failed to retrieve products');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error connecting to product repository');
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, searchQuery, selectedCategory, statusFilter]);

  const fetchProviders = React.useCallback(async () => {
    try {
      const res = await getAllActiveProvidersApi();
      if (res.success && res.data) {
        setProviders(res.data);
      }
    } catch (e) {
      console.warn('Failed to load active providers', e);
    }
  }, []);

  React.useEffect(() => {
    fetchCategories();
    fetchProviders();
  }, [fetchCategories, fetchProviders]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleStatus = async (product: ProductDto) => {
    try {
      const nextActive = !product.active;
      const res = await updateAdminProductStatusApi(product.id, nextActive);
      if (res.success) {
        showToast(`Product "${product.name}" is now ${nextActive ? 'Active' : 'Draft'}`, 'success');
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, active: nextActive } : p))
        );
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update status', 'error');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct({
      name: '',
      description: '',
      price: 0,
      providerCost: 0,
      resellerMargin: 0,
      providerId: undefined,
      stock: 100,
      active: true,
      serviceType: 'Software',
      integrationStatus: 'Integration pending provider/API information',
      deploymentType: 'MANAGED_CLOUD',
      categoryId: categories.length > 0 ? categories[0].id : 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: ProductDto) => {
    setEditingProduct({ ...p });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name?.trim()) {
      showToast('Product name is required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<ProductDto> = {
        name: editingProduct.name,
        description: editingProduct.description || '',
        price: Number(editingProduct.price),
        providerCost: editingProduct.providerCost !== undefined ? Number(editingProduct.providerCost) : undefined,
        resellerMargin: editingProduct.resellerMargin !== undefined ? Number(editingProduct.resellerMargin) : undefined,
        providerId: editingProduct.providerId ? Number(editingProduct.providerId) : undefined,
        integrationStatus: editingProduct.integrationStatus || 'Integration pending provider/API information',
        deploymentType: editingProduct.deploymentType || 'MANAGED_CLOUD',
        demoUrl: editingProduct.demoUrl || '',
        documentationUrl: editingProduct.documentationUrl || '',
        stock: Number(editingProduct.stock || 100),
        categoryId: Number(editingProduct.categoryId || 1),
        serviceType: editingProduct.serviceType || 'Software',
        imageUrl: editingProduct.imageUrl || '/OHO_TECH_LOGO.png',
      };

      if (editingProduct.id) {
        const res = await updateAdminProductApi(editingProduct.id, payload);
        if (res.success) {
          showToast('Product updated successfully', 'success');
          setIsModalOpen(false);
          fetchProducts();
        }
      } else {
        const res = await createAdminProductApi(payload);
        if (res.success) {
          showToast('Product created successfully', 'success');
          setIsModalOpen(false);
          fetchProducts();
        }
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to save product', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteAdminProductApi(productToDelete.id);
      if (res.success) {
        showToast(`Product "${productToDelete.name}" deleted`, 'success');
        setProductToDelete(null);
        fetchProducts();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage turnkey software solutions, pricing tiers, and active catalog visibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AdminButton
            variant="secondary"
            size="sm"
            onClick={fetchProducts}
            icon={RefreshCw}
          >
            Refresh
          </AdminButton>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={handleOpenCreateModal}
            icon={Plus}
          >
            New Product
          </AdminButton>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search products by title or description..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer w-full md:w-44"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 cursor-pointer w-full md:w-32"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Draft</option>
          </select>
        </div>
      </div>

      {/* 3. Products Table */}
      <AdminCard
        title={
          <span className="flex items-center gap-2">
            <span>Product Inventory</span>
            <span className="text-xs font-normal text-slate-400">
              ({totalElements} total solutions)
            </span>
          </span>
        }
      >
        {isLoading ? (
          <AdminTableSkeleton rows={8} cols={5} />
        ) : errorMsg ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-800">{errorMsg}</p>
            <AdminButton variant="secondary" size="sm" onClick={fetchProducts} className="mt-3">
              Retry
            </AdminButton>
          </div>
        ) : products.length === 0 ? (
          <AdminEmptyState
            title="No products found"
            description={
              searchQuery || selectedCategory || statusFilter !== 'ALL'
                ? 'No software solutions match your filter criteria. Try clearing filters.'
                : 'There are no products in the database catalog.'
            }
            icon={Package}
            action={
              (searchQuery || selectedCategory || statusFilter !== 'ALL') && (
                <AdminButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                    setStatusFilter('ALL');
                  }}
                >
                  Clear Filters
                </AdminButton>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-[11px] font-semibold">
                  <th className="px-5 py-3">Product Name</th>
                  <th className="px-4 py-3">Category &amp; Provider</th>
                  <th className="px-4 py-3">Selling Price</th>
                  <th className="px-4 py-3">Wholesale / Margin</th>
                  <th className="px-4 py-3">Integration</th>
                  <th className="px-4 py-3">Catalog Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => {
                  const priceFormatted = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  }).format(Number(p.price || 0));

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-900 block">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {p.description || 'No description provided'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 whitespace-nowrap space-y-1">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200 block w-fit">
                          {p.categoryName || 'General'}
                        </span>
                        {p.providerName ? (
                          <span className="text-[10px] text-indigo-700 font-semibold block">
                            Agency: {p.providerName}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic block">
                            Direct Solution
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                        {priceFormatted}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-[11px]">
                        {p.providerCost !== undefined && p.providerCost !== null ? (
                          <div>
                            <div className="text-slate-600">Cost: ₹{Number(p.providerCost).toLocaleString('en-IN')}</div>
                            <div className="text-emerald-600 font-bold">Margin: ₹{Number(p.resellerMargin || 0).toLocaleString('en-IN')}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border",
                          p.integrationStatus?.includes('pending')
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200"
                        )}>
                          {p.integrationStatus?.includes('pending') ? 'Pending API' : (p.integrationStatus || 'Verified')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p)}
                          className="flex items-center gap-1.5 cursor-pointer"
                          title="Click to toggle active state"
                        >
                          {p.active ? (
                            <AdminBadge variant="success">Active</AdminBadge>
                          ) : (
                            <AdminBadge variant="neutral">Draft</AdminBadge>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit product"
                            aria-label={`Edit ${p.name}`}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete product"
                            aria-label={`Delete ${p.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-slate-100 -mx-5 -mb-5 bg-slate-50/50 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Page {page + 1} of {totalPages} ({totalElements} items)
            </span>
            <div className="flex items-center gap-1.5">
              <AdminButton
                variant="outline"
                size="sm"
                disabled={page <= 0}
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              >
                Previous
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
              >
                Next
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* 4. Create / Edit Product Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct?.id ? 'Edit Product' : 'Add New Solution'}
        subtitle={editingProduct?.id ? `Product ID #${editingProduct.id}` : 'Create a new software offering'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <AdminInput
            label="Product Title *"
            required
            value={editingProduct?.name || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
            placeholder="e.g. Cooperative Banking & Society ERP"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminSelect
              label="Product Category"
              value={editingProduct?.categoryId || (categories[0]?.id ?? 1)}
              onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: Number(e.target.value) })}
              options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
            />

            <AdminSelect
              label="Software Provider Agency"
              value={editingProduct?.providerId ? String(editingProduct.providerId) : ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : undefined;
                setEditingProduct({ ...editingProduct, providerId: val });
              }}
              options={[
                { value: '', label: 'None (Direct In-House OHO Solution)' },
                ...providers.map((p) => ({ value: String(p.id), label: `${p.name} (${p.commercialTerms || 'Agency'})` })),
              ]}
            />
          </div>

          {/* Pricing Architecture: Wholesale Cost + Margin = Selling Price */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Wholesale Pricing &amp; Margin Engine
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <AdminInput
                label="Wholesale Cost (INR)"
                type="number"
                value={editingProduct?.providerCost !== undefined ? String(editingProduct.providerCost) : ''}
                onChange={(e) => {
                  const cost = Number(e.target.value || 0);
                  const margin = Number(editingProduct?.resellerMargin || 0);
                  setEditingProduct({
                    ...editingProduct,
                    providerCost: cost,
                    price: cost + margin > 0 ? cost + margin : Number(editingProduct?.price || 0),
                  });
                }}
                placeholder="25000"
              />

              <AdminInput
                label="OHO Margin (INR)"
                type="number"
                value={editingProduct?.resellerMargin !== undefined ? String(editingProduct.resellerMargin) : ''}
                onChange={(e) => {
                  const margin = Number(e.target.value || 0);
                  const cost = Number(editingProduct?.providerCost || 0);
                  setEditingProduct({
                    ...editingProduct,
                    resellerMargin: margin,
                    price: cost + margin > 0 ? cost + margin : Number(editingProduct?.price || 0),
                  });
                }}
                placeholder="10000"
              />

              <AdminInput
                label="Customer Selling Price (INR) *"
                type="number"
                required
                value={editingProduct?.price || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                placeholder="35000"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminSelect
              label="Deployment Architecture"
              value={editingProduct?.deploymentType || 'MANAGED_CLOUD'}
              onChange={(e) => setEditingProduct({ ...editingProduct, deploymentType: e.target.value })}
              options={[
                { value: 'MANAGED_CLOUD', label: 'Managed Cloud (Automated Provisioning)' },
                { value: 'SAAS', label: 'Hosted SaaS Multi-Tenant' },
                { value: 'SELF_HOSTED', label: 'Self-Hosted / VPS Deployment' },
                { value: 'DESKTOP_INSTALL', label: 'Desktop Installer (Windows/Mac)' },
                { value: 'MANUAL_SETUP', label: 'Manual Engineer Setup' },
              ]}
            />

            <AdminInput
              label="Integration Status"
              value={editingProduct?.integrationStatus || 'Integration pending provider/API information'}
              onChange={(e) => setEditingProduct({ ...editingProduct, integrationStatus: e.target.value })}
              placeholder="Integration pending provider/API information"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminInput
              label="Live Demo URL (Optional)"
              value={editingProduct?.demoUrl || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, demoUrl: e.target.value })}
              placeholder="https://demo.ohotechn.com"
            />

            <AdminInput
              label="Documentation URL (Optional)"
              value={editingProduct?.documentationUrl || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, documentationUrl: e.target.value })}
              placeholder="https://docs.ohotechn.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Description</label>
            <textarea
              rows={3}
              value={editingProduct?.description || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="w-full px-3 py-2 text-xs text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-colors"
              placeholder="Describe key modules, features, and target industries..."
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <AdminButton variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" size="sm" type="submit" isLoading={isSaving}>
              {editingProduct?.id ? 'Save Changes' : 'Create Product'}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      {/* 5. Destructive Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Software Product?"
        description={`Are you sure you want to delete "${productToDelete?.name}"? This will remove the offering from the catalog.`}
        confirmLabel="Delete Product"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
