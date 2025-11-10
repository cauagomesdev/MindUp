import React, { useState } from 'react';
import  { useAuth } from "../../context/AuthContext";
import "./SuportePage.css"
import imgsuporte from "../../assets/imagem-suporte.png";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Textarea from "../../components/Textarea/Textarea";

function SuportePage() {

  const { user } = useAuth();

  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [category, setCategory] = useState('agendamento');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [sucess, setSucess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSucess(false);

    console.log("Enviando solicitação de suporte:", {name, email, category, message});
    await new Promise(res => setTimeout(res, 1500));

    setLoading(false);
    setSucess(true);

    setMessage("");
    setCategory("agendamento");
  };

  return (
    <main className='suporte-container'>

      <section className='suporte-section'>

        <div className='suporte-content'>

            <h2>Suporte</h2>
            <p>Precisa de ajuda? Preencha o formulário e nossa equipe
               entrará em contato o mais rápido possível.
            </p>
    
            {sucess ? (
                <div className="suporte-success">
                  <h3>Obrigado!</h3>
                  <p>Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.</p>
                  <Button onClick={() => setSucess(false)} className="secondary">Enviar outra mensagem</Button>
                </div>
            ) : ( 
                <form onSubmit={handleSubmit}>
                <Input
                    label="Seu nome"
                    type="text"
                    placeholder="Como posso te chamar?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <Input
                    label="Seu e-mail"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={!!user}
                />
                <div className='input-group'>
                    <label htmlFor="suporte-categoria">Assunto</label>
                    <select id="suporte-categoria"
                            className='input-field'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="agendamento">Problema com Agendamento</option>
                        <option value="cadastro">Dúvida sobre Cadastro</option>
                        <option value="voluntario">Sobre ser voluntário</option>
                        <option value="feedback">Feeback ou Sugestão</option>
                        <option value="outro">Outro Assunto</option>
                      </select>
                </div>

                <Textarea
                      label="Sua mensagem"
                      placeholder="Descreva seu problema ou dúvida aqui..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                />

                <Button type='submit' className="primary" disabled={loading}>
                  {loading ? "enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            )}
        </div>


        <div className='suporte-img-section'>
          <img src={imgsuporte} alt="Imagem suporte MindUp" className='suporte-img'/>
        </div>

      </section>
    </main>

  );
}


export default SuportePage;