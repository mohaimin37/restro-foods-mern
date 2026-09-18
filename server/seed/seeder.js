import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import MenuItem from "../models/MenuItem.js";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import Reservation from "../models/Reservation.js";
import menuItems from "./data/menuItems.js";

dotenv.config();
await connectDB();

const importData = async () => {
  try {
    await Review.deleteMany();
    await Order.deleteMany();
    await Reservation.deleteMany();
    await MenuItem.deleteMany();
    await User.deleteMany();

    await User.create({
      name: "Admin",
      email: "admin@restrofoods.com",
      password: "admin123",
      role: "admin",
    });

    await User.create({
      name: "Demo Customer",
      email: "customer@restrofoods.com",
      password: "customer123",
      role: "user",
    });

    await MenuItem.insertMany(menuItems);

    console.log("Data imported successfully!");
    console.log("Admin login   -> admin@restrofoods.com / admin123");
    console.log("Customer login -> customer@restrofoods.com / customer123");
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Review.deleteMany();
    await Order.deleteMany();
    await Reservation.deleteMany();
    await MenuItem.deleteMany();
    await User.deleteMany();
    console.log("Data destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
