
import { storage } from "./storage";

async function makeAdmin() {
  const userId = "49147847"; // Your user ID from the logs
  
  try {
    const user = await storage.getUser(userId);
    if (!user) {
      console.log("User not found");
      return;
    }
    
    // Update user to be admin
    await storage.db
      .update(storage.schema.users)
      .set({ isAdmin: true })
      .where(storage.eq(storage.schema.users.id, userId));
    
    console.log(`✅ User ${user.email} is now an admin!`);
  } catch (error) {
    console.error("Error:", error);
  }
  
  process.exit(0);
}

makeAdmin();
