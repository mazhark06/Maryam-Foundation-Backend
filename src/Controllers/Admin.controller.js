import Admin from "../models/admin.model.js";
import ApiError from "../utils/ApiError.js";
import Apiresponse from "../utils/Apiresponse.js";
import asyncHandler from "../utils/asyncHandler.js";

let isProduction = process.env.NODE_ENV || "production";

const adminVerification = asyncHandler(async (req, res) => {
  let { username, password } = req.body;

  let isUsernameExist = await Admin.findOne({ username });

  if (!isUsernameExist)
    return res
      .status(401)
      .json(new ApiError(401, "Username or Password is invalid"));
  if (isUsernameExist.password !== password)
    return res
      .status(401)
      .json(new ApiError(401, "Username or Password is invalid"));

  let mailOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res
    .status(200)
    .cookie("_id", isUsernameExist._id, mailOptions)
    .json(new Apiresponse(200, "Verification Successfull", isUsernameExist));
});

const createAdmin = asyncHandler(async (req, res) => {
  let { username, password } = req.params;

  const adminCredentials = await Admin.create({ username, password });

  res.status(201).json(new Apiresponse(201, "Admin Credentials Created"));
});

export { adminVerification, createAdmin };
