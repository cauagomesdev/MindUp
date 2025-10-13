import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Layout from "../components/Layout/Layout";

import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import AgendamentosPage from "../pages/AgendamentosPage/AgendamentosPage";

function AppRoutes() {
    return (
        <Router>
            <Routes>
                
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/cadastro" element={<RegisterPage/>} />

                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/agendamentos" element={<AgendamentosPage/>} />
                </Route>
        
                <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
            </Routes>
        </Router>
    );
}

export default AppRoutes;