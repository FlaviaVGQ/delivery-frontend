import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaBoxOpen, FaMinus, FaPlus } from "react-icons/fa"; // Importa o ícone de carrinho
import "./cartPage.css";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Nome do Produto 1", price: 10.0, quantity: 1, image: "item-image.jpg" },
        { id: 2, name: "Nome do Produto 2", price: 20.0, quantity: 1, image: "item-image.jpg" },
    ]);

    const [observation, setObservation] = useState("");

    const handleRemoveItem = (id) => {
        const updatedCartItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCartItems);
    };

    const handleIncreaseQuantity = (id) => {
        const updatedCartItems = cartItems.map(item => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCartItems(updatedCartItems);
    };

    const handleDecreaseQuantity = (id) => {
        const updatedCartItems = cartItems.map(item => {
            if (item.id === id && item.quantity > 1) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        setCartItems(updatedCartItems);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <div className="cart-page-container">
            <header className="cart-page-header">
                <div className="cart-title-container">
                    <FaShoppingCart className="cart-icon" />
                    <h1 className="cart-title">Carrinho de Compras</h1>
                </div>
                <nav className="page-nav">
                    <ul className="nav-list">
                        <li><Link to="/menu/:userId"><FaBoxOpen /> Voltar</Link></li>
                    </ul>
                </nav>
            </header>

            <div className="cart-items-container">
                {cartItems.length === 0 ? (
                    <div className="empty-cart-message">
                        <p>Seu carrinho está vazio!</p>
                    </div>
                ) : (
                    cartItems.map(item => (
                        <div key={item.id} className="cart-item-card">
                            <div className="cart-item-info">
                                <img src={item.image} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <p className="cart-item-name">{item.name}</p>
                                    <p className="cart-item-price">R$ {item.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="cart-item-quantity">
                                <button className="quantity-button" onClick={() => handleDecreaseQuantity(item.id)}>
                                    <FaMinus />
                                </button>
                                <span className="quantity-value">{item.quantity}</span>
                                <button className="quantity-button" onClick={() => handleIncreaseQuantity(item.id)}>
                                    <FaPlus />
                                </button>
                            </div>
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="cart-item-remove"
                                aria-label="Remover item"
                            >
                                <FaTrash className="trash-icon" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {cartItems.length > 0 && (
                <div className="cart-summary">
                    <div className="cart-summary-item">
                        <h3>Total:</h3>
                        <span className="cart-total">R$ {calculateTotal()}</span>
                    </div>
                    <div className="observation-section">
                        <textarea
                            id="observation"
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                            placeholder="Digite alguma observação para o pedido"
                            className="observation-textarea"
                        />
                    </div>
                    <button className="checkout-button">Finalizar Compra</button>
                </div>
            )}
        </div>
    );
};

export default CartPage;
