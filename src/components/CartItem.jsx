import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import ProductEmojiCard from './ProductEmojiCard';

/**
 * One row inside the cart. Owns its own quantity controls and remove button.
 */
export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  const max = typeof item.stock === 'number' && Number.isFinite(item.stock)
    ? item.stock
    : Number.POSITIVE_INFINITY;
  const atMax = item.quantity >= max;

  return (
    <div className="card card-hover flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="shrink-0 border border-gray-100">
          <ProductEmojiCard product={item} size="small" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500">
            ₹{item.price}
            <span className="text-gray-400"> / {item.unit}</span>
          </p>
          <p className="mt-1 text-sm font-medium text-gray-700">
            Subtotal: ₹{item.price * item.quantity}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap sm:justify-end">
        <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <FiMinus className="h-4 w-4" />
          </button>
          <span className="min-w-[2rem] text-center text-sm font-semibold text-gray-900">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={atMax}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <FiPlus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => removeItem(item.id)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600"
        >
          <FiTrash2 className="h-4 w-4" />
          Remove
        </button>
      </div>
    </div>
  );
}
