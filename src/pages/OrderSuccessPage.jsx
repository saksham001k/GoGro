import { FiCheck } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center md:py-20">
      <div
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700 animate-check-pop"
        aria-hidden
      >
        <FiCheck className="h-10 w-10" />
      </div>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">Thank you for your order!</h1>
      <p className="mt-2 text-gray-600">
        We've received your order and will get it on the way soon.
      </p>
      {orderId && (
        <p className="mt-6 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm shadow-sm">
          <span className="text-gray-500">Order ID: </span>
          <span className="select-all font-mono font-medium text-gray-900">{orderId}</span>
        </p>
      )}
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link to="/orders" className="btn-primary">View orders</Link>
        <Link to="/" className="btn-outline">Continue shopping</Link>
      </div>
    </div>
  );
}
