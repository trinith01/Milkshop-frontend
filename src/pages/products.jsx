"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Edit, Trash2, Plus, Users, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ProductForm from "@/Form/productForm" // Changed form import to product form
import axios from "axios"
import { toast } from "sonner"


export default function ProductsPage() {
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [reloadData, setReloadData] = useState(false);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const response = await axios.get(`${backendURL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    getAllProducts();
  }, [reloadData]); // Dependency array updated to trigger reload on reloadData change

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const handleEditProduct = (product) => {
    setEditMode(true);
    setDialogOpen(true);
    setCurrentId(product._id)
    setReloadData((prev) => !prev); // Trigger re-fetch
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${backendURL}/products/${id}`);
      setDeleteDialogOpen(false);
      toast.success(`🗑️ **Product deleted successfully! 😊`);
      setReloadData((prev) => !prev); // Trigger re-fetch
    } catch (err) {
      console.log(err);
      toast.error("Error deleting product");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 border-blue-800 border-2 rounded-lg mt-5 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <div className="flex gap-4">
          <Link to="/members">
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Go to Members
            </Button>
          </Link>
        </div>
      </div>

      <Separator className="my-6" />

      <Card className="mb-8">
        <CardHeader className="bg-muted/50">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product List
            </CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditMode(false);
                    setCurrentId(null);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editMode ? "Edit Product" : "Add New Product"}</DialogTitle>
                  <DialogDescription>
                    Fill in the details to {editMode ? "update the" : "add a new"} product.
                  </DialogDescription>
                </DialogHeader>
                <div>
                  <ProductForm
                    editMode={editMode}
                    setDialogOpen={setDialogOpen}
                    id={currentId}
                    setReloadData={setReloadData}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableCaption>List of all registered Products</TableCaption>
            <TableHeader >
              <TableRow>
                <TableHead className="w-[200px]">Product Name</TableHead>
                <TableHead className="w-[200px]">Price</TableHead>
                <TableHead className=" w-[150px]">Stock Count</TableHead>
                <TableHead className=" w-[150px]">Expire Date</TableHead>
                <TableHead className=" w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id} >
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.stockCount}</TableCell>
                  <TableCell>{new Date(product.expireDate).toLocaleDateString("en-GB")}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the product and remove its
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product._id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No products found. Add a new product to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
