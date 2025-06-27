import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchCategoriesByUser, getProductById, updateProduct} from '../fileService';
import { FaUserCircle, FaSignOutAlt, FaBoxOpen, FaHome } from 'react-icons/fa';
import './stylesEditaPage.css';

const EditProductPage = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [errors] = useState({});
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [onSale, setOnSale] = useState(false);
    const [discount, setDiscount] = useState('');


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (userId) {
                    const response = await fetchCategoriesByUser(userId);
                    setCategories(response);
                }
            } catch (error) {
                console.error("Erro ao buscar categorias: ", error);
            }
        };

        fetchCategories();
    }, [userId]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await getProductById(id);
                setName(productResponse.name);
                setDescription(productResponse.description);
                setPrice(productResponse.price);
                setCategoryId(productResponse.categoryId);
                setImage(productResponse.image);
            } catch (error) {
                console.error("Erro ao buscar dados do produto: ", error);
            }
        };

        fetchData();
    }, [id]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await getProductById(id);
                setName(productResponse.name);
                setDescription(productResponse.description);
                setPrice(productResponse.price);
                setCategoryId(productResponse.categoryId);
                setImage(productResponse.image);
            } catch (error) {
                console.error("Erro ao buscar dados do produto: ", error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const loadData = async () => {
            const product = await getProductById(id);
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setCategoryId(product.categoryId);
            setOnSale(product.onSale || false);
            setDiscount(product.discount || '');
        };

        const loadCategories = async () => {
            const data = await fetchCategoriesByUser(userId);
            setCategories(data);
        };

        loadData();
        loadCategories();
    }, [id, userId]);


    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(id, { name, description, price, categoryId, image,  discount: onSale ? discount : null });
            navigate('/products');
        } catch (error) {
            console.error("Erro ao atualizar produto: ", error);
        }
    };

    return (
        <div className="edit-product-page">
            <header className="admin-homepage-header">
                <img src="/logo.png" alt="Logo" className="admin-homepage-logo" />
                <nav className="admin-homepage-nav">
                    <ul className="nav-list">
                        <li><Link to="/restaurante"><FaUserCircle /> Perfil</Link></li>
                        <li><Link to="/home"><FaHome /> Início</Link></li>
                        <li><a href="/products"><FaBoxOpen /> Voltar</a></li>
                        <li><Link to="/" className="logout-button"><FaSignOutAlt /> Sair</Link></li>
                    </ul>
                </nav>
            </header>
            <div className="edit-product-container">
                <form className="edit-product-form" onSubmit={handleSaveChanges}>
                <h1 className="edit-product-title">Editar Produto</h1>
                    <div className="form-group-edit">
                        <label className="form-label-edit">Nome:</label>
                        <input
                            className="form-input-edit"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <p className="error">{errors.name}</p>}
                    </div>

                    <div className="form-group-edit">
                        <label className="form-label-edit">Descrição:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-textarea-edit"
                        />
                        {errors.description && <p className="error">{errors.description}</p>}
                    </div>

                    <div className="form-group-edit">
                        <label className="form-label-edit">Preço:</label>
                        <input
                            className="form-input-edit"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        {errors.price && <p className="error">{errors.price}</p>}
                    </div>

                    <div className="form-group-edit">
                        <label className="form-label-edit">Categoria:</label>
                        <select
                            className="form-select"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="error">{errors.categoryId}</p>}
                    </div>

                    <div className="form-group-edit">
                        <label className="form-label-edit">Imagem:</label>
                        <input
                            className="form-input-edit"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        {image && <p>Imagem atual: {typeof image === 'string' ? image : image.name}</p>}
                    </div>
                    <div className="form-group">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={onSale}
                                onChange={() => setOnSale(!onSale)}
                            />
                            <span className="slider"></span>
                        </label>
                        <span className="promo-label">
                            <span className="star">⭐</span> Colocar em promoção
                        </span>
                    </div>
                    {onSale && (
                        <div className="form-group" style={{ marginTop: '12px' }}>
                            <label>Desconto (%):</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                            />
                        </div>
                    )}

                    <button type="submit" className="primary-button">Salvar Alterações</button>
                </form>
            </div>
            <footer className="admin-homepage-footer">
                <p>&copy; 2025 Delivery Express. | Todos os direitos reservados</p>
            </footer>
        </div>
    );
};

export default EditProductPage;
