const mongoose = require("mongoose");
const User = require("../models/User");

require("dotenv").config();

async function fixAdminFirstLogin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Update all admin users to have isFirstLogin: false
    const result = await User.updateMany(
      { role: "admin" },
      { $set: { isFirstLogin: false, mustChangePassword: false } }
    );

    console.log(`✅ Updated ${result.modifiedCount} admin user(s)`);

    // Verify the changes
    const admins = await User.find({ role: "admin" });
    console.log("\n📊 Current admin users:");
    admins.forEach((admin) => {
      console.log(`- ${admin.email}: isFirstLogin=${admin.isFirstLogin}, mustChangePassword=${admin.mustChangePassword}`);
    });

    await mongoose.disconnect();
    console.log("\n✅ Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixAdminFirstLogin();
