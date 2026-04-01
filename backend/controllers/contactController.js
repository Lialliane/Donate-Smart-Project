
import ContactMessage from "../models/ContactMessage.js";

export const submitContact = async (req, res) => {
  try {
    const { firstname, lastname, email, phnumber, Message } = req.body;

    if (!firstname || !lastname || !email || !Message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const saved = await ContactMessage.create({
      firstname,
      lastname,
      email,
      phnumber,
      message: Message,
      userId: req.user?.id || null, 
    });


    return res.status(201).json({ success: true, data: saved });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
