const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const upload = require("../config/multer");
const adminOnly = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  updateProfileImage,
} = require("../controllers/userController");




router.get("/me", protect, getMyProfile);

router.put("/me", protect, updateMyProfile);

router.put(
  "/me/image",
  protect,
  upload.single("profileImage"),
  updateProfileImage
);




router.get("/", protect, adminOnly, getAllUsers);
router.get("/:id", protect, adminOnly, getSingleUser);
router.put("/:id", protect, adminOnly, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;