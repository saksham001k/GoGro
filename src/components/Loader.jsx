/**
 * Centered spinner. Use `fullScreen` for route-level fallbacks.
 */
export default function Loader({ label = 'Loading…', fullScreen = false }) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center gap-3 px-4 text-gray-500',
        fullScreen ? 'min-h-[60vh]' : 'min-h-[30vh]',
      ].join(' ')}
      role="status"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-green-600"
        aria-hidden
      />
      {label && <p className="text-sm font-medium">{label}</p>}
    </div>
  );
}
