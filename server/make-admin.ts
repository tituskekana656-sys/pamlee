
import { storage } from "./storage.js";

async function makeAdmin() {
  const userId = "49147847"; // Your user ID from the logs
  
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      console.log("❌ User not found");
      process.exit(1);
    }
    
    console.log(`Found user: ${user.email}`);
    
    // Update user to be admin
    await storage.db
      .update(storage.schema.users)
      .set({ isAdmin: true })
      .where(storage.eq(storage.schema.users.id, userId));
    
    console.log(`✅ User ${user.email} is now an admin!`);
    console.log("Please refresh your browser to see the Admin link in the navbar.");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

makeAdmin();
import { storage } from "./storage.js";
import { eq } from "drizzle-orm";

async function makeAdmin() {
  const userId = "49147847"; // Your user ID from the logs
  
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      console.log("❌ User not found");
      process.exit(1);
    }
    
    console.log(`Found user: ${user.email}`);
    
    // Update user to be admin
    await storage.db
      .update(storage.schema.users)
      .set({ isAdmin: true })
      .where(eq(storage.schema.users.id, userId));
    
    console.log(`✅ User ${user.email} is now an admin!`);
    console.log("Please refresh your browser to see the Admin link in the navbar.");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

makeAdmin();
