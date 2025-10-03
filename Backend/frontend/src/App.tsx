import React, { useState } from "react";
import Home from "./pages/Home";
import CadastroPaciente from "./components/CadastroPaciente";
import CadastroProfissional from "./components/CadastroProfissional";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import NotFound from "./pages/NotFound";
import "./App.css";

type Tela = 
  | "home" 
  | "cadastro-paciente" 
  | "cadastro-profissional" 
  | "login" 
  | "dashboard-paciente" 
  | "dashboard-profissional"
  | "not-found";

interface Usuario {
  id: string;
  nome: string;
  nivel_acesso: string;
}

const App: React.FC = () => {
  const [telaAtual, setTelaAtual] = useState<Tela>("home");
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const handleLogin = (dadosUsuario: Usuario) => {
    setUsuario(dadosUsuario);
    if (dadosUsuario.nivel_acesso === "paciente") {
      setTelaAtual("dashboard-paciente");
    } else {
      setTelaAtual("dashboard-profissional");
    }
  };

  const handleLogout = () => {
    setUsuario(null);
    setTelaAtual("home");
  };

  const handleNavigate = (tela: string) => {
    setTelaAtual(tela as Tela);
  };

  const renderTela = () => {
    switch (telaAtual) {
      case "home":
        return <Home onNavigate={handleNavigate} />;
      case "cadastro-paciente":
        return <CadastroPaciente onVoltar={() => setTelaAtual("home")} />;
      case "cadastro-profissional":
        return <CadastroProfissional onVoltar={() => setTelaAtual("home")} />;
      case "login":
        return <Login onVoltar={() => setTelaAtual("home")} onLogin={handleLogin} />;
      case "dashboard-paciente":
      case "dashboard-profissional":
        if (!usuario) {
          return <Login onVoltar={() => setTelaAtual("home")} onLogin={handleLogin} />;
        }
        return (
          <Dashboard 
            usuario={usuario} 
            onLogout={handleLogout}
            tipo={telaAtual === "dashboard-paciente" ? "paciente" : "profissional"}
          />
        );
      case "not-found":
        return <NotFound onVoltar={() => setTelaAtual("home")} />;
      default:
        return <NotFound onVoltar={() => setTelaAtual("home")} />;
    }
  };

  return (
    <div className="App">
      {renderTela()}
    </div>
  );
};

export default App;