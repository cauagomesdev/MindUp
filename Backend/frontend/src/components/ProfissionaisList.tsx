import React, { useEffect, useState } from "react";

interface Profissional {
  id_usuario: string;
  nome_login: string;
  email: string;
  nivel_acesso: string;
  criado_em: string;
}

const ProfissionaisList: React.FC = () => {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const nivelAcessoLabels: Record<string, { label: string; color: string; icon: string }> = {
    admin: { label: "Administrador", color: "#e74c3c", icon: "👑" },
    colaborador: { label: "Colaborador", color: "#6c5ce7", icon: "👨‍⚕️" },
    voluntario: { label: "Voluntário", color: "#2ed573", icon: "🤝" }
  };

  useEffect(() => {
    fetch("http://localhost:8000/usuarios/")
      .then(res => res.json())
      .then(data => {
        setProfissionais(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Erro ao carregar profissionais:", err);
        setErro("Erro ao carregar lista de profissionais.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }, []);

  if (carregando) {
    return (
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
          👨‍⚕️ Profissionais Cadastrados
        </h2>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="loading" style={{ margin: "0 auto 20px" }}></div>
          <p style={{ color: "#6c757d" }}>Carregando profissionais...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
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
          👨‍⚕️ Profissionais Cadastrados
        </h2>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>❌</div>
          <p style={{ color: "#e74c3c", fontSize: "1.1rem" }}>{erro}</p>
        </div>
      </div>
    );
  }

  return (
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
        paddingBottom: "10px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        👨‍⚕️ Profissionais Cadastrados
        <span style={{
          background: "#6c5ce7",
          color: "white",
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "0.9rem",
          fontWeight: "600"
        }}>
          {profissionais.length}
        </span>
      </h2>

      {profissionais.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>👨‍⚕️</div>
          <p style={{ color: "#6c757d", fontSize: "1.1rem" }}>
            Nenhum profissional cadastrado ainda.
          </p>
        </div>
      ) : (
        <div style={{
          maxHeight: "500px",
          overflowY: "auto",
          border: "1px solid #e9ecef",
          borderRadius: "10px"
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse"
          }}>
            <thead>
              <tr style={{ background: "#f8f9fa" }}>
                <th style={{
                  padding: "12px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#495057",
                  borderBottom: "2px solid #dee2e6"
                }}>
                  Usuário
                </th>
                <th style={{
                  padding: "12px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#495057",
                  borderBottom: "2px solid #dee2e6"
                }}>
                  Email
                </th>
                <th style={{
                  padding: "12px",
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#495057",
                  borderBottom: "2px solid #dee2e6"
                }}>
                  Nível
                </th>
              </tr>
            </thead>
            <tbody>
              {profissionais.map((profissional, index) => {
                const nivelInfo = nivelAcessoLabels[profissional.nivel_acesso] || {
                  label: profissional.nivel_acesso,
                  color: "#6c757d",
                  icon: "👤"
                };

                return (
                  <tr key={profissional.id_usuario} style={{
                    transition: "background-color 0.2s ease",
                    backgroundColor: index % 2 === 0 ? "white" : "#f8f9fa"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e3f2fd";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? "white" : "#f8f9fa";
                  }}>
                    <td style={{
                      padding: "12px",
                      borderBottom: "1px solid #dee2e6",
                      fontWeight: "500"
                    }}>
                      {profissional.nome_login}
                    </td>
                    <td style={{
                      padding: "12px",
                      borderBottom: "1px solid #dee2e6",
                      color: "#6c757d"
                    }}>
                      {profissional.email}
                    </td>
                    <td style={{
                      padding: "12px",
                      borderBottom: "1px solid #dee2e6"
                    }}>
                      <span style={{
                        background: nivelInfo.color,
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "15px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}>
                        {nivelInfo.icon} {nivelInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProfissionaisList;