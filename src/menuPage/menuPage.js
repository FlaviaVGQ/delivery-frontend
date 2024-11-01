import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { getProductsByUser } from '../fileService';
import { useCart } from '../CartContext';
import './menuPage.css';

const MenuPage = () => {
    const navigate = useNavigate();
    const { cart, addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            getProductsByUser(userId)
                .then(fetchedProducts => setProducts(fetchedProducts))
                .catch(error => console.error('Erro ao carregar os produtos:', error));
        }
    }, [userId]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedProducts = filteredProducts.reduce((acc, product) => {
        (acc[product.category] = acc[product.category] || []).push(product);
        return acc;
    }, {});

    const handleCheckout = () => {
        // Limpa o carrinho
        addToCart([]); // Isso mantém o cardápio intacto
        navigate('/cartPage');
    };

    return (
        <div className="menu-page-container">
            <header className="menu-page-header">
                <img src="/logo.png" alt="Logo" className="menu-logo" />
                <h1 className="menu-cover-title">Nome do Restaurante</h1>
                <div className="cart-icon" onClick={handleCheckout}>
                    <FaShoppingCart />
                    <span className="cart-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
            </header>

            <main className="menu-main-content">
                <div className="menu-actions">
                    <h1 className="menu-title">Cardápio</h1>
                    <div className="header-right">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Buscar produtos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="search-button">
                                <FaSearch />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="product-list">
                    {Object.keys(groupedProducts).length > 0 ? (
                        Object.entries(groupedProducts).map(([category, items]) => (
                            <div key={category} className="category-section">
                                <h2 className="category-title">{category}</h2>
                                <div className="products-container">
                                    {items.map(product => (
                                        <div key={product.id} className="product-card">
                                            <img src={product.image} alt={product.name} className="product-image" />
                                            <div className="product-info">
                                                <h2 className="product-name">{product.name}</h2>
                                                <p className="product-description">Descrição: {product.description}</p>
                                                <p className="product-price">Preço: R$ {product.price}</p>
                                            </div>
                                            <button
                                                className="add-to-cart-button"
                                                onClick={() => addToCart(product)}
                                            >
                                                <FaShoppingCart />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-products-message">Não há produtos disponíveis.</p>
                    )}
                </div>
                <button onClick={handleCheckout} className="checkout-button">
                    Finalizar Compra
                </button>
            </main>
        </div>
    );
};

export default MenuPage;
