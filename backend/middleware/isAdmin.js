import jwt from "jsonwebtoken";
import User from "../models/User.js"; // تأكد من المسار الصحيح

export const verifyAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json("Access Denied: Admins only");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).json("Invalid Token");
  }
};
