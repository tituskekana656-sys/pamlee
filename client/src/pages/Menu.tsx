import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";

const categories = ["All", "Cakes", "Pastries", "Breads", "Specials"];

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { cart, addToCart, updateQuantity, cartItemCount } = useCart();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter(
    (product) =>
      selectedCategory === "All" || product.category === selectedCategory
  ) || [];

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4" data-testid="text-menu-title">
            Our Menu
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Explore our delicious selection of freshly baked goods
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 md:top-20 z-40 bg-background border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                data-testid={`button-category-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="grid-products">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cart[product.id] || 0}
                  onAddToCart={addToCart}
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16" data-testid="empty-products">
              <p className="text-xl text-muted-foreground mb-4">
                No products found in this category
              </p>
              <Button variant="outline" onClick={() => setSelectedCategory("All")}>
                View All Products
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link href="/order">
            <Button 
              size="lg" 
              className="rounded-full shadow-2xl px-6 py-6 h-auto gap-3"
              data-testid="button-view-cart"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="font-semibold">
                View Cart ({cartItemCount})
              </span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
