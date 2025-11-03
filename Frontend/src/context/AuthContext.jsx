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
        
    }
}

