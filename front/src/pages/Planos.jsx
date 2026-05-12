import { useState, useEffect } from "react";
import Button from "../components/button";
import { Link } from "react-router-dom";
import posterImages from "../constants/posterImages";
import api from "../services/api";

import { useDispatch } from "react-redux";
import { selecionarPlano } from "../store/AssinaturaSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
 


export default function Planos() {

  const navigate = useNavigate();
  const dispatch = useDispatch();



  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planos, setPlanos] = useState([]);


  

  // const subscription = useSelector(state => state.subscription);
  //console.log("SUBSCRIPTION:", user.assinatura?.tipo_plano);
 
  /* const planos = [
  {
    nome: "Básico",
    qualidade: "720p",
    preco: "R$ 19,90",
    download: "Não",
    telas: "1 dispositivo",
    anuncios: "Sim",
    exclusivo: "Não",
    gradiente: "from-blue-500 to-purple-900"
  },
  {
    nome: "Padrão",
    qualidade: "1080p",
    preco: "R$ 39,90",
    download: "Sim",
    telas: "2 dispositivos",
    anuncios: "Não",
    exclusivo: "Sim",
    gradiente: "from-blue-500 to-yellow-400"
  },
  {
    nome: "Premium",
    qualidade: "4K + HDR",
    preco: "R$ 54,90",
    download: "Sim",
    telas: "4 dispositivos",
    anuncios: "Não",
    exclusivo: "Sim",
    gradiente: "from-blue-500 to-red-500"
  }
]; */

  useEffect(() => {
    carregarPlanos();
  }, []);

  async function carregarPlanos() {
    try {
      const response = await api.get("/planos");
      setPlanos(response.data);

      if (response.data.length > 0) {
        setPlanoSelecionado(response.data[0]); // Seleciona o primeiro plano por padrão
      }

    } catch (e) {
      alert("Erro ao carregar planos: " + (e?.message || e));
    } finally {
      setLoading(false);
    }
  }

  function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function simOuNao(valor) {
    return valor ? "Sim" : "Não";
  }

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Carregando planos...</div>;
  }

  if (!planoSelecionado) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Nenhum plano disponível.</div>;
  }


// const planoAtual = planos[planoSelecionado];

  return (
    <div className="relative h-screen bg-black overflow-hidden flex flex-col items-center py-10 text-white">

    {/* FUNDO + OVERLAY */}
<div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

    
    {/* <p>Plano: {user.assinatura?.tipo_plano}</p> */}


  {/* IMAGENS */}
   <div className="absolute inset-0 overflow-hidden w-full max-w-full pointer-events-none ">

   <div className="
   grid grid-cols-6 md:grid-cols-8 gap-2
  rotate-12
 w-[120%] h-[120%]
-translate-x-[10%] -translate-y-[10%]
pointer-events-none 
">
      {posterImages.map((img, index) => ( 
        <img
          key={index}
          src={img}
          className="w-full h-full object-cover"
        />
      ))}
    </div>
  </div>

  {/* OVERLAY */}
  <div className="absolute inset-0 bg-black/80 pointer-events-none"></div>

</div>

      {/* CONTAINER DESKTOP */}
 <div className="
  relative z-10
  w-full
  max-w-md
  mx-auto

  bg-black/30        
  p-6                

  md:max-w-3xl
  md:bg-black/10
  md:backdrop-blur-xl
  border border-white/10 
  rounded-3xl
  backdrop-blur-xl
  md:border md:border-white/10 
  md:rounded-2xl 
  md:p-8
">

      <h2 className="text-xl sm:text-2xl font-bold mb-8 text-center  text-white">
        Escolha o melhor plano para você
      </h2>

      <div className="grid grid-cols-3 gap-3 w-full  mb-10">

        {planos.map((plano) => {

          const selecionado = planoSelecionado?._id === plano._id;

          return (

            <div
              key={plano._id}
              /* onClick={() => setPlanoSelecionado(index)} */
              onClick={() => {
                setPlanoSelecionado(plano);;
              }}
              className={`
                p-4 sm:p-5 rounded-xl text-center cursor-pointer
                transition duration-300 ease-in-out
                hover:scale-100  hover:shadow-xl hover:-translate-y-1 
                ${selecionado
                ? "bg-blue-600 text-white shadow-lg"
                : "border border-gray-600 bg-black/40 text-gray-300"}

              `}
            >

              <h3 className="font-semibold text-lg">
                {plano.nome}
              </h3>

              <p className={`${selecionado ? "text-white/90" : "text-gray-400"}`}>
                {plano.qualidade_video}
              </p>

            </div>

          );
        })}

      </div>
      
      
  
      <div className="w-full  space-y-4 mb-8">

        <div className="flex justify-between border-b  pb-3 text-sm text-white">
          <span className="font-bold text-base">Preço mensal:</span>
          <span className="font-extralight text-base">{formatarPreco(planoSelecionado.preco)}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white ">
          <span className="font-bold text-base">Qualidade de vídeo:</span>
          <span className="font-extralight text-base">{planoSelecionado.qualidade_video}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white">
          <span className="font-bold text-base">Permite download:</span>
          <span className="font-extralight text-base">{simOuNao(planoSelecionado.permite_download)}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white">
          <span className="font-bold text-base">Telas simultâneas:</span>
          <span className="font-extralight text-base">{planoSelecionado.telas_simultaneas}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white">
          <span className="font-bold text-base">Com anúncios:</span>
          <span className="font-extralight text-base">{simOuNao(planoSelecionado.tem_anuncios)}</span>
        </div>

        <div className="flex justify-between border-b pb-3 text-sm text-white">
          <span className="font-bold text-base">Acesso a conteúdo exclusivo:</span>
          <span className="font-extralight text-base">{simOuNao(planoSelecionado.conteudo_exclusivo)}</span>
        </div>

      </div>

   
      
        <Button 
        onClick={() => {
          /* dispatch(selecionarPlano(planos[planoSelecionado].nome)); */
          dispatch(selecionarPlano({
            plano_id: planoSelecionado._id,
            tipo_plano: planoSelecionado.nome,
            limite_perfis: planoSelecionado.limite_perfis
          }));


          navigate("/pagamento");
            }}
          
          className="relative z-50 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition font-medium">
          Selecionar plano
        </Button>
      
      </div> 
    </div>
  );
}
