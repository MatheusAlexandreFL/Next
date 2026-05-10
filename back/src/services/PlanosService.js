const Plano = require("../models/Plano");

class PlanoService {
  async listarAtivos() {
    return Plano.find({ ativo: true }).sort({ ordem: 1, preco: 1 });
  }

  async listarTodos() {
    return Plano.find().sort({ ativo: -1, ordem: 1, preco: 1 });
  }

  async buscarPorId(id) {
    const plano = await Plano.findById(id);
    if (!plano) {
      throw new Error("Plano não encontrado.");
    }
    return plano;
  }

  async criar(dados) {
    const planoExistente = await Plano.findOne({ nome: dados.nome });
    if (planoExistente) {
      throw new Error("Já existe um plano com esse nome.");
    }

    return Plano.create(dados);
  }

  async atualizar(id, dados) {
    if (dados.nome) {
      const planoExistente = await Plano.findOne({
        nome: dados.nome,
        _id: { $ne: id }
      });

      if (planoExistente) {
        throw new Error("Já existe outro plano com esse nome.");
      }
    }

    const planoAtualizado = await Plano.findByIdAndUpdate(
      id,
      { $set: dados },
      { new: true }
    );

    if (!planoAtualizado) {
      throw new Error("Plano não encontrado.");
    }

    return planoAtualizado;
  }

  async remover(id) {
    const planoRemovido = await Plano.findByIdAndUpdate(
      id,
      { $set: { ativo: false } },
      { new: true }
    );

    if (!planoRemovido) {
      throw new Error("Plano não encontrado.");
    }

    return planoRemovido;
  }
}

module.exports = new PlanoService();
