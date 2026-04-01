
import Case from "../models/Case.js";
import User from "../models/User.js";

export const getPendingCases = async (req, res) => {
  try {
    const cases = await Case.find({ status: "pending" }).populate("createdBy", "name email");
    res.json(cases);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ✅ الموافقة على حالة
export const approveCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const updated = await Case.findByIdAndUpdate(caseId, { status: "approved" }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
// ✅ رفض حالة
export const rejectCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const updated = await Case.findByIdAndUpdate(
      caseId,
      { status: "rejected" },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
};


// ✅ حذف حالة
export const deleteCase = async (req, res) => {
  try {
    const caseId = req.params.id;    
    const existing = await Case.findById(caseId);
    if (!existing) return res.status(404).json("Case not found");

    await Case.findByIdAndDelete(caseId);
    res.json("Case deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
};


// ✅ عرض جميع المستخدمين
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ✅ عرض التحليلات
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCases = await Case.countDocuments();
    const totalDonations = await Case.aggregate([
      { $group: { _id: null, total: { $sum: "$donations" } } },
    ]);

    res.json({
      totalUsers,
      totalCases,
      totalDonations: totalDonations[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
