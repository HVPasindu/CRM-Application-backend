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

const {
  addNote,
  getNotesByLead,
  deleteNote,
} = require("../controllers/noteController");


const router = express.Router();

router.use(protect);

router.post("/", createLead);
router.get("/", getAllLeads);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.put("/:id/status", updateLeadStatus);
router.delete("/:id", deleteLead);

router.post("/:leadId/notes", addNote);
router.get("/:leadId/notes", getNotesByLead);
router.delete("/notes/:noteId", deleteNote);



module.exports = router;