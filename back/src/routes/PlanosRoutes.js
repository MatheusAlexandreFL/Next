const express = require("express");
const routes = express.Router();
const PlanoController = require("../controller/PlanoController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

routes.get("/planos", PlanoController.listarAtivos);
routes.get("/planos/admin/todos", auth, adminAuth, PlanoController.listarTodos);
routes.get("/planos/:id", PlanoController.buscarPorId);

routes.post("/planos", auth, adminAuth, PlanoController.criar);
routes.patch("/planos/:id", auth, adminAuth, PlanoController.atualizar);
routes.delete("/planos/:id", auth, adminAuth, PlanoController.remover);

module.exports = routes;
