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

  // Carregar comunidades do backend
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
    setErro(""); // Limpar erro ao digitar
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
    <div style={{ 
      maxWidth: 500, 
      margin: "40px auto", 
      padding: "30px",
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        👤 Cadastro de Paciente
      </h2>
      
      {erro && (
        <div style={{ 
          color: "#dc3545", 
          backgroundColor: "#f8d7da", 
          border: "1px solid #f5c6cb",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "20px"
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
            padding: "12px",
            border: "2px solid #e9ecef",
            borderRadius: "8px",
            fontSize: "1rem"
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
            padding: "12px",
            border: "2px solid #e9ecef",
            borderRadius: "8px",
            fontSize: "1rem"
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
            padding: "12px",
            border: "2px solid #e9ecef",
            borderRadius: "8px",
            fontSize: "1rem"
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
            padding: "12px",
            border: "2px solid #e9ecef",
            borderRadius: "8px",
            fontSize: "1rem"
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
            padding: "12px",
            border: "2px solid #e9ecef",
            borderRadius: "8px",
            fontSize: "1rem",
            backgroundColor: "white"
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
            padding: "15px",
            backgroundColor: carregando ? "#95a5a6" : "#4ecdc4",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: carregando ? "not-allowed" : "pointer",
            marginBottom: "10px"
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
            padding: "12px",
            backgroundColor: "#95a5a6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: carregando ? "not-allowed" : "pointer"
          }}
        >
          ⬅️ Voltar
        </button>
      </form>
    </div>
  );
};

export default CadastroPaciente;