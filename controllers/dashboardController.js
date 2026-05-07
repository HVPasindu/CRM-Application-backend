const pool = require("../db/db");

const getDashboardStats = async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT
        COUNT(*) AS total_leads,

        SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) AS new_leads,
        SUM(CASE WHEN status = 'Qualified' THEN 1 ELSE 0 END) AS qualified_leads,
        SUM(CASE WHEN status = 'Won' THEN 1 ELSE 0 END) AS won_leads,
        SUM(CASE WHEN status = 'Lost' THEN 1 ELSE 0 END) AS lost_leads,

        COALESCE(SUM(estimated_deal_value), 0) AS total_estimated_deal_value,

        COALESCE(SUM(
          CASE 
            WHEN status = 'Won' THEN estimated_deal_value 
            ELSE 0 
          END
        ), 0) AS total_won_deal_value
      FROM leads
    `);

    const [statusSummary] = await pool.query(`
      SELECT 
        status,
        COUNT(*) AS count
      FROM leads
      GROUP BY status
      ORDER BY count DESC
    `);

    const [sourceSummary] = await pool.query(`
      SELECT 
        lead_source,
        COUNT(*) AS count
      FROM leads
      GROUP BY lead_source
      ORDER BY count DESC
    `);

    const [salespersonSummary] = await pool.query(`
      SELECT 
        assigned_salesperson,
        COUNT(*) AS total_assigned,
        SUM(CASE WHEN status = 'Won' THEN 1 ELSE 0 END) AS won_count,
        COALESCE(SUM(
          CASE 
            WHEN status = 'Won' THEN estimated_deal_value 
            ELSE 0 
          END
        ), 0) AS won_value
      FROM leads
      GROUP BY assigned_salesperson
      ORDER BY total_assigned DESC
    `);

    return res.status(200).json({
      success: true,
      dashboard: stats[0],
      statusSummary,
      sourceSummary,
      salespersonSummary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get dashboard stats",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};