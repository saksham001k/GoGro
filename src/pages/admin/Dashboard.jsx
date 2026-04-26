import { Link } from 'react-router-dom';
import { FiClipboard, FiPackage, FiRefreshCw, FiUsers } from 'react-icons/fi';
import { useProducts } from '../../contexts/ProductContext';
import { useOrders } from '../../contexts/OrderContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const statClass = 'card flex flex-col gap-1 p-5';

export default function Dashboard() {
  const { products, availableProducts, resetToInitial } = useProducts();
  const { orders } = useOrders();
  const { users } = useAuth();
  const { success } = useToast();

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  const handleReset = () => {
    if (!window.confirm('Reset the catalog to the bundled sample products? This will replace your current product list.')) return;
    resetToInitial();
    success('Catalog reset to bundled sample products.');
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-600">A quick overview of your storefront.</p>
        </div>
        <button type="button" onClick={handleReset} className="btn-outline">
          <FiRefreshCw className="mr-2 h-4 w-4" />
          Reset to sample catalog
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={statClass}>
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-sm font-medium">Total products</span>
            <FiPackage className="h-5 w-5" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{products.length}</p>
          <p className="text-xs text-gray-500">{availableProducts.length} available · {products.length - availableProducts.length} hidden</p>
        </div>
        <div className={statClass}>
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-sm font-medium">Total orders</span>
            <FiClipboard className="h-5 w-5" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{orders.length}</p>
          <p className="text-xs text-gray-500">{orders.filter((o) => (o.status || '').toLowerCase() === 'delivered').length} delivered</p>
        </div>
        <div className={statClass}>
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-sm font-medium">Customers</span>
            <FiUsers className="h-5 w-5" />
          </div>
          <p className="text-3xl font-extrabold text-gray-900">{users.length}</p>
          <p className="text-xs text-gray-500">Stored locally for this demo</p>
        </div>
        <div className={statClass}>
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-sm font-medium">Revenue (demo)</span>
            <span className="text-sm font-semibold text-green-700">₹</span>
          </div>
          <p className="text-3xl font-extrabold text-gray-900">₹{totalRevenue}</p>
          <p className="text-xs text-gray-500">Sum of every placed order</p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link to="/admin/products" className="card card-hover flex items-center justify-between gap-4 p-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Manage products</h3>
            <p className="mt-1 text-sm text-gray-600">Add, edit, or hide items from the storefront.</p>
          </div>
          <FiPackage className="h-7 w-7 text-green-600" />
        </Link>
        <Link to="/admin/orders" className="card card-hover flex items-center justify-between gap-4 p-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Manage orders</h3>
            <p className="mt-1 text-sm text-gray-600">Review every order and update its status.</p>
          </div>
          <FiClipboard className="h-7 w-7 text-green-600" />
        </Link>
      </div>
    </div>
  );
}
