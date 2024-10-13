import React, { useState } from 'react'; // Importar React y useState para manejar el estado
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para la navegación
import axios from 'axios'; // Importar axios para hacer peticiones HTTP
import './Login.css'; // Importar el archivo CSS para estilos
import loadingGif from '/loading 2.gif'; // Importar un GIF de carga
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa'; // Importar íconos

const Login = () => {
    // Definir estados para username, password, error y isLoading
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Función para manejar el envío del formulario
    const handleSubmit = async (event) => {
        setIsLoading(true); // Mostrar el overlay de carga
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        setError(''); // Reinicia el error al intentar hacer login de nuevo

        try {
            // Hacer una petición POST para autenticar al usuario
            const response = await axios.post('https://vprs4v7w-7257.use2.devtunnels.ms/api/Auth/authenticate', {
                username,
                password
            });

            const token = response.data.token;

            if (token) {
                localStorage.setItem('token', token); // Guardar el token en localStorage
                navigate(`/welcome?token=${token}`); // Redirigir a /welcome si el login fue exitoso
            }
        } catch (error) {
            // Manejar errores de la petición
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); // Mostrar mensaje de error del backend
            } else {
                setError('Error inesperado. Por favor, inténtalo de nuevo.');
            }
        } finally {
            setIsLoading(false);  // Ocultar el overlay
        }
    };

    return (
        <div className="login-container">
            {isLoading && (
                <div className="loading-overlay">
                    <img src={loadingGif} alt="Loading..." className="loading-icon" />
                </div>
            )}
            <img src="background.jpg" alt="Background" className="background-image" />
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login CMDB Claro</h2>
                <img src="loading.gif" alt="Logo" className="logo-image" />

                <div className="form-group">
                    <label htmlFor="username">Usuario:</label>
                    <div className="input-container">
                        <FaUser className="icon" /> {/* Icono de usuario */}
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control"
                            placeholder="Ingrese su usuario" />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <div className="input-container">
                        <FaLock className="icon" /> {/* Icono de candado */}
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            placeholder="Ingrese tu password" />
                    </div>
                </div>

                <button type="submit" className="btn">
                    <FaSignInAlt className="icon" /> Login {/* Icono de login */}
                </button>

                {error && <p className="error-message">{error}</p>} {/* Mostrar mensaje de error */}

                <img src="patrocinador.png" alt="Logo" className="logo-patrocinador" />
            </form>
        </div>
    );
};

export default Login; // Exportar el componente Login
