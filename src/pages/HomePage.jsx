import { useMemo, useState } from 'react';
import { FiSearch, FiTruck } from 'react-icons/fi';
import { useProducts } from '../contexts/ProductContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=720&h=720&fit=crop';

/**
 * Home / product listing page. Hosts the hero, category chips, search, and
 * the responsive product grid.
 */
export default function HomePage() {
  const { availableProducts, categories, loading } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return availableProducts.filter((p) => {
      const matchesSearch = !q || (p.name || '').toLowerCase().includes(q);
      const matchesCategory = category === 'All' || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [availableProducts, search, category]);

  const onShopNow = (e) => {
    e.preventDefault();
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-600 text-white">
        <div className="hero-pattern absolute inset-0 opacity-50" aria-hidden />
        <div
          className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-24 pt-16 md:pb-28 md:pt-20 lg:grid-cols-2 lg:gap-14 lg:pb-32 lg:pt-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <FiTruck className="h-3.5 w-3.5" /> Same‑day delivery
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              Fresh groceries delivered{' '}
              <span className="text-amber-200">in minutes</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-emerald-50/90 md:text-lg">
              Hand‑picked produce, dairy, and pantry staples from local stores — at prices you'll love.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#products"
                onClick={onShopNow}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-emerald-700 shadow-lg transition-colors hover:bg-emerald-50 sm:text-base"
              >
                Browse Products
                <span aria-hidden>→</span>
              </a>
              <span className="text-sm text-emerald-50/90">No minimum order</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium backdrop-blur-sm">
                <span aria-hidden>⭐</span> 4.8 Rating
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium backdrop-blur-sm">
                <span aria-hidden>🕒</span> Delivery in 30 mins
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 font-medium backdrop-blur-sm">
                <span aria-hidden>🚚</span> Flat ₹40 delivery
              </span>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative mx-auto w-full max-w-md">
              <div
                className="absolute -inset-8 rounded-[2.5rem] bg-amber-300/25 blur-3xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-[2rem] border-4 border-white/30 shadow-2xl">
                <img
                  src={HERO_IMAGE}
                  alt="A reusable paper bag full of fresh groceries"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white/95 p-3 shadow-xl backdrop-blur sm:block">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Today's basket
                </p>
                <p className="text-base font-bold text-gray-900">20 fresh items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider into the white chip bar below */}
        <svg
          className="block h-12 w-full text-white sm:h-16"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0,40 C240,90 480,90 720,52 C960,14 1200,14 1440,42 L1440,80 L0,80 Z"
          />
        </svg>
      </section>

      {/* CATEGORY CHIPS */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="-mx-1 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Categories">
            {categories.map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(c.id)}
                  className={['chip', active ? 'chip-active' : 'chip-idle'].join(' ')}
                >
                  <span aria-hidden className="text-base leading-none">{c.emoji}</span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <section id="products" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-14 md:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
              <span aria-hidden>🌿</span> Our Products
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {filtered.length} items {category !== 'All' ? `in ${category}` : ''}
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <FiSearch
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <label htmlFor="home-search" className="sr-only">Search products</label>
            <input
              id="home-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="w-full min-h-[44px] rounded-full border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="mt-8">
          {loading && <Loader label="Stocking the shelves…" />}

          {!loading && filtered.length === 0 && (
            <EmptyState
              icon={<FiSearch className="h-7 w-7" />}
              title={search.trim() ? `We couldn't find "${search.trim()}"` : 'No products match'}
              message="Try a different search term or pick another category."
              actionText="Clear filters"
              actionOnClick={() => {
                setSearch('');
                setCategory('All');
              }}
            />
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
