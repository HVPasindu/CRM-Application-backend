const bcrypt = require("bcryptjs");
const pool = require("./db/db");

const seedAdmin = async () => {
  try {
    const email = "admin@gmail.com";
    const plainPassword = "admin123";

    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      console.log("Admin user already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Admin User", email, hashedPassword, "admin"]
    );

    // console.log("Admin user created successfully");
    // console.log("Email: admin@example.com");
    // console.log("Password: password123");

    process.exit();
  } catch (error) {
    console.error("Seed admin error:", error);
    process.exit(1);
  }
};

seedAdmin();