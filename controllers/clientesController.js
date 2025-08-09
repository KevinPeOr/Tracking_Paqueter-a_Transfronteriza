const clienteModel = require('../models/clienteModel');

const getClientes = async (req, res) => {
  try {
    const clientes = await clienteModel.getAllClientes();
    res.render('clientes', { title: 'Clientes', clientes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener clientes');
  }
};

module.exports = {
  getClientes,
  // Otros métodos...
};
