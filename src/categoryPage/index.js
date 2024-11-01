import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { sendCategory } from '../fileService';
import { FaUserCircle, FaCog, FaSignOutAlt, FaBoxOpen } from 'react-icons/fa';
import './category.css';

const CreateCategory = () => {
    const [category, setCategory] = useState('');
    const userId = localStorage.getItem('userId');

    console.log(userId);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await sendCategory(category, userId);
            setCategory('');
        } catch (error) {
            console.error('Erro ao criar a categoria:', error);
        }
    };

    return (
        <div className="create-category-page">
            <header className="admin-homepage-header">
                <img src="/logo.png" alt="Logo" className="admin-homepage-logo" />
                <nav className="admin-homepage-nav">
                    <ul className="nav-list">
                        <li><span className="user-info"><FaUserCircle/> Usuário</span></li>
                        <li><Link to="/profile"><FaUserCircle/> Perfil</Link></li>
                        <li><Link to="/settings"><FaCog/> Configurações</Link></li>
                        <li><a href="/products"><FaBoxOpen/> Voltar</a></li>
                        <li><Link to="/" className="logout-button"><FaSignOutAlt/> Sair</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="create-category-main">
                <div className="form-container">
                    <h1>Criar Categoria</h1>
                    <form onSubmit={handleSubmit} className="create-category-form">
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Nome da categoria"
                            required
                            className="category-input"
                        />
                        <button type="submit" className="create-category-button">Criar Categoria</button>
                    </form>
                </div>
            </main>

            <footer className="admin-homepage-footer">
                <p>&copy; 2024 Delivery Express | Todos os direitos reservados</p>
            </footer>
        </div>
    );
};

export default CreateCategory;
