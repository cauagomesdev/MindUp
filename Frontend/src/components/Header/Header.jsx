import React from "react";
import {Link} from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../context/AuthContext";
import logoMindUp from "../../assets/MindUp svg.svg";
import Button from "../Button/Button";

function Header() {
  const {user, logout} = useAuth();

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
          <Link to="/sobre-nos" className="header-nav-item">Sobre nós</Link>
          <Link to="/suporte" className="header-nav-item">Suporte</Link>
          <Link to="/agendamentos" className="header-nav-item">Agendamentos</Link>
      </nav>

      <div className="header-auth-buttons">
          {user ? (

            <>
              <span className="welcome-message">Olá, {user.email}! </span>
              <Button onClick={logout} className="secondary">Sair</Button>
            </>
          ) : (

            <>
          <Button to="/cadastro" className="secondary">Cadastre-se</Button>
          <Button to="/login" className="primary">Entrar</Button>
            </>

          )}
      </div>

    </header>
  );
}

export default Header;