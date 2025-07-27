const { sql, config } = require("../config/db");

// Initialize a single connection pool
let poolPromise = null;

const getPool = async () => {
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
};

// Get all clients
const getAllClientes = async () => {
  try {
    const pool = await getPool();
    const result = await pool.request().query("SELECT * FROM clientes");
    return result.recordset;
  } catch (error) {
    throw new Error(`Error fetching clients: ${error.message}`);
  }
};

// Get client by ID
const getClienteById = async (id) => {
  try {
    if (!Number.isInteger(parseInt(id))) {
      throw new Error("Invalid client ID");
    }
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM clientes WHERE id_cliente = @id");
    return result.recordset[0] || null; // Return null if no client found
  } catch (error) {
    throw new Error(`Error fetching client by ID: ${error.message}`);
  }
};

// Create a new client
const createCliente = async (cliente) => {
  try {
    const { nombre, correo_electronico, telefono, empresa } = cliente;
    if (!nombre || !correo_electronico) {
      throw new Error("Nombre and correo_electronico are required");
    }
    const pool = await getPool();
    const result = await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("correo_electronico", sql.VarChar, correo_electronico)
      .input("telefono", sql.VarChar, telefono || null) // Allow null for optional fields
      .input("empresa", sql.VarChar, empresa || null).query(`
        INSERT INTO clientes (nombre, correo_electronico, telefono, empresa)
        VALUES (@nombre, @correo_electronico, @telefono, @empresa);
        SELECT SCOPE_IDENTITY() AS id_cliente;
      `);
    return { id_cliente: result.recordset[0]?.id_cliente, ...cliente }; // Return the created client
  } catch (error) {
    throw new Error(`Error creating client: ${error.message}`);
  }
};

// Update a client
const updateCliente = async (id, cliente) => {
  try {
    const { nombre, correo_electronico, telefono, empresa } = cliente;
    if (!Number.isInteger(parseInt(id))) {
      throw new Error("Invalid client ID");
    }
    if (!nombre || !correo_electronico) {
      throw new Error("Nombre and correo_electronico are required");
    }
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .input("nombre", sql.VarChar, nombre)
      .input("correo_electronico", sql.VarChar, correo_electronico)
      .input("telefono", sql.VarChar, telefono || null)
      .input("empresa", sql.VarChar, empresa || null).query(`
        UPDATE clientes 
        SET nombre = @nombre, 
            correo_electronico = @correo_electronico, 
            telefono = @telefono, 
            empresa = @empresa 
        WHERE id_cliente = @id
      `);
    return result.rowsAffected[0] > 0 ? { id_cliente: id, ...cliente } : null; // Return updated client or null if not found
  } catch (error) {
    throw new Error(`Error updating client: ${error.message}`);
  }
};

// Delete a client
const deleteCliente = async (id) => {
  try {
    if (!Number.isInteger(parseInt(id))) {
      throw new Error("Invalid client ID");
    }
    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM clientes WHERE id_cliente = @id");
    return result.rowsAffected[0] > 0; // Return true if deleted, false if not found
  } catch (error) {
    throw new Error(`Error deleting client: ${error.message}`);
  }
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
};
