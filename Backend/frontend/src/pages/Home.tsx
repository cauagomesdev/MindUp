import React from "react";

interface HomeProps {
  onCadastrarPaciente: () => void;
  onCadastrarProfissional: () => void;
  onLoginPaciente: () => void;
  onLoginFuncionario: () => void;
}

const Home: React.FC<HomeProps> = ({
  onCadastrarPaciente,
  onCadastrarProfissional,
  onLoginPaciente,
  onLoginFuncionario,
}) => {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh",
      padding: "20px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white"
    }}>
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: "500px",
        color: "#333"
      }}>
        <h1 style={{ 
          fontSize: "3rem", 
          marginBottom: "10px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold"
        }}>
          MindUp
        </h1>
        <p style={{ 
          fontSize: "1.2rem", 
          marginBottom: "40px", 
          color: "#666",
          lineHeight: "1.6"
        }}>
          Plataforma de Saúde Mental Comunitária
        </p>

        <div style={{ display: "grid", gap: "15px", marginBottom: "30px" }}>
          <h3 style={{ color: "#333", marginBottom: "20px" }}>Cadastro</h3>
          
          <button
            onClick={onCadastrarPaciente}
            style={{
              padding: "15px 30px",
              fontSize: "1.1rem",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "#4ecdc4",
              color: "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontWeight: "600"
            }}
          >
            👤 Cadastrar como Paciente
          </button>

          <button
            onClick={onCadastrarProfissional}
            style={{
              padding: "15px 30px",
              fontSize: "1.1rem",
              border: "none",
              borderRadius: "10px",
              backgroundColor: "#6c5ce7",
              color: "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontWeight: "600"
            }}
          >
            👨‍⚕️ Cadastrar como Profissional
          </button>
        </div>

        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px" }}>
          <h3 style={{ color: "#333", marginBottom: "20px" }}>Já possui conta?</h3>
          
          <div style={{ display: "grid", gap: "15px" }}>
            <button
              onClick={onLoginPaciente}
              style={{
                padding: "12px 30px",
                fontSize: "1rem",
                border: "2px solid #4ecdc4",
                borderRadius: "10px",
                backgroundColor: "transparent",
                color: "#4ecdc4",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontWeight: "600"
              }}
            >
              🔐 Login Paciente
            </button>

            <button
              onClick={onLoginFuncionario}
              style={{
                padding: "12px 30px",
                fontSize: "1rem",
                border: "2px solid #6c5ce7",
                borderRadius: "10px",
                backgroundColor: "transparent",
                color: "#6c5ce7",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontWeight: "600"
              }}
            >
              🔑 Login Funcionário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;