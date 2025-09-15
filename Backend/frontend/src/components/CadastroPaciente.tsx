import React, { useState } from "react";

interface CadastroPacienteProps {
  onVoltar: () => void;
}

const CadastroPaciente: React.FC<CadastroPacienteProps> = ({ onVoltar }) => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    data_nascimento: "",
    comunidade: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:5000/pacientes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Cadastro realizado!");
        onVoltar();
      })
      .catch(() => alert("Erro ao cadastrar paciente!"));
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Cadastro de Paciente</h2>
      <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required style={{ width: "100%", marginBottom: 8 }} />
      <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required style={{ width: "100%", marginBottom: 8 }} />
      <input name="senha" placeholder="Senha" type="password" value={form.senha} onChange={handleChange} required style={{ width: "100%", marginBottom: 8 }} />
      <input name="data_nascimento" placeholder="Data de Nascimento" type="date" value={form.data_nascimento} onChange={handleChange} required style={{ width: "100%", marginBottom: 8 }} />
      <input name="comunidade" placeholder="Comunidade" value={form.comunidade} onChange={handleChange} required style={{ width: "100%", marginBottom: 16 }} />
      <button type="submit" style={{ width: "100%", padding: 10 }}>Cadastrar</button>
      <button type="button" onClick={onVoltar} style={{ width: "100%", marginTop: 8 }}>Voltar</button>
    </form>
  );
};

export default CadastroPaciente;