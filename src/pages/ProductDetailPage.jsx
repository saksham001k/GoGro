import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import Loader from '../components/Loader';
import ProductEmojiCard from '../components/ProductEmojiCard';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading } = useProducts();
  const { addItem } = useCart();
  const { success } = useToast();

  const product = getProductById(id);
  const stock = typeof product?.stock === 'number' ? product.stock : 0;
  const inStock = product && product.available !== false && stock > 0;
  const max = inStock ? stock : 1;

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [id]);

  useEffect(() => {
    if (quantity > max) setQuantity(max);
    if (quantity < 1) setQuantity(1);
  }, [quantity, max]);

  if (loading) return <Loader fullScreen label="Loading product…" />;

  if (!product) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">Product not found</h1>
        <p className="mt-2 text-gray-600">It may have been removed or the link is invalid.</p>
        <Link to="/" className="btn-primary mt-6">Back to home</Link>
      </div>
    );
  }

  const handleAdd = () => {
    if (!inStock) return;
    addItem(product, quantity);
    success(`Added ${quantity} × ${product.name} to cart`);
    // Stay on the page; user can add more or navigate manually.
  };

  const buyNow = () => {
    if (!inStock) return;
    addItem(product, quantity);
    navigate('/cart');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800">
        <FiArrowLeft className="h-4 w-4" /> Back to products
      </Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="card overflow-hidden p-0">
          <ProductEmojiCard product={product} size="large" className="w-full" showPill={false} />
        </div>
        <div className="flex flex-col">
          <span className="inline-flex w-fit rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-green-700">
            {product.category}
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            {product.name}
          </h1>
          <div className="mt-3">
            <p className="text-4xl font-bold tracking-tight text-green-700 md:text-5xl">
              ₹{product.price}
            </p>
            <p className="mt-1 text-sm text-gray-500">per {product.unit}</p>
          </div>
          {product.description && (
            <p className="mt-4 max-w-md leading-relaxed text-gray-700">{product.description}</p>
          )}
          <p className="mt-4 text-sm text-gray-700">
            {inStock ? (
              stock <= 5 ? (
                <span className="font-semibold text-orange-500">Hurry — only {stock} left in stock</span>
              ) : (
                <span className="font-medium text-gray-700">{stock} in stock</span>
              )
            ) : (
              <span className="font-semibold text-red-500">Currently out of stock</span>
            )}
          </p>

          {inStock && (
            <div className="mt-6">
              <span className="block text-sm font-medium text-gray-700">Quantity</span>
              <div className="mt-2 inline-flex items-center rounded-full border border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <FiMinus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  min={1}
                  max={max}
                  value={quantity}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (Number.isNaN(n)) return;
                    setQuantity(Math.min(max, Math.max(1, n)));
                  }}
                  className="w-12 border-0 bg-transparent text-center text-sm font-semibold text-gray-900 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(max, q + 1))}
                  disabled={quantity >= max}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!inStock}
              className="btn-primary"
            >
              <FiShoppingCart className="mr-2 h-4 w-4" />
              {inStock ? 'Add to cart' : 'Out of stock'}
            </button>
            {inStock && (
              <button type="button" onClick={buyNow} className="btn-outline">
                Buy now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
