import React, { useState } from "react";

interface CadastroProfissionalProps {
  onVoltar: () => void;
}

const CadastroProfissional: React.FC<CadastroProfissionalProps> = ({ onVoltar }) => {
  const [form, setForm] = useState({
    nome_login: "",
    email: "",
    senha: "",
    especialidade: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Criar usuário admin/colaborador na tabela Usuario
    const userData = {
      nome_login: form.nome_login,
      email: form.email,
      senha: form.senha,
      nivel_acesso: "colaborador"
    };

    fetch("http://localhost:8000/usuarios/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message || data.id) {
          alert("Profissional cadastrado com sucesso!");
          onVoltar();
        } else {
          alert(data.error || "Erro ao cadastrar profissional!");
        }
      })
      .catch(() => alert("Erro ao cadastrar profissional!"));
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Cadastro de Profissional</h2>
      <input 
        name="nome_login" 
        placeholder="Nome de usuário" 
        value={form.nome_login} 
        onChange={handleChange} 
        required 
        style={{ width: "100%", marginBottom: 8 }} 
      />
      <input 
        name="email" 
        placeholder="Email" 
        type="email" 
        value={form.email} 
        onChange={handleChange} 
        required 
        style={{ width: "100%", marginBottom: 8 }} 
      />
      <input 
        name="senha" 
        placeholder="Senha" 
        type="password" 
        value={form.senha} 
        onChange={handleChange} 
        required 
        style={{ width: "100%", marginBottom: 8 }} 
      />
      <select 
        name="especialidade" 
        value={form.especialidade} 
        onChange={handleChange} 
        required 
        style={{ width: "100%", marginBottom: 16 }}
      >
        <option value="">Selecione a especialidade</option>
        <option value="psicologo">Psicólogo</option>
        <option value="psiquiatra">Psiquiatra</option>
        <option value="assistente_social">Assistente Social</option>
        <option value="coordenador">Coordenador</option>
      </select>
      <button type="submit" style={{ width: "100%", padding: 10 }}>Cadastrar</button>
      <button type="button" onClick={onVoltar} style={{ width: "100%", marginTop: 8 }}>Voltar</button>
    </form>
  );
};

export default CadastroProfissional;