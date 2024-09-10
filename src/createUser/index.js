import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Importando o arquivo CSS
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'; // Ícones adicionais

const CreateUserPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Aqui você pode adicionar a lógica para criar o usuário, como uma chamada API.
        // Exemplo:
        try {
            // const response = await fetchData(); // Substitua com a função apropriada para criar o usuário
            setMessage('Usuário criado com sucesso!');
        } catch (error) {
            setMessage('Ocorreu um erro ao criar o usuário.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src="/logo.png" alt="Logo" className="login-logo" /> {/* Imagem de logo */}
                {/*<h1 className="login-title">Criar Conta</h1>*/}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username"><FaUser/> Usuário</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Digite seu usuário"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email"><FaEnvelope/> Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Digite seu email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"><FaLock/> Senha</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                            placeholder="Digite sua senha"
                        />
                    </div>
                    <button type="submit" className="login-button">Criar Conta</button>
                </form>
                {message && <p className="login-message">{message}</p>}

                {/* Link para voltar à página de login */}
                <div className="create-account">
                    <p>Já tem uma conta? <Link to="/">Voltar ao login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default CreateUserPage;
