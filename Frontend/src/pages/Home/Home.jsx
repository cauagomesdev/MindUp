import React from 'react';
import {Link} from "react-router-dom";
import "./Home.css";
import imgroda from "../../assets/roda de conversa startup.webp";


function Home() { 
  return (
    <main className='home-container'>

    <div className='home-main'>
      <Link to='/' className='home-img-link'>
        <img src={imgroda} alt="home-img-roda" className="home-img"/>
      </Link>

      <div className='home-main-components'>
        <div className='home-main-text'>
            <h1>Agende no seu calendário uma consulta psicólogica</h1>
        </div>

        <div className='home-main-buttons'>
          <Link to="/">Agendar consulta</Link>
          <Link to="/">Ver evolução</Link>
        </div>
      </div>
    </div>
        <div className='home-footer'>
          <p>presencial</p>
          <p>acessibilidae</p>
          <p>inclusivo</p>
        </div>

    </main>

  );
}

export default Home; 