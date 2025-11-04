
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Package,
  ShoppingBag,
  Tag,
  Loader2,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  FileText,
  Settings,
  Bell,
  BarChart3,
  AlertTriangle,
  UserCog,
  Pencil,
  Trash2,
  Menu,
  X,
  Eye,
} from "lucide-react";
import type { Order, Product, Special } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    enabled: !!user?.isAdmin,
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: !!user?.isAdmin,
  });

  const { data: specials, isLoading: specialsLoading } = useQuery<Special[]>({
    queryKey: ["/api/specials"],
    enabled: !!user?.isAdmin,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleProductStockMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await apiRequest("PATCH", `/api/admin/products/${productId}/stock`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product stock status updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      return await apiRequest("POST", "/api/products", {
        ...productData,
        price: productData.price.toString(),
        inStock: true,
        featured: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      setIsAddProductOpen(false);
      resetProductForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PATCH", `/api/admin/products/${id}`, {
        ...data,
        price: data.price.toString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      setEditingProduct(null);
      resetProductForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await apiRequest("DELETE", `/api/admin/products/${productId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
    });
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      ...productForm,
      imageUrl: productForm.imageUrl || "/attached_assets/generated_images/Cupcakes_product_photo_a1537e42.png"
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      window.location.href = "/";
    }
  }, [user, authLoading]);

  if (authLoading || !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate dashboard statistics
  const totalOrders = orders?.length || 0;
  const totalSales = orders?.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === "pending").length || 0;
  const lowStockProducts = products?.filter(p => !p.inStock).length || 0;

  // Filter orders
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Navigation Bar */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-primary">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Pam_Lee's Kitchen Management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({ title: "Notifications", description: "No new notifications" })}
              >
                <Bell className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-background border-r
          transform transition-transform duration-200 ease-in-out lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:flex lg:flex-col lg:pt-20 pt-24
        `}>
          <div className="flex items-center justify-between px-4 py-2 lg:hidden border-b">
            <span className="font-semibold">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </Button>
            <Button
              variant={activeTab === "products" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => { setActiveTab("products"); setIsSidebarOpen(false); }}
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </Button>
            <Button
              variant={activeTab === "inventory" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => { setActiveTab("inventory"); setIsSidebarOpen(false); }}
            >
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </Button>
            <Button
              variant={activeTab === "customers" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => { setActiveTab("customers"); setIsSidebarOpen(false); }}
            >
              <Users className="h-4 w-4 mr-2" />
              Customers
            </Button>
            <Button
              variant={activeTab === "staff" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => { setActiveTab("staff"); setIsSidebarOpen(false); }}
            >
              <UserCog className="h-4 w-4 mr-2" />
              Staff
            </Button>
            <Button
              variant={activeTab === "specials" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => { setActiveTab("specials"); setIsSidebarOpen(false); }}
            >
              <Tag className="h-4 w-4 mr-2" />
              Specials
            </Button>
            <Button
              variant={activeTab === "reports" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => { setActiveTab("reports"); setIsSidebarOpen(false); }}
            >
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:pl-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Dashboard Overview */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Orders
                      </CardTitle>
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalOrders}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {pendingOrders} pending
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Sales
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">R{totalSales.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        +20.1% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Products
                      </CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{products?.length || 0}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {lowStockProducts} low stock
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Revenue
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">R{totalSales.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        This month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-4">
                    <Button onClick={() => { setActiveTab("products"); setIsAddProductOpen(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("orders")}>
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      View Orders
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("reports")}>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {ordersLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                      </div>
                    ) : orders && orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order.id} className="flex items-center justify-between border-b pb-4">
                            <div>
                              <p className="font-medium">#{order.orderNumber}</p>
                              <p className="text-sm text-muted-foreground">{order.customerName}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">R{parseFloat(order.totalAmount).toFixed(2)}</p>
                              <Badge variant={order.status === "pending" ? "outline" : "default"}>
                                {order.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No orders yet</p>
                    )}
                  </CardContent>
                </Card>

                {/* Low Stock Alerts */}
                {lowStockProducts > 0 && (
                  <Card className="border-yellow-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Low Stock Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {lowStockProducts} products are out of stock
                      </p>
                      <Button variant="link" onClick={() => setActiveTab("inventory")} className="p-0 mt-2">
                        View Inventory →
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Orders Management */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <h2 className="text-2xl font-bold">Orders Management</h2>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-64"
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order #</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ordersLoading ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8">
                              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : filteredOrders && filteredOrders.length > 0 ? (
                          filteredOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                              <TableCell>{order.customerName}</TableCell>
                              <TableCell>{order.customerPhone}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{order.deliveryType}</Badge>
                              </TableCell>
                              <TableCell>R{parseFloat(order.totalAmount).toFixed(2)}</TableCell>
                              <TableCell>
                                <Select
                                  value={order.status}
                                  onValueChange={(status) =>
                                    updateOrderStatusMutation.mutate({ orderId: order.id, status })
                                  }
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="preparing">Preparing</SelectItem>
                                    <SelectItem value="ready">Ready</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              No orders found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Order Details Dialog */}
                <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Order Details</DialogTitle>
                      <DialogDescription>
                        Order #{selectedOrder?.orderNumber}
                      </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-muted-foreground">Customer</Label>
                            <p className="font-medium">{selectedOrder.customerName}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Phone</Label>
                            <p className="font-medium">{selectedOrder.customerPhone}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Email</Label>
                            <p className="font-medium">{selectedOrder.customerEmail}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Delivery Type</Label>
                            <Badge variant="outline">{selectedOrder.deliveryType}</Badge>
                          </div>
                          {selectedOrder.deliveryAddress && (
                            <div className="col-span-2">
                              <Label className="text-muted-foreground">Delivery Address</Label>
                              <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                            </div>
                          )}
                          {selectedOrder.deliveryDate && (
                            <div>
                              <Label className="text-muted-foreground">Delivery Date</Label>
                              <p className="font-medium">
                                {new Date(selectedOrder.deliveryDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {selectedOrder.deliveryTime && (
                            <div>
                              <Label className="text-muted-foreground">Delivery Time</Label>
                              <p className="font-medium">{selectedOrder.deliveryTime}</p>
                            </div>
                          )}
                        </div>
                        
                        {selectedOrder.specialInstructions && (
                          <div>
                            <Label className="text-muted-foreground">Special Instructions</Label>
                            <p className="font-medium mt-1">{selectedOrder.specialInstructions}</p>
                          </div>
                        )}

                        <div>
                          <Label className="text-muted-foreground mb-2 block">Order Status</Label>
                          <Select
                            value={selectedOrder.status}
                            onValueChange={(status) => {
                              updateOrderStatusMutation.mutate({ orderId: selectedOrder.id, status });
                              setSelectedOrder({ ...selectedOrder, status });
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="ready">Ready</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-muted-foreground mb-2 block">Order Summary</Label>
                          <div className="space-y-2">
                            <div className="flex justify-between py-2 border-b">
                              <span className="font-medium">Subtotal</span>
                              <span>R{parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="font-medium">Delivery Fee</span>
                              <span>R{parseFloat(selectedOrder.deliveryFee || "0").toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 font-bold text-lg">
                              <span>Total</span>
                              <span className="text-primary">R{parseFloat(selectedOrder.totalAmount).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(selectedOrder.createdAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Products Management */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Products Management</h2>
                  <Dialog 
                    open={isAddProductOpen || !!editingProduct} 
                    onOpenChange={(open) => {
                      if (!open) {
                        setIsAddProductOpen(false);
                        setEditingProduct(null);
                        resetProductForm();
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => setIsAddProductOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingProduct ? "Edit Product" : "Add New Product"}
                        </DialogTitle>
                        <DialogDescription>
                          {editingProduct 
                            ? "Update product details"
                            : "Add a new product to your bakery inventory"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Product Name *</Label>
                          <Input 
                            placeholder="e.g., Chocolate Cake"
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Category *</Label>
                          <Select
                            value={productForm.category}
                            onValueChange={(value) => setProductForm({ ...productForm, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cakes">Cakes</SelectItem>
                              <SelectItem value="breads">Breads</SelectItem>
                              <SelectItem value="pastries">Pastries</SelectItem>
                              <SelectItem value="drinks">Drinks</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Price (R) *</Label>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea 
                            placeholder="Product description"
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Image URL</Label>
                          <Input 
                            placeholder="https://example.com/image.jpg"
                            value={productForm.imageUrl}
                            onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Leave empty to use default image
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsAddProductOpen(false);
                            setEditingProduct(null);
                            resetProductForm();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSaveProduct}
                          disabled={createProductMutation.isPending || updateProductMutation.isPending}
                        >
                          {createProductMutation.isPending || updateProductMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : editingProduct ? (
                            "Update Product"
                          ) : (
                            "Add Product"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsLoading ? (
                    <div className="col-span-full text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    </div>
                  ) : products && products.length > 0 ? (
                    products.map((product) => (
                      <Card key={product.id}>
                        <CardContent className="p-4">
                          <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/attached_assets/generated_images/Cupcakes_product_photo_a1537e42.png";
                              }}
                            />
                          </div>
                          <h3 className="font-semibold mb-2">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                          <p className="text-lg font-bold text-primary mb-4">
                            R{parseFloat(product.price).toFixed(2)}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant={product.inStock ? "default" : "destructive"}
                              size="sm"
                              className="flex-1"
                              onClick={() => toggleProductStockMutation.mutate(product.id)}
                              disabled={toggleProductStockMutation.isPending}
                            >
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                  deleteProductMutation.mutate(product.id);
                                }
                              }}
                              disabled={deleteProductMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-muted-foreground py-8">
                      No products available
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Inventory Management */}
            {activeTab === "inventory" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Inventory Management</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Levels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Track and manage your ingredient inventory and stock levels
                    </p>
                    <Button onClick={() => toast({ title: "Coming Soon", description: "Inventory management feature will be available soon" })}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Inventory Item
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Customers Management */}
            {activeTab === "customers" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Customers Management</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Database</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      View and manage customer information and order history
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Staff Management */}
            {activeTab === "staff" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Staff Management</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Staff Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Manage staff accounts, roles, and permissions
                    </p>
                    <Button onClick={() => toast({ title: "Coming Soon", description: "Staff management feature will be available soon" })}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Staff Member
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Specials */}
            {activeTab === "specials" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Specials & Promotions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {specialsLoading ? (
                    <div className="col-span-full text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    </div>
                  ) : specials && specials.length > 0 ? (
                    specials.map((special) => (
                      <Card key={special.id}>
                        <CardContent className="p-4">
                          <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                            <img
                              src={special.imageUrl}
                              alt={special.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-lg">{special.title}</h3>
                            <Badge variant={special.isActive ? "default" : "secondary"}>
                              {special.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{special.description}</p>
                          <p className="text-sm font-medium text-primary mb-2">
                            {special.discount}% OFF
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Valid until {new Date(special.validUntil).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="col-span-full text-center text-muted-foreground py-8">
                      No specials available
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Reports */}
            {activeTab === "reports" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Sales & Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sales Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        View detailed sales reports and analytics
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => toast({ 
                          title: "Export Report", 
                          description: "Report export feature coming soon" 
                        })}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Export Report
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Best Sellers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-2">
                        Track your most popular products
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Analytics feature coming soon
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Settings</h2>
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bakery Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Bakery Name</Label>
                        <Input defaultValue="Pam Lee's Kitchen" />
                      </div>
                      <div>
                        <Label>Address</Label>
                        <Input placeholder="123 Bakery Street" />
                      </div>
                      <div>
                        <Label>Contact Phone</Label>
                        <Input placeholder="+27 123 456 789" />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input placeholder="info@pamleeskitchen.com" />
                      </div>
                      <Button onClick={() => toast({ title: "Settings saved", description: "Your changes have been saved successfully" })}>
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Operating Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Set your bakery's operating hours
                      </p>
                      <Button variant="outline" onClick={() => toast({ title: "Coming Soon", description: "Operating hours management will be available soon" })}>
                        Configure Hours
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Configure payment methods and gateway
                      </p>
                      <Button variant="outline" onClick={() => toast({ title: "Coming Soon", description: "Payment settings will be available soon" })}>
                        Configure Payments
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
