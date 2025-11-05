import { Button } from "@/components/ui/button";
import { ArrowRight, Cookie, Clock, Award } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@assets/generated_images/Bakery_hero_banner_background_7eafa9f9.png";
import cakeImage from "@assets/generated_images/Chocolate_cake_product_photo_c49fbe2f.png";
import croissantImage from "@assets/generated_images/Croissant_product_photo_cb9846f7.png";
import breadImage from "@assets/generated_images/Artisan_bread_product_photo_0b57c49d.png";

export default function Landing() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Welcome to <span className="text-primary">Pam_Lee's Kitchen</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Freshly baked artisan breads, cakes, and pastries made with love in Giyani, Limpopo
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            {!isAuthenticated ? (
              <>
                <Button
                  size="lg"
                  className="bg-primary/90 backdrop-blur-md hover:bg-primary text-primary-foreground px-8 py-6 text-lg h-auto"
                  onClick={() => setLocation('/login')}
                  data-testid="button-login-hero"
                >
                  Login / Sign Up
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg h-auto"
                  onClick={() => setLocation('/login')}
                  data-testid="button-admin-login"
                >
                  Admin Login
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                className="bg-primary/90 backdrop-blur-md hover:bg-primary text-primary-foreground px-8 py-6 text-lg h-auto"
                onClick={() => setLocation('/menu')}
                data-testid="button-browse-menu"
              >
                Browse Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the finest artisan bakery products delivered with care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl hover-elevate active-elevate-2 transition-all">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cookie className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Fresh Daily</h3>
              <p className="text-muted-foreground">
                All our products are baked fresh every day using the finest ingredients
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover-elevate active-elevate-2 transition-all">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Quick Delivery</h3>
              <p className="text-muted-foreground">
                Fast delivery or convenient pickup options to suit your schedule
              </p>
            </div>

            <div className="text-center p-6 rounded-xl hover-elevate active-elevate-2 transition-all">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3">Quality Guaranteed</h3>
              <p className="text-muted-foreground">
                Premium quality bakery products that exceed your expectations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Specialties</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our delicious selection of artisan bakery products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { image: cakeImage, title: "Cakes", description: "Custom cakes for every occasion" },
              { image: croissantImage, title: "Pastries", description: "Flaky, buttery perfection" },
              { image: breadImage, title: "Breads", description: "Artisan sourdough & more" },
            ].map((item, idx) => (
              <div key={idx} className="bg-card rounded-xl overflow-hidden hover-elevate active-elevate-2 transition-all">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-serif font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <Button
              size="lg"
              className="px-8 py-6 text-lg h-auto"
              onClick={() => setLocation('/login')}
              data-testid="button-login-cta"
            >
              Login to Browse Full Menu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg h-auto"
              onClick={() => setLocation('/login')}
              data-testid="button-admin-login-cta"
            >
              Admin Login
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join our community and enjoy fresh, homemade baked goods delivered to your door
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="px-8 py-6 text-lg h-auto"
            onClick={() => setLocation('/login')}
            data-testid="button-signup-cta"
          >
            Create Your Account
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Pam_Lee's Kitchen. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Giyani, Malamulele - Limpopo, South Africa
          </p>
        </div>
      </footer>
    </div>
  );
}