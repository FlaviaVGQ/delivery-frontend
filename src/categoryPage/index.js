import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendCategory } from '../fileService';
import './styles.css';

const CreateCategory = () => {
    const [category, setCategory] = useState('');
    const userId = localStorage.getItem('userId');
    console.log(userId) 

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await sendCategory(category, userId); 
            setCategory(''); 
        } catch (error) {
            console.error('Erro ao criar a categoria:', error);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Nome da categoria"
                required
            />
            <button type="submit">Criar Categoria</button>
        </form>
    );
};

export default CreateCategory;