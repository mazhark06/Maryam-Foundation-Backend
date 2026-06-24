import mongoose, { mongo } from "mongoose";
import { type } from "os";

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Every program needs a name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a short description for donors"],
    },
    image: {
      type: String,
      required: true,
    },
    goalAmount: {
      type: Number,
      required: true,
    },
    raisedAmount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    public_id:{
      type: String
    },
    // This allows you to link donations to this specific program later
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

const Program = mongoose.model("Program", programSchema);

export default Program;
