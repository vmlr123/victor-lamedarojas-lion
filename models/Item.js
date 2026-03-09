const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required."],
      minlength: [3, "Item name must be at least 3 characters long."],
      maxlength: [50, "Item name must be at least 30 characters long."],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [100, "Description cannot exceed 100 characters."],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      max: [1000, "Quantity cannot exceed 1000"],
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      enum: ["clothing", "electronics", "furniture", "toys", "books", "other"],
      default: "other",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user."],
      immutable: true,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Item", ItemSchema);
