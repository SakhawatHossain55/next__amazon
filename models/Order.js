import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true, }, // unique: true
    slug: { type: String, required: true, unique: true }, // unique: true
    category: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Product;
