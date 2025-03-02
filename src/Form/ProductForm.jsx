"use client"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { format } from "date-fns"
import { Package, DollarSign, PackageCheck, CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Schema Validation
const formSchema = z.object({
  name: z.string().min(1, "Name must be greater than 1 character"),
  price: z.preprocess((val) => Number.parseFloat(val), z.number().positive("Price must be greater than zero")),
  stockCount: z.preprocess(
    (val) => Number.parseInt(val, 10),
    z.number().int("Stock count must be an integer").positive("Stock count must be a positive integer"),
  ),
  expireDate: z.date().refine((val) => val >= new Date(), {
    message: "Expire date must be today or in the future",
  }),
})

export default function ProductForm({ editMode, setDialogOpen, id, setReloadData }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      stockCount: 0,
      expireDate: new Date(),
    },
  })

  useEffect(() => {
    if (editMode && id) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(`${backendURL}/products/${id}`)
          form.reset({
            name: res.data.name,
            price: res.data.price,
            stockCount: res.data.stockCount,
            expireDate: new Date(res.data.expireDate),
          })
        } catch (error) {
          toast.error("Failed to fetch product data.")
        }
      }
      fetchProduct()
    }
  }, [editMode, id, form])

  async function onSubmit(values) {
    setLoading(true)
    try {
      if (editMode) {
        await axios.put(`${backendURL}/products/${id}`, values)
        toast.success("✅ Product updated successfully!")
        setReloadData((pre) => !pre)
        setDialogOpen(false)
      } else {
        await axios.post(`${backendURL}/products`, values)
        toast.success("✅ Product added successfully! 🎉")
        setReloadData((pre) => !pre)
        setDialogOpen(false)
      }
    } catch (error) {
      toast.error("Failed to submit the form. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto py-6">
        <h3 className="text-lg font-medium">{editMode ? "Edit Product" : "Add New Product"}</h3>
        <Separator className="my-4" />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Enter product name" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Price</FormLabel>
              <FormControl>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="number" placeholder="100.00" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stockCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Count</FormLabel>
              <FormControl>
                <div className="relative">
                  <PackageCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="number" placeholder="50" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expireDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expire Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    minDate={new Date()}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Expire date must be today or in the future</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-4" />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Processing..."}
            </>
          ) : editMode ? (
            "Update Product"
          ) : (
            "Add Product"
          )}
        </Button>
      </form>
    </Form>
  )
}

