import React, { useState, useEffect } from "react";

interface CadastroPacienteProps {
  onVoltar: () => void;
}

interface Comunidade {
  id_comunidade: string;
  nome: string;
  localizacao: string;
}

const CadastroPaciente: React.FC<CadastroPacienteProps> = ({ onVoltar }) => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    endereco: "",
    id_comunidade: "",
  });
  const [comunidades, setComunidades] = useState<Comunidade[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/comunidades/")
      .then(res => res.json())
      .then(data => {
        setComunidades(data.comunidades || []);
      })
      .catch(err => {
        console.error("Erro ao carregar comunidades:", err);
        setErro("Erro ao carregar comunidades. Tente novamente.");
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    
    fetch("http://localhost:8000/pacientes/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          alert("✅ " + (data.message || "Cadastro realizado com sucesso!"));
          onVoltar();
        } else {
          setErro(data.error || "Erro ao cadastrar paciente!");
        }
      })
      .catch(() => {
        setErro("Erro ao conectar ao servidor. Verifique sua conexão.");
      })
      .finally(() => {
        setCarregando(false);
      });
  };

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
        maxWidth: 500, 
        width: "100%",
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        backdropFilter: "blur(10px)"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "30px", 
          color: "#2c3e50",
          fontSize: "2.2rem",
          fontWeight: "700"
        }}>
          👤 Cadastro de Paciente
        </h2>
        
        {erro && (
          <div style={{ 
            color: "#dc3545", 
            backgroundColor: "#f8d7da", 
            border: "1px solid #f5c6cb",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center"
          }}>
            ⚠️ {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input 
            name="nome" 
            placeholder="Nome completo" 
            value={form.nome} 
            onChange={handleChange} 
            required 
            style={{ 
              width: "100%", 
              marginBottom: "15px", 
              padding: "15px",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              transition: "all 0.3s ease"
            }} 
          />
          <input 
            name="email" 
            placeholder="Email" 
            type="email" 
            value={form.email} 
            onChange={handleChange} 
            required 
            style={{ 
              width: "100%", 
              marginBottom: "15px", 
              padding: "15px",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              transition: "all 0.3s ease"
            }} 
          />
          <input 
            name="senha" 
            placeholder="Senha (mínimo 6 caracteres)" 
            type="password" 
            value={form.senha} 
            onChange={handleChange} 
            required 
            minLength={6}
            style={{ 
              width: "100%", 
              marginBottom: "15px", 
              padding: "15px",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              transition: "all 0.3s ease"
            }} 
          />
          <input 
            name="endereco" 
            placeholder="Endereço (opcional)" 
            value={form.endereco} 
            onChange={handleChange} 
            style={{ 
              width: "100%", 
              marginBottom: "15px", 
              padding: "15px",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              transition: "all 0.3s ease"
            }} 
          />
          <select 
            name="id_comunidade" 
            value={form.id_comunidade} 
            onChange={handleChange} 
            required 
            style={{ 
              width: "100%", 
              marginBottom: "25px", 
              padding: "15px",
              border: "2px solid #e9ecef",
              borderRadius: "10px",
              fontSize: "1rem",
              backgroundColor: "white",
              transition: "all 0.3s ease"
            }}
          >
            <option value="">Selecione uma comunidade</option>
            {comunidades.map(c => (
              <option key={c.id_comunidade} value={c.id_comunidade}>
                {c.nome} - {c.localizacao}
              </option>
            ))}
          </select>
          
          <button 
            type="submit" 
            disabled={carregando}
            style={{ 
              width: "100%", 
              padding: "18px",
              background: carregando ? "#95a5a6" : "linear-gradient(135deg, #4ecdc4 0%, #45b7b8 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "700",
              cursor: carregando ? "not-allowed" : "pointer",
              marginBottom: "15px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(78, 205, 196, 0.3)"
            }}
          >
            {carregando ? "⏳ Cadastrando..." : "✅ Cadastrar"}
          </button>
          
          <button 
            type="button" 
            onClick={onVoltar}
            disabled={carregando}
            style={{ 
              width: "100%", 
              padding: "15px",
              background: "transparent",
              color: "#6c757d",
              border: "2px solid #dee2e6",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: carregando ? "not-allowed" : "pointer",
              transition: "all 0.3s ease"
            }}
          >
            ⬅️ Voltar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroPaciente;