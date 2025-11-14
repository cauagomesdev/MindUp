import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getAcompanhamentos,
  createAcompanhamento,
  updateAcompanhamento,
  getPacientes
} from '../../services/api';
import Input from '../../components/Input/Input';
import Textarea from '../../components/Textarea/Textarea';
import Button from '../../components/Button/Button';
import './EvolucaoPage.css';

function EvolucaoPage() {
 return (
          <div>

      </div>
  
  );
}

export default EvolucaoPage;