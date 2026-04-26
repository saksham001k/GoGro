import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiShoppingBag, FiTwitter } from 'react-icons/fi';

const linkClass = 'text-sm text-gray-400 hover:text-white';
const colTitle = 'text-sm font-semibold uppercase tracking-wide text-white';

/**
 * Dark footer with column-based fake links. Adds visual contrast against the
 * gradient page background and gives the storefront a more premium feel.
 */
export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <FiShoppingBag className="h-5 w-5 text-white" aria-hidden />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">GoGro</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-gray-400">
              Fresh groceries delivered to your door. Front‑end demo — your data stays in this browser.
            </p>
            <div className="mt-5 flex items-center gap-3" aria-label="Social">
              <a href="#facebook" aria-label="Facebook" className="rounded-full bg-white/10 p-2 hover:bg-white/15 hover:text-white">
                <FiFacebook className="h-4 w-4" />
              </a>
              <a href="#instagram" aria-label="Instagram" className="rounded-full bg-white/10 p-2 hover:bg-white/15 hover:text-white">
                <FiInstagram className="h-4 w-4" />
              </a>
              <a href="#twitter" aria-label="Twitter" className="rounded-full bg-white/10 p-2 hover:bg-white/15 hover:text-white">
                <FiTwitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className={colTitle}>Shop</p>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/" className={linkClass}>Browse all</Link></li>
              <li><Link to="/" className={linkClass}>Fruits & veg</Link></li>
              <li><Link to="/" className={linkClass}>Dairy & bakery</Link></li>
              <li><Link to="/" className={linkClass}>Snacks & drinks</Link></li>
            </ul>
          </div>

          <div>
            <p className={colTitle}>Account</p>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/orders" className={linkClass}>My orders</Link></li>
              <li><Link to="/cart" className={linkClass}>Cart</Link></li>
              <li><Link to="/login" className={linkClass}>Sign in</Link></li>
              <li><Link to="/register" className={linkClass}>Create account</Link></li>
            </ul>
          </div>

          <div>
            <p className={colTitle}>Company</p>
            <ul className="mt-4 space-y-2.5">
              <li><a href="#about" className={linkClass}>About us</a></li>
              <li><a href="#careers" className={linkClass}>Careers</a></li>
              <li><a href="#privacy" className={linkClass}>Privacy</a></li>
              <li><a href="#terms" className={linkClass}>Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gray-800 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} GoGro. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Built with care for grocery lovers · Demo project
          </p>
        </div>
      </div>
    </footer>
  );
}
