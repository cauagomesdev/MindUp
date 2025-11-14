import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getAtendimentos, 
  createAtendimento, 
  updateAtendimento,
  deleteAtendimento,
  getEspacosComunitarios,
  getUsuarios
} from '../../services/api';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import './AgendamentosPage.css';

function AgendamentosPage() {
 

  return (
    <div>
     <h1>AgendamentosPage</h1>
    </div>
  );
}

export default AgendamentosPage;