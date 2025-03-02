import { cn } from "@/lib/utils"



export function ColorSwatch({ name, variable, className }) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className="h-16 w-16 rounded-full border shadow-sm transition-transform duration-300 hover:scale-110"
        style={{ backgroundColor: `hsl(var(--${variable}))` }}
      />
      <span className="text-xs font-medium">{name}</span>
    </div>
  )
}

