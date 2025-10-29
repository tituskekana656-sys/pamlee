import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import logoImage from "@assets/generated_images/Pam_Lee's_Kitchen_logo_c9b7ecd0.png";

interface NavbarProps {
  cartItemCount?: number;
}

export function Navbar({ cartItemCount = 0 }: NavbarProps) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/menu", label: "Menu" },
    { path: "/specials", label: "Specials" },
    { path: "/gallery", label: "Gallery" },
    { path: "/contact", label: "Contact" },
  ];

  if (user?.isAdmin) {
    navLinks.push({ path: "/admin", label: "Admin" });
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-lg px-2 py-1 -ml-2 cursor-pointer">
              <img 
                src={logoImage} 
                alt="Pam_Lee's Kitchen Logo" 
                className="h-10 w-10 md:h-12 md:w-12 object-contain"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-primary">Pam_Lee's Kitchen</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Artisan Bakery</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} data-testid={`link-${link.label.toLowerCase()}`}>
                <span
                  className={`text-sm font-medium transition-colors hover-elevate active-elevate-2 px-3 py-2 rounded-lg cursor-pointer ${
                    location === link.path
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Cart Button */}
            {isAuthenticated && (
              <Link href="/order" data-testid="link-cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  data-testid="button-cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {user?.firstName || user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <a href="/api/logout" data-testid="link-logout">
                  <Button variant="ghost" size="sm" data-testid="button-logout">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </a>
              </div>
            ) : (
              <a href="/api/login" data-testid="link-login" className="hidden md:block">
                <Button variant="default" size="sm" data-testid="button-login">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </a>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <div
                  className={`block px-4 py-2 text-base font-medium rounded-lg hover-elevate active-elevate-2 cursor-pointer ${
                    location === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid={`mobile-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </div>
              </Link>
            ))}

            <div className="pt-4 border-t space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    Signed in as {user?.email}
                  </div>
                  <a href="/api/logout" className="block">
                    <Button variant="destructive" className="w-full" data-testid="mobile-button-logout">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </a>
                </>
              ) : (
                <a href="/api/login" className="block">
                  <Button className="w-full" data-testid="mobile-button-login">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
