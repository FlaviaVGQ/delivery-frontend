import React, { useState, useEffect } from 'react';
import { fetchCategoriesByUser, deleteCategory, sendCategory } from '../fileService';
import {FaBoxOpen, FaHome, FaMoon, FaSignOutAlt, FaSun, FaTrashAlt, FaUserCircle} from 'react-icons/fa';
import './category.css';
import {Link} from "react-router-dom";

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const userId = localStorage.getItem('userId');
    const [darkMode, setDarkMode] = useState(false);


    useEffect(() => {
        const loadCategories = async () => {
            try {
                const fetchedCategories = await fetchCategoriesByUser(userId);
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
            }
        };
        loadCategories();
    }, [userId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const categoryName = category.trim();

        const isDuplicate = categories.some(
            (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (isDuplicate) {
            alert('Categoria já existente. Escolha um nome diferente.');
            return;
        }

        try {
            await sendCategory(categoryName, userId);
            setCategory('');
            const updatedCategories = await fetchCategoriesByUser(userId);
            setCategories(updatedCategories);
        } catch (error) {
            console.error('Erro ao criar a categoria:', error);
        }
    };


    const openModal = (category) => {
        setSelectedCategory(category); 
        setShowModal(true); 
    };

    const closeModal = () => {
        setSelectedCategory(null); 
        setShowModal(false); 
    };

    const confirmDelete = async () => {
        if (selectedCategory) {
            try {
                await deleteCategory(selectedCategory.id, userId);
                setCategories(categories.filter((cat) => cat.id !== selectedCategory.id)); 
                closeModal(); 
                alert('Categoria excluída com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir categoria:', error);
                alert('Erro ao excluir categoria. Tente novamente.');
            }
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };


    return (
        <div className={`admin-homepage-container ${darkMode ? 'dark' : ''}`}>
            <header className="admin-homepage-header">
                <img src="/logo.png" alt="Logo" className="admin-homepage-logo" />
                <nav className="admin-homepage-nav">
                    <ul className="nav-list">
                        <li><Link to="/restaurante"><FaUserCircle /> Perfil</Link></li>
                        <li><Link to="/home"><FaHome /> Início</Link></li>
                        <li><Link to="/" className="logout-button"><FaSignOutAlt /> Sair</Link></li>
                        <li>
                            <button
                                onClick={toggleDarkMode}
                                className="dark-mode-toggle"
                                aria-label="Toggle dark mode"
                            >
                                {darkMode ? <FaSun /> : <FaMoon />}
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="create-category-main">
                <div className="category-box">
                    <div className="form-container-category">
                        <h1>Criar Categoria</h1>
                        <form onSubmit={handleSubmit} className="create-category-form">
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Nome da categoria"
                                required
                                className="category-input-category"
                            />
                            <button type="submit" className="create-category-button">Criar Categoria</button>
                        </form>
                    </div>

                    <div className="categories-list">
                        <h2>Categorias</h2>
                        <ul className="category-list">
                            {categories.map((cat) => (
                                <li key={cat.id} className="category-item">
                                    <span>{cat.name}</span>
                                    <button
                                        className="delete-category-button"
                                        onClick={() => openModal(cat)}
                                    >
                                        <FaTrashAlt /> Excluir
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>

            <footer className="admin-homepage-footer">
                <p>&copy; 2024 Delivery Express | Todos os direitos reservados</p>
            </footer>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirmar Exclusão</h3>
                        <p style={{ color: 'red' }}>
                            Atenção: ao excluir uma categoria, todos os produtos pertencentes a ela
                            também serão excluídos.
                        </p>
                        <p>
                            Você tem certeza de que deseja excluir a categoria "
                            {selectedCategory?.name}"?
                        </p>
                        <div className="modal-buttons-category">
                            <button className="modal-confirm" onClick={confirmDelete}>
                                Confirmar
                            </button>
                            <button className="modal-cancel" onClick={closeModal}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
