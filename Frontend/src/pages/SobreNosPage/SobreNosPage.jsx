import React from 'react';
import "./SobreNosPage.css";
import imgequipe from "../../assets/fotoequipe.jpeg";
import imgsobre from "../../assets/img-sobre-nos.png";

const IconMissao = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);
const IconHistoria = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);
const IconValores = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 12.75l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 002.456-2.456L18 12.75z" />
  </svg>
);

function SobreNosPage() {
  return (
    <main className='sobre-nos-container'>

      <section className='sobre-nos-content'>
          <img src={imgsobre} alt="imagem do SOBRE NÓS MindUp" className='img-sobre-nos'/>
      </section>

      <section className='sobre-nos-text'>
            <h2>SOBRE NÓS</h2>
            <p>
                Nossa missão é democratizar o acesso à saúde mental em comunidades
                periféricas, conectando voluntários universitários a quem mais precisa
                através de um modelo de acolhimento híbrido (presencial e digital).
            </p>
      </section>

      <section className='img-equipe-section'>
            <img src={imgequipe} alt="imagem da equipe MindUp" className='img-equipe'/>
      </section>

      <section className="sobre-nos-equipe">
                <h2>Nossa Equipe</h2>
                <div className="equipe-grid">
                    
                    <div className="membro-card">
                        <h4>Cauã Aguiar</h4>
                        <p>Frontend & Líder da Startup</p>
                    </div>
                    
                    <div className="membro-card">
                        <h4>Amanda Mendes</h4>
                        <p>Documentação, LGPD & Vice Líder</p>
                    </div>
                    
                    <div className="membro-card">
                        <h4>Henrique Adson</h4>
                        <p>Backend</p>
                    </div>
                    
                    <div className="membro-card">
                        <h4>Gabriel Tavares</h4>
                        <p>Backend</p>
                    </div>
                    
                    <div className="membro-card">
                        <h4>Carlos Eduardo Lima</h4>
                        <p>Frontend</p>
                    </div>
                    
                    <div className="membro-card">
                        <h4>Bruno Ramiro</h4>
                        <p>Banco de Dados</p>
                    </div>
                    
                    <div className="membro-card">
                        <h4>Everson Lima</h4>
                        <p>Banco de Dados</p>
                    </div>
                    
                </div>
      </section>

      <section className='sobre-nos-values-section'>

          <div className='value-card'>
            <IconMissao/>
            <h3>Nossa Missão</h3>
            <p>
              Levar acolhimento psicológico acessível e de qualidade para todos, 
              quebrando barreiras geográficas e financeiras.
            </p>
          </div>

          <div className='value-card'>
            <IconHistoria/>
            <h3>Nossa História</h3>
            <p>
              Nascemos de um projeto universitário na UCB com o objetivo de 
              causar um impacto real e positivo na saúde mental da nossa comunidade.
            </p>
          </div>

          <div className='value-card'>
            <IconValores/>
            <h3>Nossos Valores</h3>
            <p>
              Empatia, Acessibilidade, Ética, Inovação Social e a força 
              da Colaboração. Acreditamos que juntos podemos fazer a diferença.
            </p>
          </div>

      </section>


    </main>
  );
}


export default SobreNosPage;