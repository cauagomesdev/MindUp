import React from "react";

interface HomeProps {
  onNavigate: (tela: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="fade-in" style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "60px 40px",
        maxWidth: "800px",
        width: "100%",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        backdropFilter: "blur(10px)"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <div style={{
            fontSize: "4rem",
            marginBottom: "20px"
          }}>🧠</div>
          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: "700",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "15px"
          }}>
            MindUp
          </h1>
          <p style={{
            fontSize: "1.3rem",
            color: "#6c757d",
            fontWeight: "500",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            Plataforma de saúde mental comunitária que conecta pessoas, 
            profissionais e comunidades para um cuidado integral e humanizado.
          </p>
        </div>

        {/* Features */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
          marginBottom: "50px"
        }}>
          <div style={{
            textAlign: "center",
            padding: "30px 20px",
            background: "linear-gradient(135deg, #4ecdc4 0%, #45b7b8 100%)",
            borderRadius: "15px",
            color: "white",
            transform: "translateY(0)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>👥</div>
            <h3 style={{ color: "white", marginBottom: "10px" }}>Comunidade</h3>
            <p style={{ opacity: 0.9 }}>Conecte-se com sua comunidade local</p>
          </div>

          <div style={{
            textAlign: "center",
            padding: "30px 20px",
            background: "linear-gradient(135deg, #6c5ce7 0%, #5f4fcf 100%)",
            borderRadius: "15px",
            color: "white",
            transform: "translateY(0)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>👨‍⚕️</div>
            <h3 style={{ color: "white", marginBottom: "10px" }}>Profissionais</h3>
            <p style={{ opacity: 0.9 }}>Acesso a profissionais qualificados</p>
          </div>

          <div style={{
            textAlign: "center",
            padding: "30px 20px",
            background: "linear-gradient(135deg, #2ed573 0%, #17a2b8 100%)",
            borderRadius: "15px",
            color: "white",
            transform: "translateY(0)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📊</div>
            <h3 style={{ color: "white", marginBottom: "10px" }}>Acompanhamento</h3>
            <p style={{ opacity: 0.9 }}>Monitore seu progresso</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "40px"
        }}>
          <button
            onClick={() => onNavigate("cadastro-paciente")}
            style={{
              padding: "18px 30px",
              fontSize: "1.1rem",
              fontWeight: "600",
              background: "linear-gradient(135deg, #4ecdc4 0%, #45b7b8 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(78, 205, 196, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(78, 205, 196, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(78, 205, 196, 0.3)";
            }}
          >
            👤 Sou Paciente
          </button>

          <button
            onClick={() => onNavigate("cadastro-profissional")}
            style={{
              padding: "18px 30px",
              fontSize: "1.1rem",
              fontWeight: "600",
              background: "linear-gradient(135deg, #6c5ce7 0%, #5f4fcf 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(108, 92, 231, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(108, 92, 231, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(108, 92, 231, 0.3)";
            }}
          >
            👨‍⚕️ Sou Profissional
          </button>
        </div>

        {/* Login Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => onNavigate("login")}
            style={{
              padding: "15px 40px",
              fontSize: "1.1rem",
              fontWeight: "600",
              background: "transparent",
              color: "#6c757d",
              border: "2px solid #dee2e6",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#4ecdc4";
              e.currentTarget.style.color = "#4ecdc4";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#dee2e6";
              e.currentTarget.style.color = "#6c757d";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            🔐 Já tenho conta - Fazer Login
          </button>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          marginTop: "50px",
          paddingTop: "30px",
          borderTop: "1px solid #e9ecef"
        }}>
          <p style={{
            color: "#6c757d",
            fontSize: "0.9rem",
            margin: "0"
          }}>
            💚 Cuidando da saúde mental comunitária com tecnologia e humanização
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;