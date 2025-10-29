# Pam Lee's Kitchen - Complete Inventory

## Images Inventory

### Available Images (10 total)
All images are located in `attached_assets/generated_images/`

| Image File | Usage | Status |
|------------|-------|--------|
| `Pam_Lee's_Kitchen_logo_c9b7ecd0.png` | Navbar logo | ✅ Active |
| `Bakery_hero_banner_background_7eafa9f9.png` | Hero background (Landing, Home, Gallery) | ✅ Active |
| `Chocolate_cake_product_photo_c49fbe2f.png` | Product, Specials, Gallery | ✅ Active |
| `Croissant_product_photo_cb9846f7.png` | Product, Specials, Gallery, Landing | ✅ Active |
| `Artisan_bread_product_photo_0b57c49d.png` | Product, Gallery, Landing | ✅ Active |
| `Cupcakes_product_photo_a1537e42.png` | Product | ✅ Active |
| `Macarons_product_photo_883105bc.png` | Product | ✅ Active |
| `Wedding_cake_product_photo_cf9b89fe.png` | Product, Gallery | ✅ Active |
| `Danish_pastries_product_photo_d827c432.png` | Product | ✅ Active |
| `Baking_process_gallery_photo_c3f2852b.png` | Gallery, Home page | ✅ Active |

### Image Usage by Component

**Frontend (using @assets imports):**
- `client/src/components/Navbar.tsx` - Logo
- `client/src/pages/Landing.tsx` - Hero, Cake, Croissant, Bread
- `client/src/pages/Home.tsx` - Hero, Baking process

**Backend (database seed paths):**
- `server/seed.ts` - All product images, specials, gallery images (using `/attached_assets/...` paths)

---

## Products Inventory

### Current Products (7 total)
Defined in `server/seed.ts`

| # | Product Name | Price | Category | Featured | Stock | Image |
|---|--------------|-------|----------|----------|-------|-------|
| 1 | Chocolate Layer Cake | R450.00 | Cakes | ✅ Yes | ✅ In Stock | Chocolate_cake_product_photo |
| 2 | Fresh Croissants | R25.00 | Pastries | ✅ Yes | ✅ In Stock | Croissant_product_photo |
| 3 | Artisan Sourdough Bread | R55.00 | Breads | ✅ Yes | ✅ In Stock | Artisan_bread_product_photo |
| 4 | Assorted Cupcakes | R35.00 | Cakes | ❌ No | ✅ In Stock | Cupcakes_product_photo |
| 5 | French Macarons | R120.00 | Pastries | ❌ No | ✅ In Stock | Macarons_product_photo |
| 6 | Elegant Wedding Cake | R1500.00 | Cakes | ❌ No | ✅ In Stock | Wedding_cake_product_photo |
| 7 | Danish Pastries | R30.00 | Pastries | ❌ No | ✅ In Stock | Danish_pastries_product_photo |

### Product Categories
- **All** - Shows all products
- **Cakes** - 3 products (Chocolate Layer Cake, Assorted Cupcakes, Elegant Wedding Cake)
- **Pastries** - 3 products (Fresh Croissants, French Macarons, Danish Pastries)
- **Breads** - 1 product (Artisan Sourdough Bread)
- **Specials** - Shows active specials/promotions

---

## Specials/Promotions (2 active)
Defined in `server/seed.ts`

| # | Title | Description | Discount | Image | Duration |
|---|-------|-------------|----------|-------|----------|
| 1 | Weekend Special - 20% Off All Cakes | Enjoy 20% discount on all our delicious cakes this weekend. Perfect for your weekend celebrations! | 20% | Chocolate_cake_product_photo | 7 days |
| 2 | Buy 6 Croissants, Get 2 Free | Stock up on our buttery croissants. Buy 6 and get 2 absolutely free! | 25% | Croissant_product_photo | 14 days |

---

## Gallery Images (6 entries)
Defined in `server/seed.ts`

| # | Image | Caption | Category |
|---|-------|---------|----------|
| 1 | Bakery_hero_banner_background | Fresh baked goods daily | Breads |
| 2 | Chocolate_cake_product_photo | Our signature chocolate cake | Cakes |
| 3 | Croissant_product_photo | Buttery French croissants | Pastries |
| 4 | Artisan_bread_product_photo | Artisan sourdough bread | Breads |
| 5 | Baking_process_gallery_photo | Handcrafted with love | Behind the Scenes |
| 6 | Wedding_cake_product_photo | Custom wedding cakes | Cakes |

---

## Database Schema

### Tables
- `users` - User accounts with Replit Auth
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Individual items in orders
- `specials` - Promotions and discounts
- `gallery_images` - Gallery/showcase images
- `contact_messages` - Contact form submissions
- `sessions` - Auth session storage

### Key Files
- `shared/schema.ts` - Database schema definitions
- `server/seed.ts` - Initial data seeding
- `server/storage.ts` - Database operations
- `server/routes.ts` - API endpoints

---

## Adding New Products

To add a new product:

1. **Add the image** to `attached_assets/generated_images/`
2. **Update seed data** in `server/seed.ts`:
   ```javascript
   {
     name: "Product Name",
     description: "Product description",
     price: "100.00",
     category: "Cakes|Pastries|Breads",
     imageUrl: "/attached_assets/generated_images/your-image.png",
     inStock: true,
     featured: false,
   }
   ```
3. **Run the seed script**:
   ```bash
   tsx server/seed.ts
   ```

Or use the Admin panel (requires admin user) to add products via the UI.

---

## Adding New Images

To add new images for products, gallery, or specials:

1. Place image in `attached_assets/generated_images/`
2. Use path format: `/attached_assets/generated_images/filename.png`
3. Reference in:
   - Products (imageUrl field)
   - Specials (imageUrl field)
   - Gallery (imageUrl field)
   - Frontend components (use `@assets` import)

---

## Current Status

✅ **All systems operational**
- 10 images present and active
- 7 products in catalog
- 2 active promotions
- 6 gallery images
- Full authentication system
- Admin panel functional
- Order management system
- Database seeded and ready

**No missing items detected** - All referenced images exist and all products have valid image references.
