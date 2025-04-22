import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import ModalCard from "./components/ModalCard";
import NovoCardForm from "./components/NovoCardForm";
import axios from "axios";

const etapas = ["Solicitado", "Aprovado", "Fila", "Produção", "Finalizado"];

function App() {
  const { instance, accounts } = useMsal();
  const [accessToken, setAccessToken] = useState("");
  const [siteId, setSiteId] = useState("");
  const [listaId, setListaId] = useState("");
  const [cards, setCards] = useState([]);
  const [cardSelecionado, setCardSelecionado] = useState(null);
  const [exibirFormulario, setExibirFormulario] = useState(false);

  const carregarCards = async () => {
    try {
      const res = await axios.get(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listaId}/items?expand=fields`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const dados = res.data.value.map((item) => ({
        id: item.id,
        titulo: item.fields.Title,
        nome: item.fields.NomeSolicitante,
        setor: item.fields.SetorSolicitante,
        descricao: item.fields.DescricaoPeca,
        quantidade: item.fields.Quantidade,
        prazo: item.fields.PrazoEntrega,
        valor: item.fields.ValorMercado,
        etapa: item.fields.Etapa,
      }));
      setCards(dados);
    } catch (err) {
      console.error("Erro ao buscar cards:", err);
    }
  };

  const buscarSiteInfo = async () => {
    try {
      const siteRes = await axios.get(
        "https://graph.microsoft.com/v1.0/sites/ticarbonblindados-my.sharepoint.com:/personal/vinicius_souza_carbon_cars:/",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const site = siteRes.data;
      setSiteId(site.id);

      const listaRes = await axios.get(
        `https://graph.microsoft.com/v1.0/sites/${site.id}/lists`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const lista = listaRes.data.value.find(
        (l) => l.name === "Solicitacoes3D"
      );
      setListaId(lista.id);
    } catch (err) {
      console.error("Erro ao buscar site/lista:", err);
    }
  };

  const login = async () => {
    try {
      const res = await instance.loginPopup({
        scopes: ["Sites.ReadWrite.All", "User.Read"],
      });

      const token = await instance.acquireTokenSilent({
        scopes: ["Sites.ReadWrite.All", "User.Read"],
        account: res.account,
      });
      setAccessToken(token.accessToken);
    } catch (err) {
      console.error(err);
    }
  };

  const atualizarEtapa = async (card, novaEtapa) => {
    try {
      await axios.patch(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listaId}/items/${card.id}/fields`,
        { Etapa: novaEtapa },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setCards((prev) =>
        prev.map((c) => (c.id === card.id ? { ...c, etapa: novaEtapa } : c))
      );
      setCardSelecionado(null);
    } catch (err) {
      console.error("Erro ao atualizar etapa:", err);
    }
  };

  const criarNovaSolicitacao = async (dados) => {
    try {
      await axios.post(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listaId}/items`,
        {
          fields: {
            Title: dados.NomePeca,
            ...dados,
            Etapa: "Solicitado"
          }
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setExibirFormulario(false);
      carregarCards();
    } catch (err) {
      console.error("Erro ao criar solicitação:", err);
      alert("Erro ao criar solicitação. Verifique os campos e tente novamente.");
    }
  };

  useEffect(() => {
    if (accessToken && siteId && listaId) {
      carregarCards();
    }
  }, [accessToken, siteId, listaId]);

  useEffect(() => {
    if (accessToken) {
      buscarSiteInfo();
    }
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Fila de Impressão 3D</h1>

      {!accounts || accounts.length === 0 ? (
        <button
          onClick={login}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Login com Microsoft
        </button>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p>Bem-vindo, {accounts[0].username}!</p>
            <button
              onClick={() => setExibirFormulario(true)}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Nova Solicitação
            </button>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {etapas.map((etapa) => (
              <div key={etapa} className="bg-white p-3 rounded shadow">
                <h2 className="font-semibold text-sm mb-2">{etapa}</h2>
                {cards
                  .filter((card) => card.etapa === etapa)
                  .map((card) => (
                    <div
                      key={card.id}
                      className="bg-gray-100 p-2 mb-2 rounded shadow cursor-pointer hover:bg-gray-200"
                      onClick={() => setCardSelecionado(card)}
                    >
                      <p className="font-bold">{card.titulo}</p>
                      <p className="text-xs">{card.nome}</p>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {cardSelecionado && (
        <ModalCard
          card={cardSelecionado}
          onClose={() => setCardSelecionado(null)}
          onEtapaChange={atualizarEtapa}
        />
      )}

      {exibirFormulario && (
        <NovoCardForm
          onCriar={criarNovaSolicitacao}
          onCancelar={() => setExibirFormulario(false)}
        />
      )}
    </div>
  );
}

export default App;
