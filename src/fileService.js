import api from './api';

export const login = async (username, password) => {
    try {
        const response = await api.post('/login/', { username, password });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            console.log(error.response.data)
            return error.response.data; // Retorna a resposta com tempo restante
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
    const csrfToken = getCsrfToken(); // Obtenha o token CSRF

    try {
        console.log(password)
        const response = await api.post(`/resetpassword/`, { username, password});
        return response.data;
    } catch (error) {
        console.error('Erro ao redefinir a senha:', error);
        throw error;
    }
};


////////////////////////////////////////////////////////////

export const sendResetPasswordEmail = async (emailOrUsername) => {
    try {
        const response = await api.post('/forgotpassword/', { emailOrUsername });
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar e-mail de recuperação:', error);
        throw error;
    }
};