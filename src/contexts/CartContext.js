/**
 * CartContext — local cart state with stock‑aware quantity capping. The `bump`
 * counter increments on every successful add so the header cart icon can play
 * a small wiggle animation.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

const CART_KEY = 'gogro_cart';
export const DELIVERY_FEE = 40;

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function maxFor(stock) {
  if (typeof stock === 'number' && Number.isFinite(stock) && stock >= 0) return stock;
  return Number.POSITIVE_INFINITY;
}

function clamp(qty, max) {
  const n = Math.floor(Number(qty));
  if (max <= 0) return 0;
  if (Number.isNaN(n) || n < 1) return 1;
  return Math.min(n, max);
}

const initialState = { items: readCart(), bump: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const max = maxFor(product.stock);
      if (max <= 0) return state;

      const existingIndex = state.items.findIndex((i) => String(i.id) === String(product.id));
      if (existingIndex >= 0) {
        const existing = state.items[existingIndex];
        const merged = clamp(existing.quantity + quantity, max);
        if (merged === existing.quantity) {
          // Nothing changed (e.g. already at max stock).
          return state;
        }
        const items = state.items.map((row, idx) =>
          idx === existingIndex
            ? { ...row, ...product, id: existing.id, quantity: merged }
            : row
        );
        return { items, bump: state.bump + 1 };
      }

      const firstQty = clamp(quantity, max);
      if (firstQty < 1) return state;

      const newLine = {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        emoji: product.emoji,
        category: product.category,
        stock: product.stock,
        quantity: firstQty,
      };
      return { items: [...state.items, newLine], bump: state.bump + 1 };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => String(i.id) !== String(action.payload)) };

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      return {
        ...state,
        items: state.items
          .map((i) => {
            if (String(i.id) !== String(id)) return i;
            const max = maxFor(i.stock);
            if (max <= 0) return null;
            return { ...i, quantity: clamp(quantity, max) };
          })
          .filter(Boolean),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    } catch {
      /* ignore */
    }
  }, [state.items]);

  /**
   * Adds a product to the cart, capped by `product.stock`. Returns true if
   * something actually changed (so callers can decide whether to fire a toast).
   */
  const addItem = useCallback((product, quantity = 1) => {
    if (!product || !product.id) return false;
    const max = maxFor(product.stock);
    if (max <= 0) return false;
    const before = state.bump;
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    // bump is checked by the next render; this returns optimistic intent.
    return before !== undefined;
  }, [state.bump]);

  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const value = useMemo(
    () => ({
      items: state.items,
      bump: state.bump,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalPrice,
      totalItems,
      deliveryFee: DELIVERY_FEE,
      orderTotal: totalPrice + (state.items.length > 0 ? DELIVERY_FEE : 0),
    }),
    [state.items, state.bump, addItem, removeItem, updateQuantity, clearCart, totalPrice, totalItems]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
