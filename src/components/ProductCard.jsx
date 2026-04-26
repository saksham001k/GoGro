import { useEffect, useRef, useState } from 'react';
import { FiCheck, FiPlus } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import ProductEmojiCard from './ProductEmojiCard';

const ADDED_RESET_MS = 1000;

/**
 * Storefront product tile. Click anywhere on the body to open the detail page,
 * tap "Add" to drop into the cart (which fires a top-right toast and animates
 * a brief "Added ✓" confirmation on the button).
 */
export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { success } = useToast();
  const navigate = useNavigate();

  const [justAdded, setJustAdded] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  if (!product?.id) return null;

  const stock = typeof product.stock === 'number' ? product.stock : 0;
  const inStock = stock > 0 && product.available !== false;
  const lowStock = inStock && stock <= 3;

  const goDetail = () => navigate(`/product/${product.id}`);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goDetail();
    }
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!inStock || justAdded) return;
    addItem(product, 1);
    success(`Added ${product.name} to cart`);
    setJustAdded(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setJustAdded(false), ADDED_RESET_MS);
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={goDetail}
      onKeyDown={handleKeyDown}
      className="card card-hover group flex h-full cursor-pointer flex-col overflow-hidden border border-gray-100 p-0 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-square overflow-hidden">
        <div className="transition-transform duration-300 group-hover:scale-[1.03]">
          <ProductEmojiCard product={product} size="default" className="h-full w-full" showPill={false} />
        </div>
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/55">
            <span className="text-sm font-semibold text-white">Out of stock</span>
          </div>
        )}
        {/* Animated green underline that grows on hover */}
        <span
          className="pointer-events-none absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-green-500 transition-all duration-300 group-hover:w-full"
          aria-hidden
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="inline-flex w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {product.category}
        </span>
        <h3 className="mt-2 line-clamp-2 min-h-[2.75rem] text-base font-semibold tracking-tight text-gray-900 group-hover:text-green-700">
          <Link
            to={`/product/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="hover:underline"
          >
            {product.name}
          </Link>
        </h3>

        {/* Stacked price: large green amount, small gray unit below */}
        <div className="mt-2">
          <p className="text-2xl font-bold tracking-tight text-green-700">₹{product.price}</p>
          <p className="text-xs text-gray-500">per {product.unit}</p>
        </div>

        {lowStock && (
          <p className="mt-1 text-xs font-semibold text-orange-500">Only {stock} left</p>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          {inStock ? (
            <button
              type="button"
              onClick={handleAdd}
              disabled={justAdded}
              aria-live="polite"
              className={[
                'inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200',
                justAdded
                  ? 'bg-emerald-500 cursor-default'
                  : 'bg-green-600 hover:bg-green-700 hover:shadow-md',
              ].join(' ')}
            >
              {justAdded ? (
                <>
                  <FiCheck className="h-4 w-4" aria-hidden />
                  Added
                </>
              ) : (
                <>
                  <FiPlus className="h-4 w-4" aria-hidden />
                  Add
                </>
              )}
            </button>
          ) : (
            <span className="text-sm font-semibold text-red-500">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
}
