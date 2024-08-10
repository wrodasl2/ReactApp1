import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const decodeToken = (token) => {
    console.log('Decodificando token...');
    try {
        const base64Url = token.split('.')[1]; // Extraer la parte de carga útil del JWT
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        console.log('Token decodificado:', JSON.parse(jsonPayload));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
    }
};

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        console.log('Comenzando verificación del token...');

        if (!token) {
            console.log('No se encontró ningún token.');
            setIsAuthenticated(false);
            return;
        }

        const decodedToken = decodeToken(token);

        // Verificar si el token ha expirado
        if (decodedToken && decodedToken.exp * 1000 >= Date.now()) {
            console.log('Token válido. Usuario autenticado.');
            setIsAuthenticated(true);
        } else {
            console.log('Token inválido o expirado. Eliminando token.');
            localStorage.removeItem('token'); // Eliminar token inválido
            setIsAuthenticated(false);
        }
    }, [token]);

    // Mientras se determina el estado de autenticación, no renderizamos nada
    if (isAuthenticated === null) {
        console.log('Estado de autenticación no determinado. Mostrando cargando...');
        return null; // O un spinner de carga, si prefieres
    }

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        console.log('No autenticado. Redirigiendo al login...');
        return <Navigate to="/login" />;
    }

    // Si está autenticado, renderizar la ruta protegida
    console.log('Autenticado. Renderizando componente protegido.');
    return children;
};

export default ProtectedRoute;
