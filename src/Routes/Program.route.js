import express from "express";
import upload from "../config/multer.js";
import {
    addProgram,
    getPrograms,
    getProgramById,
    updateProgram,
    deleteProgram,
} from "../Controllers/Program.controller.js";

const router = express.Router();

// Create program with image upload
router.post("/add", upload.any(), addProgram);

// Get all active programs
router.get("/", getPrograms);

// Get program by ID
router.get("/:slug", getProgramById);

// Update program with optional image upload
router.put("/:id", upload.any(), updateProgram);

// Delete program
router.delete("/:id", deleteProgram);

export default router;
