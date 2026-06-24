import asyncHandler from "../utils/asyncHandler.js";
import Program from "../models/programs.model.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import { uploader } from "../config/cloudinary.js";
import { v2 as cloud } from "cloudinary";
import fs from "fs/promises";
import path from "path";
import upload from "../config/multer.js";

const addProgram = asyncHandler(async (req, res) => {
  let { title, description, goalAmount, raisedAmount, isActive } = req.body;

  // Validate required fields
  if (!title || !description || !goalAmount) {
    return res
      .status(400)
      .json(
        new ApiError(400, "Title, description, and goalAmount are required"),
      );
  }

  // Check if image is uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json(new ApiError(400, "Program image is required"));
  }
  const file = req.files[0];

  try {
    const uploadResponse = await uploader(file.path);

    try {
      await fs.unlink(file.path);
    } catch (err) {
      console.log("Warning: Could not delete file", file.path);
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]/g, "");

    // Create program with image URL from Cloudinary
    const newProgram = await Program.create({
      title,
      description,
      goalAmount,
      raisedAmount: raisedAmount || 0,
      isActive: isActive !== undefined ? isActive : true,
      image: uploadResponse.secure_url,
      slug,
      public_id: uploadResponse.public_id,
    });

    res
      .status(201)
      .json(new Apiresponse(201, "Program created successfully", newProgram));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, `Image upload failed: ${error.message}`));
  }
});

const getPrograms = asyncHandler(async (req, res) => {
  const programs = await Program.find({ isActive: true });

  if (!programs || programs.length === 0) {
    return res.status(404).json(new ApiError(404, "No programs found"));
  }

  res
    .status(200)
    .json(new Apiresponse(200, "Programs retrieved successfully", programs));
});

  const getProgramById = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const program = await Program.findOne({ slug });

  if (!program) {
    return res.status(404).json(new ApiError(404, "Program not found"));
  }

  res
    .status(200)
    .json(new Apiresponse(200, "Program retrieved successfully", program));
});

const updateProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, goalAmount, raisedAmount, isActive } = req.body;

  const program = await Program.findById(id);

  if (!program) {
    return res.status(404).json(new ApiError(404, "Program not found"));
  }

  let imageUrl = program.image;

  // If new image is uploaded, upload to Cloudinary
  if (req.files && req.files.length > 0) {
    const file = req.files[0];

    try {
      let uploadResponse = await uploader(file.path);
      // Delete the local file after successful upload
      try {
        await fs.unlink(file.path);
      } catch (err) {
        console.log("Warning: Could not delete file", file.path);
      }
      imageUrl = uploadResponse.secure_url;
    } catch (error) {
      return res
        .status(500)
        .json(new ApiError(500, `Image upload failed: ${error.message}`));
    }
  }

  // Update program
  const updatedProgram = await Program.findByIdAndUpdate(
    id,
    {
      title: title || program.title,
      description: description || program.description,
      goalAmount: goalAmount || program.goalAmount,
      raisedAmount:
        raisedAmount !== undefined ? raisedAmount : program.raisedAmount,
      isActive: isActive !== undefined ? isActive : program.isActive,
      image: imageUrl,
    },
    { returnDocument: "after" },
  );

  res
    .status(200)
    .json(new Apiresponse(200, "Program updated successfully", updatedProgram));
});

  const deleteProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const program = await Program.findByIdAndDelete(id);

  if (!program) {
    return res.status(404).json(new ApiError(404, "Program not found"));
  }

  res
    .status(200)
    .json(new Apiresponse(200, "Program deleted successfully", program));
});

export {
  addProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram,
};
