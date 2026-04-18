import { useId, useState } from 'react';
import { cn } from '../../utils/cn.js';

export function AccordionItem({ title, children, defaultOpen = false }) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);

  const toggle = () => setOpen((o) => !o);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div className="border-b border-brand-charcoal/10 dark:border-white/10">
      <button
        type="button"
        id={`${id}-btn`}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className="flex w-full items-center justify-between py-4 text-left text-base font-semibold text-brand-charcoal transition hover:text-brand-red dark:text-white dark:hover:text-white"
      >
        {title}
        <span className="text-brand-red" aria-hidden>
          {open ? '−' : '+'}
        </span>
      </button>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-4 text-sm leading-relaxed text-brand-charcoal/80 dark:text-white/75">{children}</p>
        </div>
      </div>
    </div>
  );
}
