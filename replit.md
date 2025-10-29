# Pam_Lee's Kitchen - Luxury Bakery E-Commerce Platform

## Overview

Pam_Lee's Kitchen is a modern, mobile-first bakery e-commerce web application built for a local bakery in Giyani, Limpopo, South Africa. The platform enables customers to browse products, place orders, track deliveries, and view promotional specials. The design draws inspiration from modern e-commerce platforms while maintaining a luxury bakery aesthetic with gold accents, elegant typography, and high-quality imagery.

**Core Purpose**: Enable online ordering and customer engagement for an artisan bakery through an elegant, user-friendly web interface.

**Key Features**:
- Product catalog with filtering and search
- Shopping cart and order management
- Order tracking system
- Gallery showcasing bakery creations
- Admin dashboard for order and product management
- Special promotions and deals section
- Contact form with business information

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**Routing**: Wouter for client-side routing with the following page structure:
- `/` - Landing page (pre-authentication) or Home page (post-authentication)
- `/menu` - Product catalog with category filtering
- `/order` - Shopping cart and checkout
- `/order-tracking` - Order status lookup
- `/specials` - Promotional offers
- `/gallery` - Image gallery with lightbox
- `/contact` - Contact form and business information
- `/admin` - Administrative dashboard (restricted)

**State Management**:
- React Query (@tanstack/react-query) for server state and API data fetching
- React Context API for cart state management (CartContext)
- Local storage persistence for shopping cart data

**UI Component Library**: Shadcn/ui with Radix UI primitives for accessible, customizable components

**Styling**: 
- Tailwind CSS with custom configuration
- Design tokens defined in CSS variables for theming
- Custom utility classes for elevation effects (hover-elevate, active-elevate-2)
- Font pairing: Playfair Display (serif headings) + Poppins (sans-serif body)
- Color scheme: Gold (#D4AF37), Black, White with supporting grays

**Asset Management**: 
- Static assets served from `/attached_assets` directory
- Vite aliases for clean imports (@, @shared, @assets)
- Image optimization through Vite's asset pipeline

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js

**API Design**: RESTful API with the following endpoints:
- `/api/auth/*` - Authentication routes (Replit Auth integration)
- `/api/products` - Product CRUD operations
- `/api/orders` - Order creation and tracking
- `/api/specials` - Promotional specials
- `/api/gallery` - Gallery images
- `/api/contact` - Contact form submissions
- `/api/admin/*` - Administrative operations

**Authentication**: 
- Replit Auth with OpenID Connect (OIDC)
- Passport.js for authentication strategy
- Express sessions with PostgreSQL session store (connect-pg-simple)
- Role-based access control (admin flag on user model)

**Data Layer**:
- Drizzle ORM for type-safe database operations
- Schema-first approach with shared TypeScript types
- Zod schemas for validation (drizzle-zod integration)

**Middleware Stack**:
- express.json() for JSON body parsing
- express.urlencoded() for form data
- express.static() for serving static assets from attached_assets
- Custom logging middleware for API requests
- Session management middleware

**Static File Serving**: Express middleware configured to serve files from `attached_assets` directory at `/attached_assets` route

### Database Schema

**ORM**: Drizzle ORM with PostgreSQL dialect

**Core Tables**:

1. **sessions** - Express session storage (required for authentication)
   - Primary key: sid (varchar)
   - Fields: sess (jsonb), expire (timestamp)

2. **users** - User accounts
   - Primary key: id (UUID)
   - Fields: email, firstName, lastName, profileImageUrl, isAdmin, timestamps
   - Relationships: One-to-many with orders

3. **products** - Bakery product catalog
   - Primary key: id (UUID)
   - Fields: name, description, price (decimal), category, imageUrl, inStock (boolean), featured (boolean), timestamps
   - Categories: Cakes, Pastries, Breads, Specials

4. **orders** - Customer orders
   - Primary key: id (UUID)
   - Fields: orderNumber (unique), userId, customerName, customerEmail, customerPhone, totalAmount, status, deliveryType, deliveryAddress, notes, timestamps
   - Status enum: pending, confirmed, preparing, ready, completed, cancelled

5. **orderItems** - Line items for orders
   - Primary key: id (UUID)
   - Foreign keys: orderId, productId
   - Fields: quantity, priceAtTime (decimal - captures price snapshot)

6. **specials** - Promotional offers
   - Primary key: id (UUID)
   - Fields: title, description, imageUrl, discountPercentage, validUntil, isActive, timestamps

7. **galleryImages** - Photo gallery
   - Primary key: id (UUID)
   - Fields: imageUrl, caption, displayOrder, timestamps

8. **contactMessages** - Customer inquiries
   - Primary key: id (UUID)
   - Fields: name, email, phone, message, timestamps

**Migration Strategy**: Drizzle Kit for schema migrations with `db:push` command

### Design System

**Typography Scale**:
- Hero: text-6xl to text-7xl (Playfair Display, bold)
- Page titles: text-4xl to text-5xl (Playfair Display, semibold)
- Section headers: text-3xl to text-4xl (Playfair Display, semibold)
- Card titles: text-xl to text-2xl (Playfair Display, semibold)
- Body text: text-base (Poppins, normal weight)

**Color System**:
- Primary gold: #D4AF37 (HSL: 43 70% 53%) for CTAs, accents, highlights
- Supporting colors defined through CSS custom properties
- Light mode default with semantic color tokens (background, foreground, border, etc.)

**Component Patterns**:
- ProductCard with image, details, and add-to-cart functionality
- Responsive navbar with mobile hamburger menu
- Footer with business information and quick links
- Hero sections with parallax backgrounds and gradient overlays
- Skeleton loading states for async content

**Responsive Design**:
- Mobile-first approach with breakpoints at sm (640px), md (768px), lg (1024px)
- Flex and grid layouts for responsive component arrangement
- Sticky header at top-0 with z-index management

## External Dependencies

### Third-Party Services

**Authentication Provider**: Replit Auth (OIDC)
- Environment variables: REPL_ID, SESSION_SECRET, ISSUER_URL
- OpenID Connect discovery endpoint
- Token-based authentication with refresh tokens

**Database**: PostgreSQL via Neon Serverless
- Connection via @neondatabase/serverless package
- WebSocket constructor (ws) for serverless compatibility
- Connection string via DATABASE_URL environment variable

### NPM Packages

**Core Framework**:
- react, react-dom - UI framework
- express - HTTP server
- vite - Build tool and dev server
- typescript - Type safety
- wouter - Client-side routing

**Database & ORM**:
- drizzle-orm - Database ORM
- drizzle-kit - Schema migrations
- @neondatabase/serverless - PostgreSQL driver
- drizzle-zod - Zod integration for validation

**Authentication**:
- passport - Authentication middleware
- openid-client - OIDC client
- express-session - Session management
- connect-pg-simple - PostgreSQL session store

**UI Components**:
- @radix-ui/* - Accessible component primitives (20+ packages)
- cmdk - Command palette
- vaul - Drawer component
- lucide-react - Icon library
- react-icons - Additional icons (TikTok, Instagram, Facebook)

**Forms & Validation**:
- react-hook-form - Form state management
- zod - Schema validation
- @hookform/resolvers - Form validation integration

**Data Fetching**:
- @tanstack/react-query - Server state management
- memoizee - Function memoization

**Styling**:
- tailwindcss - Utility-first CSS framework
- tailwind-merge - Merge Tailwind classes
- clsx - Conditional class names
- class-variance-authority - Component variants

**Development Tools**:
- tsx - TypeScript execution
- esbuild - JavaScript bundler
- @vitejs/plugin-react - Vite React plugin
- @replit/vite-plugin-* - Replit development plugins

### Environment Configuration

**Required Environment Variables**:
- DATABASE_URL - PostgreSQL connection string
- SESSION_SECRET - Session encryption key
- REPL_ID - Replit application identifier
- ISSUER_URL - OIDC provider URL (defaults to https://replit.com/oidc)
- NODE_ENV - Environment flag (development/production)

**Build Configuration**:
- TypeScript with strict mode and ESNext modules
- Path aliases for clean imports
- Separate client and server build processes
- Static asset bundling through Vite