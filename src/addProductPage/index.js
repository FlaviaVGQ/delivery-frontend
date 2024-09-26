import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategoriesByUser, addProduct } from '../fileService'; // Importando as funções

const AddProductPage = () => { // Certifique-se de passar o userId como prop
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
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

    const validateFields = () => {
        const newErrors = {};
        if (!name) newErrors.name = 'Nome é obrigatório.';
        if (!description) newErrors.description = 'Descrição é obrigatória.';
        if (!price) newErrors.price = 'Preço é obrigatório.';
        if (!categoryId) newErrors.categoryId = 'Categoria é obrigatória.';
        if (!image) newErrors.image = 'Imagem é obrigatória.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateFields()) {
            const productData = { 
                name, 
                description, 
                price, 
                categoryId, 
                image 
            };
            console.log(productData)
            await addProduct(productData); // Adiciona o produto
            navigate('/productPage'); // Redireciona para a página de produtos
        }
    };

    return (
        <div className="add-product-container">
            <h2>Adicionar Produto</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>
                <div>
                    <label>Descrição:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && <p className="error">{errors.description}</p>}
                </div>
                <div>
                    <label>Preço:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    {errors.price && <p className="error">{errors.price}</p>}
                </div>
                <div>
                    <label>Categoria:</label>
                    <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                        <option value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryId && <p className="error">{errors.categoryId}</p>}
                </div>
                <div>
                    <label>Imagem:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    {errors.image && <p className="error">{errors.image}</p>}
                </div>
                <button type="submit">Adicionar Produto</button>
            </form>
        </div>
    );
};

export default AddProductPage;
