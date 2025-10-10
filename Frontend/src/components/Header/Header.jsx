import React from "react";
import {Link} from "react-router-dom";
import "./Header.css";
import logoMindUp from "../../assets/MindUp svg.svg";

function Header() {
  return (
    <header className="header-container">


      <div className="header-brand">

        <Link to="/" className="header-logo-link">
          <img src={logoMindUp} alt="MindUp Logo - Home" className="header-logo-image"/>
        </Link>

        <div className="header-texts">

          <h1 className="header-title">MindUp</h1>
          <p className="header-tagline">Seu espaço de acolhimento</p>

        </div>
      </div>

      <nav className="header-nav">    
          <Link to="/sobre" className="header-nav-item">Sobre nós</Link>
          <Link to="/suporte" className="header-nav-item">Suporte</Link>
          <Link to="/agendamentos" className="header-nav-item">Agendamentos</Link>
      </nav>

      <div className="header-auth-buttons">
          <Link className="btn primary" to="/cadastro">Cadastre-se</Link>
          <Link className="btn secondary" to="/login">Entrar</Link>      
      </div>

    </header>
  );
}

export default Header;