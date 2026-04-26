import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiClipboard,
  FiHome,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

/**
 * Sticky app header. Includes desktop nav, mobile dropdown, and a cart icon
 * that wiggles whenever an item is added (driven by cart `bump`).
 */
export default function Header() {
  const { currentUser, isAdmin, logout } = useAuth();
  const { totalItems, bump } = useCart();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const prevBump = useRef(bump);

  useEffect(() => {
    if (bump !== prevBump.current) {
      prevBump.current = bump;
      setWiggle(true);
      const t = window.setTimeout(() => setWiggle(false), 320);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [bump]);

  const close = () => setMobileOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  const linkBase = 'text-sm font-medium text-white/90 transition-colors hover:text-white';
  const linkActive = 'text-white border-b-2 border-white';
  const linkInactive = 'border-b-2 border-transparent';

  return (
    <header className="sticky top-0 z-50 bg-emerald-700 text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-2 text-white" onClick={close}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <FiShoppingBag className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-xl font-extrabold tracking-tight">GoGro</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              [linkBase, isActive ? linkActive : linkInactive, 'pb-1'].join(' ')
            }
          >
            Home
          </NavLink>
          {currentUser && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                [linkBase, isActive ? linkActive : linkInactive, 'pb-1'].join(' ')
              }
            >
              Orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                [linkBase, isActive ? linkActive : linkInactive, 'pb-1'].join(' ')
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/cart"
            onClick={close}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10"
            aria-label={totalItems ? `Cart (${totalItems} items)` : 'Cart'}
          >
            <FiShoppingCart
              className={['h-5 w-5', wiggle ? 'animate-wiggle' : ''].join(' ')}
              aria-hidden
            />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-[1.25rem] animate-pulse items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {currentUser ? (
            <div className="hidden items-center gap-3 md:flex">
              <span className="flex items-center gap-1.5 text-sm">
                <FiUser className="h-4 w-4 opacity-80" aria-hidden />
                <span className="max-w-[10rem] truncate" title={currentUser.email}>
                  {currentUser.name || currentUser.email}
                </span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/30 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="text-sm font-medium text-white/90 hover:text-white">
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Register
              </Link>
            </div>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-emerald-700 md:hidden"
        >
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            <Link
              to="/"
              onClick={close}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
            >
              <FiHome className="h-4 w-4" /> Home
            </Link>
            {currentUser && (
              <Link
                to="/orders"
                onClick={close}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
              >
                <FiClipboard className="h-4 w-4" /> Orders
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={close}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
              >
                <FiSettings className="h-4 w-4" /> Admin
              </Link>
            )}
            <div className="my-2 h-px bg-white/10" />
            {currentUser ? (
              <>
                <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/60">
                  Signed in as {currentUser.name || currentUser.email}
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-white/10"
                >
                  <FiLogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-1 py-1">
                <Link
                  to="/login"
                  onClick={close}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={close}
                  className="rounded-full bg-white py-2 text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
