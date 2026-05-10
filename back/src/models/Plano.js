const mongoose = require('mongoose');

const PlanoSchema = new mongoose.Schema({
  nome: {type: String, required: true, unique: true, trim: true},
  preco: {type: Number, required: true},
  qualidade_video: {type: String, required: true, trim: true},
  permite_download: {type: Boolean, default: false},
  telas_simultaneas: {type: Number, required: true, min: 1},
  tem_anuncios: {type: Boolean, default: false},
  conteudo_exclusivo: {type: Boolean, default: false},
  limite_perfis: {type: Number, required: true, min: 1},
  ativo: {type: Boolean, default: true},
  ordem: {type: Number, default: 0}//para controlar a ordem de exibição dos planos, se necessário
},
{timestamps: true}// serve para criar automaticamente os campos createdAt e updatedAt, facilitando o controle de quando cada plano foi criado ou atualizado
);

module.exports = mongoose.model('Plano', PlanoSchema);