import React, { useEffect, useState } from "react";

interface Profissional {
  id: string;
  nome: string;
  email: string;
  especialidade: string;
}

const ProfissionaisList: React.FC = () => {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/profissionais/listar")
      .then((res) => res.json())
      .then((data) => setProfissionais(data.profissionais))
      .catch((err) => console.error(err));
  }, []);
  
  return (
    <div>
      <h1>Lista de Profissionais</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>Nome</th>
            <th style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>Email</th>
            <th style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>Especialidade</th>
            <th style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>ID</th>
          </tr>
        </thead>
        <tbody>
          {profissionais.map((p) => (
            <tr key={p.id}>
              <td style={{ borderBottom: "1px solid #eee" }}>{p.nome}</td>
              <td style={{ borderBottom: "1px solid #eee" }}>{p.email}</td>
              <td style={{ borderBottom: "1px solid #eee" }}>{p.especialidade}</td>
              <td style={{ borderBottom: "1px solid #eee", fontSize: "0.8em" }}>{p.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {profissionais.length === 0 && <p>Nenhum profissional cadastrado.</p>}
    </div>
  );
};

export default ProfissionaisList;