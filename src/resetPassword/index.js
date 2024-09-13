import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './index.css';
import { FaLock } from 'react-icons/fa';
import { changePassword } from '../fileService'; // Certifique-se de que essa função está importada corretamente

const ResetPasswordPage = () => {
    const { uidb64, token } = useParams(); // Use useParams para acessar os parâmetros da URL
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('As senhas não correspondem.');
            return;
        }

        try {
            await changePassword(username, newPassword); // Passe username, uidb64 e token para a função
            setMessage('Senha alterada com sucesso!');
            setUsername('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setMessage('Ocorreu um erro ao alterar a senha.');
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
                <img src="/logo.png" alt="Logo" className="reset-password-logo" />
                <h1 className="reset-password-title">Alterar Senha</h1>
                <form onSubmit={handleSubmit} className="reset-password-form">
                    <div className="form-group">
                        <label htmlFor="username">Nome de Usuário</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Digite seu nome de usuário"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="new-password"><FaLock /> Nova Senha</label>
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Digite sua nova senha"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password"><FaLock /> Confirmar Senha</label>
                        <input
                            type="password"
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Confirme sua nova senha"
                        />
                    </div>
                    <button type="submit" className="reset-password-button">Alterar Senha</button>
                </form>
                {message && <p className="reset-password-message">{message}</p>}
                <div className="back-to-login">
                    <p>Voltar ao login? <Link to="/">Ir para Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
