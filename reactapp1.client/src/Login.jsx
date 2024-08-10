import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Formulario enviado. Iniciando proceso de autenticación...');

        setError(''); // Reinicia el error al intentar hacer login de nuevo

        try {
            console.log('Enviando solicitud de autenticación al servidor...');
            const response = await axios.post('https://localhost:7257/api/Auth/authenticate', {
                username,
                password
            });

            console.log('Respuesta recibida del servidor:', response);

            const token = response.data.token;

            if (token) {
                console.log('Token recibido:', token);
                localStorage.setItem('token', token); // Guardar el token en localStorage
                console.log('Token guardado en localStorage. Redirigiendo a /welcome...');
                navigate(`/welcome?token=${token}`); // Redirigir a /welcome si el login fue exitoso
            } else {
                console.error('Error: Token no recibido. Por favor, inténtalo de nuevo.');
                setError('Token no recibido. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setError('Credenciales incorrectas o problema con el servidor.');
        }
    };

    return (
             <div className="login-container">
            {/* Aquí puedes agregar una imagen de fondo */}
            <img src="background.jpg" alt="Background" className="background-image" />
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login CMDB Claro</h2>
                {/* Aquí puedes agregar una imagen de logo */}
                <img src="loading.gif" alt="Logo" className="logo-image" />
                <div className="form-group">
                    <label htmlFor="username">Usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control" />
                </div>
                <button type="submit" className="btn">Login</button>

                <img src="patrocinador.png" alt="Logo" className="logo-patrocinador" />
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
