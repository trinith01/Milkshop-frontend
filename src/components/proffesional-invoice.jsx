"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Printer, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"



export default function ProfessionalInvoice({
  transaction,
}) {
  const [open, setOpen] = useState(false)

  const handlePrint = () => {
    // Close the dialog before printing
    setOpen(false)

    // Use setTimeout to ensure the dialog is closed before printing
    setTimeout(() => {
      window.print()
    }, 100)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Printer className="h-4 w-4" />
            Print Invoice
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Invoice Preview</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-6 w-6 rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>

          <div className="mt-4 flex flex-col gap-4">
            {/* This is shown in the dialog */}
            <div className="p-4 border rounded-md">
              <InvoiceContent transaction={transaction} />
            </div>

            <Button onClick={handlePrint} className="w-full">
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* This is hidden normally but shown when printing */}
      <div id="printable-invoice" className="hidden print:block">
        <InvoiceContent transaction={transaction} />
      </div>
    </>
  )
}

// Separate component for the invoice content to avoid duplication
function InvoiceContent({ transaction }) {
  return (
    <div className="p-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">INVOICE</h2>
        <p className="text-sm text-muted-foreground">Invoice #: {transaction.nic}</p>
      </div>

      <div className="flex justify-between mb-4">
        <div>
          <p className="font-medium">{transaction.name}</p>
          <p className="text-sm text-muted-foreground">Date: {transaction.date}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold border-b pb-1 mb-2">Milk Details</h3>
        <div className="grid grid-cols-3 text-sm">
          <div>
            <p className="text-muted-foreground">Price/Liter</p>
            <p>${transaction.milkPricePerLiter.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Quantity</p>
            <p>{transaction.milkQuantity.toFixed(2)}L</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total</p>
            <p>${transaction.milkIncome.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold border-b pb-1 mb-2">Products</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-1">Item</th>
              <th className="text-right py-1">Price</th>
              <th className="text-right py-1">Qty</th>
              <th className="text-right py-1">Total</th>
            </tr>
          </thead>
          <tbody>
            {transaction.products.map((product, index) => (
              <tr key={index} className="border-b border-dashed">
                <td className="py-1">{product.name}</td>
                <td className="text-right py-1">${product.price.toFixed(2)}</td>
                <td className="text-right py-1">{product.quantity}</td>
                <td className="text-right py-1">${(product.price * product.quantity).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} className="text-right py-1 font-medium">
                Product Total:
              </td>
              <td className="text-right py-1 font-medium">${transaction.productIncome.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-t pt-2">
        <div className="flex justify-between font-bold">
          <span>Balance:</span>
          <span>
            {transaction.milkIncome > transaction.productIncome
              ? `- $${Math.abs(transaction.productIncome - transaction.milkIncome).toFixed(2)}`
              : `+ $${(transaction.productIncome - transaction.milkIncome).toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        <p>Thank you for your business!</p>
      </div>
    </div>
  )
}

