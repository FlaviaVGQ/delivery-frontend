import React, { useState } from 'react';
import { sendResetPasswordEmail } from '../fileService'; // Função para enviar o e-mail de redefinição
import { FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Certifique-se de que esta importação está presente
import './index.css'; // Importe o CSS atualizado

const ForgotPasswordPage = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' ou 'error'

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log(emailOrUsername);
            const response = await sendResetPasswordEmail(emailOrUsername);

            // Se for sucesso, define a mensagem e o tipo como 'success'
            if (response.success) {
                setMessage('E-mail de recuperação enviado com sucesso. Verifique sua caixa de entrada.');
                setMessageType('success');
            } else {
                // Se houver algum erro, define a mensagem e o tipo como 'error'
                setMessage(response.message);
                setMessageType('error');
            }
        } catch (error) {
            // Em caso de falha, define a mensagem e o tipo como 'error'
            setMessage('Ocorreu um erro ao tentar enviar o e-mail de recuperação.');
            setMessageType('error');
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-box">
                <h2>Recuperação de Senha</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="emailOrUsername">
                            <FaEnvelope /> E-mail ou Nome de Usuário
                        </label>
                        <input
                            type="text"
                            id="emailOrUsername"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            required
                            placeholder="Digite seu e-mail ou nome de usuário"
                        />
                    </div>
                    <button type="submit">Enviar Instruções</button>
                </form>
                {message && (
                    <p className={`message ${messageType}`}>{message}</p>
                )}
                <div className="back-to-login">
                    <Link to="/">Voltar para Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
