/**
 * ProductContext — catalog stored in localStorage. Seeds from the bundled mock
 * data on first run, then exposes simple CRUD for the admin area.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';

const PRODUCTS_KEY = 'gogro_products';
const SEED_VERSION_KEY = 'gogro_products_seed_version';
/**
 * Bump this whenever the bundled `PRODUCTS` array changes shape (e.g. emoji
 * field) so existing visitors get a clean re‑seed instead of stale localStorage.
 */
const SEED_VERSION = 3;

function readProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeProducts(list) {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

function readSeedVersion() {
  try {
    const raw = localStorage.getItem(SEED_VERSION_KEY);
    return raw == null ? null : Number(raw);
  } catch {
    return null;
  }
}

function writeSeedVersion(v) {
  try {
    localStorage.setItem(SEED_VERSION_KEY, String(v));
  } catch {
    /* ignore */
  }
}

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedVersion = readSeedVersion();
    const stored = readProducts();

    // Force a clean re-seed when the bundled catalog version changes (e.g.
    // catalog version changes). Admin edits persist across reloads otherwise.
    if (storedVersion !== SEED_VERSION || !stored || stored.length === 0) {
      try {
        localStorage.removeItem(PRODUCTS_KEY);
      } catch {
        /* ignore */
      }
      writeProducts(PRODUCTS);
      writeSeedVersion(SEED_VERSION);
      setProducts(PRODUCTS);
    } else {
      setProducts(stored);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) writeProducts(products);
  }, [products, loading]);

  const addProduct = useCallback((product) => {
    const id = product.id || `p-${Date.now()}`;
    const next = {
      id,
      name: '',
      category: 'Fruits',
      price: 0,
      unit: '',
      emoji: '',
      description: '',
      stock: 0,
      available: true,
      ...product,
    };
    setProducts((prev) => [next, ...prev]);
    return id;
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates, id: p.id } : p)));
  }, []);

  /** Soft delete — hides the product from the storefront. */
  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, available: false } : p)));
  }, []);

  const resetToInitial = useCallback(() => {
    setProducts(PRODUCTS);
  }, []);

  const getProductById = useCallback(
    (id) => products.find((p) => String(p.id) === String(id)) || null,
    [products]
  );

  const availableProducts = useMemo(
    () => products.filter((p) => p.available !== false),
    [products]
  );

  const value = useMemo(
    () => ({
      products,
      availableProducts,
      categories: CATEGORIES,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      resetToInitial,
      getProductById,
    }),
    [products, availableProducts, loading, addProduct, updateProduct, deleteProduct, resetToInitial, getProductById]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
