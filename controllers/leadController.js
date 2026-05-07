const pool = require("../db/db");

const allowedStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

const createLead = async (req, res) => {
  try {
    const {
      lead_name,
      company_name,
      requirement,
      email,
      phone,
      lead_source,
      assigned_salesperson,
      status,
      estimated_deal_value,
    } = req.body;

    if (
      !lead_name ||
      !company_name ||
      !requirement ||
      !email ||
      !assigned_salesperson
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Lead name, company name, requirement, email, and assigned salesperson are required",
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const [existingLead] = await pool.query(
      `
      SELECT id 
      FROM leads 
      WHERE email = ? 
      AND company_name = ? 
      AND requirement = ? 
      LIMIT 1
      `,
      [email, company_name, requirement]
    );

    if (existingLead.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A lead with this email, company, and requirement already exists",
      });
    }

    const query = `
      INSERT INTO leads 
      (
        lead_name, 
        company_name, 
        requirement,
        email, 
        phone, 
        lead_source, 
        assigned_salesperson, 
        status, 
        estimated_deal_value
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      lead_name,
      company_name,
      requirement,
      email,
      phone || null,
      lead_source || "Other",
      assigned_salesperson,
      status || "New",
      estimated_deal_value !== undefined ? estimated_deal_value : 0,
    ];

    const [result] = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      leadId: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "A lead with this email, company, and requirement already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create lead",
      error: error.message,
    });
  }
};

const getAllLeads = async (req, res) => {
  try {
    const {
      status,
      lead_source,
      assigned_salesperson,
      search,
      requirement,
    } = req.query;

    let query = `
      SELECT *
      FROM leads
      WHERE 1 = 1
    `;

    const values = [];

    if (status) {
      query += ` AND status = ?`;
      values.push(status);
    }

    if (lead_source) {
      query += ` AND lead_source = ?`;
      values.push(lead_source);
    }

    if (assigned_salesperson) {
      query += ` AND assigned_salesperson = ?`;
      values.push(assigned_salesperson);
    }

    if (requirement) {
      query += ` AND requirement LIKE ?`;
      values.push(`%${requirement}%`);
    }

    if (search) {
      query += `
        AND (
          lead_name LIKE ?
          OR company_name LIKE ?
          OR email LIKE ?
          OR requirement LIKE ?
        )
      `;

      values.push(
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
      );
    }

    query += ` ORDER BY created_at DESC`;

    const [leads] = await pool.query(query, values);

    return res.status(200).json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get leads",
      error: error.message,
    });
  }
};

const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    const [leads] = await pool.query(
      "SELECT * FROM leads WHERE id = ? LIMIT 1",
      [id]
    );

    if (leads.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const [notes] = await pool.query(
      `
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
      `,
      [id]
    );

    return res.status(200).json({
      success: true,
      lead: leads[0],
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get lead details",
      error: error.message,
    });
  }
};

const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      lead_name,
      company_name,
      requirement,
      email,
      phone,
      lead_source,
      assigned_salesperson,
      status,
      estimated_deal_value,
    } = req.body;

    const [existingLead] = await pool.query(
      "SELECT * FROM leads WHERE id = ? LIMIT 1",
      [id]
    );

    if (existingLead.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const oldLead = existingLead[0];

    const updatedLead = {
      lead_name: lead_name !== undefined ? lead_name : oldLead.lead_name,

      company_name:
        company_name !== undefined ? company_name : oldLead.company_name,

      requirement:
        requirement !== undefined ? requirement : oldLead.requirement,

      email: email !== undefined ? email : oldLead.email,

      phone: phone !== undefined ? phone : oldLead.phone,

      lead_source:
        lead_source !== undefined ? lead_source : oldLead.lead_source,

      assigned_salesperson:
        assigned_salesperson !== undefined
          ? assigned_salesperson
          : oldLead.assigned_salesperson,

      status: status !== undefined ? status : oldLead.status,

      estimated_deal_value:
        estimated_deal_value !== undefined
          ? estimated_deal_value
          : oldLead.estimated_deal_value,
    };

    if (
      !updatedLead.lead_name ||
      !updatedLead.company_name ||
      !updatedLead.requirement ||
      !updatedLead.email ||
      !updatedLead.assigned_salesperson
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Lead name, company name, requirement, email, and assigned salesperson cannot be empty",
      });
    }

    const [duplicateLead] = await pool.query(
      `
      SELECT id 
      FROM leads 
      WHERE email = ? 
      AND company_name = ? 
      AND requirement = ? 
      AND id != ? 
      LIMIT 1
      `,
      [
        updatedLead.email,
        updatedLead.company_name,
        updatedLead.requirement,
        id,
      ]
    );

    if (duplicateLead.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Another lead already uses this email, company, and requirement",
      });
    }

    const query = `
      UPDATE leads
      SET 
        lead_name = ?,
        company_name = ?,
        requirement = ?,
        email = ?,
        phone = ?,
        lead_source = ?,
        assigned_salesperson = ?,
        status = ?,
        estimated_deal_value = ?
      WHERE id = ?
    `;

    const values = [
      updatedLead.lead_name,
      updatedLead.company_name,
      updatedLead.requirement,
      updatedLead.email,
      updatedLead.phone,
      updatedLead.lead_source,
      updatedLead.assigned_salesperson,
      updatedLead.status,
      updatedLead.estimated_deal_value,
      id,
    ];

    await pool.query(query, values);

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message:
          "Another lead already uses this email, company, and requirement",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update lead",
      error: error.message,
    });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const [result] = await pool.query(
      "UPDATE leads SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update lead status",
      error: error.message,
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM leads WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete lead",
      error: error.message,
    });
  }
};

module.exports = {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
};