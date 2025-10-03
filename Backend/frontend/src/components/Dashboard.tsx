import React, { useEffect, useState } from "react";
import PacientesList from "./PacientesList";
import ProfissionaisList from "./ProfissionaisList";

interface DashboardProps {
  usuario: {
    id: string;
    nome: string;
    nivel_acesso: string;
  };
  onLogout: () => void;
  tipo: "paciente" | "profissional";
}

interface Paciente {
  id_paciente: string;
  nome: string;
  email: string;
  endereco: string;
  comunidade_nome?: string;
  criado_em: string;
}

const Dashboard: React.FC<DashboardProps> = ({ usuario, onLogout, tipo }) => {
  const [dadosPaciente, setDadosPaciente] = useState<Paciente | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (tipo === "paciente") {
      // Buscar dados do paciente específico
      fetch("http://localhost:8000/pacientes/listar")
        .then(res => res.json())
        .then(data => {
          const pacientes = data.pacientes || [];
          const pacienteEncontrado = pacientes.find((p: Paciente) => p.id_paciente === usuario.id);
          setDadosPaciente(pacienteEncontrado || null);
        })
        .catch(err => {
          console.error("Erro ao carregar dados do paciente:", err);
        })
        .finally(() => {
          setCarregando(false);
        });
    } else {
      setCarregando(false);
    }
  }, [usuario.id, tipo]);

  if (tipo === "paciente") {
    return (
      <div className="fade-in" style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "15px",
            padding: "30px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            <div>
              <h1 style={{
                color: "#2c3e50",
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "10px"
              }}>
                👤 Painel do Paciente
              </h1>
              <p style={{
                color: "#6c757d",
                fontSize: "1.2rem",
                margin: "0"
              }}>
                Bem-vindo, <strong>{usuario.nome}</strong>!
              </p>
            </div>
            
            <button
              onClick={onLogout}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              🚪 Sair
            </button>
          </div>

          {/* Dados do Paciente */}
          <div style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "15px",
            padding: "30px",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{
              color: "#2c3e50",
              fontSize: "1.8rem",
              fontWeight: "600",
              marginBottom: "25px",
              borderBottom: "2px solid #4ecdc4",
              paddingBottom: "10px"
            }}>
              📋 Meus Dados
            </h2>

            {carregando ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div className="loading" style={{ margin: "0 auto 20px" }}></div>
                <p style={{ color: "#6c757d" }}>Carregando seus dados...</p>
              </div>
            ) : dadosPaciente ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px"
              }}>
                <div style={{
                  padding: "20px",
                  background: "linear-gradient(135deg, #4ecdc4 0%, #45b7b8 100%)",
                  borderRadius: "10px",
                  color: "white"
                }}>
                  <h3 style={{ color: "white", marginBottom: "10px" }}>👤 Nome</h3>
                  <p style={{ fontSize: "1.1rem", margin: "0" }}>{dadosPaciente.nome}</p>
                </div>

                <div style={{
                  padding: "20px",
                  background: "linear-gradient(135deg, #6c5ce7 0%, #5f4fcf 100%)",
                  borderRadius: "10px",
                  color: "white"
                }}>
                  <h3 style={{ color: "white", marginBottom: "10px" }}>📧 Email</h3>
                  <p style={{ fontSize: "1.1rem", margin: "0" }}>{dadosPaciente.email}</p>
                </div>

                <div style={{
                  padding: "20px",
                  background: "linear-gradient(135deg, #2ed573 0%, #17a2b8 100%)",
                  borderRadius: "10px",
                  color: "white"
                }}>
                  <h3 style={{ color: "white", marginBottom: "10px" }}>🏠 Endereço</h3>
                  <p style={{ fontSize: "1.1rem", margin: "0" }}>
                    {dadosPaciente.endereco || "Não informado"}
                  </p>
                </div>

                <div style={{
                  padding: "20px",
                  background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
                  borderRadius: "10px",
                  color: "white"
                }}>
                  <h3 style={{ color: "white", marginBottom: "10px" }}>🏘️ Comunidade</h3>
                  <p style={{ fontSize: "1.1rem", margin: "0" }}>
                    {dadosPaciente.comunidade_nome || "Não informado"}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div style={{ fontSize: "3rem", marginBottom: "20px" }}>❌</div>
                <p style={{ color: "#e74c3c", fontSize: "1.1rem" }}>
                  Não foi possível carregar seus dados.
                </p>
              </div>
            )}
          </div>

          {/* Próximas funcionalidades */}
          <div style={{
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "15px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{
              color: "#2c3e50",
              fontSize: "1.8rem",
              fontWeight: "600",
              marginBottom: "25px",
              borderBottom: "2px solid #6c5ce7",
              paddingBottom: "10px"
            }}>
              🚀 Próximas Funcionalidades
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px"
            }}>
              {[
                { icon: "📅", titulo: "Agendamentos", desc: "Agende consultas" },
                { icon: "💬", titulo: "Chat", desc: "Converse com profissionais" },
                { icon: "📊", titulo: "Relatórios", desc: "Acompanhe seu progresso" },
                { icon: "📚", titulo: "Recursos", desc: "Material educativo" }
              ].map((item, index) => (
                <div key={index} style={{
                  padding: "20px",
                  background: "#f8f9fa",
                  borderRadius: "10px",
                  textAlign: "center",
                  border: "2px dashed #dee2e6"
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{item.icon}</div>
                  <h4 style={{ color: "#2c3e50", marginBottom: "5px" }}>{item.titulo}</h4>
                  <p style={{ color: "#6c757d", fontSize: "0.9rem", margin: "0" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Profissional
  return (
    <div className="fade-in" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "15px",
          padding: "30px",
          marginBottom: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap"
        }}>
          <div>
            <h1 style={{
              color: "#2c3e50",
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "10px"
            }}>
              👨‍⚕️ Painel Administrativo
            </h1>
            <p style={{
              color: "#6c757d",
              fontSize: "1.2rem",
              margin: "0"
            }}>
              Bem-vindo, <strong>{usuario.nome}</strong> - {usuario.nivel_acesso}
            </p>
          </div>
          
          <button
            onClick={onLogout}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(231, 76, 60, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            🚪 Sair
          </button>
        </div>

        {/* Listas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
          gap: "30px"
        }}>
          <PacientesList />
          <ProfissionaisList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;