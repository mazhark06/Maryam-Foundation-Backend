import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    receiptNo: {
      type: String,
    },
    donorName: {
      type: String,
      required: [true, "Name is required"]
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone Number is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required for Payment"],
    },
    transactionID: {
      type: String,
    },
    is_verified: {
        type : Boolean,
        default : false
    },
    program:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Program",
      required:true
    },
    email:{
        type:String,
        required:[true, "Email is required for sending receipt"]
    },
    receiptRequest: {
      type: String,
      enum: ["Not Requested", "Pending", "Delivered", "Failed"],
      default:"Not Requested"
    },
  },
  { timestamps: true },
);

 const Receipt = mongoose.model("Receipt" , receiptSchema)

 export default Receipt

