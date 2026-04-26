import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function LoginPage() {
  const { login, loginAsAdmin } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    const result = login(form.email, form.password);
    if (!result.ok) {
      toastError(result.error || 'Could not sign in');
      return;
    }
    success(`Welcome back, ${result.user.name || result.user.email}!`);
    navigate(redirect, { replace: true });
  };

  const handleAdmin = () => {
    const result = loginAsAdmin();
    success(`Signed in as ${result.user.name}`);
    navigate(redirect.startsWith('/admin') ? redirect : '/admin', { replace: true });
  };

  return (
    <div className="mx-auto flex max-w-md items-center justify-center px-4 py-16">
      <div className="card w-full p-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-600">Sign in to track orders and check out faster.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className={['input-underline', errors.email ? 'border-red-400 focus:border-red-500' : ''].join(' ')}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              className={['input-underline', errors.password ? 'border-red-400 focus:border-red-500' : ''].join(' ')}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            <p className="mt-1 text-xs text-gray-400">Demo mode — any password works.</p>
          </div>

          <button type="submit" className="btn-primary w-full">Login</button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          OR
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <button type="button" onClick={handleAdmin} className="btn-outline w-full">
          Login as Admin
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          New to GoGro?{' '}
          <Link
            to={`/register${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
