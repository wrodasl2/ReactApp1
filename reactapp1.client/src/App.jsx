import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Welcome from './Welcome';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                
                {/* La ruta principal para el componente Welcome */}
                <Route path="/welcome/*" element={<Welcome />} />
                
                {/* Redirigir cualquier otra ruta no especificada a /login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
