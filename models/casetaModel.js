const sql = require("mssql");

const getCasetas = async () => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query("SELECT * FROM casetas");
    return result.recordset;
  } catch (err) {
    throw err;
  }
};

const getCasetaById = async (id) => {
  try {
    const pool = await sql.connect();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM casetas WHERE id_caseta = @id");
    return result.recordset[0];
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getCasetas,
  getCasetaById,
};
