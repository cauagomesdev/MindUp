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

  useEffect(() => {
    fetch("http://localhost:8000/usuarios/")
      .then((res) => res.json())
      .then((data) => {
        // Filtrar apenas colaboradores e admins
        const filtrados = data.filter((user: Profissional) => 
          user.nivel_acesso === 'colaborador' || user.nivel_acesso === 'admin'
        );
        setProfissionais(filtrados);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar profissionais:", err);
        setCarregando(false);
      });
  }, []);

  const getNivelColor = (nivel: string) => {
    switch(nivel) {
      case 'admin': return { bg: '#e74c3c', text: 'white' };
      case 'colaborador': return { bg: '#3498db', text: 'white' };
      case 'voluntario': return { bg: '#2ecc71', text: 'white' };
      default: return { bg: '#95a5a6', text: 'white' };
    }
  };

  const getNivelTexto = (nivel: string) => {
    switch(nivel) {
      case 'admin': return '👑 Administrador';
      case 'colaborador': return '👨‍⚕️ Colaborador';
      case 'voluntario': return '🤝 Voluntário';
      default: return nivel;
    }
  };

  if (carregando) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <p>Carregando profissionais...</p>
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
      {profissionais.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#6c5ce7", color: "white" }}>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>👤 Nome de Usuário</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>📧 Email</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>🔑 Nível de Acesso</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>📅 Data de Cadastro</th>
                <th style={{ padding: "15px", textAlign: "left", fontWeight: "600" }}>🆔 ID</th>
              </tr>
            </thead>
            <tbody>
              {profissionais.map((p, index) => (
                <tr 
                  key={p.id_usuario}
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
                    {p.nome_login}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #eee", color: "#666" }}>
                    {p.email}
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: "4px", 
                      backgroundColor: getNivelColor(p.nivel_acesso).bg,
                      color: getNivelColor(p.nivel_acesso).text,
                      fontSize: '0.8em',
                      fontWeight: "500"
                    }}>
                      {getNivelTexto(p.nivel_acesso)}
                    </span>
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
                    {p.id_usuario.split('-')[0]}...
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
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>👨‍⚕️</div>
          <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Nenhum profissional cadastrado</h3>
          <p style={{ margin: 0 }}>Os profissionais do sistema aparecerão aqui.</p>
        </div>
      )}
      
      {profissionais.length > 0 && (
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
          <span>📊 Total: <strong>{profissionais.length}</strong> profissional(is)</span>
          <span>🔄 Atualizado em tempo real</span>
        </div>
      )}
    </div>
  );
};

export default ProfissionaisList;