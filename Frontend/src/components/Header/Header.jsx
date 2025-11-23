import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { useAuth } from "../../context/AuthContext";
import logoMindUp from "../../assets/MindUp svg.svg";
import Button from "../Button/Button";

function Header() {
  const { user, logout } = useAuth();

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
          {/* O link de agendamentos pode ficar aqui ou ser acessado pelo painel */}
          <Link to="/agendamentos" className="header-nav-item">Agendamentos</Link>
      </nav>

      <div className="header-auth-buttons">
          {user ? (
            <>
              {/* BOTÃO DE PERFIL PERSONALIZADO */}
              <Link to="/perfil" className="header-profile-btn">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="header-profile-icon"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="header-username">
                  {user.nome ? user.nome.split(' ')[0] : "Meu Perfil"}
                </span>
              </Link>

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