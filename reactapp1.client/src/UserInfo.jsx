// Importar las dependencias necesarias de React y otros archivos
import React, { useState } from 'react';
import './UserInfo.css';
import userIcon from '/User2.gif';
import loadingGif from '/loading 2.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';  // Cambio el ícono a 'faSearchengin'

// Componente principal UserInfo
const UserInfo = () => {
    // Estado para almacenar el código de búsqueda
    const [searchByCode, setSearchByCode] = useState('');
    // Estado para almacenar el correo electrónico de búsqueda
    const [searchByEmail, setSearchByEmail] = useState('');
    // Estado para almacenar los datos del usuario
    const [userData, setUserData] = useState(null);
    // Estado para manejar el estado de carga
    const [isLoading, setIsLoading] = useState(false);

    // Función para buscar usuario por código de empleado
    const handleSearchByCode = async () => {
        setIsLoading(true); // Mostrar el overlay
        try {
            const response = await fetch(`https://vprs4v7w-7257.use2.devtunnels.ms/api/Test/PorID/${searchByCode}`);
            if (response.ok) {
                const data = await response.json();
                setUserData(data.length > 0 ? data[0] : null);
            } else {
                console.error('Error al buscar por codigo de empleado');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            setIsLoading(false);  // Ocultar el overlay
        }
    };

    // Función para buscar usuario por correo electrónico
    const handleSearchByEmail = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://vprs4v7w-7257.use2.devtunnels.ms/api/Test/PorEmail?email=${searchByEmail}`);
            if (response.ok) {
                const data = await response.json();
                setUserData(data.length > 0 ? data[0] : null);
            } else {
                console.error('Error al buscar por correo electronico');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            setIsLoading(false);  // Ocultar el overlay
        }
    };

    // Renderizar el componente
    return (
        <div className="userinfo-container">
            <div className="user-info-content">
                <div className="search-bar">
                    <input
                        type="text"
                        value={searchByCode}
                        onChange={(e) => setSearchByCode(e.target.value)}
                        placeholder="Ingresa el codigo de empleado"
                    />
                    <button onClick={handleSearchByCode} className="icon-button">
                        <FontAwesomeIcon icon={faSearchengin} className="large-icon" /> Buscar por Codigo de empleado
                    </button>
                    <input
                        type="text"
                        value={searchByEmail}
                        onChange={(e) => setSearchByEmail(e.target.value)}
                        placeholder="Ingresa el Correo electronico"
                    />
                    <button onClick={handleSearchByEmail} className="icon-button">
                        <FontAwesomeIcon icon={faSearchengin} className="large-icon" /> Buscar por Correo electronico
                    </button>
                </div>

                {isLoading ? (
                    <div className="loading-overlay">
                        <img src={loadingGif} alt="Loading..." className="loading-icon" />
                    </div>
                ) : userData ? (
                    <div className="user-card">
                        <div className="user-icon">
                            <img src={userIcon} alt="User Icon" />
                        </div>
                        <div className="user-details">
                            <p><strong>ID Empleado:</strong> {userData.id_empleado}</p>
                            <p><strong>Nombres:</strong> {userData.nombres}</p>
                            <p><strong>Apellidos:</strong> {userData.apellidos}</p>
                            <p><strong>DPI:</strong> {userData.dpi}</p>
                            <p><strong>Email:</strong> {userData.email}</p>
                            <p><strong>Fecha de nacimiento:</strong> {new Date(userData.fecha_nacimiento).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                        </div>
                        <div className="user-details">
                            <p><strong>Puesto:</strong> {userData.puesto}</p>
                            <p><strong>Gerencia:</strong> {userData.gerencia}</p>
                            <p><strong>Nombre de Jefe:</strong> {userData.nombreJefe}</p>
                            <p><strong>Telefono del Jefe:</strong> {userData.telefonoJefe}</p>
                            <p><strong>Estado:</strong> {userData.estado}</p>
                        </div>
                    </div>
                ) : (
                    <p>No se encontraron resultados</p>
                )}
            </div>
        </div>
    );
};

// Exportar el componente UserInfo
export default UserInfo;
