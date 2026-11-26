import { useId, useState } from 'react';
import { cn } from '../../utils/cn.js';
import { IconPlus } from './Icons.jsx';

export function AccordionItem({ title, children, defaultOpen = false }) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-ink/10 dark:border-white/10">
      <h3 className="m-0 font-sans text-base font-semibold tracking-normal" style={{ fontFamily: 'inherit' }}>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-[56px] w-full items-center justify-between gap-4 py-3 text-left text-[17px] font-semibold text-ink"
        >
          {title}
          <IconPlus className={cn('h-5 w-5 shrink-0 text-ink/50 transition-transform duration-300', open && 'rotate-45')} />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={cn('grid transition-[grid-template-rows] duration-300 ease-out', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
      >
        <div className="overflow-hidden">
          <p className="pb-5 pr-8 leading-relaxed text-muted-foreground">{children}</p>
        </div>
      </div>
    </div>
  );
}
