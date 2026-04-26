import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import CartItem from '../components/CartItem';
import EmptyState from '../components/EmptyState';

export default function CartPage() {
  const { items, totalPrice, deliveryFee, orderTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={<FiShoppingCart className="h-7 w-7" />}
          title="Your cart is empty"
          message="Browse fresh produce, dairy, and pantry staples — your cart is ready when you are."
          actionText="Start shopping"
          actionLink="/"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">Shopping cart</h1>
      <p className="mt-1 text-sm text-gray-600">
        Review the items in your cart, then proceed to checkout.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <li key={item.id}>
              <CartItem item={item} />
            </li>
          ))}
          <li>
            <Link
              to="/"
              className="inline-flex items-center gap-1 pt-2 text-sm font-semibold text-green-700 hover:text-green-800"
            >
              <FiArrowLeft className="h-4 w-4" /> Continue shopping
            </Link>
          </li>
        </ul>

        <aside className="card h-fit p-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold tracking-tight text-gray-900">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <dt>Subtotal</dt>
              <dd className="font-medium text-gray-900">₹{totalPrice}</dd>
            </div>
            <div className="flex justify-between text-gray-600">
              <dt>Delivery fee</dt>
              <dd className="font-medium text-gray-900">₹{deliveryFee}</dd>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between text-base font-bold text-gray-900">
                <dt>Total</dt>
                <dd>₹{orderTotal}</dd>
              </div>
            </div>
          </dl>
          <Link to="/checkout" className="btn-primary mt-5 w-full">
            Proceed to checkout
          </Link>
          <p className="mt-3 text-center text-xs text-gray-500">
            Flat ₹{deliveryFee} delivery fee · Cash or online payment supported.
          </p>
        </aside>
      </div>
    </div>
  );
}
