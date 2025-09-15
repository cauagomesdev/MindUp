import React, { useState } from "react";

interface HomeProps {
  onSelect: (acao: "login" | "cadastro", tipo: "paciente" | "funcionario") => void;
}

const Home: React.FC<HomeProps> = ({ onSelect }) => {
  const [tipo, setTipo] = useState<"paciente" | "funcionario">("paciente");

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 32, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Bem-vindo!</h2>
      <div style={{ marginBottom: 24 }}>
        <label>
          <input
            type="radio"
            value="paciente"
            checked={tipo === "paciente"}
            onChange={() => setTipo("paciente")}
          />{" "}
          Paciente
        </label>
        <label style={{ marginLeft: 24 }}>
          <input
            type="radio"
            value="funcionario"
            checked={tipo === "funcionario"}
            onChange={() => setTipo("funcionario")}
          />{" "}
          Funcionário
        </label>
      </div>
      <button
        style={{ width: "100%", padding: 12, marginBottom: 12, fontSize: 16 }}
        onClick={() => onSelect("login", tipo)}
      >
        Login
      </button>
      <button
        style={{ width: "100%", padding: 12, fontSize: 16 }}
        onClick={() => onSelect("cadastro", tipo)}
      >
        Cadastro
      </button>
    </div>
  );
};

export default Home;