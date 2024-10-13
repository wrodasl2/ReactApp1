import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import './Sidebar.css';
import jwt_decode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';



const Sidebar = () => {
    const token = localStorage.getItem('token');
    let username = "Nombre de Usuario";

    if (token) {
        const decodedToken = jwt_decode(token);
        username = decodedToken.sub || username;
    }

    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        if (path === '') {
            // Redirigir a la página de inicio sin añadir un path adicional
            navigate(`/welcome?token=${token}`);
        } else {
            // Navegar a las rutas adicionales con el path
            navigate(`/welcome/${path}?token=${token}`);
        }
    };

    return (
        <>
            <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
                    {isCollapsed ? <FontAwesomeIcon icon={faAngleDoubleRight} /> : <FontAwesomeIcon icon={faAngleDoubleLeft} />}

                    
                </div>
                <div className="profile">
                    <img src="User.gif" alt="profile" className="profile-pic" />
                    {!isCollapsed && <p>Usuario: {username}</p>}
                </div>
                <nav>
                    <ul>
                        <li><a onClick={() => handleNavigation('')}><FaHome className="icon" /> {!isCollapsed && 'Inicio'}</a></li>
                        <li><a onClick={() => handleNavigation('user-info')}><FaUser className="icon" /> {!isCollapsed && 'Datos de empleados'}</a></li>
                        <li><a onClick={() => handleNavigation('app-info')}><FaUsers className="icon" /> {!isCollapsed && 'Usuarios y aplicaciones'}</a></li>
                    </ul>
                </nav>
                <div className="logout">
                    <a href="/logout"><FaSignOutAlt className="icon" /> {!isCollapsed && 'Log Out'}</a>
                </div>
            </div>

            {/* Overlay para oscurecer el contenido principal cuando el sidebar esté abierto */}
            {!isCollapsed && <div className="sidebar-overlay" onClick={() => setIsCollapsed(true)}></div>}
        </>
    );
};

export default Sidebar;
