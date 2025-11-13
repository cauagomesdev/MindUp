import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getComunidades } from '../../services/api';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './RegisterPage.css';

import imgmulher from '../../assets/mulher_terapeuta_login.png';
import logoMindUp from '../../assets/MindUp Logo.png';

function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [endereco, setEndereco] = useState('');
  const [comunidadeId, setComunidadeId] = useState('');
  const [comunidades, setComunidades] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  useEffect(() => {
    loadComunidades();
  }, []);

  const loadComunidades = async () => {
    const result = await getComunidades();
    if (result.success) {
      setComunidades(result.data.comunidades || []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    const result = await register(
      nome, 
      email, 
      password, 
      endereco, 
      comunidadeId || null
    );

    if (!result.success) {
      setError(result.message || 'Erro ao cadastrar');
    }

    setLoading(false);
  };

  return (
    <div className="register-page-container">
      <div className="register-form-section">
        <header className="register-header">
          <img src={logoMindUp} alt="MindUp Logo" className="register-logo-img" />
          <div className="register-brand-text">
            <h1>MindUp</h1>
            <p>Seu espaço de Acolhimento</p>
          </div>
        </header>

        <div className="register-box">
          <h2>Criar Conta</h2>

          <form onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>}

            <Input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              aria-label="Nome"
            />

            <Input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="E-mail"
            />

            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              aria-label="Senha"
            />

            <Input
              type="password"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              aria-label="Confirmar Senha"
            />

            <Input
              type="text"
              placeholder="Endereço (opcional)"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              aria-label="Endereço"
            />

            <select
              className="select-input"
              value={comunidadeId}
              onChange={(e) => setComunidadeId(e.target.value)}
              aria-label="Comunidade"
            >
              <option value="">Selecione uma comunidade (opcional)</option>
              {comunidades.map((comunidade) => (
                <option key={comunidade.id_comunidade} value={comunidade.id_comunidade}>
                  {comunidade.nome}
                </option>
              ))}
            </select>

            <Button
              type="submit"
              className="btn-register-submit"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>

          <div className="login-link">
            <p>
              Já possui uma conta?
              <Button to="/login" className="btn-link">
                Entre aqui
              </Button>
            </p>
          </div>
        </div>
      </div>

      <div className="register-visual-section">
        <div className="visual-blob"></div>
        <img src={imgmulher} alt="Terapeuta MindUp" className="register-visual-img" />
      </div>
    </div>
  );
}

export default RegisterPage;