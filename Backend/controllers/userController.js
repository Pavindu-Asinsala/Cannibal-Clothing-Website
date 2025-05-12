const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { checkAuth, checkAdmin } = require("../middleware/authMiddleware");

// Add User Controller
// Modified to allow Managers and Admins to add users and handle the profile image
exports.addUser = async (req, res) => {
  try {
    const { name, email, role, username, password, profileImage } = req.body;

    console.log("Received payload:", req.body);

    if (!/^https?:\/\/.+\.(jpg|jpeg|png|gif|bmp)$/i.test(profileImage)) {
      return res
        .status(400)
        .json({ message: "Invalid profile image URL format." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const userData = {
      name,
      email,
      role,
      username,
      profileImage,
    };

    if (password) {
      console.log("Hashing password...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      userData.password = hashedPassword;
    } else {
      console.log("No password provided for role:", role);
    }

    console.log("Saving user...");
    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json({ message: "User added successfully!" });
  } catch (error) {
    console.error("ADD USER ERROR:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};



// View Users - Only Admin can view all users
exports.viewUsers = async (req, res) => {

  try {
    // Only admins can view all users
    // if (req.user.role !== "Admin") {
    //   return res.status(403).json({ message: "Access denied." });
    // }

    const users = await User.find(); // Fetch all users from the database
    res.status(200).json(users); // Return the list of users
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// View User Profile - Returns a specific user's profile, authenticated by token
exports.viewProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Get the user from the token ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); // Return user profile
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit User Controller
exports.editUser = async (req, res) => {
  const { userId } = req.params;
  const { name, email, role, username, password, profileImage } = req.body;

  try {
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if password is being updated and hash it if needed
    if (password && password !== userToUpdate.password) {
      const salt = await bcrypt.genSalt(10);
      userToUpdate.password = await bcrypt.hash(password, salt);
    }

    userToUpdate.name = name || userToUpdate.name;
    userToUpdate.email = email || userToUpdate.email;
    userToUpdate.role = role || userToUpdate.role;
    userToUpdate.username = username || userToUpdate.username;
    userToUpdate.profileImage = profileImage || userToUpdate.profileImage; // Update profile image if provided

    const updatedUser = await userToUpdate.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete User Controller
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToDelete.role === "Admin") {
      return res.status(403).json({ message: "Cannot delete an admin" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// User Login Controller
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ email: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user.password);

    // const isPasswordMatch = await bcrypt.compare(password, user.password);
    // if (!isPasswordMatch) {
    //   return res.status(401).json({ message: "Invalid credentials" });
    // }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
if (!isPasswordMatch) {
  return res.status(401).json({ message: "Invalid credentials" });
}

    // Create and sign JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Profile Update Route (Optional)
exports.updateProfile = async (req, res) => {
  const { name, email, username, password, currentPassword, profileImage } =
    req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If password is being updated, verify current password and hash new one
    if (password) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profileImage = profileImage || user.profileImage; // Update profile image if provided

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
