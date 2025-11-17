// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
// Importa as funções REAIS e CORRIGIDAS do api.js
import { 
    login as apiLogin, 
    register as apiRegister,
    logout as apiLogout 
} from "../services/api"; 
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Efeito para verificar o login ao carregar (está correto)
    useEffect(() => {
        const token = localStorage.getItem("authToken"); 
        const storedUser = localStorage.getItem("currentUser");
        if (token && storedUser) {
            setUser(JSON.parse(storedUser)); 
        }
        setLoading(false);
    }, []);

    // Função LOGIN (chama o api.js)
    const login = async (email, password) => {
        const result = await apiLogin(email, password);
        if (result.success) {
            setUser(result.user);
            navigate("/agendamentos"); // Redireciona para a área logada
            return result;
        }
        return result;
    };

    // Função REGISTER (agora simplificada)
    const register = async (userData) => {
        // Apenas passa o objeto 'userData' completo para a api.js
        const result = await apiRegister(userData); 
        
        if (result.success) {
            setUser(result.user);
            navigate("/agendamentos"); // Redireciona para a área logada
            return result;
        }
        return result;
    };

    // Função LOGOUT (chama o api.js)
    const logout = async () => {
        await apiLogout(); 
        setUser(null);
        navigate("/login");
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Hook customizado (padrão)
export function useAuth() {
    return useContext(AuthContext);
}