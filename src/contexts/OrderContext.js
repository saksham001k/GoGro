/**
 * OrderContext — keeps a list of orders in localStorage. New orders are tagged
 * with the current user's email and timestamped. Status flows roughly:
 * placed → packed → delivered.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const ORDERS_KEY = 'gogro_orders';

function readOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => readOrders());

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      /* ignore */
    }
  }, [orders]);

  /**
   * Adds a new order to the store. Pass `userId`, `items`, `totalAmount`,
   * `deliveryFee`, `deliveryAddress`, `paymentMethod`, `paymentStatus`.
   * Returns the generated order id.
   */
  const addOrder = useCallback((order) => {
    const id = `ord-${Date.now()}`;
    const newOrder = {
      id,
      status: 'placed',
      createdAt: new Date().toISOString(),
      ...order,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return id;
  }, []);

  const getOrdersForUser = useCallback(
    (email) => {
      if (!email) return [];
      const lower = String(email).toLowerCase();
      return orders.filter((o) => String(o.userId || '').toLowerCase() === lower);
    },
    [orders]
  );

  const getAllOrders = useCallback(() => orders, [orders]);

  const getOrderById = useCallback(
    (id) => orders.find((o) => String(o.id) === String(id)) || null,
    [orders]
  );

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }, []);

  const value = useMemo(
    () => ({
      orders,
      addOrder,
      getOrdersForUser,
      getAllOrders,
      getOrderById,
      updateOrderStatus,
    }),
    [orders, addOrder, getOrdersForUser, getAllOrders, getOrderById, updateOrderStatus]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}
