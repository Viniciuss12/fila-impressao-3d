import React, { useState } from "react";

export default function NovoCardForm({ onCriar, onCancelar }) {
  const [form, setForm] = useState({
    DataSolicitacao: "",
    NomeSolicitante: "",
    SetorSolicitante: "",
    Marca: "",
    Modelo: "",
    NomePeca: "",
    DescricaoPeca: "",
    Quantidade: "",
    PrazoEntrega: "",
    ValorMercado: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const camposVazios = Object.entries(form).filter(([_, v]) => !v);
    if (camposVazios.length > 0) {
      alert("Preencha todos os campos antes de enviar.");
      return;
    }
    onCriar(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">Nova Solicitação</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <label>
            Data Solicitação:
            <input type="date" name="DataSolicitacao" value={form.DataSolicitacao} onChange={handleChange} className="w-full border rounded p-2" />
          </label>
          <label>
            Nome do Solicitante:
            <input name="NomeSolicitante" value={form.NomeSolicitante} onChange={handleChange} className="w-full border rounded p-2" />
          </label>
          <label>
            Setor de Solicitação:
            <input name="SetorSolicitante" value={form.SetorSolicitante} onChange={handleChange} className="w-full border rounded p-2" />
          </label>
          <label>
            Marca:
            <input name="Marca" value={form.Marca} onChange={handleChange} className="w-full border rounded p-2" />
          </label>
          <label>
            Modelo:
            <input name="Modelo" value={form.Modelo} onChange={handleChange} className="w-full border rounded p-2" />
          </label>
          <label>
            Nome da Peça:
            <input name="NomePeca" value={form.NomePeca} onChange={handleChange} className="w-full border rounded p-2" />
          </label>
          <label className="col-span-2">
            Descrição da Peça:
            <textarea name="DescricaoPeca" value={form.DescricaoPeca} onChange={handleChange} className="w-full border rounded p-2" />
          </label>
          <label>
            Quantidade de Peças:
            <input type="number" name="Quantidade" value={form.Quantidade} onChange={handleChange} className="w-full border rounded p-2" />
          </label>
          <label>
            Prazo de Entrega:
            <input type="date" name="PrazoEntrega" value={form.PrazoEntrega} onChange={handleChange} className="w-full border rounded p-2" />
          </label>
          <label>
            Valor da Peça (R$):
            <input type="number" name="ValorMercado" value={form.ValorMercado} onChange={handleChange} className="w-full border rounded p-2" />
          </label>
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <button onClick={onCancelar} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
          <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Criar</button>
        </div>
      </div>
    </div>
  );
}
