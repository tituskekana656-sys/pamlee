import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Package, CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Order, OrderItem } from "@shared/schema";

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-500", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-500", icon: Package },
  preparing: { label: "Preparing", color: "bg-purple-500", icon: Package },
  ready: { label: "Ready", color: "bg-green-500", icon: CheckCircle },
  completed: { label: "Completed", color: "bg-green-600", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-500", icon: XCircle },
};

export default function OrderTracking() {
  const [location] = useLocation();
  const [orderNumber, setOrderNumber] = useState("");
  const [searchedOrderNumber, setSearchedOrderNumber] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlOrderNumber = params.get('orderNumber');
    if (urlOrderNumber) {
      setOrderNumber(urlOrderNumber);
      setSearchedOrderNumber(urlOrderNumber);
    }
  }, [location]);

  const { data: order, isLoading, error } = useQuery<Order & { items: OrderItem[] }>({
    queryKey: ["/api/orders/track", searchedOrderNumber],
    enabled: searchedOrderNumber.length > 0,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return await apiRequest("POST", `/api/orders/${orderId}/cancel`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders/track", searchedOrderNumber] });
      toast({
        title: "Order Cancelled",
        description: "Your order has been cancelled successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    setSearchedOrderNumber(orderNumber.trim());
  };

  const handleCancelOrder = () => {
    if (order && window.confirm("Are you sure you want to cancel this order?")) {
      cancelOrderMutation.mutate(order.id);
    }
  };

  const canCancelOrder = order && (() => {
    if (order.status !== "pending") return false;
    const orderAge = Date.now() - new Date(order.createdAt).getTime();
    const hoursOld = orderAge / (1000 * 60 * 60);
    return hoursOld <= 24;
  })();
  const statusInfo = order ? statusConfig[order.status as keyof typeof statusConfig] : null;
  const StatusIcon = statusInfo?.icon;

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8 text-center" data-testid="text-tracking-title">
          Track Your Order
        </h1>

        {/* Search Section */}
        <Card className="p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter your order number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              data-testid="input-order-number"
            />
            <Button onClick={handleSearch} data-testid="button-track-order">
              <Search className="h-4 w-4 mr-2" />
              Track Order
            </Button>
          </div>
        </Card>

        {/* Order Details */}
        {isLoading && (
          <Card className="p-8">
            <p className="text-center text-muted-foreground">Searching for your order...</p>
          </Card>
        )}

        {error && (
          <Card className="p-8">
            <p className="text-center text-destructive" data-testid="text-order-not-found">
              Order not found. Please check your order number and try again.
            </p>
          </Card>
        )}

        {order && statusInfo && (
          <Card className="p-6 md:p-8" data-testid="card-order-details">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-serif font-semibold mb-2" data-testid="text-order-number">
                  Order #{order.orderNumber}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Badge className={`${statusInfo.color} text-white`} data-testid="badge-order-status">
                  {StatusIcon && <StatusIcon className="h-4 w-4 mr-2" />}
                  {statusInfo.label}
                </Badge>
                {canCancelOrder && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCancelOrder}
                    disabled={cancelOrderMutation.isPending}
                    data-testid="button-cancel-order"
                  >
                    {cancelOrderMutation.isPending ? "Cancelling..." : "Cancel Order"}
                  </Button>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Order Progress</h3>
              <div className="space-y-4">
                {["pending", "confirmed", "preparing", "ready", "completed"].map((status, idx) => {
                  const config = statusConfig[status as keyof typeof statusConfig];
                  const Icon = config.icon;
                  const isCompleted = ["pending", "confirmed", "preparing", "ready", "completed"].indexOf(order.status) >= idx;
                  const isCurrent = order.status === status;

                  return (
                    <div key={status} className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? config.color : "bg-muted"
                        } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                      >
                        <Icon className={`h-5 w-5 ${isCompleted ? "text-white" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                          {config.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Details */}
            <div className="border-t pt-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium" data-testid="text-customer-name">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Delivery Method</p>
                  <p className="font-medium capitalize">{order.deliveryType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="font-medium capitalize">
                    {order.paymentMethod === "eft" ? "Bank Transfer (EFT)" : 
                     order.paymentMethod === "card" ? "Card Payment" : "Cash"}
                  </p>
                </div>
                {order.deliveryAddress && (
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">Delivery Address</p>
                    <p className="font-medium">{order.deliveryAddress}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center" data-testid={`order-item-${item.id}`}>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-primary">
                      R{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-4 pt-4 space-y-2">
                {order.deliveryFee && parseFloat(order.deliveryFee) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>R{parseFloat(order.deliveryFee).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-primary" data-testid="text-order-total">
                    R{parseFloat(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="border-t mt-6 pt-6">
                <h3 className="text-lg font-semibold mb-2">Special Instructions</h3>
                <p className="text-muted-foreground">{order.notes}</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
