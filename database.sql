CREATE DATABASE IF NOT EXISTS crm_lead_management;
USE crm_lead_management;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'salesperson') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,

  lead_name VARCHAR(150) NOT NULL,
  company_name VARCHAR(150) NOT NULL,
  requirement VARCHAR(255) NOT NULL,

  email VARCHAR(150) NOT NULL,
  phone VARCHAR(30),

  lead_source ENUM(
    'Website',
    'LinkedIn',
    'Referral',
    'Cold Email',
    'Event',
    'Other'
  ) DEFAULT 'Other',

  assigned_salesperson VARCHAR(100) NOT NULL,

  status ENUM(
    'New',
    'Contacted',
    'Qualified',
    'Proposal Sent',
    'Won',
    'Lost'
  ) DEFAULT 'New',

  estimated_deal_value DECIMAL(12,2) DEFAULT 0.00,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY unique_lead_email_company_requirement (
    email,
    company_name,
    requirement
  )
);

CREATE TABLE IF NOT EXISTS lead_notes (
  id INT AUTO_INCREMENT PRIMARY KEY,

  lead_id INT NOT NULL,
  note_content TEXT NOT NULL,
  created_by INT NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);