import React from "react";

interface NotFoundProps {
  onVoltar: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onVoltar }) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
      color: "white",
      textAlign: "center",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "60px 40px",
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        color: "#333",
        maxWidth: "500px"
      }}>
        <div style={{ fontSize: "8rem", marginBottom: "20px" }}>🤔</div>
        
        <h1 style={{ 
          fontSize: "4rem", 
          marginBottom: "20px", 
          color: "#ff6b6b",
          fontWeight: "bold"
        }}>
          404
        </h1>
        
        <h2 style={{ 
          fontSize: "2rem", 
          marginBottom: "20px", 
          color: "#333",
          fontWeight: "600"
        }}>
          Página não encontrada
        </h2>
        
        <p style={{ 
          fontSize: "1.2rem", 
          marginBottom: "40px", 
          color: "#666",
          lineHeight: "1.6"
        }}>
          Ops! A página que você está procurando não existe ou foi movida.
        </p>
        
        <div style={{
          padding: "20px",
          backgroundColor: "#fff3cd",
          borderRadius: "8px",
          marginBottom: "30px",
          borderLeft: "4px solid #ffc107"
        }}>
          <p style={{ margin: 0, color: "#856404" }}>
            💡 <strong>Dica:</strong> Verifique se digitou o endereço corretamente ou use o botão abaixo para voltar ao início.
          </p>
        </div>
        
        <button
          onClick={onVoltar}
          style={{
            padding: "15px 30px",
            fontSize: "1.1rem",
            border: "none",
            borderRadius: "10px",
            backgroundColor: "#4ecdc4",
            color: "white",
            cursor: "pointer",
            transition: "all 0.3s ease",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(78, 205, 196, 0.3)"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#45b7b8";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(78, 205, 196, 0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#4ecdc4";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(78, 205, 196, 0.3)";
          }}
        >
          🏠 Voltar ao Início
        </button>

        <div style={{ 
          marginTop: "30px", 
          fontSize: "0.9rem", 
          color: "#999",
          borderTop: "1px solid #eee",
          paddingTop: "20px"
        }}>
          <p style={{ margin: 0 }}>
            Se você acredita que isso é um erro, entre em contato com nossa equipe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;