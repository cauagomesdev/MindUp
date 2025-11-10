import React from 'react';
import "./SobreNosPage.css";
import imgequipe from "../../assets/fotoequipe.jpeg";
import imgsobre from "../../assets/img-sobre-nos.png";

function SobreNosPage() {
  return (
    <main className='sobrenos-container'>
      <div className='sobrenos-content'>

        <section className='sobre-nos-section'>

          <div className='img-sobre-nos-section'>
            <img src={imgsobre} alt="imagem do SOBRE NÓS MindUp" className='img-sobre-nos'/>
          </div>

          <div className='sobrenos-texts'>
            <h3>SOBRE NÓS</h3>
            <p>nossa missão e etc...</p>
          </div>

          <div className='img-equipe-section'>
            <img src={imgequipe} alt="imagem da equipe MindUp" className='img-equipe'/>
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

      </div>
    </main>
  );
}


export default SobreNosPage;