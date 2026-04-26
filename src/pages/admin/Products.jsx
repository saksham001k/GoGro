import { useMemo, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { CATEGORY_NAMES } from '../../data/categories';
import ProductEmojiCard from '../../components/ProductEmojiCard';

const emptyForm = {
  name: '',
  category: 'Fruits',
  price: '',
  unit: '',
  emoji: '',
  description: '',
  stock: '',
  available: true,
};

const CATEGORY_OPTIONS = CATEGORY_NAMES.filter((c) => c !== 'All');

function validateForm(form) {
  const errors = {};
  if (!form.name?.trim()) errors.name = 'Name is required';
  if (!form.category?.trim()) errors.category = 'Category is required';
  const price = parseFloat(form.price);
  if (Number.isNaN(price) || price <= 0) errors.price = 'Enter a price greater than 0';
  if (!form.unit?.trim()) errors.unit = 'Unit is required (e.g. 1 kg)';
  if (!form.emoji?.trim()) errors.emoji = 'Add an emoji (e.g. 🍎)';
  if (!form.description?.trim()) errors.description = 'Description is required';
  const stock = parseInt(form.stock, 10);
  if (Number.isNaN(stock) || stock < 0) errors.stock = 'Stock must be a number ≥ 0';
  return {
    errors,
    values: {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number.isFinite(price) ? price : 0,
      unit: form.unit.trim(),
      emoji: form.emoji.trim(),
      description: form.description.trim(),
      stock: Number.isFinite(stock) ? stock : 0,
      available: !!form.available,
    },
  };
}

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { success, error: toastError } = useToast();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...products]
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      .filter((p) => !q || (p.name || '').toLowerCase().includes(q));
  }, [products, search]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || '',
      category: p.category || 'Fruits',
      price: p.price != null ? String(p.price) : '',
      unit: p.unit || '',
      emoji: p.emoji || '',
      description: p.description || '',
      stock: p.stock != null ? String(p.stock) : '0',
      available: p.available !== false,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { errors, values } = validateForm(form);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    if (editingId) {
      updateProduct(editingId, values);
      success(`Updated ${values.name}`);
    } else {
      addProduct(values);
      success(`Added ${values.name}`);
    }
    closeModal();
  };

  const handleSoftDelete = (p) => {
    if (!window.confirm(`Hide "${p.name}" from the shop? It will be marked unavailable.`)) return;
    deleteProduct(p.id);
    toastError(`${p.name} hidden from storefront`);
  };

  const handleToggleAvailable = (p) => {
    updateProduct(p.id, { available: !p.available });
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Products</h2>
          <p className="mt-1 text-sm text-gray-600">All items, including hidden ones. Edits save to this device.</p>
        </div>
        <button type="button" onClick={openAdd} className="btn-primary">
          <FiPlus className="mr-2 h-4 w-4" />
          Add product
        </button>
      </div>

      <div className="mt-6">
        <label htmlFor="ap-search" className="sr-only">Search products</label>
        <input
          id="ap-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name…"
          className="w-full max-w-md rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          autoComplete="off"
        />
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Visible</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((p) => (
              <tr key={p.id} className="odd:bg-white even:bg-gray-50/50 hover:bg-green-50/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 border border-gray-100">
                      <ProductEmojiCard product={p} size="tiny" />
                    </div>
                    <div className="font-medium text-gray-900">{p.name}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">{p.category}</span>
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">₹{p.price}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <label className="inline-flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={p.available !== false}
                      onChange={() => handleToggleAvailable(p)}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-xs font-medium text-gray-600">
                      {p.available !== false ? 'Visible' : 'Hidden'}
                    </span>
                  </label>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:text-green-700"
                      aria-label={`Edit ${p.name}`}
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSoftDelete(p)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50"
                      aria-label={`Hide ${p.name}`}
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-gray-500">No products match the filter.</p>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
          role="dialog"
          aria-modal
          aria-labelledby="ap-modal-title"
          onMouseDown={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            className="max-h-[min(100dvh,100%)] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-gray-100 bg-white p-6 shadow-lg sm:max-h-[90vh] sm:rounded-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 id="ap-modal-title" className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit product' : 'Add product'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
              <div>
                <label htmlFor="pf-name" className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
                <input
                  id="pf-name"
                  className="input-underline"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="pf-category" className="mb-1 block text-sm font-medium text-gray-700">Category *</label>
                <select
                  id="pf-category"
                  className="input-underline"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {formErrors.category && <p className="mt-1 text-xs text-red-600">{formErrors.category}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="pf-price" className="mb-1 block text-sm font-medium text-gray-700">Price (₹) *</label>
                  <input
                    id="pf-price"
                    type="number"
                    step="0.01"
                    min="0"
                    className="input-underline"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  />
                  {formErrors.price && <p className="mt-1 text-xs text-red-600">{formErrors.price}</p>}
                </div>
                <div>
                  <label htmlFor="pf-unit" className="mb-1 block text-sm font-medium text-gray-700">Unit *</label>
                  <input
                    id="pf-unit"
                    className="input-underline"
                    placeholder="e.g. 1 kg"
                    value={form.unit}
                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                  />
                  {formErrors.unit && <p className="mt-1 text-xs text-red-600">{formErrors.unit}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="pf-emoji" className="mb-1 block text-sm font-medium text-gray-700">Emoji *</label>
                <input
                  id="pf-emoji"
                  className="input-underline"
                  placeholder="e.g. 🍎"
                  value={form.emoji}
                  onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                />
                {formErrors.emoji && <p className="mt-1 text-xs text-red-600">{formErrors.emoji}</p>}
              </div>
              <div>
                <label htmlFor="pf-desc" className="mb-1 block text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  id="pf-desc"
                  rows={3}
                  className="input-underline resize-y"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
                {formErrors.description && <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>}
              </div>
              <div>
                <label htmlFor="pf-stock" className="mb-1 block text-sm font-medium text-gray-700">Stock *</label>
                <input
                  id="pf-stock"
                  type="number"
                  min="0"
                  step="1"
                  className="input-underline"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                />
                {formErrors.stock && <p className="mt-1 text-xs text-red-600">{formErrors.stock}</p>}
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700" htmlFor="pf-available">
                <input
                  id="pf-available"
                  type="checkbox"
                  checked={!!form.available}
                  onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                Available in store
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="btn-outline">Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingId ? 'Save changes' : 'Add product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
