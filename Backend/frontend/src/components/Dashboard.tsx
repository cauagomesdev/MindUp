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

interface PacienteData {
  id_paciente: string;
  nome: string;
  email: string;
  endereco: string;
  comunidade_nome: string;
  criado_em: string;
}

const Dashboard: React.FC<DashboardProps> = ({ usuario, onLogout }) => {
  const [meuPaciente, setMeuPaciente] = useState<PacienteData | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (usuario.tipo === "paciente" && usuario.email) {
      setCarregando(true);
      setErro("");
      
      // Buscar paciente pelo email em vez do ID
      fetch(`http://localhost:8000/pacientes/listar`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log("Dados recebidos:", data); // Debug - pode remover depois
          
          if (data && data.pacientes && Array.isArray(data.pacientes)) {
            const paciente = data.pacientes.find((p: PacienteData) => 
              p.email === usuario.email
            );
            
            if (paciente) {
              setMeuPaciente(paciente);
            } else {
              setErro("Paciente não encontrado na base de dados.");
            }
          } else {
            setErro("Formato de dados inesperado.");
          }
        })
        .catch(err => {
          console.error("Erro ao carregar dados do paciente:", err);
          setErro("Erro ao carregar informações. Tente novamente.");
        })
        .finally(() => {
          setCarregando(false);
        });
    }
  }, [usuario]);

  return (
    <div style={{ maxWidth: 1200, margin: "20px auto", padding: "20px" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "30px",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <div>
          <h2 style={{ margin: 0, color: "#333" }}>Bem-vindo, {usuario.nome}!</h2>
          <p style={{ margin: "5px 0", color: "#666" }}>
            {usuario.tipo === "profissional" ? "Painel Administrativo" : "Área do Paciente"}
          </p>
        </div>
        <button 
          onClick={onLogout} 
          style={{ 
            padding: "10px 20px", 
            backgroundColor: "#e74c3c", 
            color: "white", 
            border: "none", 
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#c0392b";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#e74c3c";
          }}
        >
          🚪 Sair
        </button>
      </div>
      
      {usuario.tipo === "profissional" ? (
        <div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "30px",
            marginBottom: "30px"
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ color: "#4ecdc4", marginBottom: "20px" }}>📊 Estatísticas</h3>
              <div style={{ display: "grid", gap: "10px" }}>
                <div style={{ padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                  <strong>Pacientes Cadastrados:</strong> <span style={{color: "#4ecdc4"}}>Em tempo real</span>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                  <strong>Atendimentos Hoje:</strong> <span style={{color: "#6c5ce7"}}>0</span>
                </div>
                <div style={{ padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                  <strong>Comunidades Ativas:</strong> <span style={{color: "#2ed573"}}>3</span>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{ color: "#6c5ce7", marginBottom: "20px" }}>🔗 Links Rápidos</h3>
              <div style={{ display: "grid", gap: "10px" }}>
                <button 
                  style={{
                    padding: "10px",
                    backgroundColor: "#4ecdc4",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onClick={() => alert("Funcionalidade em desenvolvimento")}
                >
                  📋 Novo Atendimento
                </button>
                <button 
                  style={{
                    padding: "10px",
                    backgroundColor: "#6c5ce7",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onClick={() => alert("Funcionalidade em desenvolvimento")}
                >
                  📅 Agenda do Dia
                </button>
                <a 
                  href="http://localhost:8000/admin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    padding: "10px",
                    backgroundColor: "#ff6b6b",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "5px",
                    textAlign: "center",
                    display: "block",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#ff5252";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#ff6b6b";
                  }}
                >
                  ⚙️ Admin Django
                </a>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#333", marginBottom: "20px" }}>👥 Pacientes Cadastrados</h3>
            <PacientesList />
          </div>
          
          <div>
            <h3 style={{ color: "#333", marginBottom: "20px" }}>👨‍⚕️ Profissionais do Sistema</h3>
            <ProfissionaisList />
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ color: "#4ecdc4", marginBottom: "20px" }}>📋 Suas Informações</h3>
          
          {carregando ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "20px" }}>⏳</div>
              <p>Carregando suas informações...</p>
            </div>
          ) : erro ? (
            <div style={{ 
              padding: "20px",
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              borderRadius: "8px",
              color: "#721c24"
            }}>
              <p style={{ margin: 0 }}>
                ⚠️ {erro}
              </p>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                🔄 Tentar Novamente
              </button>
            </div>
          ) : meuPaciente ? (
            <div style={{ marginTop: 16 }}>
              <table style={{ 
                borderCollapse: "collapse", 
                width: "100%",
                backgroundColor: "white",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
              }}>
                <tbody>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <td style={{ padding: "15px", fontWeight: "bold", borderBottom: "1px solid #eee", width: "200px" }}>
                      👤 Nome:
                    </td>
                    <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
                      {meuPaciente.nome}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "15px", fontWeight: "bold", borderBottom: "1px solid #eee", backgroundColor: "#f8f9fa" }}>
                      📧 Email:
                    </td>
                    <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
                      {meuPaciente.email}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <td style={{ padding: "15px", fontWeight: "bold", borderBottom: "1px solid #eee" }}>
                      🏠 Endereço:
                    </td>
                    <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
                      {meuPaciente.endereco || "Não informado"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "15px", fontWeight: "bold", borderBottom: "1px solid #eee", backgroundColor: "#f8f9fa" }}>
                      🏘️ Comunidade:
                    </td>
                    <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
                      {meuPaciente.comunidade_nome || "Não informada"}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <td style={{ padding: "15px", fontWeight: "bold", borderBottom: "1px solid #eee" }}>
                      📅 Data de Cadastro:
                    </td>
                    <td style={{ padding: "15px", borderBottom: "1px solid #eee" }}>
                      {meuPaciente.criado_em ? 
                        new Date(meuPaciente.criado_em).toLocaleDateString('pt-BR') : 
                        "Não disponível"
                      }
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "15px", fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
                      🆔 ID:
                    </td>
                    <td style={{ 
                      padding: "15px", 
                      fontSize: "0.8em", 
                      color: "#666", 
                      fontFamily: "monospace",
                      wordBreak: "break-all"
                    }}>
                      {meuPaciente.id_paciente}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ 
                marginTop: "30px",
                padding: "20px",
                backgroundColor: "#e8f8f5",
                borderRadius: "8px",
                borderLeft: "4px solid #4ecdc4"
              }}>
                <h4 style={{ color: "#4ecdc4", marginBottom: "10px" }}>💚 Próximos Passos</h4>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#666" }}>
                  <li>Aguarde contato da equipe para agendamento</li>
                  <li>Mantenha seus dados atualizados</li>
                  <li>Participe das atividades comunitárias</li>
                </ul>
              </div>
            </div>
          ) : (
            <div style={{ 
              padding: "20px",
              backgroundColor: "#fff3cd",
              borderRadius: "8px",
              borderLeft: "4px solid #ffc107"
            }}>
              <p style={{ margin: 0, color: "#856404" }}>
                ⚠️ Suas informações não foram encontradas. Faça login novamente ou entre em contato com o suporte.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;