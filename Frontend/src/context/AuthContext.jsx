import React, {createContext, useState, useContext, useEffect} from "react";
import {login as apiLogin, createPaciente, createVoluntario, logout as apiLogout} from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() =>{
        const token = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("currentUser");

        if (token && storedUser) {
            setUser(JSON.parse(storedUser)); 
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const result = await apiLogin(email, password);
        if (result.success) {
            setUser(result.user);
            navigate("/painel");
            return result;
        }
        return result;
    };

    const register = async(userData) => {

        let apiResult;

        if (userData.role === "paciente") {

            const pacienteData = {
                nome: userData.name,
                email: userData.email,
                senha: userData.password,
                data_nascimento: userData.birthDate,
                endereco: userData.address,
                id_comunidade: userData.community
            };

            apiResult = await createPaciente(pacienteData);

        } else if (userData.role === "voluntario") {

            const voluntarioData = {
                nome: userData.name,
                email: userData.email,
                senha: userData.password,
                contato: userData.contact,
                universidade: userData.university,
                especialidade: userData.specialty
            };

            apiResult = await createVoluntario(voluntarioData);
        }else {
            return { sucess : false, message: "Perfil (role) inválido."};
        }

        if (apiResult.success) {

            return await login(userData.email, userData.password);
        } else {
            return apiResult;
        }
    };
    
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
export function useAuth(){
    return useContext(AuthContext);
}


