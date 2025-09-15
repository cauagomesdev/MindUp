import React, { useEffect, useState } from "react";

interface Paciente {
  id: string;
  nome: string;
  email: string;
  data_nascimento: string;
  comunidade: string;
}

const PacientesList: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/pacientes/")
      .then((res) => res.json())
      .then((data) => setPacientes(data.pacientes))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Lista de Pacientes</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>Nome</th>
            <th style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>Email</th>
            <th style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>Data de Nascimento</th>
            <th style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>Comunidade</th>
            <th style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>ID</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.id}>
              <td style={{ borderBottom: "1px solid #eee" }}>{p.nome}</td>
              <td style={{ borderBottom: "1px solid #eee" }}>{p.email}</td>
              <td style={{ borderBottom: "1px solid #eee" }}>
                {p.data_nascimento ? new Date(p.data_nascimento).toLocaleDateString() : ""}
              </td>
              <td style={{ borderBottom: "1px solid #eee" }}>{p.comunidade}</td>
              <td style={{ borderBottom: "1px solid #eee", fontSize: "0.8em" }}>{p.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {pacientes.length === 0 && <p>Nenhum paciente cadastrado.</p>}
    </div>
  );
};

export default PacientesList;