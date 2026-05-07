import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function recreateAdmin() {
  try {
    console.log("🚀 Connecting DB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ DB Connected");

    const db = mongoose.connection;

    // Delete existing admin
    const deleteResult = await db.collection("users").deleteOne({
      email: "admin@gmail.com",
    });
    console.log("🗑️  Deleted existing admin:", deleteResult.deletedCount > 0 ? "Yes" : "No");

    // Create new admin with fresh hash
    const plainPassword = "123456";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    console.log("\n🔐 Creating new admin user:");
    console.log("   Password:", plainPassword);
    console.log("   Hash:", hashedPassword.substring(0, 30) + "...");

    await db.collection("users").insertOne({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Verify the hash works
    const admin = await db.collection("users").findOne({
      email: "admin@gmail.com",
    });

    const isValid = await bcrypt.compare(plainPassword, admin.password);
    console.log("\n✅ Admin created successfully");
    console.log("🔍 Password verification:", isValid ? "✅ WORKING" : "❌ FAILED");

    if (isValid) {
      console.log("\n🎉 You can now login with:");
      console.log("   Email: admin@gmail.com");
      console.log("   Password: 123456");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

recreateAdmin();
