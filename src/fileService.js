// src/apiService.js

const API_BASE_URL = 'http://localhost:8000/';


export const fetchData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}${'login/'}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados: ', error);
        throw error; // Re-throw error to be handled by the caller
    }
};
