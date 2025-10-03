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
    setErro("");
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
    <div className="fade-in" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{ 
        maxWidth: 500, 
        width: "100%",
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        backdropFilter: "blur(10px)"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "30px", 
          color: "#2c3e50",
          fontSize: "2.2rem",
          fontWeight: "700"
        }}>
          👨‍⚕️ Cadastro de Profissional
        </h2>
        
        {erro && (
          <div style={{ 
            color: "#dc3545", 
            backgroundColor: "#f8d7da", 
            border: "1px solid #f5c6cb",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center"
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
              padding: "15px",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              transition: "all 0.3s ease"
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
              padding: "15px",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              transition: "all 0.3s ease"
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
              padding: "15px",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              transition: "all 0.3s ease"
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
              padding: "15px",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              backgroundColor: "white",
              transition: "all 0.3s ease"
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
              padding: "18px",
              background: carregando ? "#95a5a6" : "linear-gradient(135deg, #6c5ce7 0%, #5f4fcf 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "700",
              cursor: carregando ? "not-allowed" : "pointer",
              marginBottom: "15px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(108, 92, 231, 0.3)"
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
              padding: "15px",
              background: "transparent",
              color: "#6c757d",
              border: "2px solid #dee2e6",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: carregando ? "not-allowed" : "pointer",
              transition: "all 0.3s ease"
            }}
          >
            ⬅️ Voltar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroProfissional;