import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import Receipt from "../models/reciept.model.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import Program from "../models/programs.model.js";
import { sendDonationReceiptEmail } from "../utils/pdfMaker.js";

const addReceipt = asyncHandler(async (req, res) => {
    
    let { amount, donorName, phoneNumber, emailId, program } = req.body;
    let receiptCount = await Receipt.countDocuments();

    const receiptNumber = `REC-${String(receiptCount + 1).padStart(4, 0)}`

    if (!program) {
        let generalFund = await Program.findOne({ title: "General Fund" })
        program = generalFund._id;
    }
    
    let updatedProgram = await Program.findById(program);
    updatedProgram.raisedAmount += Number(amount)
    
    updatedProgram.save();
    
    const newDonation = await Receipt.create({
        amount,
        donorName,
        phoneNumber,
        email: emailId,
        receiptNo: receiptNumber,
        receiptRequest: "Not Requested",
        program:program
    })

    if (!newDonation) return res.status(400).json(new ApiError(400, "Donation regisetration failed"));


    res.status(201).json(new Apiresponse(201, "Donation Successfulll", newDonation))

})

const updateReceipt = asyncHandler(async (req,res) => {

    let {transactionId, donationId} = req.body ;

    let isReceiptExist = await Receipt.findById(donationId);

    if(!isReceiptExist) return res.status(404).json(new Apiresponse(404, "Receipt not found"));

    isReceiptExist.transactionID = transactionId;
    isReceiptExist.is_verified = true;
    isReceiptExist.receiptRequest = "Pending"
    isReceiptExist.save();

    res.status(200)
    .json(new Apiresponse(201, "Transaction ID is updated", isReceiptExist))

})

const sendReceipt = asyncHandler(async (req,res) => {
    
    let {receiptId} = req.body;
    let receipt = await Receipt.findById(receiptId);
    let program = await Program.findById(receipt.program)
    receipt.programTitle = program.title
   let response = await sendDonationReceiptEmail(receipt)

   console.log(response)
   if(!response) return res.status(500).json(new ApiError(500, "Pdf Not Sent"))
    receipt.receiptRequest = "Delivered"
   receipt.save()

   res.status(200).json(new Apiresponse(200, "Pdf Sent Successfully", receipt))


})


export {
    addReceipt,
    updateReceipt,
    sendReceipt
}