import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function testPassword() {
  try {
    console.log("🔍 Connecting to DB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ DB Connected");

    const db = mongoose.connection;
    const admin = await db.collection("users").findOne({
      email: "admin@gmail.com",
    });

    if (!admin) {
      console.log("❌ Admin user NOT found");
      process.exit(1);
    }

    console.log("\n🧪 Testing password comparison:");
    console.log("   Email:", admin.email);
    console.log("   Stored hash:", admin.password.substring(0, 20) + "...");

    // Test with correct password
    const test1 = await bcrypt.compare("123456", admin.password);
    console.log("\n   Test 1 - '123456':", test1 ? "✅ VALID" : "❌ INVALID");

    // Test with wrong password
    const test2 = await bcrypt.compare("wrongpassword", admin.password);
    console.log("   Test 2 - 'wrongpassword':", test2 ? "✅ VALID" : "❌ INVALID");

    // Test hash creation
    const newHash = await bcrypt.hash("123456", 10);
    const test3 = await bcrypt.compare("123456", newHash);
    console.log("\n   Test 3 - New hash comparison:", test3 ? "✅ VALID" : "❌ INVALID");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testPassword();
