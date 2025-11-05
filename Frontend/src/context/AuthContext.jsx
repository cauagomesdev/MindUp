import React, {createContext, useState, useContext, useEffect} from "react";
import {login as apiLogin, register as apiRegister} from "../services/mockApi";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() =>{
        const token = localStorage.getItem("AuthToken");
        const storedUser = localStorage.getItem("currentUser");

        if (token && storedUser) {
            setUser(JSON.parse(storedUser)); 
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const result = await apiLogin(email,password);
        if (result.success) {
            setUser(result.user);
            navigate("/painel");
            return result;
        }
        return result;
    };

    const register = async(name, email, password, role) => {
        const result = await apiRegister(name, email, password, role);
        if (result.success) {
            setUser(result.user);
            navigate("/painel");
            return result;
        }
        return result;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("AuthToken");
        localStorage.removeItem("currentUser");
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

export function useAuth(){
    return useContext(AuthContext);
}


