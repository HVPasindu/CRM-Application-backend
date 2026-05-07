const pool = require("../db/db");

const addNote = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { note_content } = req.body;
    const userId = req.user.id;

    if (!note_content) {
      return res.status(400).json({
        success: false,
        message: "Note content is required",
      });
    }

    const [leads] = await pool.query(
      "SELECT id FROM leads WHERE id = ? LIMIT 1",
      [leadId]
    );

    if (leads.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const query = `
      INSERT INTO lead_notes 
      (lead_id, note_content, created_by)
      VALUES (?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      leadId,
      note_content,
      userId,
    ]);

    return res.status(201).json({
      success: true,
      message: "Note added successfully",
      noteId: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add note",
      error: error.message,
    });
  }
};

const getNotesByLead = async (req, res) => {
  try {
    const { leadId } = req.params;

    const [leads] = await pool.query(
      "SELECT id FROM leads WHERE id = ? LIMIT 1",
      [leadId]
    );

    if (leads.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const query = `
      SELECT 
        lead_notes.id,
        lead_notes.note_content,
        lead_notes.created_at,
        users.name AS created_by_name,
        users.email AS created_by_email
      FROM lead_notes
      JOIN users ON lead_notes.created_by = users.id
      WHERE lead_notes.lead_id = ?
      ORDER BY lead_notes.created_at DESC
    `;

    const [notes] = await pool.query(query, [leadId]);

    return res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get notes",
      error: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const [result] = await pool.query(
      "DELETE FROM lead_notes WHERE id = ?",
      [noteId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete note",
      error: error.message,
    });
  }
};

module.exports = {
  addNote,
  getNotesByLead,
  deleteNote,
};