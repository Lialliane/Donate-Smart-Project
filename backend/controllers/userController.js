
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.status(201).json("User registered");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("Invalid credentials");
    }

    // ✅ Check if user is disabled
    if (user.isDisabled) {
      return res.status(403).json("Account disabled. Contact admin.");
    }

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid credentials");
    }

    // ✅ Generate token if everything is fine
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
     
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
}


export const updateUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json("User not found");
    }

    res.json({
      message: "User updated successfully",
      user: updated,
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
};


export const disableUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDisabled: req.body.disabled },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User status updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User deleted", id });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
