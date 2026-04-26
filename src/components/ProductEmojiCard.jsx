/**
 * Square emoji tile for product visuals (replaces external product photos).
 * `size` scales the emoji and corner radius for list / cart / detail / admin.
 */
const FALLBACK = '🛒';

const sizeConfig = {
  tiny: {
    root: 'h-10 w-10 min-h-[2.5rem] min-w-[2.5rem] rounded-lg',
    emoji: 'text-xl leading-none drop-shadow-md',
    pill: 'hidden',
  },
  small: {
    root: 'h-20 w-20 min-h-[5rem] min-w-[5rem] rounded-xl',
    emoji: 'text-4xl leading-none drop-shadow-md sm:text-[2.75rem]',
    pill: 'hidden',
  },
  default: {
    root: 'aspect-square w-full rounded-t-2xl',
    emoji: 'text-5xl leading-none drop-shadow-md sm:text-6xl',
    pill: 'px-2 py-0.5 text-[0.65rem] font-medium',
  },
  large: {
    root: 'aspect-square w-full rounded-2xl',
    emoji: 'text-6xl leading-none drop-shadow-lg sm:text-7xl md:text-8xl',
    pill: 'px-2.5 py-1 text-xs font-medium',
  },
};

export default function ProductEmojiCard({ product, size = 'default', className = '', showPill = true }) {
  const emoji = (product?.emoji && String(product.emoji).trim()) || FALLBACK;
  const category = product?.category;
  const cfg = sizeConfig[size] || sizeConfig.default;
  const pillVisible = showPill && size !== 'tiny' && size !== 'small' && category;

  return (
    <div
      className={[
        'relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-green-100',
        cfg.root,
        className,
      ].join(' ')}
    >
      <div className="flex flex-1 flex-col items-center justify-center px-1 pt-1">
        <span
          className={['select-none', cfg.emoji].join(' ')}
          style={{ textShadow: '0 2px 12px rgba(34, 197, 94, 0.25)' }}
          role="img"
          aria-hidden
        >
          {emoji}
        </span>
      </div>
      {pillVisible && (
        <div className="w-full px-1.5 pb-1.5 pt-0.5 sm:px-2 sm:pb-2">
          <span
            className={[
              'block max-w-full truncate text-center text-gray-600',
              'rounded-full bg-white/80 text-gray-600 shadow-sm ring-1 ring-green-200/60 backdrop-blur-sm',
              cfg.pill,
            ].join(' ')}
          >
            {category}
          </span>
        </div>
      )}
    </div>
  );
}
