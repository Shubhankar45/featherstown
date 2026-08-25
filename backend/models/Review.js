import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  comment: String,
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);