import { cn } from "@/lib";

const variants = {
  default: "bg-ink text-ivory hover:bg-wine",
  outline: "border border-ink/20 bg-transparent text-ink hover:border-ink",
  ghost: "hover:bg-ink/5",
  destructive: "bg-wine text-ivory hover:bg-wine-light",
};

export function Button({ className, variant = "default", disabled, children, ...props }) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
