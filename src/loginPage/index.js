import React, { useState } from 'react';
import { fetchData } from '../fileService';
import './index.css'; // Importando o arquivo CSS
import { FaUser, FaLock } from 'react-icons/fa'; // Ícones de usuário e senha
import { Link } from 'react-router-dom'; // Importando Link do react-router-dom para navegação

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetchData();
            if (response.success) {
                setMessage('Login realizado com sucesso!');
            } else {
                setMessage('Falha no login. Tente novamente.');
            }
        } catch (error) {
            setMessage('Ocorreu um erro durante o login.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src="/logo.png" alt="Logo" className="login-logo" /> {/* Imagem de logo */}
                {/*<h1 className="login-title">Delivery Express</h1>*/}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username"><FaUser /> Usuário</label>
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
                        <label htmlFor="password"><FaLock /> Senha</label>
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
                    <button type="submit" className="login-button">Entrar</button>
                </form>
                {message && <p className="login-message">{message}</p>}

                {/* Link para criar conta */}
                <div className="create-account">
                    <p>Não tem uma conta? <Link to="/createUser">Criar conta</Link></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
