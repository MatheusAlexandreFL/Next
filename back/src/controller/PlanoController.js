const PlanoService = require("../services/PlanosService");

class PlanoController {
  async listarAtivos(req, res) {
    try {
      const planos = await PlanoService.listarAtivos();
      return res.json(planos);
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  async listarTodos(req, res) {
    try {
      const planos = await PlanoService.listarTodos();
      return res.json(planos);
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const plano = await PlanoService.buscarPorId(req.params.id);
      return res.json(plano);
    } catch (e) {
      return res.status(404).json({ erro: e.message });
    }
  }

  async criar(req, res) {
    try {
      const {
        nome,
        preco,
        qualidade_video,
        telas_simultaneas,
        limite_perfis
      } = req.body;

      if (!nome || preco == null || !qualidade_video || !telas_simultaneas || !limite_perfis) {
        return res.status(400).json({ erro: "Preencha os campos obrigatórios do plano." });
      }

      const novoPlano = await PlanoService.criar(req.body);
      return res.status(201).json(novoPlano);
    } catch (e) {
      return res.status(400).json({ erro: e.message });
    }
  }

  async atualizar(req, res) {
    try {
      const planoAtualizado = await PlanoService.atualizar(req.params.id, req.body);
      return res.json(planoAtualizado);
    } catch (e) {
      return res.status(400).json({ erro: e.message });
    }
  }

  async remover(req, res) {
    try {
      const planoRemovido = await PlanoService.remover(req.params.id);
      return res.json({
        message: "Plano desativado com sucesso.",
        plano: planoRemovido
      });
    } catch (e) {
      return res.status(400).json({ erro: e.message });
    }
  }
}

module.exports = new PlanoController();
