const db = require('../config/db');

class User {
  static async create(name, email, hashedPassword) {
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    return db.promise().query(sql, [name, email, hashedPassword]);
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [result] = await db.promise().query(sql, [email]);
    return result[0];
  }

  static async updatePassword(email, hashedPassword) {
    const sql = 'UPDATE users SET password = ? WHERE email = ?';
    return db.promise().query(sql, [hashedPassword, email]);
  }
}

module.exports = User;
