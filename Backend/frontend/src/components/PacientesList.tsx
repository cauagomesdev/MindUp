import React, { useEffect, useState } from "react";

interface Paciente {
  id_paciente: string;
  nome: string;
  email: string;
  endereco: string;
  comunidade_nome?: string;
  criado_em: string;
}

const PacientesList: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/pacientes/listar")
      .then(res => res.json())
      .then(data => {
        setPacientes(data.pacientes || []);
      })
      .catch(err => {
        console.error("Erro ao carregar pacientes:", err);
        setErro("Erro ao carregar lista de pacientes.");
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
          borderBottom: "2px solid #4ecdc4",
          paddingBottom: "10px"
        }}>
          👥 Pacientes Cadastrados
        </h2>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="loading" style={{ margin: "0 auto 20px" }}></div>
          <p style={{ color: "#6c757d" }}>Carregando pacientes...</p>
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
          borderBottom: "2px solid #4ecdc4",
          paddingBottom: "10px"
        }}>
          👥 Pacientes Cadastrados
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
        borderBottom: "2px solid #4ecdc4",
        paddingBottom: "10px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}>
        👥 Pacientes Cadastrados
        <span style={{
          background: "#4ecdc4",
          color: "white",
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "0.9rem",
          fontWeight: "600"
        }}>
          {pacientes.length}
        </span>
      </h2>

      {pacientes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>👤</div>
          <p style={{ color: "#6c757d", fontSize: "1.1rem" }}>
            Nenhum paciente cadastrado ainda.
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
                  Nome
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
                  Comunidade
                </th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente, index) => (
                <tr key={paciente.id_paciente} style={{
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
                    {paciente.nome}
                  </td>
                  <td style={{
                    padding: "12px",
                    borderBottom: "1px solid #dee2e6",
                    color: "#6c757d"
                  }}>
                    {paciente.email}
                  </td>
                  <td style={{
                    padding: "12px",
                    borderBottom: "1px solid #dee2e6",
                    color: "#6c757d"
                  }}>
                    {paciente.comunidade_nome || "Não informado"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PacientesList;