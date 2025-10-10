import React from 'react';
import {Link} from "react-router-dom";
import "./Home.css";
import imgroda from "../../assets/roda de conversa startup.webp";


function Home() { 
  return (
    <main className='home-container'>

    <section className='home-section'>

        <div className='home-img-wrapper'>
          <img src={imgroda} alt="home-img-roda" className="home-img"/>
        </div>
        
      <div className='home-content'>
        <div className='home-text'>
          <h1>Cuidar da mente é prioridade. <br/> A MindUp leva o apoio de forma eficaz.</h1>
          <p>Conectamos a população à psicólogos voluntários em comunidades, oferecendo atendimento humanizado e acessível.
             De forma presencial e com o suporte da nossa plataforma digital.
             Faça já o agendamento ou veja a evolução:
          </p>
        </div>

        <div className='home-buttons'>
          <Link to="/agendamentos" className='btn primary'>Agendar Consulta</Link>
          <Link to="/pacientes/evolucao" className='btn secondary'>Acompanhar evolução</Link>
        </div>
      </div>

    </section>

    <section className='value-section'>

       <div className='value-item'>
          <p className='icon'>📍</p>
          <h3>Presencial</h3>
          <p>Acolhimento direto na comunidade.</p>
        </div>

        <div className='value-item'>
          <p className='icon'>📱</p>
          <h3>Digital</h3>
          <p>Organização e suporte online facilitado.</p>
        </div>

        <div className='value-item'>
          <p className='icon'>🤝</p>
          <h3>Inclusivo</h3>
          <p>Cuidado humanizado para todos.</p>
        </div>

    </section>

    </main>

  );
}

export default Home; 