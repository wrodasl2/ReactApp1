import React, { useState } from 'react';
import './Appinfo.css';
import loadingGif from '/loading 2.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';  // Cambio el ícono a 'faSearchengin'

const Appinfo = () => {
    const [searchByCode, setSearchByCode] = useState('');
    const [searchByEmail, setSearchByEmail] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearchByCode = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://vprs4v7w-7257.use2.devtunnels.ms/api/Test/UID/${searchByCode}`);
            if (response.ok) {
                const data = await response.json();
                setResults(data);
            } else {
                console.error('Error al buscar por codigo de empleado');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchByEmail = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://vprs4v7w-7257.use2.devtunnels.ms/api/Test/UEmail?email=${searchByEmail}`);
            if (response.ok) {
                const data = await response.json();
                setResults(data);
            } else {
                console.error('Error al buscar por correo electronico');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="appinfo-container">
            <div className="search-bar">
                <input
                    type="text"
                    value={searchByCode}
                    onChange={(e) => setSearchByCode(e.target.value)}
                    placeholder="Busqueda por Codigo de empleado"
                />
                <button onClick={handleSearchByCode} className="icon-button">
                    <FontAwesomeIcon icon={faSearchengin} className="large-icon" />
                    Buscar por Codigo de empleado
                </button>
                <input
                    type="text"
                    value={searchByEmail}
                    onChange={(e) => setSearchByEmail(e.target.value)}
                    placeholder="Busqueda por Correo electronico"
                />
                <button onClick={handleSearchByEmail} className="icon-button">
                    <FontAwesomeIcon icon={faSearchengin} className="large-icon" />
                    Buscar por Correo electronico
                </button>
            </div>

            <div className="table-container">
                {isLoading && (
                    <div className="loading-overlay">
                        <img src={loadingGif} alt="Loading..." className="loading-icon" />
                    </div>
                )}
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Nombre Completo</th>
                            <th>Nombre de Aplicacion</th>
                            <th>Fecha de Creacion</th>
                            <th>Estado</th>
                            <th>No. de caso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.length > 0 ? (
                            results.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.usuario}</td>
                                    <td>{item.email}</td>
                                    <td>{item.nombrecompleto}</td>
                                    <td>{item.nombreaplicacion}</td>
                                    <td>{new Date(item.fecha_creacion).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                                    <td>{item.estado}</td>
                                    <td>{item.no_caso}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No se encontraron resultados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Appinfo;
