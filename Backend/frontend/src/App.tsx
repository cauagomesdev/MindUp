import React, { useState } from "react";
import Home from "./pages/Home";
import CadastroPaciente from "./components/CadastroPaciente";
import CadastroProfissional from "./components/CadastroProfissional";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "./App.css";

interface Usuario {
  id: string;
  nome: string;
  tipo: "paciente" | "profissional";
  email?: string;
}

type Tela = "home" | "cadastro-paciente" | "cadastro-profissional" | "login-paciente" | "login-funcionario" | "dashboard";

const App: React.FC = () => {
  const [telaAtual, setTelaAtual] = useState<Tela>("home");
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);

  const handleLogin = (usuario: Usuario) => {
    setUsuarioLogado(usuario);
    setTelaAtual("dashboard");
  };

  const handleLogout = () => {
    setUsuarioLogado(null);
    setTelaAtual("home");
  };

  if (usuarioLogado) {
    return <Dashboard usuario={usuarioLogado} onLogout={handleLogout} />;
  }

  return (
    <div className="App">
      {telaAtual === "home" && (
        <Home
          onCadastrarPaciente={() => setTelaAtual("cadastro-paciente")}
          onCadastrarProfissional={() => setTelaAtual("cadastro-profissional")}
          onLoginPaciente={() => setTelaAtual("login-paciente")}
          onLoginFuncionario={() => setTelaAtual("login-funcionario")}
        />
      )}

      {telaAtual === "cadastro-paciente" && (
        <CadastroPaciente onVoltar={() => setTelaAtual("home")} />
      )}

      {telaAtual === "cadastro-profissional" && (
        <CadastroProfissional onVoltar={() => setTelaAtual("home")} />
      )}

      {telaAtual === "login-paciente" && (
        <Login
          tipo="paciente"
          onVoltar={() => setTelaAtual("home")}
          onLogin={handleLogin}
        />
      )}

      {telaAtual === "login-funcionario" && (
        <Login
          tipo="funcionario"
          onVoltar={() => setTelaAtual("home")}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};

export default App;