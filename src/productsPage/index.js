import React, { useState } from 'react';
import './stylesProductsPage.css';
import { FaBoxOpen, FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaEllipsisV, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const categories = ["Categoria 1", "Categoria 2", "Categoria 3"];

const ProductsPage = () => {
    const [products, setProducts] = useState([
        { id: 1, name: "Exemplo de Produto 1", description: "Descrição do Produto 1", category: "Categoria 1" },
        { id: 2, name: "Exemplo de Produto 2", description: "Descrição do Produto 2", category: "Categoria 1" },
        { id: 3, name: "Exemplo de Produto 3", description: "Descrição do Produto 3", category: "Categoria 1" },
        { id: 4, name: "Exemplo de Produto 4", description: "Descrição do Produto 4", category: "Categoria 2" },
        { id: 5, name: "Exemplo de Produto 5", description: "Descrição do Produto 5", category: "Categoria 2" },
        { id: 6, name: "Exemplo de Produto 6", description: "Descrição do Produto 6", category: "Categoria 2" },
        { id: 7, name: "Exemplo de Produto 7", description: "Descrição do Produto 7", category: "Categoria 2" }
    ]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({ category: '' });
    const [editingCategory, setEditingCategory] = useState(null);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);

    const handleAddProduct = () => {
        // Function to add a new product
    };

    const handleEditProduct = (id) => {
        // Function to edit a product
    };

    const handleDeleteProduct = (id) => {
        const filteredProducts = products.filter(product => product.id !== id);
        setProducts(filteredProducts);
    };

    const handleViewProduct = (product) => {
        alert(`Visualizando Produto: ${product.name}\nDescrição: ${product.description}\nCategoria: ${product.category}`);
    };

    const handleEditCategory = (category) => {
        // Function to edit a category
        setEditingCategory(category);
    };

    const handleDeleteCategory = (category) => {
        // Function to delete a category
    };

    const filteredProducts = products
        .filter(product => product.name.toLowerCase().includes(search.toLowerCase()) &&
            (filter.category ? product.category === filter.category : true));

    // Organize products by categories
    const categorizedProducts = categories.reduce((acc, category) => {
        acc[category] = filteredProducts.filter(product => product.category === category);
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
                                    key={category}
                                    className={`filter-button ${filter.category === category ? 'active' : ''}`}
                                    onClick={() => setFilter({ category: filter.category === category ? '' : category })}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="products-actions">
                    <button className="primary-button" onClick={handleAddProduct}><FaPlus /> Adicionar Novo Produto</button>
                </div>

                <div className="categories-container">
                    {categories.map(category => (
                        categorizedProducts[category].length > 0 && (
                            <div key={category} className="category-container">
                                <div className="category-header">
                                    <h2>{category}</h2>
                                    <div className="category-actions">
                                        <button className="category-edit" onClick={() => handleEditCategory(category)}>
                                            <FaEllipsisV className="category-icon" />
                                        </button>
                                    </div>
                                </div>
                                <div className="category-products">
                                    {categorizedProducts[category].map(product => (
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
                            </div>
                        )
                    ))}
                    <button className="add-category-button"><FaPlus /> Adicionar Categoria</button>
                </div>
            </main>

            <footer className="page-footer">
                &copy; {new Date().getFullYear()} Don Lisita. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default ProductsPage;
