"use client";

import { CardFooter } from "@/components/ui/card";

import { useState, useEffect } from "react";
import {
  Search,
  User,
  Package,
  Milk,
  ShoppingCart,
  CreditCard,
  History,
  Plus,
  Minus,
  X,
  CheckCircle2,
  Edit2,
  Check,
  ChevronRight,
} from "lucide-react";
import { Navigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

import TransactionTable from "@/components/TransactionTable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@clerk/clerk-react";

export default function Home() {
   const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempCustomPrice, setTempCustomPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState("purchase");
  const [activeTab, setActiveTab] = useState("purchase");
  const [searchType, setSearchType] = useState("nic");
  const [searchQuery, setSearchQuery] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [milkQuantity, setMilkQuantity] = useState(0);
  const [milkPrice, setMilkPrice] = useState(100);
  const [productQuery, setProductQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [recetTransactions, setRecentTransactions] = useState([]);

  // Fetch products and employees data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await axios.get(
          `${backendURL}/products`
        );
        const recent = await axios.get(
          `${backendURL}/transactions/recent`
        );
        setProducts(productsResponse.data);
        setRecentTransactions(recent.data);

        // Fetch employees
        const employeesResponse = await axios.get(
          `${backendURL}/employees`
        );
        setUsers(employeesResponse.data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filtered products based on search
  const filteredProducts = productQuery
    ? products.filter((product) =>
        product.name.toLowerCase().includes(productQuery.toLowerCase())
      )
    : [];

  // Handle user search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFoundUser(null);
      setSearchError("Please enter a search term");
      return;
    }

    const user = users.find((user) =>
      searchType === "nic"
        ? user.nic.toLowerCase() === searchQuery.toLowerCase()
        : user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (user) {
      setFoundUser(user);
      setSearchError("");
    } else {
      setFoundUser(null);
      setSearchError(`No member found with the given ${searchType}`);
    }
  };

  // Handle adding product to cart
  const handleAddProduct = (product) => {
    const existingProduct = selectedProducts.find((p) => p._id === product._id);

    if (existingProduct) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          ...product,
          quantity: 1,
          useCustomPrice: false,
        },
      ]);
    }
  };

  // Handle starting to edit a product's price
  const handleStartEditPrice = (product) => {
    setEditingPriceId(product._id);
    setTempCustomPrice(
      product.customPrice?.toString() || product.price.toString()
    );
  };

  // Handle toggling custom price
  const handleToggleCustomPrice = (productId, useCustomPrice) => {
    setSelectedProducts((prev) =>
      prev.map((p) => {
        if (p._id === productId) {
          return {
            ...p,
            useCustomPrice,
            customPrice: useCustomPrice ? p.customPrice : undefined,
          };
        }
        return p;
      })
    );
  };

  // Handle saving custom price
  const handleSaveCustomPrice = (productId) => {
    const price = Number.parseFloat(tempCustomPrice);

    if (!isNaN(price) && price >= 0) {
      setSelectedProducts((prev) =>
        prev.map((p) => {
          if (p._id === productId) {
            return {
              ...p,
              customPrice: price,
              useCustomPrice: true,
            };
          }
          return p;
        })
      );
    }

    setEditingPriceId(null);
  };

  // Handle updating product quantity
  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setSelectedProducts(selectedProducts.filter((p) => p._id !== id));
    } else {
      setSelectedProducts(
        selectedProducts.map((p) => (p._id === id ? { ...p, quantity } : p))
      );
    }
  };

  // Calculate total milk cost
  const totalMilkCost = milkQuantity * milkPrice;

  // Calculate total products cost
  const totalProductsCost = selectedProducts.reduce((total, product) => {
    const priceToUse =
      product.useCustomPrice && product.customPrice !== undefined
        ? product.customPrice
        : product.price;
    return total + priceToUse * product.quantity;
  }, 0);

  // Calculate grand total
  const grandTotal = totalMilkCost - totalProductsCost;

  // Handle confirm purchase
  const handleConfirmPurchase = async () => {
    if (!foundUser) return;

    console.log("User:", foundUser.name, "NIC:", foundUser.nic);
    console.log(
      "Milk:",
      milkQuantity,
      "liters at",
      milkPrice,
      "per liter. Total:",
      totalMilkCost
    );

    const productArray = selectedProducts.map((p) => ({
      name: p.name,
      quantity: p.quantity,
      price:
        p.useCustomPrice && p.customPrice !== undefined
          ? p.customPrice
          : p.price,
    }));

    console.log("Grand Total:", grandTotal);
    try {
      const data = {
        name: foundUser.name,
        nic: foundUser.nic,
        products: productArray,
        milkQuantity: milkQuantity,
        milkPricePerLiter: milkPrice,
        milkIncome: totalMilkCost,
        productIncome: totalProductsCost,
      };
      console.log("transaction data:", data);
      const res = await axios.post(`${backendURL}/transactions`, data);
      toast.success("Transaction Successful !");
      setTimeout(() => {
        setActiveTab("history");
        setSelectedTab("history");

        // Reset the form after switching tabs
        setSearchQuery("");
        setFoundUser(null);
        setMilkQuantity(0);
        setProductQuery("");
        setSelectedProducts([]);
      }, 10); // Ensures UI updates correctly
    } catch (error) {
      console.log(error);
      toast.error("Transaction Failed !");
    }
  };
  const { isSignedIn, user, isLoaded } = useUser();

  // Handle loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20  mt-5">
      <div className="container min-w-full mx-auto py-4 px-4 shoadow-lg rounded-lg border-blue-800 border-2  shadow-lg">
        <Tabs
          defaultValue="purchase"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-center mb-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger
                value="purchase"
                className={`flex items-center justify-center px-4 py-2 transition-all  " ${
                  selectedTab === "purchase"
                    ? "bg-primary text-primary-foreground shadow-sm border-blue-800"
                    : "border-blue-800"
                }`}
                onClick={() => setSelectedTab("purchase")}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Purchase & Milk
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className={`flex items-center justify-center px-4 py-2 transition-all ${
                  selectedTab === "history"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : ""
                }`}
                onClick={() => setSelectedTab("history")}
              >
                <History className="h-4 w-4 mr-2" />
                Transaction History
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator className = "h-1 p-1 text-blue-800"/>

          <TabsContent value="purchase" className="space-y-4">
            {!foundUser ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Search Section - Always visible */}
                  <Card className="shadow-md border-t-4 border-t-primary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <User className="h-4 w-4 mr-2 text-primary" />
                        Member Search
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Find a member by NIC or name
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2">
                      <RadioGroup
                        defaultValue="nic"
                        value={searchType}
                        onValueChange={setSearchType}
                        className="flex flex-wrap gap-2"
                      >
                        <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1 rounded-md">
                          <RadioGroupItem
                            value="nic"
                            id="nic"
                            className="text-primary"
                          />
                          <Label htmlFor="nic" className="text-sm">
                            NIC
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1 rounded-md">
                          <RadioGroupItem
                            value="name"
                            id="name"
                            className="text-primary"
                          />
                          <Label htmlFor="name" className="text-sm">
                            Name
                          </Label>
                        </div>
                      </RadioGroup>

                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder={
                              searchType === "nic"
                                ? "Enter NIC number"
                                : "Enter member name"
                            }
                            className="pl-8 h-9 text-sm bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleSearch();
                              }
                            }}
                          />
                        </div>
                        <Button
                          onClick={handleSearch}
                          className="h-9 px-3 bg-primary hover:bg-primary/90"
                        >
                          Search
                        </Button>
                      </div>

                      {searchError && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert
                            variant="destructive"
                            className="bg-destructive/10 border-destructive/20 py-2"
                          >
                            <AlertDescription className="text-xs flex justify-between items-center">
                              <span>{searchError}</span>
                              {!foundUser && (
                                <Link
                                  to="/members"
                                  className="text-primary text-xs font-medium hover:underline"
                                >
                                  Register →
                                </Link>
                              )}
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Welcome Dashboard */}
                  <Card className="shadow-md md:col-span-2 lg:col-span-2 bg-gradient-to-br from-primary/5 to-primary/10 border-none">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="bg-primary/10 p-4 rounded-full"
                        >
                          <Milk className="h-12 w-12 text-primary" />
                        </motion.div>
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        >
                          <h2 className="text-2xl font-bold text-primary">
                            Welcome to Dairy Management
                          </h2>
                          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                            Search for a member by NIC or name to start
                            recording milk purchases and product sales.
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4"
                        >
                          <Card className="bg-blue-500/10 border-none">
                            <CardContent className="p-4 flex flex-col items-center">
                              <Milk className="h-6 w-6 text-blue-500 mb-2" />
                              <h3 className="font-medium text-sm">
                                Milk Collection
                              </h3>
                              <p className="text-2xl font-bold text-blue-600">
                                250L
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Today
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="bg-amber-500/10 border-none">
                            <CardContent className="p-4 flex flex-col items-center">
                              <Package className="h-6 w-6 text-amber-500 mb-2" />
                              <h3 className="font-medium text-sm">
                                Products Sold
                              </h3>
                              <p className="text-2xl font-bold text-amber-600">
                                42
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Today
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="bg-green-500/10 border-none">
                            <CardContent className="p-4 flex flex-col items-center">
                              <User className="h-6 w-6 text-green-500 mb-2" />
                              <h3 className="font-medium text-sm">
                                Active Members
                              </h3>
                              <p className="text-2xl font-bold text-green-600">
                                {users.length || 0}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Total
                              </p>
                            </CardContent>
                          </Card>

                          <Card className="bg-purple-500/10 border-none">
                            <CardContent className="p-4 flex flex-col items-center">
                              <ShoppingCart className="h-6 w-6 text-purple-500 mb-2" />
                              <h3 className="font-medium text-sm">Products</h3>
                              <p className="text-2xl font-bold text-purple-600">
                                {products.length || 0}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Available
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Transactions Preview */}
                  <Card className="shadow-md lg:col-span-3 border-t-4 border-t-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <History className="h-4 w-4 mr-2 text-muted-foreground" />
                        Recent Transactions
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Latest milk purchases and product sales
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <Table>
                          <TableHeader>
                            <TableRow className="border-b ">
                              <TableHead className="text-xs font-semibold text-left p-3">
                                Date
                              </TableHead>
                              <TableHead className="text-xs font-semibold text-left p-3">
                                Member
                              </TableHead>
                              <TableHead className="text-xs font-semibold text-left p-3">
                                Milk Quanitiy (L.)
                              </TableHead>
                              <TableHead className="text-xs font-semibold text-left p-3">
                                Milk Income (RS.)
                              </TableHead>
                              <TableHead className="text-xs font-semibold text-left p-3">
                                Product Income (Rs.)
                              </TableHead>
                              <TableHead className="text-xs font-semibold text-right p-3">
                                Total Income (Rs.)
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {recetTransactions.map((rt) => (
                              <TableRow
                                key={rt._id}
                                className="border-b last:border-0 hover:bg-gray-50"
                              >
                                {/* Date Formatting (YYYY-MM-DD) */}
                                <TableCell className="p-3 text-xs">
                                  {rt.date
                                    ? new Date(rt.date)
                                        .toISOString()
                                        .split("T")[0]
                                    : "N/A"}
                                </TableCell>
                                <TableCell className="p-3 text-xs font-medium">
                                  {rt.name}
                                </TableCell>
                                <TableCell className="p-3 text-xs font-medium">
                                  {rt.milkQuantity} L
                                </TableCell>
                                <TableCell className="p-3 text-xs text-blue-600">
                                  Rs. {rt.milkIncome}
                                </TableCell>
                                <TableCell className="p-3 text-xs text-green-600">
                                  Rs. {rt.productIncome}
                                </TableCell>
                                <TableCell
                                  className={`p-3 text-xs font-bold text-right ${
                                    rt.milkIncome > rt.productIncome
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {rt.milkIncome > rt.productIncome
                                    ? `- Rs. ${Math.abs(
                                        rt.productIncome - rt.milkIncome
                                      )}`
                                    : `+ Rs. ${
                                        rt.productIncome - rt.milkIncome
                                      }`}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        <div className="flex justify-end mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              setActiveTab("history");
                              setSelectedTab("history");
                            }}
                          >
                            View All <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="shadow-md lg:col-span-3 border-t-4 border-t-primary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-primary" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                      >
                        <Link to="/members" className="no-underline">
                          <Card className="border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer h-full">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                              <User className="h-8 w-8 text-muted-foreground mb-2" />
                              <h3 className="font-medium text-sm">
                                Add New Member
                              </h3>
                            </CardContent>
                          </Card>
                        </Link>

                        <Link to="/products" className="no-underline">
                          <Card className="border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer h-full">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                              <Package className="h-8 w-8 text-muted-foreground mb-2" />
                              <h3 className="font-medium text-sm">
                                Manage Products
                              </h3>
                            </CardContent>
                          </Card>
                        </Link>

                        <Link to="/reports" className="no-underline">
                          <Card className="border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer h-full">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                              <History className="h-8 w-8 text-muted-foreground mb-2" />
                              <h3 className="font-medium text-sm">
                                View Reports
                              </h3>
                            </CardContent>
                          </Card>
                        </Link>

                        <Link to="/settings" className="no-underline">
                          <Card className="border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer h-full">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                              <CreditCard className="h-8 w-8 text-muted-foreground mb-2" />
                              <h3 className="font-medium text-sm">
                                Payment Settings
                              </h3>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left Column - Search and User Details */}
                <div className="space-y-4">
                  {/* Search Section */}
                  <Card className="shadow-md border-t-4 border-t-primary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <User className="h-4 w-4 mr-2 text-primary" />
                        Member Search
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Find a member by NIC or name
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2">
                      <RadioGroup
                        defaultValue="nic"
                        value={searchType}
                        onValueChange={setSearchType}
                        className="flex flex-wrap gap-2"
                      >
                        <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1 rounded-md">
                          <RadioGroupItem
                            value="nic"
                            id="nic"
                            className="text-primary"
                          />
                          <Label htmlFor="nic" className="text-sm">
                            NIC
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1 rounded-md">
                          <RadioGroupItem
                            value="name"
                            id="name"
                            className="text-primary"
                          />
                          <Label htmlFor="name" className="text-sm">
                            Name
                          </Label>
                        </div>
                      </RadioGroup>

                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder={
                              searchType === "nic"
                                ? "Enter NIC number"
                                : "Enter member name"
                            }
                            className="pl-8 h-9 text-sm bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleSearch();
                              }
                            }}
                          />
                        </div>
                        <Button
                          onClick={handleSearch}
                          className="h-9 px-3 bg-primary hover:bg-primary/90"
                        >
                          Search
                        </Button>
                      </div>

                      {searchError && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert
                            variant="destructive"
                            className="bg-destructive/10 border-destructive/20 py-2"
                          >
                            <AlertDescription className="text-xs flex justify-between items-center">
                              <span>{searchError}</span>
                              {!foundUser && (
                                <Link
                                  to="/members"
                                  className="text-primary text-xs font-medium hover:underline"
                                >
                                  Register →
                                </Link>
                              )}
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>

                  {/* User Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="shadow-md overflow-hidden border-t-4 border-t-green-500">
                      <CardHeader className="pb-2 bg-green-500/10">
                        <CardTitle className="text-sm flex items-center text-green-700">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Member Found
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="bg-muted p-1.5 rounded-full">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{foundUser.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Member
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="px-2 py-1 text-xs font-medium"
                          >
                            NIC: {foundUser.nic}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Milk Purchase Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="shadow-md">
                      <CardHeader className="pb-2 border-b bg-blue-500/10">
                        <CardTitle className="text-sm flex items-center gap-1 text-blue-700">
                          <Milk className="h-4 w-4" />
                          Milk Purchase
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label
                              htmlFor="milk-quantity"
                              className="text-xs font-medium"
                            >
                              Quantity (Liters)
                            </Label>
                            <div className="relative">
                              <Input
                                id="milk-quantity"
                                type="number"
                                min="0"
                                step="0.1"
                                value={milkQuantity || ""}
                                onChange={(e) =>
                                  setMilkQuantity(
                                    Number.parseFloat(e.target.value) || 0
                                  )
                                }
                                className="h-9 pl-3 pr-8 text-sm"
                              />
                              <span className="absolute right-3 top-2 text-xs text-muted-foreground">
                                L
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label
                              htmlFor="milk-price"
                              className="text-xs font-medium"
                            >
                              Price per Liter
                            </Label>
                            <div className="relative">
                              <Input
                                id="milk-price"
                                type="number"
                                min="0"
                                value={milkPrice}
                                onChange={(e) =>
                                  setMilkPrice(
                                    Number.parseFloat(e.target.value) || 0
                                  )
                                }
                                className="h-9 pl-6 text-sm"
                              />
                              <span className="absolute left-2 top-2 text-xs text-muted-foreground">
                                Rs.
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/50 p-2 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium">
                              Total Milk Cost:
                            </span>
                            <span className="text-sm font-bold text-blue-600">
                              Rs. {totalMilkCost.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Middle Column - Product Purchase */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <Card className="shadow-md h-full">
                    <CardHeader className="pb-2 border-b bg-amber-500/10">
                      <CardTitle className="text-sm flex items-center gap-1 text-amber-700">
                        <Package className="h-4 w-4" />
                        Product Purchase
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-3">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Search products by name..."
                          className="pl-8 h-9 text-sm"
                          value={productQuery}
                          onChange={(e) => setProductQuery(e.target.value)}
                        />
                      </div>

                      {productQuery && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ duration: 0.3 }}
                        >
                          <ScrollArea className="h-[120px] border rounded-md p-2 bg-background">
                            {filteredProducts.length > 0 ? (
                              <ul className="space-y-1">
                                {filteredProducts.map((product) => (
                                  <li
                                    key={product._id}
                                    className="flex justify-between items-center p-1.5 hover:bg-muted/50 rounded-md transition-colors"
                                  >
                                    <div>
                                      <span className="text-sm font-medium">
                                        {product.name}
                                      </span>
                                      <span className="text-xs text-muted-foreground ml-2">
                                        Rs. {product.price.toFixed(2)}
                                      </span>
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={() => handleAddProduct(product)}
                                      className="h-7 px-2 bg-amber-500 hover:bg-amber-600 text-white"
                                    >
                                      <Plus className="h-3 w-3 mr-1" /> Add
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground text-xs text-center py-6">
                                No products found matching "{productQuery}"
                              </p>
                            )}
                          </ScrollArea>
                        </motion.div>
                      )}

                      {selectedProducts.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-medium flex items-center">
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Selected Products
                          </h4>
                          <ScrollArea className="h-[220px]">
                            <div className="border rounded-md divide-y bg-background">
                              {selectedProducts.map((product) => (
                                <div key={product._id} className="p-2 group">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">
                                      {product.name}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-6 w-6 rounded-full"
                                        onClick={() =>
                                          handleUpdateQuantity(
                                            product._id,
                                            product.quantity - 1
                                          )
                                        }
                                      >
                                        <Minus className="h-2.5 w-2.5" />
                                      </Button>
                                      <span className="w-6 text-center text-sm font-medium">
                                        {product.quantity}
                                      </span>
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-6 w-6 rounded-full"
                                        onClick={() =>
                                          handleUpdateQuantity(
                                            product._id,
                                            product.quantity + 1
                                          )
                                        }
                                      >
                                        <Plus className="h-2.5 w-2.5" />
                                      </Button>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() =>
                                          handleUpdateQuantity(product._id, 0)
                                        }
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                      <div className="flex items-center space-x-1">
                                        <Switch
                                          id={`custom-price-${product._id}`}
                                          checked={product.useCustomPrice}
                                          onCheckedChange={(checked) =>
                                            handleToggleCustomPrice(
                                              product._id,
                                              checked
                                            )
                                          }
                                          className="h-3 w-6 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                                        />
                                        <Label
                                          htmlFor={`custom-price-${product._id}`}
                                          className="text-xs text-muted-foreground"
                                        >
                                          Custom
                                        </Label>
                                      </div>
                                    </div>

                                    <div className="flex items-center">
                                      {editingPriceId === product._id ? (
                                        <div className="flex items-center">
                                          <Input
                                            type="number"
                                            value={tempCustomPrice}
                                            onChange={(e) =>
                                              setTempCustomPrice(e.target.value)
                                            }
                                            className="w-16 h-6 text-xs text-right"
                                            autoFocus
                                          />
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-6 w-6 text-green-600"
                                            onClick={() =>
                                              handleSaveCustomPrice(product._id)
                                            }
                                          >
                                            <Check className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center">
                                          <span className="text-xs">
                                            Rs.{" "}
                                            {(product.useCustomPrice &&
                                            product.customPrice !== undefined
                                              ? product.customPrice
                                              : product.price
                                            ).toFixed(2)}
                                          </span>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-6 w-6 text-muted-foreground"
                                            onClick={() =>
                                              handleStartEditPrice(product)
                                            }
                                          >
                                            <Edit2 className="h-2.5 w-2.5" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="text-xs text-muted-foreground">
                                    Total:
                                    <span className="font-medium text-amber-600 ml-1">
                                      Rs.{" "}
                                      {(
                                        (product.useCustomPrice &&
                                        product.customPrice !== undefined
                                          ? product.customPrice
                                          : product.price) * product.quantity
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                          <div className="bg-muted/50 p-2 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium">
                                Total Products Cost:
                              </span>
                              <span className="text-sm font-bold text-amber-600">
                                Rs. {totalProductsCost.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Right Column - Invoice Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-md border-t-4 border-t-primary h-full">
                    <CardHeader className="pb-2 bg-primary/5">
                      <CardTitle className="text-sm flex items-center gap-1">
                        <ShoppingCart className="h-4 w-4 text-primary" />
                        Invoice Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-3">
                      <ScrollArea className="h-[400px]">
                        <div className="bg-muted/30 rounded-lg p-3 space-y-3">
                          <div className="grid grid-cols-2 gap-3 pb-2">
                            <div className="space-y-1">
                              <h4 className="text-xs font-medium text-muted-foreground">
                                MEMBER
                              </h4>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3 text-primary" />
                                <span className="font-medium text-sm">
                                  {foundUser.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Badge
                                  variant="outline"
                                  className="px-1.5 py-0.5 text-xs"
                                >
                                  NIC: {foundUser.nic}
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs font-medium text-muted-foreground">
                                INVOICE
                              </h4>
                              <div className="text-xs text-muted-foreground">
                                <p>Date: {new Date().toLocaleDateString()}</p>
                                <p>Time: {new Date().toLocaleTimeString()}</p>
                                <p>
                                  Invoice #: INV-
                                  {Math.floor(Math.random() * 10000)
                                    .toString()
                                    .padStart(4, "0")}
                                </p>
                              </div>
                            </div>
                          </div>

                          <Separator className="my-1" />

                          <div className="space-y-3">
                            <h4 className="text-xs font-medium text-muted-foreground">
                              PURCHASE DETAILS
                            </h4>

                            {milkQuantity > 0 && (
                              <div className="bg-blue-500/5 p-2 rounded-md">
                                <div className="flex flex-col space-y-1">
                                  <div className="flex items-center gap-1">
                                    <Milk className="h-3 w-3 text-blue-500" />
                                    <span className="text-sm font-medium">
                                      Milk Purchase
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-xs pl-4">
                                    <span className="text-muted-foreground">
                                      {milkQuantity} liters @ Rs. {milkPrice}
                                      /liter
                                    </span>
                                    <span className="font-bold text-blue-600">
                                      Rs. {totalMilkCost.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {selectedProducts.length > 0 && (
                              <div className="bg-amber-500/5 p-2 rounded-md">
                                <div className="flex items-center gap-1 mb-1">
                                  <Package className="h-3 w-3 text-amber-500" />
                                  <span className="text-sm font-medium">
                                    Product Purchases
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {selectedProducts.map((product) => {
                                    const priceToUse =
                                      product.useCustomPrice &&
                                      product.customPrice !== undefined
                                        ? product.customPrice
                                        : product.price;

                                    return (
                                      <div
                                        key={product._id}
                                        className="flex justify-between text-xs pl-4 py-0.5 border-b border-dashed border-muted last:border-0"
                                      >
                                        <span>
                                          {product.name}
                                          <span className="text-muted-foreground ml-1">
                                            ({product.quantity} × Rs.{" "}
                                            {priceToUse.toFixed(2)})
                                            {product.useCustomPrice &&
                                              product.customPrice !==
                                                undefined && (
                                                <span className="ml-1 text-amber-600">
                                                  (Custom)
                                                </span>
                                              )}
                                          </span>
                                        </span>
                                        <span className="font-medium">
                                          Rs.{" "}
                                          {(
                                            priceToUse * product.quantity
                                          ).toFixed(2)}
                                        </span>
                                      </div>
                                    );
                                  })}
                                  <div className="flex justify-between pt-1 pl-4 font-medium text-amber-600 text-xs">
                                    <span>Products Subtotal</span>
                                    <span>
                                      Rs. {totalProductsCost.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <Separator className="my-1" />

                          <div className="flex justify-between items-center pt-1">
                            <span className="text-sm font-bold">
                              Grand Total:
                            </span>
                            <span className="text-lg font-bold text-primary">
                              Rs. {grandTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter className="pt-2 pb-3">
                      <Button
                        className="w-full h-10 text-sm bg-primary hover:bg-primary/90"
                        onClick={handleConfirmPurchase}
                      >
                        <CheckCircle2 className="mr-1 h-4 w-4" />
                        Confirm Purchase
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <TransactionTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
