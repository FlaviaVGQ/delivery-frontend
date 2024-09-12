import React, { useState } from 'react';
import { sendResetPasswordEmail } from '../fileService'; // Supondo que você tenha uma função para enviar o e-mail
import { FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Importando Link do react-router-dom
import './index.css';

const ForgotPasswordPage = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await sendResetPasswordEmail(emailOrUsername);

            if (response.success) {
                setMessage('E-mail de recuperação enviado com sucesso. Verifique sua caixa de entrada.');
            } else {
                setMessage(response.message || 'Falha ao enviar e-mail de recuperação. Tente novamente.');
            }
        } catch (error) {
            setMessage('Ocorreu um erro ao tentar enviar o e-mail de recuperação.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Recuperação de Senha</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="emailOrUsername"><FaEnvelope /> E-mail ou Nome de Usuário</label>
                        <input
                            type="text"
                            id="emailOrUsername"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Digite seu e-mail ou nome de usuário"
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Enviar Instruções
                    </button>
                </form>
                {message && <p className="login-message">{message}</p>}
                <div className="back-to-login">
                    <Link to="/">Voltar para Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
