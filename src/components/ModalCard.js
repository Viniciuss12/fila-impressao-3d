import React from "react";
const etapas = ["Solicitado", "Aprovado", "Fila", "Produção", "Finalizado"];

export default function ModalCard({ card, onClose, onEtapaChange }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Detalhes da Solicitação</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Nome da peça:</strong> {card.titulo}</p>
          <p><strong>Solicitante:</strong> {card.nome}</p>
          <p><strong>Setor:</strong> {card.setor}</p>
          <p><strong>Descrição:</strong> {card.descricao}</p>
          <p><strong>Quantidade:</strong> {card.quantidade}</p>
          <p><strong>Prazo:</strong> {card.prazo}</p>
          <p><strong>Valor:</strong> R$ {card.valor}</p>

          <label className="block mt-4">
            <span className="text-sm font-medium">Etapa:</span>
            <select
              value={card.etapa}
              onChange={(e) => onEtapaChange(card, e.target.value)}
              className="w-full border rounded p-2 mt-1"
            >
              {etapas.map((etapa) => (
                <option key={etapa} value={etapa}>
                  {etapa}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
