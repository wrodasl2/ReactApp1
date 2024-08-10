import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Welcome component mounted.');

        // Capturar el token de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        console.log('Token capturado de la URL:', token);

        if (token) {
            console.log('Guardando token en localStorage...');
            // Guardar el token en el local storage
            localStorage.setItem('token', token);

            // Redirigir a la página principal o cualquier otra ruta después de guardar el token
            console.log('Token guardado. Redirigiendo a /home...');
            navigate(`/welcome?token=${token}`); // Redirigir a /home o cualquier otra ruta
        } else {
            console.log('No se encontró token en la URL. Redirigiendo a /login...');
            // Manejar el caso donde no hay token en la URL
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div>
            <h1>Bienvenido</h1>
            <p>Redirigiendo...</p>
        </div>
    );
};

export default Welcome;
