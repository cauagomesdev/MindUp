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
    
    // Usar novo endpoint unificado
    fetch(`http://localhost:8000/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome_login: form.email,  // Pode usar email como login
        senha: form.senha
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          onLogin({
            id: data.id,
            nome: data.nome,
            tipo: data.nivel_acesso === "admin" ? "profissional" : "paciente",
            email: form.email,
          });
        } else {
          setErro(data.error || "Erro ao fazer login");
        }
      })
      .catch(() => setErro("Erro ao conectar ao servidor"));
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Login - {tipo === "paciente" ? "Paciente" : "Funcionário"}</h2>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
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
        style={{ width: "100%", marginBottom: 16 }}
      />
      <button type="submit" style={{ width: "100%", padding: 10 }}>
        Entrar
      </button>
      <button type="button" onClick={onVoltar} style={{ width: "100%", marginTop: 8 }}>
        Voltar
      </button>
    </form>
  );
};

export default Login;