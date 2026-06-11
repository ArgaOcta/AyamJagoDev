const db = require('./database');

const initDb = async () => {
  try {
    // add username column if missing
    await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100) NULL UNIQUE");

    // add is_blocked column if missing
    await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_blocked TINYINT(1) NOT NULL DEFAULT 0");

    // ensure role enum contains superadmin
    await db.query("ALTER TABLE users MODIFY COLUMN role ENUM('admin','user','superadmin') DEFAULT 'user'");

    console.log('DB init: ensured users table has username, is_blocked, and superadmin role');
  } catch (error) {
    console.error('DB init error:', error.message);
  }
};

module.exports = initDb;
