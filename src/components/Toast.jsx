import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { useToast } from '../contexts/ToastContext';

/**
 * Global toast viewport. Mounted once at the app root.
 * Toasts slide in from the top-right and auto-dismiss.
 */
export default function Toast() {
  const { toasts } = useToast();

  if (!toasts.length) return null;

  return (
    <div
      className="pointer-events-none fixed right-4 top-20 z-[100] flex w-[min(20rem,calc(100%-2rem))] flex-col gap-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => {
        const isError = t.type === 'error';
        const isInfo = t.type === 'info';
        const Icon = isError ? FiAlertCircle : isInfo ? FiInfo : FiCheckCircle;
        const bg = isError
          ? 'bg-red-600'
          : isInfo
            ? 'bg-gray-800'
            : 'bg-green-600';
        return (
          <div
            key={t.id}
            role="status"
            className={[
              'pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg',
              bg,
              'animate-slide-in-right',
            ].join(' ')}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="min-w-0 flex-1">{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
