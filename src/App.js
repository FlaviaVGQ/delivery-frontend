import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './loginPage';
import CreateUserPage from './createUser'; // Supondo que você tenha a página de criação de usuário

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/createUser" element={<CreateUserPage />} />
            </Routes>
        </Router>
    );
};

export default App;
