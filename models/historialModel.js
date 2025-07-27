const sql = require("mssql");

const getHistorialByEnvioId = async (id_envio) => {
  try {
    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("id_envio", sql.Int, id_envio)
      .query("SELECT * FROM historial WHERE id_envio = @id_envio");
    return result.recordset;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getHistorialByEnvioId,
};
