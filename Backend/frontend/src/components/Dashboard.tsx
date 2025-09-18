import React, { useEffect, useState } from "react";
import PacientesList from "./PacientesList";
import ProfissionaisList from "./ProfissionaisList";

interface DashboardProps {
  usuario: {
    id: string;
    nome: string;
    tipo: "paciente" | "profissional";
    email?: string;
  };
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ usuario, onLogout }) => {
  const [meuPaciente, setMeuPaciente] = useState<any>(null);

  useEffect(() => {
    if (usuario.tipo === "paciente") {
      fetch(`http://localhost:5000/pacientes/listar`)
        .then(res => res.json())
        .then(data => {
          const paciente = data.pacientes.find((p: any) => p.id === usuario.id);
          setMeuPaciente(paciente);
        });
    }
  }, [usuario]);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Bem-vindo, {usuario.nome}!</h2>
        <button onClick={onLogout}>Sair</button>
      </div>
      {usuario.tipo === "profissional" ? (
        <div>
          <h3>Pacientes</h3>
          <PacientesList />
          <h3 style={{ marginTop: 32 }}>Profissionais</h3>
          <ProfissionaisList />
        </div>
      ) : (
        <div>
          <h3>Suas informações</h3>
          {meuPaciente ? (
            <table>
              <tbody>
                <tr><td>Nome:</td><td>{meuPaciente.nome}</td></tr>
                <tr><td>Email:</td><td>{meuPaciente.email}</td></tr>
                <tr><td>Data de Nascimento:</td><td>{meuPaciente.data_nascimento ? new Date(meuPaciente.data_nascimento).toLocaleDateString() : ""}</td></tr>
                <tr><td>Comunidade:</td><td>{meuPaciente.comunidade}</td></tr>
                <tr><td>ID:</td><td>{meuPaciente.id}</td></tr>
              </tbody>
            </table>
          ) : (
            <p>Carregando...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;