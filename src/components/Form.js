// src/components/Form.js
import React, { useState } from "react";

export default function Form({ onSubmit }) {
  const [form, setForm] = useState({
    data: "",
    nome: "",
    setor: "",
    marca: "",
    modelo: "",
    titulo: "",
    descricao: "",
    quantidade: "",
    prazo: "",
    valor: "",
    imagemPeca: null,
    imagemLocal: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form); // Envia todos os dados para o App.js
    setForm({
      data: "",
      nome: "",
      setor: "",
      marca: "",
      modelo: "",
      titulo: "",
      descricao: "",
      quantidade: "",
      prazo: "",
      valor: "",
      imagemPeca: null,
      imagemLocal: null
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: "#f9f9f9", padding: 20, borderRadius: 8, marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      <h2>Nova Solicitação</h2>
      
      <input required type="date" name="data" value={form.data} onChange={handleChange} placeholder="Data da solicitação" />
      <input required name="nome" placeholder="Nome do solicitante" value={form.nome} onChange={handleChange} />
      <input required name="setor" placeholder="Setor de solicitação" value={form.setor} onChange={handleChange} />
      <input required name="marca" placeholder="Marca" value={form.marca} onChange={handleChange} />
      <input required name="modelo" placeholder="Modelo" value={form.modelo} onChange={handleChange} />
      <input required name="titulo" placeholder="Nome da peça" value={form.titulo} onChange={handleChange} />
      <input required name="descricao" placeholder="Descrição da peça" value={form.descricao} onChange={handleChange} />
      <input required type="number" name="quantidade" placeholder="Qtd peças" value={form.quantidade} onChange={handleChange} />
      <input required type="date" name="prazo" placeholder="Prazo de entrega" value={form.prazo} onChange={handleChange} />
      <input required type="number" name="valor" placeholder="Valor da peça (R$)" value={form.valor} onChange={handleChange} />
      
      <label>Imagem da peça</label>
      <input required type="file" name="imagemPeca" onChange={handleChange} />

      <label>Imagem do local de aplicação</label>
      <input required type="file" name="imagemLocal" onChange={handleChange} />

      
      <button type="submit">Salvar Solicitação</button>
    </form>
  );
}
