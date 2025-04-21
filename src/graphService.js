import axios from "axios";
import { getAccessToken } from "./authProvider";

// ✅ IDs reais do seu SharePoint
const siteId = "ticarbonblindados-my.sharepoint.com,85cba5cc-187f-4dba-90a2-6e96fa1371f2,7cd6e616-d4e3-402d-98c2-07122f0e7f60";
const listId = "cf0264df-85f6-4112-ae1e-67a2101d863d";

// 🔁 Criação de um novo card
export async function criarCard(instance, accounts, dados) {
  const token = await getAccessToken(instance, accounts);

  const payload = {
    fields: {
      Title: dados.titulo,
      DescricaoPeca: dados.descricao,
      SetorSolicitante: dados.setor,
      Marca: dados.marca,
      Modelo: dados.modelo,
      Quantidade: parseInt(dados.quantidade),
      PrazoEntrega: new Date(dados.prazo).toISOString(),
      ValorMercado: parseFloat(dados.valor),
      NomeSolicitante: dados.nome,
      DataSolicitacao: new Date(dados.data).toISOString(),
      Etapa: "Solicitado"
    }
  };

  console.log("📦 Payload enviado:", payload);

  try {
    await axios.post(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("✅ Card criado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao criar card:", error.response?.data || error.message);
  }
}

// 🔎 Listar cards do SharePoint
export async function getCards(instance, accounts) {
  const token = await getAccessToken(instance, accounts);

  try {
    const res = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?expand=fields`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const items = res.data.value;

    return items.map((item) => ({
      id: item.id,
      titulo: item.fields.Title,
      descricao: item.fields.DescricaoPeca,
      etapa: item.fields.Etapa
    }));
  } catch (error) {
    console.error("❌ Erro ao carregar cards:", error.response?.data || error.message);
    return [];
  }
}

// 🔄 Atualizar etapa do card
export async function updateCardEtapa(instance, accounts, id, novaEtapa) {
  const token = await getAccessToken(instance, accounts);

  try {
    await axios.patch(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${id}/fields`,
      { Etapa: novaEtapa },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(`✅ Etapa do card ${id} atualizada para: ${novaEtapa}`);
  } catch (error) {
    console.error("❌ Erro ao atualizar etapa:", error.response?.data || error.message);
  }
}
