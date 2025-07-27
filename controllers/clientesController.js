const clienteModel = require("../models/clienteModel");

const getClientes = async (req, res) => {
  try {
    const clientes = await clienteModel.getAllClientes();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCliente = async (req, res) => {
  try {
    const cliente = await clienteModel.getClienteById(req.params.id);
    if (!cliente)
      return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCliente = async (req, res) => {
  try {
    await clienteModel.createCliente(req.body);
    res.status(201).json({ message: "Cliente creado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCliente = async (req, res) => {
  try {
    await clienteModel.updateCliente(req.params.id, req.body);
    res.json({ message: "Cliente actualizado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCliente = async (req, res) => {
  try {
    await clienteModel.deleteCliente(req.params.id);
    res.json({ message: "Cliente eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getClientes,
  getCliente,
  createCliente,
  updateCliente,
  deleteCliente,
};
