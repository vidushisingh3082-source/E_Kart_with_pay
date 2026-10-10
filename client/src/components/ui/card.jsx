import { cn } from "@/lib";

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink/10 bg-white transition-shadow duration-300 hover:shadow-[0_12px_32px_-16px_rgba(28,26,23,0.25)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function Badge({ className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-wine px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-ivory",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
