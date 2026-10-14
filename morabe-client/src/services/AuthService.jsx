/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("user", JSON.stringify(data.data));
    setUser(data.data);
    return data.data;
  };

  const register = async (formData) => {
    const { data } = await axios.post(`${API_URL}/register`, formData);
    localStorage.setItem("user", JSON.stringify(data.data));
    setUser(data.data);
    return data.data;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
