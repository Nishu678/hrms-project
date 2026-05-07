import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seedAdmin() {
  try {
    console.log("🚀 Connecting DB...");

    await mongoose.connect(MONGODB_URI);

    console.log("✅ DB Connected");

    const db = mongoose.connection;

    const existing = await db.collection("users").findOne({
      email: "admin@gmail.com",
    });

    if (existing) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await db.collection("users").insertOne({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seedAdmin();
