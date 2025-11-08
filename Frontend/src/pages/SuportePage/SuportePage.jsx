import React from 'react';
import "./SuportePage.css"
import imgsuporte from "../../assets/imagem-suporte.png";


function SuportePage() {
  return (
    <main className='suporte-container'>

      <section className='suporte-section'>

        <div className='suporte-content'>

          <div className='suporte-text'>
            <h1>Suporte</h1>
            <p>Digite seu problema e enviaremos uma resposta o mais rápido possivel</p>
          </div>

          <div className='form'>
            <form>
              <input type="text"/>
              {/* <Button to="/" className="btn-link" >botao</Button> */}
            </form>
          </div>

        </div>
        <div className='suporte-img'>
          <img src={imgsuporte} alt="imgsuporte"/>
        </div>
      </section>
    </main>

  );
}


export default SuportePage;