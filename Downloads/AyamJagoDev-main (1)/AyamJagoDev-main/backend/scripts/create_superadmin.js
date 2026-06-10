const db = require('../src/config/database');
const bcrypt = require('bcrypt');

(async () => {
  try {
    const email = 'superadmin@ayamjago.dev';
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      console.log('Superadmin already exists');
      process.exit(0);
    }

    const hashed = await bcrypt.hash('SuperSecret123', 10);
    const [res] = await db.query('INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)', ['Super Admin', email, hashed, 'superadmin']);
    console.log('Inserted superadmin id', res.insertId);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
