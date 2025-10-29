// Following javascript_log_in_with_replit and javascript_database blueprints
import {
  users,
  products,
  orders,
  orderItems,
  specials,
  galleryImages,
  contactMessages,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Special,
  type InsertSpecial,
  type GalleryImage,
  type InsertGalleryImage,
  type ContactMessage,
  type InsertContactMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - Required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(id: string, inStock: boolean): Promise<Product>;

  // Order operations
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order & { items: OrderItem[] }>;
  getOrderByNumber(orderNumber: string): Promise<(Order & { items: OrderItem[] }) | undefined>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order>;
  getOrder(orderId: string): Promise<Order | undefined>; // Added for cancellation check

  // Special operations
  getAllSpecials(): Promise<Special[]>;
  getActiveSpecials(): Promise<Special[]>;
  createSpecial(special: InsertSpecial): Promise<Special>;

  // Gallery operations
  getAllGalleryImages(): Promise<GalleryImage[]>;
  createGalleryImage(image: InsertGalleryImage): Promise<GalleryImage>;

  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations - Required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }

  async updateProductStock(id: string, inStock: boolean): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ inStock, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  // Order operations
  async createOrder(orderData: InsertOrder, items: InsertOrderItem[]): Promise<Order & { items: OrderItem[] }> {
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const [order] = await db
      .insert(orders)
      .values({ ...orderData, orderNumber, canCancel: true }) // Add canCancel flag
      .returning();

    const orderItemsData = items.map(item => ({
      ...item,
      orderId: order.id,
    }));

    const createdItems = await db.insert(orderItems).values(orderItemsData).returning();

    return { ...order, items: createdItems };
  }

  async getOrderByNumber(orderNumber: string): Promise<(Order & { items: OrderItem[] }) | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));

    if (!order) return undefined;

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));

    return { ...order, items };
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    return order;
  }

  // Special operations
  async getAllSpecials(): Promise<Special[]> {
    return await db.select().from(specials).orderBy(desc(specials.createdAt));
  }

  async getActiveSpecials(): Promise<Special[]> {
    const now = new Date();
    return await db
      .select()
      .from(specials)
      .where(
        and(
          eq(specials.isActive, true)
        )
      )
      .orderBy(desc(specials.createdAt));
  }

  async createSpecial(specialData: InsertSpecial): Promise<Special> {
    const [special] = await db.insert(specials).values(specialData).returning();
    return special;
  }

  // Gallery operations
  async getAllGalleryImages(): Promise<GalleryImage[]> {
    return await db.select().from(galleryImages).orderBy(desc(galleryImages.createdAt));
  }

  async createGalleryImage(imageData: InsertGalleryImage): Promise<GalleryImage> {
    const [image] = await db.insert(galleryImages).values(imageData).returning();
    return image;
  }

  // Contact operations
  async createContactMessage(messageData: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(messageData).returning();
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
}

export const storage = new DatabaseStorage();