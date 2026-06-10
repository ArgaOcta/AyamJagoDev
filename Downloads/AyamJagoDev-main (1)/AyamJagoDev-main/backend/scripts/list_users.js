const db = require('../src/config/database');

(async () => {
  try {
    const [rows] = await db.query('SELECT id, full_name, email, role, IFNULL(is_blocked,0) as is_blocked FROM users');
    console.log(rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
