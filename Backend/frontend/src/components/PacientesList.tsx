import React, { useEffect, useState } from "react";

interface Paciente {
  id_paciente: string;
  nome: string;
  email: string;
  endereco: string;
  comunidade_nome: string;
  criado_em: string;
}

const PacientesList: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/pacientes/listar")
      .then((res) => res.json())
      .then((data) => {
        setPacientes(data.pacientes);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar pacientes:", err);
        setCarregando(false);
      });
  }, []);

  if (carregando) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p>Carregando pacientes...</p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      overflow: "hidden"
    }}>
      {pacientes.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#4ecdc4", color: "white" }}>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>👤 Nome</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>📧 Email</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>🏠 Endereço</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>🏘️ Comunidade</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>📅 Cadastro</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>🆔 ID</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p, index) => (
                <tr 
                  key={p.id_paciente}
                  style={{ 
                    backgroundColor: index % 2 === 0 ? "#f8f9fa" : "white",
                    transition: "background-color 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#e3f2fd";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f8f9fa" : "white";
                  }}
                >
                  <td style={{ padding: "12px", borderBottom: "1px solid #eee", fontWeight: "500" }}>
                    {p.nome}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #eee", color: "#666" }}>
                    {p.email}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #eee", color: "#666" }}>
                    {p.endereco || "Não informado"}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                    {p.comunidade_nome ? (
                      <span style={{
                        padding: "4px 8px",
                        backgroundColor: "#4ecdc4",
                        color: "white",
                        borderRadius: "4px",
                        fontSize: "0.8em",
                        fontWeight: "500"
                      }}>
                        {p.comunidade_nome}
                      </span>
                    ) : (
                      <span style={{ color: "#999", fontStyle: "italic" }}>Não informada</span>
                    )}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #eee", color: "#666" }}>
                    {p.criado_em ? new Date(p.criado_em).toLocaleDateString('pt-BR') : "N/A"}
                  </td>
                  <td style={{ 
                    padding: "12px", 
                    borderBottom: "1px solid #eee", 
                    fontSize: "0.7em", 
                    color: "#999",
                    fontFamily: "monospace",
                    maxWidth: "100px",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {p.id_paciente.split('-')[0]}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ 
          padding: "40px", 
          textAlign: "center",
          color: "#666"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>👥</div>
          <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Nenhum paciente cadastrado</h3>
          <p style={{ margin: 0 }}>Os pacientes cadastrados aparecerão aqui.</p>
        </div>
      )}
      
      {pacientes.length > 0 && (
        <div style={{ 
          padding: "15px 20px", 
          backgroundColor: "#f8f9fa", 
          borderTop: "1px solid #eee",
          fontSize: "0.9em",
          color: "#666",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span>📊 Total: <strong>{pacientes.length}</strong> paciente(s)</span>
          <span>🔄 Atualizado em tempo real</span>
        </div>
      )}
    </div>
  );
};

export default PacientesList;