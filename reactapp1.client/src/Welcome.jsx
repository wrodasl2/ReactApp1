import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserInfo from './UserInfo';
import './Welcome.css';
import Appinfo from './Appinfo';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import loadingGif from '/loadingpages.gif';

const Welcome = () => {
    const navigate = useNavigate();
    const [countEmpleados, setCountEmpleados] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [tokenChecked, setTokenChecked] = useState(false); // Nueva bandera para verificar si el token ya fue validado

    // Función para validar el token
    const validateToken = async (token) => {
        try {
            const response = await fetch('https://vprs4v7w-7257.use2.devtunnels.ms/api/Auth/validate-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(token),
            });
            const data = await response.json();
            if (response.ok) {
                return true;
            } else {
                console.error('Token no válido:', data.message);
                return false;
            }
        } catch (error) {
            console.error('Error en la validación del token:', error);
            return false;
        }
    };

    // Función para obtener el conteo de empleados por gerencia
    const handleCountEmpleados = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('https://vprs4v7w-7257.use2.devtunnels.ms/api/Test/ContarEmpleadosPorGerencia');
            if (response.ok) {
                const data = await response.json();
                setCountEmpleados(data);
            } else {
                console.error('Error al obtener el conteo de empleados por gerencia');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect para manejar el token y validar solo una vez al montar el componente
    useEffect(() => {
        const validateAndFetchData = async () => {
            if (!token) {
                navigate('/login'); // Redirigir al login si no hay token
                return;
            }

            // Si el token no ha sido verificado previamente
            if (!tokenChecked) {
                const isValid = await validateToken(token);
                setTokenChecked(true); // Marca que el token ya fue verificado

                if (isValid) {
                    setIsTokenValid(true);
                    handleCountEmpleados(); // Cargar datos si el token es válido
                } else {
                    navigate('/login'); // Redirigir al login si el token no es válido
                }
            }
        };

        validateAndFetchData();
    }, [navigate, token, tokenChecked]);

    useEffect(() => {
        const handleResize = () => {
            window.dispatchEvent(new Event('resize')); // Forzar el redibujo de la gráfica
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const chartData = {
        labels: countEmpleados.map((gerencia) => gerencia.nombre),
        datasets: [
            {
                label: 'Numero de empleados',
                data: countEmpleados.map((gerencia) => gerencia.total_empleados),
                backgroundColor: '#de9143',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Empleados por gerencia',
                font: {
                    size: 20,
                },
                padding: {
                    top: 10,
                    bottom: 30,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 5,
                },
            },
            x: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                },
            },
        },
    };

    return isTokenValid ? (
        <div className="welcome-container">
            {isLoading && (
                <div className="loading-overlay">
                    <img src={loadingGif} alt="Loading..." className="loading-icon" />
                </div>
            )}
            <Sidebar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={
                        <>
                            <div className="data-container">
                                {isLoading ? (
                                    <p>Cargando datos...</p>
                                ) : countEmpleados.length > 0 ? (
                                    <div className="gerencia-info">
                                        <t>Resumen de empleados</t>
                                        <ul>
                                            {countEmpleados.map((gerencia, index) => (
                                                <li key={index}>
                                                    {gerencia.nombre} - <strong>Total Empleados:</strong> {gerencia.total_empleados}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p>No se encontraron datos de empleados.</p>
                                )}
                            </div>
                            <div className="chart-container">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        </>
                    } />
                    <Route path="user-info" element={<UserInfo />} />
                    <Route path="app-info" element={<Appinfo />} />
                </Routes>
            </div>
        </div>
    ) : null;
};

export default Welcome;
