import React, { useState } from "react";
import Home from "./pages/Home";
import PacientesList from "./components/PacientesList";
import ProfissionaisList from "./components/ProfissionaisList";
import CadastroPaciente from "./components/CadastroPaciente";
import CadastroProfissional from "./components/CadastroProfissional";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

type Usuario = {
  id: string;
  nome: string;
  tipo: "paciente" | "profissional";
  email?: string;
};

const App: React.FC = () => {
  const [tela, setTela] = useState<"home" | "login" | "cadastro" | "dashboard">("home");
  const [tipo, setTipo] = useState<"paciente" | "funcionario">("paciente");
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const handleSelect = (acao: "login" | "cadastro", tipoSelecionado: "paciente" | "funcionario") => {
    setTipo(tipoSelecionado);
    setTela(acao);
  };

  const handleLogin = (user: Usuario) => {
    setUsuario(user);
    setTela("dashboard");
  };

  const handleLogout = () => {
    setUsuario(null);
    setTela("home");
  };

  if (tela === "cadastro") {
    if (tipo === "paciente") {
      return <CadastroPaciente onVoltar={() => setTela("home")} />;
    } else {
      return <CadastroProfissional onVoltar={() => setTela("home")} />;
    }
  }

  if (tela === "login") {
    return (
      <Login
        tipo={tipo}
        onVoltar={() => setTela("home")}
        onLogin={handleLogin}
      />
    );
  }

  if (tela === "dashboard" && usuario) {
    return (
      <Dashboard usuario={usuario} onLogout={handleLogout} />
    );
  }

  return (
    <div style={{ fontFamily: "Arial" }}>
      <Home onSelect={handleSelect} />
    </div>
  );
};

export default App;