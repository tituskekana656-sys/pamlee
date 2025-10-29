import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  quantity?: number;
  onAddToCart?: (productId: string) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
}

export function ProductCard({ product, quantity = 0, onAddToCart, onUpdateQuantity }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden hover-elevate active-elevate-2 transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          data-testid={`img-product-${product.id}`}
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
        {product.featured && product.inStock && (
          <div className="absolute top-3 right-3">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-xl font-serif font-semibold mb-2 text-foreground" data-testid={`text-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2" data-testid={`text-description-${product.id}`}>
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
            R{parseFloat(product.price).toFixed(2)}
          </span>

          {product.inStock && (
            <>
              {quantity > 0 ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateQuantity?.(product.id, Math.max(0, quantity - 1))}
                    data-testid={`button-decrease-${product.id}`}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-semibold w-8 text-center" data-testid={`text-quantity-${product.id}`}>
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onUpdateQuantity?.(product.id, quantity + 1)}
                    data-testid={`button-increase-${product.id}`}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => onAddToCart?.(product.id)}
                  size="sm"
                  data-testid={`button-add-cart-${product.id}`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
