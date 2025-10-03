import React from "react";

interface NotFoundProps {
  onVoltar: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onVoltar }) => {
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
        maxWidth: "500px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}>
        <div style={{ fontSize: "8rem", marginBottom: "30px" }}>🤔</div>
        
        <h1 style={{
          fontSize: "3rem",
          fontWeight: "700",
          color: "#e74c3c",
          marginBottom: "20px"
        }}>
          404
        </h1>
        
        <h2 style={{
          fontSize: "1.5rem",
          color: "#2c3e50",
          marginBottom: "20px"
        }}>
          Página não encontrada
        </h2>
        
        <p style={{
          fontSize: "1.1rem",
          color: "#6c757d",
          marginBottom: "40px",
          lineHeight: "1.6"
        }}>
          Oops! A página que você está procurando não existe ou foi movida.
        </p>
        
        <button
          onClick={onVoltar}
          style={{
            padding: "15px 30px",
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
          🏠 Voltar ao Início
        </button>
      </div>
    </div>
  );
};

export default NotFound;