import React, { useState, useEffect } from 'react';
import './stylesProductsPage.css';
import { FaBoxOpen, FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchCategoriesByUser, getProductsByUser } from '../fileService'; // Importando as funções do fileService

const ProductsPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({ category: '' });
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const userId = localStorage.getItem('userId');
    console.log("usuario", userId); // Pega o userId do localStorage

    // Busca categorias e produtos do usuário
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (userId) {
                    const categoriesResponse = await fetchCategoriesByUser(userId); // Chama a função para buscar categorias
                    setCategories(categoriesResponse);
                    console.log('Categorias:', categoriesResponse); // Define as categorias

                    const productsResponse = await getProductsByUser(userId); // Chama a função para buscar produtos
                    setProducts(productsResponse);
                    console.log('Produtos:', productsResponse); // Define os produtos
                }
            } catch (error) {
                console.error("Erro ao buscar dados: ", error);
            }
        };

        fetchData();
    }, [userId]);

    const handleEditProduct = (id) => {
        // Função para editar produto
    };

    const handleDeleteProduct = (id) => {
        const filteredProducts = products.filter(product => product.id !== id);
        setProducts(filteredProducts);
    };

    const handleViewProduct = (product) => {
        alert(`Visualizando Produto: ${product.name}\nDescrição: ${product.description}\nCategoria: ${product.category}`);
    };

    const handleGoToCategories = () => {
        navigate('/category'); // Redireciona para a página de categorias
    };

    const handleAddProduct = () => {
        navigate('/addProduct'); // Redireciona para a página de adicionar produto
    };

    // Filtrar produtos
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter.category ? product.category === filter.category : true)
    );

    // Organize products by categories
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

                <div className="search-filter-section">
                    <div className="search-filter-bar">
                        <button
                            className="search-filter-toggle"
                            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                        >
                            <FaSearch />
                        </button>

                        <button
                            className="search-filter-toggle"
                            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                        >
                            <FaFilter />
                        </button>
                    </div>

                    {isSearchExpanded && (
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
                    )}

                    {isFilterExpanded && (
                        <div className="filter-buttons">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    className={`filter-button ${filter.category === category.name ? 'active' : ''}`}
                                    onClick={() => setFilter({ category: filter.category === category.name ? '' : category.name })}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}
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
                                        <img src={product.imagePath} alt={product.name} className="product-image" /> {/* Adicionando a imagem do produto */}
                                        <div className="product-details">
                                            <h3>{product.name}</h3>
                                            <p>{product.description}</p>
                                            <p><strong>Categoria:</strong> {product.category}</p>
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
                            <hr className="category-divider" /> {/* Divider line between categories */}
                        </div>
                    ))}
                </div>
            </main>

            <footer className="page-footer">
                &copy; {new Date().getFullYear()} Don Lisita. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default ProductsPage;
