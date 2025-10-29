// Seed database with initial data
import { db } from "./db";
import { products, specials, galleryImages } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Seed products
  const productData = [
    {
      name: "Chocolate Layer Cake",
      description: "Rich chocolate cake with velvety frosting, perfect for celebrations",
      price: "450.00",
      category: "Cakes",
      imageUrl: "/attached_assets/generated_images/Chocolate_cake_product_photo_c49fbe2f.png",
      inStock: true,
      featured: true,
    },
    {
      name: "Fresh Croissants",
      description: "Buttery, flaky French pastries baked fresh daily",
      price: "25.00",
      category: "Pastries",
      imageUrl: "/attached_assets/generated_images/Croissant_product_photo_cb9846f7.png",
      inStock: true,
      featured: true,
    },
    {
      name: "Artisan Sourdough Bread",
      description: "Traditional sourdough with crispy crust and soft interior",
      price: "55.00",
      category: "Breads",
      imageUrl: "/attached_assets/generated_images/Artisan_bread_product_photo_0b57c49d.png",
      inStock: true,
      featured: true,
    },
    {
      name: "Assorted Cupcakes",
      description: "Colorful cupcakes with beautiful frosting decorations",
      price: "35.00",
      category: "Cakes",
      imageUrl: "/attached_assets/generated_images/Cupcakes_product_photo_a1537e42.png",
      inStock: true,
      featured: false,
    },
    {
      name: "French Macarons",
      description: "Delicate almond meringue cookies in assorted flavors",
      price: "120.00",
      category: "Pastries",
      imageUrl: "/attached_assets/generated_images/Macarons_product_photo_883105bc.png",
      inStock: true,
      featured: false,
    },
    {
      name: "Elegant Wedding Cake",
      description: "Custom wedding cake with white fondant and gold decorations",
      price: "1500.00",
      category: "Cakes",
      imageUrl: "/attached_assets/generated_images/Wedding_cake_product_photo_cf9b89fe.png",
      inStock: true,
      featured: false,
    },
    {
      name: "Danish Pastries",
      description: "Assorted Danish pastries with fruit and custard fillings",
      price: "30.00",
      category: "Pastries",
      imageUrl: "/attached_assets/generated_images/Danish_pastries_product_photo_d827c432.png",
      inStock: true,
      featured: false,
    },
  ];

  await db.insert(products).values(productData);
  console.log("Products seeded");

  // Seed specials
  const specialsData = [
    {
      title: "Weekend Special - 20% Off All Cakes",
      description: "Enjoy 20% discount on all our delicious cakes this weekend. Perfect for your weekend celebrations!",
      discount: 20,
      imageUrl: "/attached_assets/generated_images/Chocolate_cake_product_photo_c49fbe2f.png",
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isActive: true,
    },
    {
      title: "Buy 6 Croissants, Get 2 Free",
      description: "Stock up on our buttery croissants. Buy 6 and get 2 absolutely free!",
      discount: 25,
      imageUrl: "/attached_assets/generated_images/Croissant_product_photo_cb9846f7.png",
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      isActive: true,
    },
  ];

  await db.insert(specials).values(specialsData);
  console.log("Specials seeded");

  // Seed gallery images
  const galleryData = [
    {
      imageUrl: "/attached_assets/generated_images/Bakery_hero_banner_background_7eafa9f9.png",
      caption: "Fresh baked goods daily",
      category: "Breads",
    },
    {
      imageUrl: "/attached_assets/generated_images/Chocolate_cake_product_photo_c49fbe2f.png",
      caption: "Our signature chocolate cake",
      category: "Cakes",
    },
    {
      imageUrl: "/attached_assets/generated_images/Croissant_product_photo_cb9846f7.png",
      caption: "Buttery French croissants",
      category: "Pastries",
    },
    {
      imageUrl: "/attached_assets/generated_images/Artisan_bread_product_photo_0b57c49d.png",
      caption: "Artisan sourdough bread",
      category: "Breads",
    },
    {
      imageUrl: "/attached_assets/generated_images/Baking_process_gallery_photo_c3f2852b.png",
      caption: "Handcrafted with love",
      category: "Behind the Scenes",
    },
    {
      imageUrl: "/attached_assets/generated_images/Wedding_cake_product_photo_cf9b89fe.png",
      caption: "Custom wedding cakes",
      category: "Cakes",
    },
  ];

  await db.insert(galleryImages).values(galleryData);
  console.log("Gallery images seeded");

  console.log("Database seeded successfully!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
