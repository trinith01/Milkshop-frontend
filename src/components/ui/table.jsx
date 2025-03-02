import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-lg border shadow-sm">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props} />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-primary text-white", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0 [&>tr:nth-child(even)]:bg-muted/30", className)}
    {...props} />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t bg-primary/10 font-medium text-primary", className)}
    {...props} />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-accent/20 data-[state=selected]:bg-accent/30",
      className
    )}
    {...props} />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-bold uppercase tracking-wide text-xs [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props} />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props} />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm italic text-muted-foreground", className)}
    {...props} />
))
TableCaption.displayName = "TableCaption"

// New component for highlighted rows (e.g., for featured products)
const TableHighlightRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b bg-accent/10 transition-colors hover:bg-accent/30 data-[state=selected]:bg-accent/40",
      className
    )}
    {...props} />
))
TableHighlightRow.displayName = "TableHighlightRow"

// New component for numeric data cells
const TableNumericCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle text-right font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props} />
))
TableNumericCell.displayName = "TableNumericCell"

// New component for status indicators
const TableStatusCell = React.forwardRef(({ status, className, children, ...props }, ref) => {
  const statusStyles = {
    inStock: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
    lowStock: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
    outOfStock: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
  }
  
  return (
    <td
      ref={ref}
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}>
      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusStyles[status])}>
        {children}
      </span>
    </td>
  )
})
TableStatusCell.displayName = "TableStatusCell"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableHighlightRow,
  TableNumericCell,
  TableStatusCell,
}