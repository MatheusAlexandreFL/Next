import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import contentReducer from "./contentSlice";
import assinaturaReducer from "./AssinaturaSlice";

/* const DEFAULT_ASSINATURA = {
  tipo_plano: null,
  tipo_pagamento: null,
  status: "inativo"
}; */

const criarAssinaturaPadrao = () => ({
  plano_id: null,
  tipo_plano: null,
  limite_perfis: 1,
  tipo_pagamento: null,
  status: "inativo"
});

const normalizeState = (state) => {
  if (!state || typeof state !== "object") return undefined;

  const { assinatura: assinaturaLegada, ...userSemAssinatura } = state.user || {};

  return {
    ...state,
    user: userSemAssinatura,
    assinatura: {
      assinaturaAtiva: state.assinatura?.assinaturaAtiva ?? assinaturaLegada ?? criarAssinaturaPadrao(),
      assinaturaEmSelecao: state.assinatura?.assinaturaEmSelecao ?? criarAssinaturaPadrao(),
      statusRequest: state.assinatura?.statusRequest ?? "idle",
      error: state.assinatura?.error ?? null 
    }
  };
};

//criando o localStorage

//pega os dados do localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("appState");
    return serializedState ? normalizeState(JSON.parse(serializedState)) : undefined;
  } catch {
    return undefined;
    //se voltar undefined, o Redux irá usar o estado inicial definido no userSlice.js
  }
}

export const store = configureStore({
  reducer: {
    user: userReducer,
    content: contentReducer,
    assinatura: assinaturaReducer
  },
  //usando o localStorage
  preloadedState: loadState()//se tiver algo no localStorage, ele vai usar, se não, ele vai usar o estado inicial do userSlice.js
});


//toda vez que o Redux mudar, ele vai executar isso
//quando utilizar "dispatch(setUser(...))" irá disparar o subscribe

store.subscribe(() => {
  try {
    const state = store.getState();//pega o estado atual
    //pega exatamente 
    /* {
     id: null;
        nome: string;
        sobrenome: string;
        email: string;
        data_nascimento: null;
        role: string;
        assinatura: {
            tipo_plano: null;
            tipo_pagamento: null;
            status: string;
        };
        token: string | null;
        isAuthenticated: boolean;
        statusRequest: string;
        error: null;
    } */

    
    localStorage.setItem("appState", JSON.stringify({//salva no localStorage
      user: state.user,
      assinatura: state.assinatura
    }));
  }catch {
    console.log("Erro ao salvar no localStorage");
  }
})




