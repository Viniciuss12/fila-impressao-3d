import React, { useEffect, useState } from "react";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "./msalConfig";
import Board from "./components/Board";
import Form from "./components/Form";
import {
  getCards,
  updateCardEtapa,
  criarCard
} from "./graphService";

export default function App() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [cards, setCards] = useState([]);

  const carregarCards = async () => {
    const dados = await getCards(instance, accounts);
    setCards(dados);
  };

  useEffect(() => {
    if (isAuthenticated) {
      carregarCards();
    }
  }, [isAuthenticated]);

  const moverCard = async (id, novaEtapa) => {
    await updateCardEtapa(instance, accounts, id, novaEtapa);
    carregarCards();
  };

  const agruparPorEtapa = () => {
    const agrupado = {};
    cards.forEach((card) => {
      if (!agrupado[card.etapa]) agrupado[card.etapa] = [];
      agrupado[card.etapa].push(card);
    });
    return agrupado;
  };

  const handleNovaSolicitacao = async (dados) => {
    await criarCard(instance, accounts, dados);
    carregarCards();
  };

  // ✅ BUSCA DO SITE ID E LIST ID COM SCOPES CORRETOS
  useEffect(() => {
    const buscarSiteInfo = async () => {
      if (isAuthenticated) {
        let token;
        try {
          const silentResult = await instance.acquireTokenSilent({
            scopes: ["https://graph.microsoft.com/Sites.Read.All"],
            account: accounts[0]
          });
          token = silentResult.accessToken;
        } catch (e) {
          const popupResult = await instance.acquireTokenPopup({
            scopes: ["https://graph.microsoft.com/Sites.Read.All"]
          });
          token = popupResult.accessToken;
        }

        const res = await fetch(
          "https://graph.microsoft.com/v1.0/sites/ticarbonblindados-my.sharepoint.com:/personal/vinicius_souza_carbon_cars:/",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await res.json();
        console.log("✅ SITE ID:", data.id);

        const listas = await fetch(
          `https://graph.microsoft.com/v1.0/sites/${data.id}/lists`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const listasData = await listas.json();
        const lista3d = listasData.value.find((l) => l.name === "Solicitacoes3D");

        console.log("✅ LISTA ID:", lista3d?.id);
      }
    };

    buscarSiteInfo();
  }, [isAuthenticated]);

  return (
    <div style={{ fontFamily: "Arial", padding: "1rem" }}>
      <h1>Fila de Impressão 3D</h1>

      {!isAuthenticated ? (
        <button onClick={() => instance.loginPopup(loginRequest)}>
          Login com Microsoft
        </button>
      ) : (
        <>
          <p>Bem-vindo, {accounts[0]?.username}!</p>
          <Form onSubmit={handleNovaSolicitacao} />
          <Board cardsByEtapa={agruparPorEtapa()} onMoveCard={moverCard} />
        </>
      )}
    </div>
  );
}
