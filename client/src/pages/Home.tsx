import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import heroImage from "@assets/generated_images/Bakery_hero_banner_background_7eafa9f9.png";
import bakingImage from "@assets/generated_images/Baking_process_gallery_photo_c3f2852b.png";

export default function Home() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", "featured"],
    enabled: true,
  });

  const featuredProducts = products?.filter(p => p.featured).slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax Effect */}
      <section className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6" data-testid="text-hero-title">
            Freshly Baked with <span className="text-primary">Love</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Discover our selection of artisan breads, delicious pastries, and custom cakes
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/menu">
              <Button 
                size="lg" 
                className="bg-primary/90 backdrop-blur-md hover:bg-primary px-8 py-6 text-lg h-auto"
                data-testid="button-browse-menu"
              >
                Browse Menu
                <ShoppingCart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/specials">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg h-auto"
                data-testid="button-view-specials"
              >
                View Specials
                <Star className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="text-featured-title">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Handpicked favorites loved by our customers
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="grid-featured-products">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(id) => {
                    window.location.href = '/menu';
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured products available at the moment</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/menu">
              <Button size="lg" variant="outline" data-testid="button-view-all-products">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6" data-testid="text-mission-title">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                At Pam_Lee's Kitchen, we're committed to delighting our customers with fresh, 
                homemade baked goods and friendly service. Our vision is to become the leading 
                bakery brand in Giyani and the wider Limpopo region through exceptional quality 
                and innovative customer experience.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Every product is crafted with care using traditional recipes and the finest 
                ingredients. From our artisan sourdough to our custom celebration cakes, 
                we pour our hearts into every creation.
              </p>
              <Link href="/contact">
                <Button size="lg" data-testid="button-contact-us">
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="order-1 lg:order-2">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src={bakingImage}
                  alt="Baking process at Pam_Lee's Kitchen"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4" data-testid="text-cta-title">
            Ready to Order?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Browse our menu and place your order for delivery or pickup today
          </p>
          <Link href="/menu">
            <Button 
              size="lg" 
              variant="secondary"
              className="px-8 py-6 text-lg h-auto"
              data-testid="button-order-now"
            >
              Order Now
              <ShoppingCart className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
