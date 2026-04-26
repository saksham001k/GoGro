import { FiPackage } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';
import EmptyState from '../components/EmptyState';

function formatDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '—';
  }
}

function statusBadgeClass(status) {
  const s = (status || 'placed').toLowerCase();
  if (s === 'delivered') return 'bg-green-100 text-green-800';
  if (s === 'packed') return 'bg-amber-100 text-amber-800';
  if (s === 'cancelled') return 'bg-red-100 text-red-800';
  return 'bg-blue-100 text-blue-800';
}

function statusLabel(status) {
  const s = (status || 'placed').toLowerCase();
  if (s === 'packed') return 'Packed';
  if (s === 'delivered') return 'Delivered';
  if (s === 'cancelled') return 'Cancelled';
  return 'Placed';
}

function paymentLabel(method, status) {
  const m = method === 'online' ? 'Online' : 'Cash on delivery';
  const s = (status || '').toLowerCase();
  const sl = s === 'paid' ? 'Paid' : s === 'pending' ? 'Pending' : status || '';
  return sl ? `${m} · ${sl}` : m;
}

function itemsLine(items) {
  if (!items || !items.length) return 'No items';
  const head = items
    .slice(0, 3)
    .map((i) => `${i.name} × ${i.quantity}`)
    .join(' · ');
  return items.length > 3 ? `${head} +${items.length - 3} more` : head;
}

export default function OrderTrackingPage() {
  const { currentUser } = useAuth();
  const { getOrdersForUser } = useOrders();
  const orders = currentUser ? getOrdersForUser(currentUser.email) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">My orders</h1>
      <p className="mt-1 text-sm text-gray-600">Track everything you've ordered on this device.</p>

      {orders.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={<FiPackage className="h-7 w-7" />}
            title="No orders yet"
            message="Once you place your first order, you'll see it here with its delivery status."
            actionText="Start shopping"
            actionLink="/"
          />
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="card p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Order</p>
                  <p className="select-all font-mono text-sm font-medium text-gray-900">{order.id}</p>
                  <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <span
                  className={[
                    'inline-flex w-fit rounded-full px-3 py-0.5 text-xs font-semibold',
                    statusBadgeClass(order.status),
                  ].join(' ')}
                >
                  {statusLabel(order.status)}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-700">{itemsLine(order.items)}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                <p className="text-lg font-bold text-gray-900">₹{order.totalAmount ?? 0}</p>
                <p className="text-xs text-gray-500 sm:text-sm">
                  {paymentLabel(order.paymentMethod, order.paymentStatus)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
