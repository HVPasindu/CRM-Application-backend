const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
} = require("../controllers/leadController");


const router = express.Router();

router.use(protect);

router.post("/", createLead);
router.get("/", getAllLeads);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.patch("/:id/status", updateLeadStatus);
router.delete("/:id", deleteLead);



module.exports = router;