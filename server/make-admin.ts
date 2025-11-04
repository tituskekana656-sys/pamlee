
import { storage } from "./storage";

async function makeAdmin() {
  // INSTRUCTIONS:
  // 1. Login to your app first
  // 2. Check the server logs for "X-Replit-User-Id" header value
  // 3. Replace "YOUR_USER_ID_HERE" with your actual user ID
  // 4. Run this script: npx tsx server/make-admin.ts
  
  const userId = "49124288"; // Your user ID from the logs
  
  try {
    if (userId === "YOUR_USER_ID_HERE") {
      console.log("⚠️  Please update the userId variable with your actual user ID");
      console.log("Login to your app first, then check the server logs for your user ID");
      process.exit(1);
    }
    
    const user = await storage.getUser(userId);
    if (!user) {
      console.log("❌ User not found");
      console.log("Available users:");
      const allUsers = await storage.db.select().from(storage.schema.users);
      console.table(allUsers.map(u => ({ id: u.id, email: u.email, isAdmin: u.isAdmin })));
      return;
    }
    
    // Update user to be admin
    await storage.db
      .update(storage.schema.users)
      .set({ isAdmin: true })
      .where(storage.eq(storage.schema.users.id, userId));
    
    console.log(`✅ User ${user.email} is now an admin!`);
  } catch (error) {
    console.error("❌ Error:", error);
  }
  
  process.exit(0);
}

makeAdmin();
