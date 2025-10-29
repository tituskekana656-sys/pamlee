import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { Trash2, ShoppingCart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
import { useLocation } from "wouter";

const orderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  deliveryType: z.enum(["delivery", "pickup"]),
  deliveryAddress: z.string().optional(),
  paymentMethod: z.enum(["cash", "card", "eft"], {
    required_error: "Please select a payment method",
  }),
  notes: z.string().optional(),
}).refine(
  (data) => {
    if (data.deliveryType === "delivery") {
      return data.deliveryAddress && data.deliveryAddress.trim().length > 0;
    }
    return true;
  },
  {
    message: "Delivery address is required for delivery orders",
    path: ["deliveryAddress"],
  }
);

type OrderFormData = z.infer<typeof orderSchema>;

export default function Order() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { cart, removeFromCart, clearCart } = useCart();

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : "",
      customerEmail: user?.email || "",
      customerPhone: "",
      deliveryType: "delivery",
      deliveryAddress: "",
      paymentMethod: "cash",
      notes: "",
    },
  });

  const deliveryType = form.watch("deliveryType");

  const cartItems = Object.entries(cart)
    .map(([productId, quantity]) => {
      const product = products?.find(p => p.id === productId);
      return product ? { product, quantity } : null;
    })
    .filter(Boolean) as Array<{ product: Product; quantity: number }>;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  const deliveryFee = deliveryType === "delivery" ? 50 : 0;
  const total = subtotal + deliveryFee;

  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      return await apiRequest("POST", "/api/orders", {
        ...data,
        userId: user?.id,
        deliveryFee: deliveryFee.toFixed(2),
        totalAmount: total.toFixed(2),
        items: orderItems,
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Order Placed Successfully!",
        description: `Your order number is ${data.orderNumber}. You can track it on the order tracking page.`,
      });
      clearCart();
      setLocation("/order-tracking");
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OrderFormData) => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add items to your cart before placing an order",
        variant: "destructive",
      });
      return;
    }
    createOrderMutation.mutate(data);
  };


  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8" data-testid="text-order-title">
          Place Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Method *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="delivery" id="delivery" data-testid="radio-delivery" />
                              <Label htmlFor="delivery">Delivery (R50)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="pickup" id="pickup" data-testid="radio-pickup" />
                              <Label htmlFor="pickup">Pickup (Free)</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {deliveryType === "delivery" && (
                    <FormField
                      control={form.control}
                      name="deliveryAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address *</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={3} 
                              data-testid="textarea-address"
                              placeholder="Enter your full residential address including street, city, and postal code"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col gap-3"
                          >
                            <div className="flex items-center space-x-2 border rounded-lg p-3">
                              <RadioGroupItem value="cash" id="cash" data-testid="radio-cash" />
                              <Label htmlFor="cash" className="flex-1 cursor-pointer">
                                <span className="font-semibold">Cash on Delivery/Pickup</span>
                                <p className="text-sm text-muted-foreground">Pay with cash when you receive your order</p>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-3">
                              <RadioGroupItem value="card" id="card" data-testid="radio-card" />
                              <Label htmlFor="card" className="flex-1 cursor-pointer">
                                <span className="font-semibold">Card Payment</span>
                                <p className="text-sm text-muted-foreground">Pay with credit/debit card on delivery/pickup</p>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-3">
                              <RadioGroupItem value="eft" id="eft" data-testid="radio-eft" />
                              <Label htmlFor="eft" className="flex-1 cursor-pointer">
                                <span className="font-semibold">Bank Transfer (EFT)</span>
                                <p className="text-sm text-muted-foreground">We'll send you banking details after order confirmation</p>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} data-testid="textarea-notes" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={createOrderMutation.isPending || cartItems.length === 0}
                    data-testid="button-place-order"
                  >
                    {createOrderMutation.isPending ? "Processing..." : `Place Order (R${total.toFixed(2)})`}
                  </Button>
                </form>
              </Form>
            </Card>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-serif font-semibold mb-6" data-testid="text-cart-summary">
                Order Summary
              </h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-8" data-testid="empty-cart">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <Button variant="outline" onClick={() => setLocation("/menu")}>
                    Browse Menu
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex gap-4" data-testid={`cart-item-${item.product.id}`}>
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            R{parseFloat(item.product.price).toFixed(2)} × {item.quantity}
                          </p>
                          <p className="font-semibold text-primary">
                            R{(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.product.id)}
                          data-testid={`button-remove-${item.product.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span data-testid="text-subtotal">R{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span data-testid="text-delivery-fee">R{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span className="text-primary" data-testid="text-total">R{total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
