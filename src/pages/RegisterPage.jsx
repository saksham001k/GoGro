import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const e = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!form.email.trim()) e.email = 'Please enter your email';
    if (!form.password) e.password = 'Choose a password';
    else if (form.password.length < 4) e.password = 'Use at least 4 characters';
    if (form.confirm !== form.password) e.confirm = 'Passwords do not match';
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    const result = register(form.name, form.email, form.password);
    if (!result.ok) {
      toastError(result.error || 'Could not create account');
      return;
    }
    success(`Account created — welcome, ${result.user.name}!`);
    navigate(redirect, { replace: true });
  };

  return (
    <div className="mx-auto flex max-w-md items-center justify-center px-4 py-16">
      <div className="card w-full p-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">Create your account</h1>
        <p className="mt-1 text-sm text-gray-600">Join GoGro to checkout faster and track orders.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <div>
            <label htmlFor="reg-name" className="mb-1 block text-sm font-medium text-gray-700">Full name</label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              className={['input-underline', errors.name ? 'border-red-400 focus:border-red-500' : ''].join(' ')}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="reg-email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              className={['input-underline', errors.email ? 'border-red-400 focus:border-red-500' : ''].join(' ')}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="reg-password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              className={['input-underline', errors.password ? 'border-red-400 focus:border-red-500' : ''].join(' ')}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="reg-confirm" className="mb-1 block text-sm font-medium text-gray-700">Confirm password</label>
            <input
              id="reg-confirm"
              type="password"
              autoComplete="new-password"
              className={['input-underline', errors.confirm ? 'border-red-400 focus:border-red-500' : ''].join(' ')}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
            {errors.confirm && <p className="mt-1 text-sm text-red-600">{errors.confirm}</p>}
          </div>

          <button type="submit" className="btn-primary w-full">Create account</button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-semibold text-green-700 hover:text-green-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
