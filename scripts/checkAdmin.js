import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function checkAdmin() {
  try {
    console.log("🔍 Connecting to DB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ DB Connected");

    const db = mongoose.connection;
    const admin = await db.collection("users").findOne({
      email: "admin@gmail.com",
    });

    if (admin) {
      console.log("✅ Admin user found:");
      console.log("   Email:", admin.email);
      console.log("   Role:", admin.role);
      console.log("   Verified:", admin.isVerified);
      console.log("   Password hash exists:", !!admin.password);
      console.log("   Password hash length:", admin.password?.length);
    } else {
      console.log("❌ Admin user NOT found in database");
      console.log(
        "💡 Run 'node scripts/seedAdmin.js' to create the admin user",
      );
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkAdmin();
