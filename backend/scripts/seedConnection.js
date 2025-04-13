import mongoose from "mongoose";
import Connection from "../models/Connection.js"; // Adjust path if needed

const run = async () => {
  try {
    // Replace with your actual MongoDB connection string
    await mongoose.connect("mongodb://localhost:27017/yourdbname", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Create a new WooCommerce connection with the missing keys
    await Connection.create({
      platform: "WooCommerce",
      isActive: true,
      siteUrl: "https://virtuxrealty.com",
      username: "smitha",
      appPassword: "Km6t RRwT N0BG CGug GYFo 3fKJ",  
      consumerKey: "ck_daeae10fecfe12df1ec9e6b3e664b58cfc494fed", 
      consumerSecret: "cs_9913e47f9e9c42f2ec6887c310b1a999eb31fbd9", 
    });

    console.log("✅ WooCommerce connection added");
    process.exit();
  } catch (error) {
    console.error("❌ Error adding WooCommerce connection:", error);
    process.exit(1); // Exit with error code if the operation fails
  }
};

run();


