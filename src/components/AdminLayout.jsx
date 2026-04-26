import { NavLink, Outlet } from 'react-router-dom';

const tab = ({ isActive }) =>
  [
    'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
    isActive
      ? 'bg-green-500 text-white shadow'
      : 'text-gray-300 hover:bg-white/10 hover:text-white',
  ].join(' ');

/**
 * Layout for the admin section. The top bar uses a dark theme so the back
 * office feels visually distinct from the storefront.
 */
export default function AdminLayout() {
  return (
    <div className="min-h-[60vh] bg-gray-50">
      <div className="bg-gray-900 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-green-400">
              Admin console
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              GoGro back office
            </h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2" aria-label="Admin sections">
            <NavLink to="/admin" end className={tab}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={tab}>
              Products
            </NavLink>
            <NavLink to="/admin/orders" className={tab}>
              Orders
            </NavLink>
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Outlet />
      </div>
    </div>
  );
}
