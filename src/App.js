import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './loginPage';
import CreateUserPage from './createUser';
import ForgotPasswordPage from './forgotPassword';
import ResetPasswordPage from './resetPassword'; // Certifique-se de que o caminho e nome estão corretos
import HomePage from './homePage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/createUser" element={<CreateUserPage />} />
                <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordPage />} />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </Router>
    );
};

export default App;
