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


const getCsrfToken = () => {
    const name = 'csrftoken=';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
};

export const changePassword = async ( username, password) => {
    const csrfToken = getCsrfToken(); 

    try {
        console.log(password)
        const response = await api.post(`/resetpassword/`, { username, password});
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

