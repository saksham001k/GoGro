import { Link } from 'react-router-dom';

/**
 * Reusable empty state. Pass a React node (e.g. an icon component) and an
 * optional CTA. Used by cart, search, orders, and admin pages.
 */
export default function EmptyState({
  icon,
  title,
  message,
  actionText,
  actionLink = '/',
  actionOnClick,
}) {
  return (
    <div
      className="card flex flex-col items-center justify-center px-6 py-14 text-center"
      role="status"
    >
      {icon && (
        <div
          className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-600 shadow-md ring-8 ring-green-50/40"
          aria-hidden
        >
          {icon}
        </div>
      )}
      <h2 className="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl">{title}</h2>
      {message && <p className="mt-2 max-w-sm text-sm text-gray-600">{message}</p>}
      {actionText && (
        actionOnClick ? (
          <button type="button" onClick={actionOnClick} className="btn-primary mt-6">
            {actionText}
          </button>
        ) : (
          <Link to={actionLink} className="btn-primary mt-6">
            {actionText}
          </Link>
        )
      )}
    </div>
  );
}
