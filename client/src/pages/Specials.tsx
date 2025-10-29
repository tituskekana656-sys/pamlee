import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Tag } from "lucide-react";
import type { Special } from "@shared/schema";

export default function Specials() {
  const { data: specials, isLoading } = useQuery<Special[]>({
    queryKey: ["/api/specials"],
  });

  const activeSpecials = specials?.filter(s => s.isActive && new Date(s.validUntil) > new Date()) || [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4" data-testid="text-specials-title">
            Specials & Promotions
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Don't miss out on our current deals and seasonal offerings
          </p>
        </div>
      </section>

      {/* Specials Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : activeSpecials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="grid-specials">
              {activeSpecials.map((special) => (
                <Card key={special.id} className="overflow-hidden hover-elevate active-elevate-2 transition-all" data-testid={`card-special-${special.id}`}>
                  {/* Special Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={special.imageUrl}
                      alt={special.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">
                        <Tag className="h-4 w-4 mr-2" />
                        {special.discount}% OFF
                      </Badge>
                    </div>
                  </div>

                  {/* Special Info */}
                  <div className="p-6">
                    <h3 className="text-2xl font-serif font-semibold mb-3" data-testid={`text-special-title-${special.id}`}>
                      {special.title}
                    </h3>
                    <p className="text-muted-foreground mb-4" data-testid={`text-special-description-${special.id}`}>
                      {special.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>
                        Valid until {new Date(special.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16" data-testid="empty-specials">
              <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Specials</h3>
              <p className="text-muted-foreground">
                Check back soon for new promotions and seasonal offerings
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
