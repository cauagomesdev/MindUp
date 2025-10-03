import React from "react";
import {Link} from "react-router-dom";
import "./Header.css";

function Header() {
  return (
    <header>
      <a class="logo" href="#">IMAGEM</a>
      <h1>MindUp</h1>
      <p>Seu espaço de acolhimento</p>
      <nav>
        <div class="nav-container">
          <Link to="/">Sobre nós</Link>
          <Link to="/">Suporte</Link>
          <Link to="/">Agendamento</Link>
          <Link to="/">Cadastre-se</Link>
          <Link to="/">Entrar</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;