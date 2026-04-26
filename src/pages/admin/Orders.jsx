import { useMemo, useState } from 'react';
import { useOrders } from '../../contexts/OrderContext';
import { useToast } from '../../contexts/ToastContext';

const STATUS_OPTIONS = ['placed', 'packed', 'delivered', 'cancelled'];

function statusClass(status) {
  const s = (status || 'placed').toLowerCase();
  if (s === 'delivered') return 'bg-green-100 text-green-800';
  if (s === 'packed') return 'bg-amber-100 text-amber-800';
  if (s === 'cancelled') return 'bg-red-100 text-red-800';
  return 'bg-blue-100 text-blue-800';
}

function paymentLine(method, status) {
  const m = method === 'online' ? 'Online' : 'COD';
  const s = (status || '').toLowerCase();
  const label = s === 'paid' ? 'Paid' : s === 'pending' ? 'Pending' : status || '';
  return label ? `${m} · ${label}` : m;
}

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

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders();
  const { success } = useToast();
  const [filter, setFilter] = useState('all');

  const visible = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((o) => (o.status || '').toLowerCase() === filter);
  }, [orders, filter]);

  const handleStatusChange = (orderId, status) => {
    updateOrderStatus(orderId, status);
    success(`Order ${orderId} → ${status}`);
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Orders</h2>
          <p className="mt-1 text-sm text-gray-600">Update order status as items move through fulfilment.</p>
        </div>
        <div>
          <label htmlFor="status-filter" className="sr-only">Filter status</label>
          <select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.map((o) => (
              <tr key={o.id} className="odd:bg-white even:bg-gray-50/50 hover:bg-green-50/40">
                <td className="px-4 py-3">
                  <p className="font-mono text-xs text-gray-700">{o.id}</p>
                  <p className="text-xs text-gray-500">{formatDate(o.createdAt)}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{o.deliveryAddress?.name || '—'}</p>
                  <p className="text-xs text-gray-500">{o.userId}</p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {o.items?.length || 0} item{(o.items?.length || 0) === 1 ? '' : 's'}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">₹{o.totalAmount ?? 0}</td>
                <td className="px-4 py-3 text-xs text-gray-700">{paymentLine(o.paymentMethod, o.paymentStatus)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1.5">
                    <span
                      className={[
                        'inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        statusClass(o.status),
                      ].join(' ')}
                    >
                      {(o.status || 'placed').charAt(0).toUpperCase() + (o.status || 'placed').slice(1)}
                    </span>
                    <select
                      value={(o.status || 'placed').toLowerCase()}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-gray-500">No orders to show.</p>
        )}
      </div>
    </div>
  );
}
