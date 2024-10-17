import React, { useState, useEffect } from 'react';
import './restaurantPage.css';
import { FaSignOutAlt, FaUserCircle, FaUpload,FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Slider } from '@mui/material';

const RestaurantPage = () => {
    const [restaurantData, setRestaurantData] = useState({
        name: 'Restaurante',
        address: 'Rua ...',
        phone: '',
        hours: [8, 20],
        description: 'Restaurante ...',
        image: '/default-restaurant.jpg',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [imagePreview, setImagePreview] = useState(restaurantData.image);
    const [dragging, setDragging] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchRestaurantData = async () => {
            // Simular fetch dos dados do restaurante do servidor
        };
        fetchRestaurantData();
    }, [userId]);

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
        } else if (value.length > 6) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
        }
        setRestaurantData(prevData => ({ ...prevData, phone: value }));
    };

    const handleHoursChange = (event, newValue) => {
        setRestaurantData(prevData => ({ ...prevData, hours: newValue }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setRestaurantData(prevData => ({ ...prevData, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => setDragging(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setRestaurantData(prevData => ({ ...prevData, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSave = () => {
        setIsEditing(false);
        // Aqui seria o local para enviar os dados atualizados para o servidor
    };

    return (
        <div className="restaurant-page-container">
            <header className="restaurant-page-header">
                <img src="/logo.png" alt="Logo" className="admin-homepage-logo" />
                <nav className="admin-homepage-nav">
                    <ul className="nav-list">
                        <li><Link to="/restaurante"><FaUserCircle /> Perfil</Link></li>
                        <li><Link to="/home"><FaHome /> Início</Link></li>
                        <li><Link to="/logout" className="logout-button"><FaSignOutAlt /> Sair</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="restaurant-page-content">
                <div className="restaurant-info">
                    <h2>Informações do Restaurante</h2>

                    {/* Seção de imagem */}
                    <div className="form-group">
                        {isEditing ? (
                            <div
                                className={`image-upload ${dragging ? 'dragging' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input type="file" accept="image/*" onChange={handleImageChange}
                                       style={{display: 'none'}} id="imageInput"/>
                                <label htmlFor="imageInput">
                                    <div className="upload-area">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="imagem" className="restaurant-image-preview"/>
                                        ) : (
                                            <FaUpload className="upload-icon"/>
                                        )}
                                        <p>{imagePreview ? 'Alterar Imagem' : 'Arraste ou clique para enviar uma imagem'}</p>
                                    </div>
                                </label>
                            </div>
                        ) : (
                            <img src="/logo.png" alt="imagem" className="restaurant-image"/>
                        )}
                    </div>
                    <form className="restaurant-form">
                        <div className="form-group">
                            <label>Nome do Restaurante:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={restaurantData.name}
                                    onChange={(e) => setRestaurantData({...restaurantData, name: e.target.value})}
                                    required
                                />
                            ) : (
                                <p>{restaurantData.name}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Endereço:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={restaurantData.address}
                                    onChange={(e) => setRestaurantData({...restaurantData, address: e.target.value})}
                                    required
                                />
                            ) : (
                                <p>{restaurantData.address}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Telefone:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="phone"
                                    value={restaurantData.phone}
                                    onChange={handlePhoneChange}
                                    maxLength={15}
                                    required
                                />
                            ) : (
                                <p>{restaurantData.phone}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Horário de Funcionamento:</label>
                            {isEditing ? (
                                <div className="slider-container">
                                    <Slider
                                        value={restaurantData.hours}
                                        onChange={handleHoursChange}
                                        valueLabelDisplay="auto"
                                        min={0}
                                        max={24}
                                        marks={[
                                            {value: 0, label: '00:00'},
                                            {value: 6, label: '06:00'},
                                            {value: 12, label: '12:00'},
                                            {value: 18, label: '18:00'},
                                            {value: 24, label: '24:00'},
                                        ]}
                                    />
                                    <div className="time-range">
                                        <span>{restaurantData.hours[0]}:00</span> - <span>{restaurantData.hours[1]}:00</span>
                                    </div>
                                </div>
                            ) : (
                                <p>{restaurantData.hours[0]}:00 - {restaurantData.hours[1]}:00</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Descrição:</label>
                            {isEditing ? (
                                <textarea
                                    name="description"
                                    value={restaurantData.description}
                                    onChange={(e) => setRestaurantData({
                                        ...restaurantData,
                                        description: e.target.value
                                    })}
                                />
                            ) : (
                                <p>{restaurantData.description}</p>
                            )}
                        </div>


                        {isEditing && (
                            <button type="button" className="save-button" onClick={handleSave}>
                                Salvar
                            </button>
                        )}
                    </form>

                    {!isEditing && (
                        <button className="edit-button" onClick={() => setIsEditing(true)}>
                            Editar Informações
                        </button>
                    )}
                </div>
            </main>

            <footer className="restaurant-page-footer">
                <p>&copy; 2024 Delivery Express | Todos os direitos reservados</p>
            </footer>
        </div>
    );
};

export default RestaurantPage;