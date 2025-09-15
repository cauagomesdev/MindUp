import React, { useState } from "react";

interface CadastroProfissionalProps {
  onVoltar: () => void;
}

const CadastroProfissional: React.FC<CadastroProfissionalProps> = ({ onVoltar }) => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    especialidade: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:5000/profissionais/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Cadastro realizado!");
        onVoltar();
      })
      .catch(() => alert("Erro ao cadastrar profissional!"));
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Cadastro de Profissional</h2>
      <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required style={{ width: "100%", marginBottom: 8 }} />
      <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required style={{ width: "100%", marginBottom: 8 }} />
      <input name="senha" placeholder="Senha" type="password" value={form.senha} onChange={handleChange} required style={{ width: "100%", marginBottom: 8 }} />
      <select name="especialidade" value={form.especialidade} onChange={handleChange} required style={{ width: "100%", marginBottom: 16 }}>
        <option value="">Selecione a especialidade</option>
        <option value="psicologo">Psicólogo</option>
        <option value="psiquiatra">Psiquiatra</option>
      </select>
      <button type="submit" style={{ width: "100%", padding: 10 }}>Cadastrar</button>
      <button type="button" onClick={onVoltar} style={{ width: "100%", marginTop: 8 }}>Voltar</button>
    </form>
  );
};

export default CadastroProfissional;