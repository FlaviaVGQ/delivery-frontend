import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { getProductsByUser, getCompanyByUser } from '../fileService';
import { useCart } from '../CartContext';
import './menuPage.css';



const MenuPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const { cart, addToCart } = useCart();
    const [restaurantData, setRestaurantData] = useState({});
    const [imagePreview, setImagePreview] = useState('/default-restaurant.jpg');
    const [searchTerm, setSearchTerm] = useState('');
    const userId = localStorage.getItem('userId');



    useEffect(() => {
    const intervalId = setInterval(() => {
        if (userId) {
            getProductsByUser(userId)
                .then(fetchedProducts => setProducts(fetchedProducts))
                .catch(error => console.error('Erro ao carregar os produtos:', error));
        }
    }, 2000);

    return () => clearInterval(intervalId);
}, [userId]);


    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await getCompanyByUser(userId);
                const { name, address, contact, opening_hours, description, image } = response.data;

                setRestaurantData({
                    name: name || '',
                    address: address || '',
                    phone: contact || '',
                    hours: opening_hours
                        ? opening_hours.split(' - ').map(h => parseInt(h, 10))
                        : [0, 0],
                    description: description || '',
                    image: image || null,
                });


                if (image) {
                    setImagePreview(`data:image/png;base64,${image}`);
                } else {
                    setImagePreview('/default-restaurant.jpg');
                }
            } catch (error) {
                console.error('Erro ao buscar informações do restaurante:', error);
            }
        };

        fetchRestaurantData();
    }, [userId]);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedProducts = filteredProducts.reduce((acc, product) => {
        (acc[product.category] = acc[product.category] || []).push(product);
        return acc;
    }, {});

    const handleCheckout = () => {
        addToCart([]);
        navigate('/cartPage');
    };

    return (
        <div className="menu-page-container">
            <header className="menu-page-header">
                <img src={imagePreview} alt="Logo do Restaurante" className="menu-logo" />
                <h2 className="menu-cover-title">{restaurantData.name}</h2>
                <div className="cart-icon" onClick={handleCheckout}>
                    <FaShoppingCart />
                    <span className="cart-count">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
            </header>

            <main className="menu-main-content">
                <div className="-menu-restaurant-info">
                    <p className="menu-description">{restaurantData.description}</p>
                    <p className="menu-address">{restaurantData.address}</p>
                    <p className="menu-hours">
                        {Array.isArray(restaurantData.hours) && restaurantData.hours.length === 2
                            ? `${String(restaurantData.hours[0]).padStart(2, '0')}:00 - ${String(restaurantData.hours[1]).padStart(2, '0')}:00`
                            : 'Horário não disponível'}
                    </p>
                    <p className="menu-phone">{restaurantData.phone}</p>
                </div>

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
                                            <img src={`http://localhost:8000/${product.image}`} alt={product.name}
                                                 className="product-image"/>
                                            <div className="product-content-menu">
                                                <div className="product-info-menu">
                                                    <h2 className="product-name">{product.name}</h2>
                                                    <p className="product-description">Descrição: {product.description}</p>
                                                    {product.discount > 0 ? (
                                                        <p className="product-price">
                                                            Preço: <span className="original-price">R$ {parseFloat(product.price).toFixed(2)}</span>{' '}
                                                            <span className="discounted-price">
            R$ {(parseFloat(product.price) * (1 - parseFloat(product.discount) / 100)).toFixed(2)}
        </span>
                                                            <span className="promotion-badge">{product.discount}% OFF</span>
                                                        </p>
                                                    ) : (
                                                        <p className="product-price">Preço: R$ {parseFloat(product.price).toFixed(2)}</p>
                                                    )}

                                                </div>
                                                <button
                                                    className="add-to-cart-button"
                                                    onClick={() => addToCart(product)}
                                                >
                                                    <FaShoppingCart/>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-products-message">Não há produtos disponíveis.</p>
                    )}
                </div>
                <button onClick={handleCheckout} className="checkout-button-menu">
                    Finalizar Compra
                </button>
            </main>
        </div>
    );
};

export default MenuPage;
