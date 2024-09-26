import React, { useState, useEffect } from 'react';
import './stylesProductsPage.css';
import { FaBoxOpen, FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaEllipsisV } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchCategoriesByUser } from '../fileService'; // Importando a função do fileService

const ProductsPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([
        { id: 1, name: "Exemplo de Produto 1", description: "Descrição do Produto 1", category: "Categoria 1" },
        { id: 2, name: "Exemplo de Produto 2", description: "Descrição do Produto 2", category: "Categoria 1" },
        { id: 3, name: "Exemplo de Produto 3", description: "Descrição do Produto 3", category: "Categoria 1" },
        { id: 4, name: "Exemplo de Produto 4", description: "Descrição do Produto 4", category: "Categoria 2" },
        { id: 5, name: "Exemplo de Produto 5", description: "Descrição do Produto 5", category: "Categoria 2" },
        { id: 6, name: "Exemplo de Produto 6", description: "Descrição do Produto 6", category: "Categoria 2" },
        { id: 7, name: "Exemplo de Produto 7", description: "Descrição do Produto 7", category: "Categoria 2" }
    ]);

    const [categories, setCategories] = useState([]); // Lista de categorias
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({ category: '' });
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const userId = localStorage.getItem('userId');
    console.log(userId) // Pega o userId do localStorage

    // Busca categorias do usuário
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (userId) {
                    const response = await fetchCategoriesByUser(userId); // Chama a função para buscar categorias
                    setCategories(response);
                    console.log('Categorias:', response); // Define as categorias
                }
            } catch (error) {
                console.error("Erro ao buscar categorias: ", error);
            }
        };

        fetchCategories();
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

    const handleEditCategory = (category) => {
        // Função para editar uma categoria
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
