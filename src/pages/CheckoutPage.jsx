import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';
import { useToast } from '../contexts/ToastContext';

const initialForm = { name: '', address: '', city: '', pincode: '', phone: '' };
const phone10 = /^\d{10}$/;
const pincode6 = /^\d{6}$/;

export default function CheckoutPage() {
  const { currentUser } = useAuth();
  const { items, totalPrice, deliveryFee, orderTotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { error: toastError } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(() => ({ ...initialForm, name: currentUser?.name || '' }));
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.pincode.trim()) e.pincode = 'PIN code is required';
    else if (!pincode6.test(form.pincode.trim())) e.pincode = 'Enter a 6-digit PIN code';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!phone10.test(form.phone.trim())) e.phone = 'Enter a 10-digit mobile number';
    return e;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setErrors({});
    setSubmitting(true);

    // Simulate processing — 2 seconds for both methods.
    await new Promise((r) => {
      window.setTimeout(r, 2000);
    });

    try {
      const lineItems = items.map((i) => ({
        productId: String(i.id),
        name: i.name,
        price: i.price,
        unit: i.unit,
        quantity: i.quantity,
      }));

      const orderId = addOrder({
        userId: currentUser.email,
        items: lineItems,
        totalAmount: orderTotal,
        deliveryFee,
        deliveryAddress: {
          name: form.name.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          pincode: form.pincode.trim(),
          phone: form.phone.trim(),
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      });
      clearCart();
      navigate(`/order-success/${orderId}`, { replace: true });
    } catch (err) {
      console.error('Order failed', err);
      toastError('Could not place your order. Please try again.');
      setSubmitting(false);
    }
  };

  const errorClass = (key) => (errors[key] ? 'border-red-400 focus:border-red-500' : '');

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800">
        <FiArrowLeft className="h-4 w-4" /> Back to cart
      </Link>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">Checkout</h1>
      <p className="mt-1 text-sm text-gray-600">We'll deliver to the address below.</p>

      {submitting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 p-6 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <div className="card w-full max-w-sm p-6 text-center shadow-xl">
            <div
              className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-green-600"
              aria-hidden
            />
            <p className="mt-3 text-base font-semibold text-gray-900">Placing your order…</p>
            <p className="mt-1 text-xs text-gray-500">Hang tight, this only takes a moment.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-12" noValidate>
        <div className="space-y-6 lg:col-span-7">
          <fieldset className="card space-y-5 p-5 sm:p-6">
            <legend className="text-lg font-bold text-gray-900">Delivery address</legend>
            <div>
              <label htmlFor="co-name" className="mb-1 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                id="co-name"
                type="text"
                autoComplete="name"
                className={['input-underline', errorClass('name')].join(' ')}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={submitting}
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="co-address" className="mb-1 block text-sm font-medium text-gray-700">
                Street / building
              </label>
              <textarea
                id="co-address"
                rows={2}
                autoComplete="street-address"
                className={['input-underline resize-y', errorClass('address')].join(' ')}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                disabled={submitting}
                aria-invalid={!!errors.address}
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="co-city" className="mb-1 block text-sm font-medium text-gray-700">City</label>
                <input
                  id="co-city"
                  type="text"
                  autoComplete="address-level2"
                  className={['input-underline', errorClass('city')].join(' ')}
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  disabled={submitting}
                  aria-invalid={!!errors.city}
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="co-pin" className="mb-1 block text-sm font-medium text-gray-700">PIN code</label>
                <input
                  id="co-pin"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="postal-code"
                  className={['input-underline', errorClass('pincode')].join(' ')}
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  disabled={submitting}
                  aria-invalid={!!errors.pincode}
                />
                {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="co-phone" className="mb-1 block text-sm font-medium text-gray-700">Mobile number</label>
              <input
                id="co-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel"
                placeholder="10-digit number"
                className={['input-underline', errorClass('phone')].join(' ')}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                disabled={submitting}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
          </fieldset>

          <fieldset className="card space-y-3 p-5 sm:p-6" role="radiogroup" aria-labelledby="payment-legend">
            <legend id="payment-legend" className="text-lg font-bold text-gray-900">Payment</legend>
            <p className="text-sm text-gray-600">Choose how you'd like to pay.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { id: 'cod', label: 'Cash on delivery', description: 'Pay when the order arrives.', Icon: FiDollarSign },
                { id: 'online', label: 'Online payment', description: 'Mock pay — instantly marked paid.', Icon: FiCreditCard },
              ].map(({ id, label, description, Icon }) => {
                const active = paymentMethod === id;
                return (
                  <label
                    key={id}
                    htmlFor={`pay-${id}`}
                    className={[
                      'flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-all duration-200',
                      active
                        ? 'border-green-600 bg-green-50 ring-glow-green'
                        : 'border-gray-200 hover:border-gray-300',
                    ].join(' ')}
                  >
                    <input
                      id={`pay-${id}`}
                      type="radio"
                      name="pay"
                      className="sr-only"
                      checked={active}
                      onChange={() => setPaymentMethod(id)}
                      disabled={submitting}
                    />
                    <span
                      className={[
                        'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                        active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600',
                      ].join(' ')}
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-gray-900">{label}</span>
                      <span className="mt-0.5 block text-xs text-gray-500">{description}</span>
                    </span>
                    <span
                      className={[
                        'mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                        active ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300 bg-white',
                      ].join(' ')}
                      aria-hidden
                    >
                      {active && <FiCheck className="h-3 w-3" />}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Placing your order…' : 'Place order'}
          </button>
        </div>

        <aside className="card h-fit p-5 lg:col-span-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-gray-900">Order summary</h2>
          <ul className="mt-3 max-h-44 space-y-2 overflow-y-auto text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 text-gray-700">
                <span className="min-w-0 truncate">
                  {i.name} <span className="text-gray-400">× {i.quantity}</span>
                </span>
                <span className="font-medium text-gray-900">₹{i.price * i.quantity}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-gray-100 pt-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <dt>Subtotal</dt>
              <dd>₹{totalPrice}</dd>
            </div>
            <div className="flex justify-between text-gray-600">
              <dt>Delivery</dt>
              <dd>₹{deliveryFee}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
              <dt>Total</dt>
              <dd>₹{orderTotal}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-gray-500">
            Order history is stored in your browser only.
          </p>
        </aside>
      </form>
    </div>
  );
}
