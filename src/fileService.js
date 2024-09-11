import api from './api';

export const login = async (username, password) => {
    try {
        const response = await api.post('/login/', { username, password });
        return response.data;
    } catch (error) {
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