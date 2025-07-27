const { sql, config } = require("../config/db");

const getAllEnvio = async () => {
  const pool = await sql.connect(config);
  const result = await pool.request().query("SELECT * FROM envios");
  return result.recordset;
};
const getEnvioById = async (id) => {
  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .input("id", sql.Int, id)
    .query("SELECT * FROM envios WHERE numero_guia = @id");
  return result.recordset[0];
};
module.exports = {
  getAllEnvio,
  getEnvioById,
};
