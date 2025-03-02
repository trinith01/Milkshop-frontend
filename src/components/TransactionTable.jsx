"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Eye, Trash, Printer, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import axios from "axios"
import ProfessionalInvoice from "./proffesional-invoice"
import { toast } from "sonner"
import { Separator } from "./ui/separator"

export default function TransactionTable() {
  //   const [searchCriteria, setSearchCriteria] = useState("nic")
  const [transactions, setTransactions] = useState([])
  //   const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [refetch , setRefetch] = useState(false)

  const [error, setError] = useState(null)
 

  const fetchTransactions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await axios.get("http://localhost:3000/transactions", {
        params: {
          startDate: startDate || undefined, 
          endDate: endDate || undefined,
        },
      })

      setTransactions(res.data)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch transactions. Please try again later.")
    } finally {
      setIsLoading(false)
      console.log("Loading state:", isLoading)
    }
  }

  useEffect(() => {
    fetchTransactions() 
  }, [startDate, endDate ,refetch])



  const handleView = (transaction) => {
    setSelectedTransaction(transaction)
    setIsDrawerOpen(true)
  }

  const handleDelete = async(id) => {
    console.log(`Delete transaction with id: ${id}`)
    try{
      const res = await axios.delete(`http://localhost:3000/transactions/${id}`)
      if(res.status === 200){
        toast.success('Transaction deleted successfully')
        setRefetch(!refetch)

      }else{
        toast.error('Error deleting transaction')
      }

    }catch(err){
      toast.error('Error deleting transaction')

    }
    

    
  }

  

  if (isLoading) {
    return <div>Loading transactions...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">🛒 Milk Transactions</CardTitle>

      </CardHeader>
      <Separator className="h-1"/>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1 space-y-2">
              {/* <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder={`Search by ${searchCriteria}`}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div> */}
            </div>
            {/* <div className="flex items-center space-x-2">
              <RadioGroup defaultValue="nic" onValueChange={(value) => setSearchCriteria(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nic" id="nic" />
                  <Label htmlFor="nic">NIC</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="name" id="name" />
                  <Label htmlFor="name">Name</Label>
                </div>
              </RadioGroup>
            </div> */}
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1 space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1 space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          
          </div>
          <Separator/>
        </div>
        <div className="mt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>NIC</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Milk Income</TableHead>
                <TableHead className="text-right">Product Income</TableHead>
                <TableHead className="text-right">Grand Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell>{transaction.nic}</TableCell>
                    <TableCell>{new Date(transaction.date).toISOString().split("T")[0]}</TableCell>
                    <TableCell className="text-right font-medium text-red-500">
                      Rs. {transaction.milkIncome.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-500">
                      Rs. {transaction.productIncome.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-medium",
                        transaction.milkIncome > transaction.productIncome ? "text-red-500" : "text-green-500",
                      )}
                    >
                      {transaction.milkIncome > transaction.productIncome
                        ? `- Rs. ${Math.abs(transaction.productIncome - transaction.milkIncome).toFixed(2)}`
                        : `+ Rs. ${(transaction.productIncome - transaction.milkIncome).toFixed(2)}`}
                    </TableCell>

                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleView(transaction)}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(transaction._id)}>
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                        <ProfessionalInvoice transaction={transaction} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetContent className="sm:max-w-md md:max-w-lg">
            <SheetHeader className="pr-10">
              <SheetTitle>Transaction Details</SheetTitle>
            </SheetHeader>
            <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
            {selectedTransaction && (
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{selectedTransaction.name}</h3>
                  <p className="text-sm text-muted-foreground">NIC: {selectedTransaction.nic}</p>
                  <p className="text-sm text-muted-foreground">Date: {selectedTransaction.date}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Milk Details</h4>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Price per Liter</p>
                        <p className="font-medium">${selectedTransaction.milkPricePerLiter.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Liters</p>
                        <p className="font-medium">{selectedTransaction.milkQuantity.toFixed(2)}L</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Milk Income</p>
                        <p className="font-medium text-red-500">${selectedTransaction.milkIncome.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Products</h4>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Unit Price</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTransaction.products.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{product.quantity}</TableCell>
                            <TableCell className="text-right">
                              ${(product.price * product.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="font-medium">
                            Total Product Income
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-500">
                            ${selectedTransaction.productIncome.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Grand Total</span>
                    <span
                      className={cn(
                        "font-semibold",
                        selectedTransaction.milkIncome > selectedTransaction.productIncome
                          ? "text-red-500"
                          : "text-green-500",
                      )}
                    >
                      {selectedTransaction.milkIncome > selectedTransaction.productIncome
                        ? `- Rs. ${Math.abs(selectedTransaction.productIncome - selectedTransaction.milkIncome).toFixed(
                            2,
                          )}`
                        : `+ Rs. ${(selectedTransaction.productIncome - selectedTransaction.milkIncome).toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  )
}

