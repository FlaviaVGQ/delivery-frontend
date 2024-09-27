import React, { useState, useEffect } from 'react';
import './stylesProductsPage.css';
import { FaBoxOpen, FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchCategoriesByUser, getProductsByUser } from '../fileService';

const ProductsPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');

    const userId = localStorage.getItem('userId');
    console.log("usuario", userId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userId) {
                    const categoriesResponse = await fetchCategoriesByUser(userId);
                    setCategories(categoriesResponse);
                    console.log('Categorias:', categoriesResponse);

                    const productsResponse = await getProductsByUser(userId);
                    setProducts(productsResponse);
                    console.log('Produtos:', productsResponse);
                }
            } catch (error) {
                console.error("Erro ao buscar dados: ", error);
            }
        };

        fetchData();
    }, [userId]);

    const handleEditProduct = (id) => {
    };

    const handleDeleteProduct = (id) => {
        const filteredProducts = products.filter(product => product.id !== id);
        setProducts(filteredProducts);
    };

    const handleViewProduct = (product) => {
        alert(`Visualizando Produto: ${product.name}\nDescrição: ${product.description}\nCategoria: ${product.category}`);
    };

    const handleGoToCategories = () => {
        navigate('/category');
    };

    const handleAddProduct = () => {
        navigate('/addProduct');
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const categorizedProducts = categories.reduce((acc, category) => {
        acc[category.name] = filteredProducts.filter(product => product.category === category.name);
        return acc;
    }, {});

    return (
        <div className="products-page-container">
            <header className="page-header">
                <img src="/logo.png" alt="Logo" className="page-logo" />
                <nav className="page-nav">
                    <ul>
                        <li><a href="/home"><FaBoxOpen /> Voltar</a></li>
                    </ul>
                </nav>
            </header>

            <main className="products-page-main">
                <div className="products-page-title">
                    <h1>Gerenciamento de Produtos</h1>
                    <p>Adicione, edite e exclua produtos do seu inventário.</p>
                </div>

                <div className="search-section">
                    <div className="search-bar">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Pesquisar produtos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="products-actions">
                    <button className="add-category-button" onClick={handleGoToCategories}><FaPlus /> Adicionar Categoria</button>
                    <button className="primary-button" onClick={handleAddProduct}><FaPlus /> Adicionar Produto</button>
                </div>

                <div className="categories-container">
                    {categories.map(category => (
                        <div key={category.id} className="category-container">
                            <h2>{category.name}</h2>
                            <div className="category-products">
                                {categorizedProducts[category.name]?.map(product => (
                                    <div key={product.id} className="product-item">
                                        <img src={product.imagePath} alt={product.name} className="product-image" />
                                        <div className="product-details">
                                            <h3>{product.name}</h3>
                                            <p>{product.description}</p>
                                            <p className="product-price">R$ {product.price}</p>
                                        </div>
                                        <div className="product-buttons">
                                            <button className="edit-button" onClick={() => handleEditProduct(product.id)}>
                                                <FaEdit className="product-icon" />
                                            </button>
                                            <button className="view-button" onClick={() => handleViewProduct(product)}>
                                                <FaEye className="product-icon" />
                                            </button>
                                            <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>
                                                <FaTrash className="product-icon" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <hr className="category-divider" />
                        </div>
                    ))}
                </div>
            </main>

            <footer className="page-footer">
                &copy; {new Date().getFullYear()} Delivery Express. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default ProductsPage;
