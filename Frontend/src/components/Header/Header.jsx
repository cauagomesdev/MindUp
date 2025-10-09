import React from "react";
import {Link} from "react-router-dom";
import "./Header.css";
import logoMindUp from "../../assets/MindUp svg.svg";

function Header() {
  return (
    <header className="header-container">

      <Link to="/" className="header-logo-link">

      <img src={logoMindUp} alt="MindUp Logo - Home" className="header-logo-image"/>


      </Link>

      <div className="header-texts">

      <h1 className="header-title">MindUp</h1>
      <p>Seu espaço de acolhimento</p>
      <p>_______________________</p>
      </div>

      <nav className="header-nav">    
          <Link to="/">Sobre nós</Link>
          <Link to="/">Suporte</Link>
          <Link to="/">Agendamentos</Link>
          <Link className="register" to="/">Cadastre-se</Link>
          <Link className="login" to="/">Entrar</Link>      
      </nav>

    </header>
  );
}

export default Header;