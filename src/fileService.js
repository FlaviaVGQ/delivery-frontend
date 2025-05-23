import api from './api';

export const login = async (username, password) => {
    try {
        const response = await api.post('/login/', { username, password });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            console.log(error.response.data)
            return error.response.data;
        }
        console.error('Erro ao fazer login: ', error);
        throw error;
    }
};

export const fetchData = async () => {
    try {
        const response = await api.get('/data/');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados: ', error);
        throw error;
    }
};

export const createUser = async (username, email, password) => {
    try {
        const response = await api.post('/create/', { username, email, password });
        return response.data;
    } catch (error) {
        console.error('Erro ao criar usuário: ', error);
        throw error;
    }
};

export const changePassword = async (token, password) => {

    try {
        const response = await api.post(`/reset-password/${token}/`, { password });
        return response.data;
    } catch (error) {
        console.error('Erro ao redefinir a senha:', error);
        throw error;
    }
};

export const sendResetPasswordEmail = async (emailOrUsername) => {
    try {
        const response = await api.post('/forgotpassword/', { emailOrUsername });
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar e-mail de recuperação:', error);
        throw error;
    }
};

export const sendCategory = async (category, userId) => {
    try {
        const response = await api.post('/category/', { category, user_id: userId });
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar categoria e ID:', error);
        throw error;
    }
};

export const fetchCategoriesByUser = async (userId) => {
    try {
        const response = await api.get(`/category/`, { params: { user_id: userId } });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar categorias: ', error);
        throw error;
    }
};
export const addProduct = async (productData, userId) => {
    try {
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('categoryId', productData.categoryId);
        formData.append('image', productData.image);


        if (userId) {
            formData.append('userId', userId);
        }
        console.log([...formData]);

        const response = await api.post('/addProduct/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar produto: ', error);
        throw error;
    }
};

export const getProductsByUser = async (userId) => {
    try {
        const response = await api.get(`/products/`, { params: { user_id: userId } });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar produtos: ', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/deleteProduct/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir produto: ', error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await api.get(`/products/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar produto: ', error);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const formData = new FormData();


        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('categoryId', productData.categoryId);
        

        if (productData.discount !== undefined && productData.discount !== null && productData.discount !== '') {
    formData.append('discount', productData.discount);
}



        if (productData.image) {
            formData.append('image', productData.image);
        }

        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        const response = await api.put(`/editProduct/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar produto: ', error);
        throw error;
    }
};

export const saveCompanyInfo = async (
    userId,
    name,
    openingHours = '',
    address = '',
    contact = '',
    description = '',
    image = null
) => {
    try {
        const formData = new FormData();


        formData.append('user_id', userId);
        formData.append('name', name);


        if (openingHours) formData.append('opening_hours', openingHours);
        if (address) formData.append('address', address);
        if (contact) formData.append('contact', contact);
        if (description) formData.append('description', description);


        if (image) {
            if (image instanceof File || image instanceof Blob) {
                formData.append('image', image, 'restaurant-image.png');
            } else {
                console.warn('O parâmetro "image" não é válido. Ele deve ser um arquivo ou um Blob.');
            }
        }

        const response = await api.post('/company-info/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao salvar informações da empresa:', error.response?.data || error.message);
        throw error;
    }
};


export const deleteCategory = async (categoryId, userId) => {
    try {
        const response = await api.delete(`/category/${categoryId}/`, {
            data: { user_id: userId },
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir categoria:', error.response?.data || error.message);
        throw error;
    }
};

export const getCompanyByUser = async (userId) => {
    try {
        const response = await api.get(`/company-info/get`, { params: { user_id: userId } });
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar restaurante: ', error);
        throw error;
    }
};


export const fetchProductById = async (id) => {
    try {
        const response = await api.get(`/product/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar produto: ', error);
        throw error;
    }
};

export const getOrdersByUser = async (userId) => {
    try {
        const response = await api.get('/get/orders/', { params: { user_id: userId } });
        return response;
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        throw error;
    }
};

export const sendOrder = async (orderData) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await api.post('/orders/', orderData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar pedido:', error);
        throw new Error('Erro ao processar o pedido. Tente novamente.');
    }
};


export const deleteOrder = async (orderId, userId) => {
    try {
        const response = await api.delete(`/orders/${orderId}/`, {
            data: { user_id: userId }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir pedido:', error);
        throw error;
    }
};
