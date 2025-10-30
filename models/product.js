const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  categoryId: { type: String, ref: "Category" }, //
  image: { type: String },
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Product", productSchema);
