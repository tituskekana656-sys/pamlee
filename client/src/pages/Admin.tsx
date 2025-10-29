import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Package, ShoppingBag, Tag, Loader2 } from "lucide-react";
import type { Order, Product, Special } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("orders");

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

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8" data-testid="text-admin-title">
          Admin Dashboard
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="orders" data-testid="tab-orders">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" data-testid="tab-products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="specials" data-testid="tab-specials">
              <Tag className="h-4 w-4 mr-2" />
              Specials
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="p-6">
              <h2 className="text-2xl font-serif font-semibold mb-6">Manage Orders</h2>
              {ordersLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="space-y-4" data-testid="list-orders">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-6" data-testid={`order-card-${order.id}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold" data-testid={`order-number-${order.id}`}>
                              #{order.orderNumber}
                            </h3>
                            <Badge variant="outline">{order.deliveryType}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Customer: {order.customerName}
                          </p>
                          <p className="text-sm text-muted-foreground mb-1">
                            Phone: {order.customerPhone}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total: <span className="font-semibold text-primary">R{parseFloat(order.totalAmount).toFixed(2)}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>

                        <div className="md:w-48">
                          <Label className="text-sm font-medium mb-2 block">Order Status</Label>
                          <Select
                            value={order.status}
                            onValueChange={(status) =>
                              updateOrderStatusMutation.mutate({ orderId: order.id, status })
                            }
                          >
                            <SelectTrigger data-testid={`select-status-${order.id}`}>
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
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8" data-testid="empty-orders">
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="p-6">
              <h2 className="text-2xl font-serif font-semibold mb-6">Manage Products</h2>
              {productsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </div>
              ) : products && products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="grid-admin-products">
                  {products.map((product) => (
                    <Card key={product.id} className="p-4" data-testid={`product-card-${product.id}`}>
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
                      <Button
                        variant={product.inStock ? "default" : "destructive"}
                        size="sm"
                        className="w-full"
                        onClick={() => toggleProductStockMutation.mutate(product.id)}
                        data-testid={`button-toggle-stock-${product.id}`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </Button>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8" data-testid="empty-products">
                  <p className="text-muted-foreground">No products available</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Specials Tab */}
          <TabsContent value="specials">
            <Card className="p-6">
              <h2 className="text-2xl font-serif font-semibold mb-6">Manage Specials</h2>
              {specialsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </div>
              ) : specials && specials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="grid-admin-specials">
                  {specials.map((special) => (
                    <Card key={special.id} className="p-4" data-testid={`special-card-${special.id}`}>
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
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8" data-testid="empty-specials">
                  <p className="text-muted-foreground">No specials available</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
