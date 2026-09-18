import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        "Starters",
        "Main Course",
        "Pizza",
        "Burgers",
        "Desserts",
        "Beverages",
        "Salads",
      ],
    },
    image: { type: String, required: true },
    isVeg: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    spiceLevel: { type: String, enum: ["Mild", "Medium", "Hot", "None"], default: "None" },
    calories: { type: Number, default: 0 },
    prepTimeMinutes: { type: Number, default: 15 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    stock: { type: Number, default: 100 },
    isAvailable: { type: Boolean, default: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

menuItemSchema.index({ name: "text", description: "text", tags: "text" });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;
