const mongoose = require("mongoose");

const AssinaturaSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
    unique: true
  },
  plano_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plano",
    required: true
  },
  tipo_plano: {
    type: String,
    required: true
  },
  limite_perfis: {
    type: Number,
    default: 1
  },
  tipo_pagamento: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "inativo"
  },
  data_inicio: Date,
  data_vencimento: Date
}, { timestamps: true });

module.exports = mongoose.model("Assinatura", AssinaturaSchema);