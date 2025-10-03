import React, { useState } from "react";

interface LoginProps {
  onVoltar: () => void;
  onLogin: (usuario: { id: string; nome: string; nivel_acesso: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onVoltar, onLogin }) => {
  const [form, setForm] = useState({
    email: "",
    senha: "",
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    
    fetch("http://localhost:8000/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome_login: form.email, // API aceita email no campo nome_login
        senha: form.senha,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          onLogin({
            id: data.id,
            nome: data.nome,
            nivel_acesso: data.nivel_acesso,
          });
        } else {
          setErro(data.error || "Email ou senha inválidos!");
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
        maxWidth: 450, 
        width: "100%",
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🔐</div>
          <h2 style={{ 
            color: "#2c3e50",
            fontSize: "2.2rem",
            fontWeight: "700",
            marginBottom: "10px"
          }}>
            Fazer Login
          </h2>
          <p style={{
            color: "#6c757d",
            fontSize: "1rem"
          }}>
            Entre com suas credenciais
          </p>
        </div>
        
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
            name="email" 
            placeholder="Email ou nome de usuário" 
            type="text"
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
            placeholder="Senha" 
            type="password" 
            value={form.senha} 
            onChange={handleChange} 
            required 
            style={{ 
              width: "100%", 
              marginBottom: "25px", 
              padding: "15px",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              transition: "all 0.3s ease"
            }} 
          />
          
          <button 
            type="submit"
            disabled={carregando}
            style={{ 
              width: "100%", 
              padding: "18px",
              background: carregando ? "#95a5a6" : "linear-gradient(135deg, #2ed573 0%, #17a2b8 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "700",
              cursor: carregando ? "not-allowed" : "pointer",
              marginBottom: "15px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(46, 213, 115, 0.3)"
            }}
          >
            {carregando ? "⏳ Entrando..." : "🚀 Entrar"}
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

        <div style={{
          textAlign: "center",
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: "1px solid #e9ecef"
        }}>
          <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>
            💡 <strong>Dica:</strong> Use o email cadastrado para fazer login
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;