/**
 * Storefront categories. Each entry has a label that matches `product.category`
 * (except for "All", which is a UI-only filter), and a small emoji used in chips.
 */
export const CATEGORIES = [
  { id: 'All', label: 'All', emoji: '🛒' },
  { id: 'Fruits', label: 'Fruits', emoji: '🍎' },
  { id: 'Vegetables', label: 'Vegetables', emoji: '🥦' },
  { id: 'Dairy', label: 'Dairy', emoji: '🥛' },
  { id: 'Bakery', label: 'Bakery', emoji: '🍞' },
  { id: 'Beverages', label: 'Beverages', emoji: '🧃' },
  { id: 'Snacks', label: 'Snacks', emoji: '🍿' },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.id);
