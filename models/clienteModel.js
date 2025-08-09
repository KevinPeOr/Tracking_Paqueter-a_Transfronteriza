const { sql, config } = require('../db');

async function getAllClientes() {
  const pool = await sql.connect(config);
  const result = await pool.request().query('SELECT * FROM clientes');
  return result.recordset;
}

module.exports = {
  getAllClientes,
  // Otros métodos...
};
