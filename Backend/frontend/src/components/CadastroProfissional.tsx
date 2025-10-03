import React, { useState } from "react";

interface CadastroProfissionalProps {
  onVoltar: () => void;
}

const CadastroProfissional: React.FC<CadastroProfissionalProps> = ({ onVoltar }) => {
  const [form, setForm] = useState({
    nome_login: "",
    email: "",
    senha: "",
    nivel_acesso: "colaborador",
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro(""); // Limpar erro ao digitar
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    
    fetch("http://localhost:8000/usuarios/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          alert("✅ " + (data.message || "Profissional cadastrado com sucesso!"));
          onVoltar();
        } else {
          setErro(data.error || "Erro ao cadastrar profissional!");
        }
      })
      .catch(() => {
        setErro("Erro ao conectar ao servidor. Verifique sua conexão.");
      })
      .finally(() => {
        setCarregando(false);
      });
  };

  return (
    <div style={{ 
      maxWidth: 500, 
      margin: "40px auto", 
      padding: "30px",
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        👨‍⚕️ Cadastro de Profissional
      </h2>
      
      {erro && (
        <div style={{ 
          color: "#dc3545", 
          backgroundColor: "#f8d7da", 
          border: "1px solid #f5c6cb",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "20px"
        }}>
          ⚠️ {erro}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input 
          name="nome_login" 
          placeholder="Nome de usuário" 
          value={form.nome_login} 
          onChange={handleChange} 
          required 
          style={{ 
            width: "100%", 
            marginBottom: "15px", 
            padding: "12px",
            border: "2px solid #e9ecef",
            borderRadius: "8px",
            fontSize: "1rem"
          }} 
        />
        <input 
          name="email" 
          placeholder="Email" 
          type="email" 
          value={form.email} 
          onChange={handleChange} 
          required 
          style={{ 
            width: "100%", 
            marginBottom: "15px", 
            padding: "12px",
            border: "2px solid #e9ecef",
            borderRadius: "8px",
            fontSize: "1rem"
          }} 
        />
        <input 
          name="senha" 
          placeholder="Senha (mínimo 6 caracteres)" 
          type="password" 
          value={form.senha} 
          onChange={handleChange} 
          required 
          minLength={6}
          style={{ 
            width: "100%", 
            marginBottom: "15px", 
            padding: "12px",
            border: "2px solid #e9ecef",
            borderRadius: "8px",
            fontSize: "1rem"
          }} 
        />
        <select 
          name="nivel_acesso" 
          value={form.nivel_acesso} 
          onChange={handleChange} 
          required 
          style={{ 
            width: "100%", 
            marginBottom: "25px", 
            padding: "12px",
            border: "2px solid #e9ecef",
            borderRadius: "8px",
            fontSize: "1rem",
            backgroundColor: "white"
          }}
        >
          <option value="colaborador">👨‍⚕️ Colaborador</option>
          <option value="admin">👑 Administrador</option>
          <option value="voluntario">🤝 Voluntário</option>
        </select>
        
        <button 
          type="submit"
          disabled={carregando}
          style={{ 
            width: "100%", 
            padding: "15px",
            backgroundColor: carregando ? "#95a5a6" : "#6c5ce7",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: carregando ? "not-allowed" : "pointer",
            marginBottom: "10px"
          }}
        >
          {carregando ? "⏳ Cadastrando..." : "✅ Cadastrar"}
        </button>
        
        <button 
          type="button" 
          onClick={onVoltar}
          disabled={carregando}
          style={{ 
            width: "100%", 
            padding: "12px",
            backgroundColor: "#95a5a6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: carregando ? "not-allowed" : "pointer"
          }}
        >
          ⬅️ Voltar
        </button>
      </form>
    </div>
  );
};

export default CadastroProfissional;