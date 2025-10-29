# Design Guidelines for Pam_Lee's Kitchen

## Design Approach

**Reference-Based Approach**: Drawing primary inspiration from Dis-Chem's website (modern e-commerce with clean layouts, clear product displays, and efficient navigation), adapted for a luxury bakery aesthetic. The design combines Dis-Chem's practical e-commerce functionality with elevated, artisanal bakery branding.

## Core Design Principles

1. **Luxury meets accessibility** - Sophisticated gold accents balanced with clean, scannable layouts
2. **Product-forward** - High-quality bakery imagery takes center stage
3. **Warmth and trust** - Convey home-baked authenticity through visual language
4. **Efficient shopping** - Clear paths to browse, order, and track purchases

---

## Typography System

**Font Families**:
- **Headings**: Playfair Display (Serif) - 700 weight for main headings, 600 for subheadings
- **Body**: Poppins (Sans-serif) - 400 regular, 500 medium, 600 semibold

**Type Scale**:
- Hero Headlines: text-6xl md:text-7xl (Playfair Display, font-bold)
- Page Titles: text-4xl md:text-5xl (Playfair Display, font-semibold)
- Section Headers: text-3xl md:text-4xl (Playfair Display, font-semibold)
- Card Titles: text-xl md:text-2xl (Playfair Display, font-semibold)
- Body Large: text-lg (Poppins, font-normal)
- Body: text-base (Poppins, font-normal)
- Small Text: text-sm (Poppins, font-normal)
- Micro Copy: text-xs (Poppins, font-medium)

---

## Color System

**Primary Palette**:
- **Gold**: #D4AF37 (primary accent, CTAs, highlights, hover states)
- **Black**: #000000 (text, backgrounds, sophisticated contrast)
- **White**: #FFFFFF (backgrounds, text on dark, clean space)

**Supporting Shades**:
- Gold variants: rgba(212, 175, 55, 0.1) for subtle backgrounds, rgba(212, 175, 55, 0.2) for hover overlays
- Gray scale: #F5F5F5 (light gray for sections), #333333 (soft black for secondary text), #666666 (muted text)

**Usage Rules**:
- Primary CTAs: Gold background with white text, subtle gold glow on hover
- Secondary buttons: White/transparent with gold border, gold text
- Links: Gold color with underline on hover
- Product cards: White background with subtle shadow, gold accents on hover
- Dark sections: Black background with gold accents and white text

---

## Layout & Spacing System

**Container System**:
- Max width: max-w-7xl for main content
- Side padding: px-4 sm:px-6 lg:px-8
- Section padding vertical: py-16 md:py-24 lg:py-32

**Spacing Primitives** (Tailwind units):
- Primary spacing: 4, 6, 8, 12, 16
- Component internal spacing: p-4, p-6, p-8
- Section gaps: gap-6, gap-8, gap-12
- Margins between sections: mb-16, mb-24

**Grid Systems**:
- Product grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Feature sections: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Two-column layouts: grid-cols-1 lg:grid-cols-2

---

## Component Library

### Navigation Bar
- Sticky top navigation with subtle shadow on scroll
- Black background with gold logo and navigation links
- White text for nav items, gold underline on active/hover
- Mobile: Hamburger menu with slide-in drawer
- Include: Logo (left), Nav links (center), Cart icon + Login/Account (right)

### Hero Sections
- Full-width hero with high-quality bakery background image (freshly baked breads, pastries on display)
- Dark overlay (rgba(0,0,0,0.4)) for text readability
- Centered content with large Playfair Display headline
- Primary CTA button with blurred background (backdrop-blur-md, bg-gold/90)
- Height: min-h-[600px] md:min-h-[700px]
- Parallax scroll effect for depth

### Product Cards
- White background with rounded-xl corners
- Product image: aspect-square, object-cover with overflow-hidden
- Hover effect: Slight scale (scale-105), gold border glow
- Content padding: p-6
- Product name: text-xl Playfair Display
- Price: text-lg Poppins, gold color
- "Add to Cart" button: Gold background, appears on hover for desktop, always visible on mobile

### Buttons
**Primary Button**:
- Gold background (#D4AF37)
- White text, Poppins font-medium
- Padding: px-8 py-3
- Rounded: rounded-lg
- Hover: Subtle gold glow (box-shadow), slightly lighter gold
- When on images: backdrop-blur-md, bg-gold/90

**Secondary Button**:
- Transparent background with gold border (border-2)
- Gold text
- Same padding and rounding as primary
- Hover: Gold background with white text transition

### Forms
- Input fields: White background, border-gray-300, rounded-lg, p-4
- Focus state: Gold border (border-gold), gold ring (ring-2 ring-gold/20)
- Labels: text-sm Poppins, font-medium, text-gray-700
- Error states: Red border, red text below
- Success states: Green border with checkmark icon

### Footer
- Black background with gold accents
- Three columns on desktop (About, Quick Links, Contact & Social)
- Single column stack on mobile
- Social icons: Gold with hover effect
- Newsletter signup: Inline form with gold submit button
- Business info: Phone, email, location clearly displayed
- Bottom bar: Copyright, designed by credits

### Order Tracking Card
- White card with shadow-lg
- Order number prominent at top (text-2xl Playfair)
- Status indicator: Color-coded badge (Gold for processing, Green for completed)
- Timeline visualization with gold progress line
- Estimated delivery date highlighted

### Gallery Lightbox
- Grid of images with hover overlay (dark with gold border)
- Lightbox opens on click with black background
- Navigation arrows in gold
- Close button: Gold X icon, top-right
- Image counter: Bottom center in white

---

## Page-Specific Layouts

### Login/Signup Page
- Centered card layout on subtle bakery background (blurred, low opacity)
- max-w-md form card with white background
- Toggle between login/signup with gold underline indicator
- Social login buttons with icons
- "Or continue with email" divider

### Homepage
- Hero section with CTA
- Featured products grid (4 items)
- Mission statement section (two-column: image left, text right)
- Special offers banner (full-width, gold background)
- Customer testimonials carousel
- Instagram feed preview
- CTA section before footer

### Menu Page
- Sticky filter bar (Categories: All, Cakes, Pastries, Breads, Specials)
- 4-column product grid on desktop, responsive
- Each product card includes image, name, description snippet, price, add to cart
- Quick view modal on product click

### Order Page
- Two-column layout (Form left, Cart summary right)
- Cart summary sticky on scroll
- Payment method selection with icons
- Order total prominently displayed in gold
- Delivery/Pickup toggle

### Admin Dashboard
- Sidebar navigation (black with gold active state)
- Data tables with gold header row
- Action buttons (Edit, Delete) in table rows
- Add product/special modal forms
- Order status update dropdowns

---

## Images

### Required Images:
1. **Hero Backgrounds**: 
   - Homepage: Artisan bread loaves on wooden table, warm lighting (1920x1080)
   - Menu page: Variety of pastries and cakes display (1920x800)
   
2. **Product Images**: 
   - High-quality, square format (600x600)
   - Well-lit, professional bakery photography
   - Consistent white or neutral backgrounds
   
3. **Gallery**: 
   - Behind-the-scenes baking photos
   - Finished products close-ups
   - Customer celebration cakes
   - Bakery workspace shots
   
4. **About/Mission Section**: 
   - Owner/baker portrait or hands kneading dough (800x800)

### Image Treatment:
- Rounded corners (rounded-lg) for product and gallery images
- Hover zoom effect (scale-110) with overflow-hidden
- Lazy loading for performance
- WebP format with fallbacks

---

## Animation & Interaction

**Minimal, Purposeful Motion**:
- Fade-in on scroll for sections (opacity + translateY)
- Product card hover: scale + shadow increase (transition-all duration-300)
- Button hover: Subtle glow expansion (transition-shadow)
- Page transitions: Fade between routes (no complex animations)
- Hero parallax: Subtle background scroll offset (transform: translateY)

**No Animations**:
- Auto-playing carousels
- Excessive scroll-triggered effects
- Distracting background movements

---

## Accessibility

- Minimum contrast ratio 4.5:1 (gold on white, white on black meet this)
- Focus indicators: Gold ring (ring-2 ring-gold) on all interactive elements
- Alt text for all product and decorative images
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for icons and complex components

---

## Mobile-First Considerations

- Touch targets minimum 44x44px
- Simplified navigation in hamburger menu
- Single-column layouts prioritized
- Larger tap areas for product cards
- Sticky "Add to Cart" bar on product pages
- Bottom navigation for key actions on mobile
- Optimized images for mobile bandwidth

This design system delivers a sophisticated, luxury bakery experience while maintaining the practical e-commerce functionality of Dis-Chem's approach, creating an elevated yet accessible shopping experience for Pam_Lee's Kitchen customers.