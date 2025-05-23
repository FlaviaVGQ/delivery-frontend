import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash, FaBoxOpen, FaMinus, FaPlus } from "react-icons/fa";
import { useCart } from "../CartContext";
import "./cartPage.css";

const CartPage = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity } = useCart();
    const [observation, setObservation] = useState("");

    const handleIncreaseQuantity = (id, quantity) => {
        updateQuantity(id, quantity + 1);
    };

    const handleDecreaseQuantity = (id, quantity) => {
        if (quantity > 1) updateQuantity(id, quantity - 1);
    };

    const calculateTotal = () => {
    return cart.reduce((total, item) => {
        const priceWithDiscount = item.discount
            ? item.price * (1 - item.discount / 100)
            : item.price;
        return total + priceWithDiscount * item.quantity;
    }, 0).toFixed(2);
    };

    const handleCheckout = () => {
        const userId = localStorage.getItem('userId');
        navigate("/checkoutPage", { state: { cartItems: cart, observation, userId } });
    };

    return (
        <div className="cart-page-container">
            <header className="cart-page-header">
                <div className="cart-title-container">
                    <FaShoppingCart className="cart-icon" />
                    <h1 className="cart-title">Carrinho de Compras</h1>
                </div>
                <nav className="cart-page-nav">
                    <ul className="cart-nav-list">
                        <li><Link to="/menu/:userId"><FaBoxOpen /> Voltar</Link></li>
                    </ul>
                </nav>
            </header>

            <div className="cart-items-container">
                {cart.length === 0 ? (
                    <div className="cart-empty-message">
                        <p>Seu carrinho está vazio!</p>
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.id} className="cart-item-card">
                            <div className="cart-item-info">
                                <img src={`http://localhost:8000/${item.image}`} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <p className="cart-item-name">{item.name}</p>
                                    <p className="cart-item-price">
                                        R$ {item.discount
                                                ? (item.price * (1 - item.discount / 100)).toFixed(2)
                                                : item.price.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="cart-item-quantity">
                                <button className="cart-quantity-button" onClick={() => handleDecreaseQuantity(item.id, item.quantity)}>
                                    <FaMinus />
                                </button>
                                <span className="cart-quantity-value">{item.quantity}</span>
                                <button className="cart-quantity-button" onClick={() => handleIncreaseQuantity(item.id, item.quantity)}>
                                    <FaPlus />
                                </button>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="cart-item-remove"
                                aria-label="Remover item"
                            >
                                <FaTrash className="cart-trash-icon" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {cart.length > 0 && (
                <div className="cart-summary">
                    <div className="cart-summary-item">
                        <h3>Total:</h3>
                        <span className="cart-total">R$ {calculateTotal()}</span>
                    </div>
                    <div className="cart-observation-section">
                        <textarea
                            id="cart-observation"
                            value={observation}
                            onChange={(e) => setObservation(e.target.value)}
                            placeholder="Digite alguma observação..."
                            className="cart-observation-textarea"
                        />
                    </div>
                    <button onClick={handleCheckout} className="cart-checkout-button">Finalizar Compra</button>
                </div>
            )}
        </div>
    );
};

export default CartPage;
