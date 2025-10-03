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
      // Buscar paciente pelo ID específico retornado do login
      fetch(`http://localhost:8000/pacientes/listar`)
        .then(res => res.json())
        .then(data => {
          // Buscar pelo ID retornado do login
          const paciente = data.pacientes.find((p: any) => p.id_paciente === usuario.id);
          setMeuPaciente(paciente);
        })
        .catch(err => console.error("Erro ao carregar dados do paciente:", err));
    }
  }, [usuario]);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Bem-vindo, {usuario.nome}!</h2>
        <button onClick={onLogout} style={{ padding: "8px 16px" }}>Sair</button>
      </div>
      
      {usuario.tipo === "profissional" ? (
        <div>
          <h3>Painel Administrativo</h3>
          <div style={{ marginBottom: 32 }}>
            <h4>Pacientes Cadastrados</h4>
            <PacientesList />
          </div>
          <div>
            <h4>Profissionais do Sistema</h4>
            <ProfissionaisList />
          </div>
        </div>
      ) : (
        <div>
          <h3>Suas Informações</h3>
          {meuPaciente ? (
            <div style={{ marginTop: 16 }}>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "8px", fontWeight: "bold", borderBottom: "1px solid #eee" }}>Nome:</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{meuPaciente.nome}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", fontWeight: "bold", borderBottom: "1px solid #eee" }}>Email:</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{meuPaciente.email}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", fontWeight: "bold", borderBottom: "1px solid #eee" }}>Endereço:</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{meuPaciente.endereco || "Não informado"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", fontWeight: "bold", borderBottom: "1px solid #eee" }}>Comunidade:</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>{meuPaciente.comunidade_nome || "Não informada"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", fontWeight: "bold", borderBottom: "1px solid #eee" }}>Data de Cadastro:</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                      {meuPaciente.criado_em ? new Date(meuPaciente.criado_em).toLocaleDateString('pt-BR') : "Não disponível"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "8px", fontWeight: "bold" }}>ID:</td>
                    <td style={{ padding: "8px", fontSize: "0.8em", color: "#666" }}>{meuPaciente.id_paciente}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p>Carregando suas informações...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;