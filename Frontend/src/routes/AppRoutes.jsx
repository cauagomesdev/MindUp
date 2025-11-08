import React from "react";
import { Routes, Route } from 'react-router-dom';

import Layout from "../components/Layout/Layout";

import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import AgendamentosPage from "../pages/AgendamentosPage/AgendamentosPage";
import RecuperarPage from "../pages/RecuperarPage/RecuperarPage";
import PainelPage from "../pages/PainelPage/PainelPage";
import SobreNosPage from "../pages/SobreNosPage/SobreNosPage";
import SuportePage from "../pages/SuportePage/SuportePage";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

function AppRoutes() {
    return (       
            <Routes>
                
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/cadastro" element={<RegisterPage/>} />

                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/suporte" element={<SuportePage/>} />
                    <Route path="/sobre-nos" element={<SobreNosPage/>} />
                </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/agendamentos" element={<AgendamentosPage/>} />
                    <Route path= "/recuperar-senha" element={<RecuperarPage/>} />
                    <Route path= "/painel" element={<PainelPage/>} />
                </Route>
            </Route>
            
                <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />

            </Routes>
    );
}

export default AppRoutes;