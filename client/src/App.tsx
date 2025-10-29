// Following javascript_log_in_with_replit blueprint
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { CartProvider, useCart } from "@/contexts/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Order from "@/pages/Order";
import OrderTracking from "@/pages/OrderTracking";
import Specials from "@/pages/Specials";
import Gallery from "@/pages/Gallery";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const { cartItemCount } = useCart();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar cartItemCount={cartItemCount} />
      
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/home" component={Home} />
          <Route path="/menu" component={Menu} />
          <Route path="/order" component={Order} />
          <Route path="/order-tracking" component={OrderTracking} />
          <Route path="/specials" component={Specials} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/contact" component={Contact} />
          {isAuthenticated && <Route path="/admin" component={Admin} />}
          <Route component={NotFound} />
        </Switch>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
