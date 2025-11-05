// Following javascript_log_in_with_replit and javascript_database blueprints
import {
  users,
  products,
  orders,
  orderItems,
  specials,
  galleryImages,
  contactMessages,
  staff,
  inventory,
  bakerySettings,
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
  type Staff,
  type InsertStaff,
  type Inventory,
  type InsertInventory,
  type BakerySettings,
  type InsertBakerySettings,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

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
  updateProduct(id: string, data: Partial<typeof products.$inferInsert>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;

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

  // Staff operations
  getAllStaff(): Promise<Staff[]>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: string, data: Partial<typeof staff.$inferInsert>): Promise<Staff>;
  deleteStaff(id: string): Promise<void>;

  // Inventory operations
  getAllInventory(): Promise<Inventory[]>;
  createInventory(inventory: InsertInventory): Promise<Inventory>;
  updateInventory(id: string, data: Partial<typeof inventory.$inferInsert>): Promise<Inventory>;
  deleteInventory(id: string): Promise<void>;
  getLowStockItems(): Promise<Inventory[]>;

  // Settings operations
  getSettings(): Promise<BakerySettings | undefined>;
  updateSettings(data: Partial<typeof bakerySettings.$inferInsert>): Promise<BakerySettings>;

  // Customer operations
  getAllCustomers(): Promise<User[]>;
  getCustomerOrders(userId: string): Promise<Order[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations - Required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = await this.getUser(userData.id!);
    
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          isAdmin: existingUser?.isAdmin ?? false,
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

  async updateProduct(id: string, data: Partial<typeof products.$inferInsert>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
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

  // Staff operations
  async getAllStaff(): Promise<Staff[]> {
    return await db.select().from(staff).orderBy(desc(staff.createdAt));
  }

  async createStaff(staffData: InsertStaff): Promise<Staff> {
    const [newStaff] = await db.insert(staff).values(staffData).returning();
    return newStaff;
  }

  async updateStaff(id: string, data: Partial<typeof staff.$inferInsert>): Promise<Staff> {
    const [updatedStaff] = await db
      .update(staff)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(staff.id, id))
      .returning();
    return updatedStaff;
  }

  async deleteStaff(id: string): Promise<void> {
    await db.delete(staff).where(eq(staff.id, id));
  }

  // Inventory operations
  async getAllInventory(): Promise<Inventory[]> {
    return await db.select().from(inventory).orderBy(desc(inventory.createdAt));
  }

  async createInventory(inventoryData: InsertInventory): Promise<Inventory> {
    const [newInventory] = await db.insert(inventory).values(inventoryData).returning();
    return newInventory;
  }

  async updateInventory(id: string, data: Partial<typeof inventory.$inferInsert>): Promise<Inventory> {
    const [updatedInventory] = await db
      .update(inventory)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(inventory.id, id))
      .returning();
    return updatedInventory;
  }

  async deleteInventory(id: string): Promise<void> {
    await db.delete(inventory).where(eq(inventory.id, id));
  }

  async getLowStockItems(): Promise<Inventory[]> {
    return await db
      .select()
      .from(inventory)
      .where(sql`${inventory.quantity} <= ${inventory.lowStockThreshold}`)
      .orderBy(desc(inventory.createdAt));
  }

  // Settings operations
  async getSettings(): Promise<BakerySettings | undefined> {
    const [settings] = await db.select().from(bakerySettings).limit(1);
    return settings;
  }

  async updateSettings(data: Partial<typeof bakerySettings.$inferInsert>): Promise<BakerySettings> {
    const existingSettings = await this.getSettings();
    
    if (existingSettings) {
      const [updated] = await db
        .update(bakerySettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(bakerySettings.id, existingSettings.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(bakerySettings)
        .values({ ...data, name: data.name || "Pam Lee's Kitchen" })
        .returning();
      return created;
    }
  }

  // Customer operations
  async getAllCustomers(): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.isAdmin, false))
      .orderBy(desc(users.createdAt));
  }

  async getCustomerOrders(userId: string): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }
}

export const storage = new DatabaseStorage();