export default function PlusMinusIcon({ open, className = '' }: { open: boolean; className?: string }) {
  return (
    <span className={`relative inline-block w-3 h-3 shrink-0 ${className}`}>
      <span className="absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-current" />
      <span
        className={`absolute top-1/2 left-0 -translate-y-1/2 h-px w-full bg-current transition-all duration-300 origin-center ${
          open ? 'rotate-0 opacity-0' : 'rotate-90 opacity-100'
        }`}
      />
    </span>
  )
}
