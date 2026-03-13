const User = require("../models/User");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");


exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getSingleUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getMyProfile = async (req, res) => {
  try {
    const { password, ...userData } = req.user.toObject();
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateMyProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.deleteMyProfile = async(req,res)=>{

//   const {email,password,profileImage}=req.body

//   const user = await User.findByIdAndDelete(
  
//   const  image = user.image.filter((user)=>user.id !==profileImage.id)

//     res.json(image)


//   )
// }




exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const inputPath = req.file.path;
    const outputFilename = `resized-${req.file.filename}`;
    const outputPath = path.join("uploads", outputFilename);

    // Resize to 150x150 for smaller profile picture
    await sharp(inputPath)
      .resize(150, 150) // smaller
      .toFile(outputPath);

    // Delete original
    fs.unlinkSync(inputPath);

    // Update DB
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: outputFilename },
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (error) {
    console.error("Profile image update error:", error);
    res.status(500).json({ message: error.message });
  }
};