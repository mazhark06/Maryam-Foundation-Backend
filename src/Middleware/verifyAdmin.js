import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

const adminVerification = (req, res, next) => {
  const _id = req.cookies?._id;
  if (!_id) {
    return res.status(401).json(new ApiError(401,"Not Authorized"));
  }
  next();
};

export {
    adminVerification
}