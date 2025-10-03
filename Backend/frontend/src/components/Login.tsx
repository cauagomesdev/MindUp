import React, { useState } from "react";

interface LoginProps {
  tipo: "paciente" | "funcionario";
  onVoltar: () => void;
  onLogin: (user: { id: string; nome: string; tipo: "paciente" | "profissional"; email?: string }) => void;
}

const Login: React.FC<LoginProps> = ({ tipo, onVoltar, onLogin }) => {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    
    fetch(`http://localhost:8000/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome_login: form.email,
        senha: form.senha
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          // Corrigir lógica de determinação do tipo de usuário
          let tipoUsuario: "paciente" | "profissional";
          
          if (data.nivel_acesso === "admin" || data.nivel_acesso === "colaborador" || data.nivel_acesso === "voluntario") {
            tipoUsuario = "profissional";
          } else {
            tipoUsuario = "paciente";
          }

          onLogin({
            id: data.id,
            nome: data.nome,
            tipo: tipoUsuario,
            email: form.email,
          });
        } else {
          setErro(data.error || "Erro ao fazer login");
        }
      })
      .catch(() => setErro("Erro ao conectar ao servidor"));
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: "40px auto", 
      padding: "20px",
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <form onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
          Login - {tipo === "paciente" ? "Paciente" : "Funcionário"}
        </h2>
        {erro && (
          <div style={{ 
            color: "#dc3545", 
            backgroundColor: "#f8d7da", 
            border: "1px solid #f5c6cb",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px"
          }}>
            {erro}
          </div>
        )}
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
          placeholder="Senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
          required
          style={{ 
            width: "100%", 
            marginBottom: "20px", 
            padding: "12px",
            border: "2px solid #e9ecef",
            borderRadius: "8px",
            fontSize: "1rem"
          }}
        />
        <button 
          type="submit" 
          style={{ 
            width: "100%", 
            padding: "12px",
            backgroundColor: tipo === "paciente" ? "#4ecdc4" : "#6c5ce7",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "10px"
          }}
        >
          🔐 Entrar
        </button>
        <button 
          type="button" 
          onClick={onVoltar} 
          style={{ 
            width: "100%", 
            padding: "12px",
            backgroundColor: "#95a5a6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          ⬅️ Voltar
        </button>
      </form>
    </div>
  );
};

export default Login;