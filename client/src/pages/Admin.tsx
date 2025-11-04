
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

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

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
            <div>
              <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Pam_Lee's Kitchen Management</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-20 bg-background border-r">
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </Button>
            <Button
              variant={activeTab === "products" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("products")}
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </Button>
            <Button
              variant={activeTab === "inventory" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("inventory")}
            >
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </Button>
            <Button
              variant={activeTab === "customers" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("customers")}
            >
              <Users className="h-4 w-4 mr-2" />
              Customers
            </Button>
            <Button
              variant={activeTab === "staff" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("staff")}
            >
              <UserCog className="h-4 w-4 mr-2" />
              Staff
            </Button>
            <Button
              variant={activeTab === "specials" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("specials")}
            >
              <Tag className="h-4 w-4 mr-2" />
              Specials
            </Button>
            <Button
              variant={activeTab === "reports" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("reports")}
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
                    <Button onClick={() => setActiveTab("products")}>
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
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4" />
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
              </div>
            )}

            {/* Products Management */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Products Management</h2>
                  <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>
                          Add a new product to your bakery inventory
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Product Name</Label>
                          <Input placeholder="e.g., Chocolate Cake" />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cakes">Cakes</SelectItem>
                              <SelectItem value="breads">Breads</SelectItem>
                              <SelectItem value="pastries">Pastries</SelectItem>
                              <SelectItem value="specials">Specials</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Price (R)</Label>
                          <Input type="number" placeholder="0.00" />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input placeholder="Product description" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => {
                          toast({ title: "Coming Soon", description: "Product creation will be implemented" });
                          setIsAddProductOpen(false);
                        }}>
                          Add Product
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
                          <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
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
                            >
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
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
                    <Button>
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
                    <Button>
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
                      <Button variant="outline">
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
                      <p className="text-muted-foreground">
                        Track your most popular products
                      </p>
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
