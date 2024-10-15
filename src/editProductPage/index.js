import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategoriesByUser, getProductById, updateProduct } from '../fileService'; 
import './stylesEditaPage.css';

const EditProductPage = () => {
    const { id } = useParams(); // Pega o ID do produto da URL
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                if (userId) {
                    const response = await fetchCategoriesByUser(userId); 
                    setCategories(response);
                    console.log('Categorias:', response); 
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
                console.log("Produto Response:", productResponse); // Busca o produto pelo ID
                setName(productResponse.name);
                
                setDescription(productResponse.description);
                setPrice(productResponse.price);
                setCategoryId(productResponse.categoryId);

                const categoriesResponse = await fetchCategoriesByUser(userId);
                setCategories(categoriesResponse);
            } catch (error) {
                console.error("Erro ao buscar dados do produto: ", error);
            }
        };

        fetchData();
    }, [id, userId]);

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(id, { name, description, price, categoryId }); // Atualiza o produto
            navigate('/products'); // Redireciona para a página de produtos
        } catch (error) {
            console.error("Erro ao atualizar produto: ", error);
        }
    };

    return (
        <div className="edit-product-container">
            <h1 className="edit-product-title">Editar Produto</h1>
            <form className="edit-product-form" onSubmit={handleSaveChanges}>
                <div className="form-group">
                    <label className="form-label">Nome:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Descrição:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="form-textarea"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label className="form-label">Preço:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div>
                    <label>Categoria:</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="form-select">
                            <option value="">Selecione uma categoria</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                <button type="submit" className="primary-button">Salvar Alterações</button>
            </form>
        </div>
    );
};

export default EditProductPage;
