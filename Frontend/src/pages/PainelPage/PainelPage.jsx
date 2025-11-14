import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  getAtendimentos, 
  getAcompanhamentos,
  getPacientes,
  getUsuarios
} from '../../services/api';
import Button from '../../components/Button/Button';
import './PainelPage.css';

function PainelPage() {
  return (
        <div>
<h1>PainelPage</h1>
    </div>
  );
}

export default PainelPage;