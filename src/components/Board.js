// src/components/Board.js
import React from "react";
import "./Board.css";

const etapas = [
  "Solicitado",
  "Aprovado",
  "Fila de Produção",
  "Em Produção",
  "Finalizado"
];

export default function Board({ cardsByEtapa, onMoveCard }) {
  return (
    <div className="board">
      {etapas.map((etapa) => (
        <div
          key={etapa}
          className="coluna"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const data = JSON.parse(e.dataTransfer.getData("card"));
            onMoveCard(data.id, etapa);
          }}
        >
          <h3>{etapa}</h3>
          <div className="coluna-cards">
            {cardsByEtapa[etapa]?.map((card) => (
              <div
                key={card.id}
                className="card"
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("card", JSON.stringify(card))
                }
              >
                <strong>{card.titulo}</strong>
                <p>{card.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
