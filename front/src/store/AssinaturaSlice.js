import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import { cadastrarUsuario, loginUsuario, logout } from "./userSlice";

const criarAssinaturaPadrao = () => ({
  plano_id: null,
  tipo_plano: null,
  limite_perfis: 1,
  tipo_pagamento: null,
  status: "inativo"
});

const usuarioSalvo = sessionStorage.getItem("user");
const parsedUser = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

export const atualizarPlano = createAsyncThunk(
  "assinatura/atualizarPlano",
  async ({ plano_id, tipo_pagamento }, { rejectWithValue }) => {
    try {
      const response = await api.patch("/usuarios/assinatura", { plano_id, tipo_pagamento });
      return response.data.user.assinatura;
    } catch (err) {
      return rejectWithValue(err.response?.data?.erro || "Erro ao atualizar assinatura");
    }
  }
);

const assinaturaSlice = createSlice({
  name: "assinatura",
  initialState: {
    assinaturaAtiva: parsedUser?.assinatura || criarAssinaturaPadrao(),
    assinaturaEmSelecao: criarAssinaturaPadrao(),
    statusRequest: "idle",
    error: null
  },
  reducers: {
    selecionarPlano: (state, action) => {
      state.assinaturaEmSelecao = {
        ...state.assinaturaEmSelecao,
        plano_id: action.payload.plano_id,
        tipo_plano: action.payload.tipo_plano,
        limite_perfis: action.payload.limite_perfis
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(cadastrarUsuario.fulfilled, (state, action) => {
        state.assinaturaAtiva = action.payload.usuario?.assinatura || criarAssinaturaPadrao();
      })
      .addCase(loginUsuario.fulfilled, (state, action) => {
        state.assinaturaAtiva = action.payload.usuario?.assinatura || criarAssinaturaPadrao();
      })
      .addCase(atualizarPlano.pending, (state) => {
        state.statusRequest = "loading";
      })
      .addCase(atualizarPlano.fulfilled, (state, action) => {
        state.statusRequest = "succeeded";
        state.assinaturaAtiva = action.payload || criarAssinaturaPadrao();
        state.assinaturaEmSelecao = criarAssinaturaPadrao();
        state.error = null;
      })
      .addCase(atualizarPlano.rejected, (state, action) => {
        state.statusRequest = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(logout, (state) => {
        state.assinaturaAtiva = criarAssinaturaPadrao();
        state.assinaturaEmSelecao = criarAssinaturaPadrao();
        state.statusRequest = "idle";
        state.error = null;
      });
  }
});

export const { selecionarPlano } = assinaturaSlice.actions;
export default assinaturaSlice.reducer;
