import React, { useState } from "react";
import Home from "./pages/Home";
import PacientesList from "./components/PacientesList";
import ProfissionaisList from "./components/ProfissionaisList";
import CadastroPaciente from "./components/CadastroPaciente";
import CadastroProfissional from "./components/CadastroProfissional";

const App: React.FC = () => {
  const [tela, setTela] = useState<"home" | "login" | "cadastro">("home");
  const [tipo, setTipo] = useState<"paciente" | "funcionario">("paciente");

  const handleSelect = (acao: "login" | "cadastro", tipoSelecionado: "paciente" | "funcionario") => {
    setTipo(tipoSelecionado);
    setTela(acao);
  };

  if (tela === "cadastro") {
    if (tipo === "paciente") {
      return <CadastroPaciente onVoltar={() => setTela("home")} />;
    } else {
      return <CadastroProfissional onVoltar={() => setTela("home")} />;
    }
  }

  if (tela === "login") {
    return <div>Página de Login para {tipo === "paciente" ? "Paciente" : "Funcionário"}</div>;
  }

  return (
    <div style={{ fontFamily: "Arial" }}>
      <Home onSelect={handleSelect} />
    </div>
  );
};

export default App;