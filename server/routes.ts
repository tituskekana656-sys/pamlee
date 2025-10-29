// Following javascript_log_in_with_replit blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertProductSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertSpecialSchema,
  insertGalleryImageSchema,
  insertContactMessageSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error: any) {
      console.error("Error creating product:", error);
      res.status(400).json({ message: error.message || "Failed to create product" });
    }
  });

  // Order routes
  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const { items, ...orderData } = req.body;
      
      if (!items || items.length === 0) {
        return res.status(400).json({ message: "Order must contain at least one item" });
      }

      const validatedOrder = insertOrderSchema.parse(orderData);
      const validatedItems = items.map((item: any) => insertOrderItemSchema.parse(item));

      const order = await storage.createOrder(validatedOrder, validatedItems);
      res.status(201).json(order);
    } catch (error: any) {
      console.error("Error creating order:", error);
      res.status(400).json({ message: error.message || "Failed to create order" });
    }
  });

  app.get("/api/orders/track/:orderNumber", async (req, res) => {
    try {
      const order = await storage.getOrderByNumber(req.params.orderNumber);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders/:id/cancel", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if order can be cancelled (within 24 hours and status is pending)
      const orderAge = Date.now() - new Date(order.createdAt).getTime();
      const hoursOld = orderAge / (1000 * 60 * 60);

      if (hoursOld > 24) {
        return res.status(400).json({ message: "Orders can only be cancelled within 24 hours of placement" });
      }

      if (order.status !== "pending") {
        return res.status(400).json({ message: "Only pending orders can be cancelled" });
      }

      const cancelledOrder = await storage.updateOrderStatus(req.params.id, "cancelled");
      res.json(cancelledOrder);
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      res.status(400).json({ message: error.message || "Failed to cancel order" });
    }
  });

  // Admin order routes
  app.get("/api/admin/orders", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch("/api/admin/orders/:id/status", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      res.json(order);
    } catch (error: any) {
      console.error("Error updating order status:", error);
      res.status(400).json({ message: error.message || "Failed to update order status" });
    }
  });

  // Admin product routes
  app.patch("/api/admin/products/:id/stock", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const updatedProduct = await storage.updateProductStock(req.params.id, !product.inStock);
      res.json(updatedProduct);
    } catch (error: any) {
      console.error("Error updating product stock:", error);
      res.status(400).json({ message: error.message || "Failed to update product stock" });
    }
  });

  // Specials routes
  app.get("/api/specials", async (req, res) => {
    try {
      const specials = await storage.getAllSpecials();
      res.json(specials);
    } catch (error) {
      console.error("Error fetching specials:", error);
      res.status(500).json({ message: "Failed to fetch specials" });
    }
  });

  app.post("/api/specials", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const validatedData = insertSpecialSchema.parse(req.body);
      const special = await storage.createSpecial(validatedData);
      res.status(201).json(special);
    } catch (error: any) {
      console.error("Error creating special:", error);
      res.status(400).json({ message: error.message || "Failed to create special" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const images = await storage.getAllGalleryImages();
      res.json(images);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      res.status(500).json({ message: "Failed to fetch gallery images" });
    }
  });

  app.post("/api/gallery", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const validatedData = insertGalleryImageSchema.parse(req.body);
      const image = await storage.createGalleryImage(validatedData);
      res.status(201).json(image);
    } catch (error: any) {
      console.error("Error creating gallery image:", error);
      res.status(400).json({ message: error.message || "Failed to create gallery image" });
    }
  });

  // Contact routes
  app.post("/api/contact", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json(message);
    } catch (error: any) {
      console.error("Error creating contact message:", error);
      res.status(400).json({ message: error.message || "Failed to send message" });
    }
  });

  app.get("/api/admin/contact", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
