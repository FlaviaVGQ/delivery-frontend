import React, { useEffect, useState } from "react";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);  // Inicializa como um array vazio
    const [loading, setLoading] = useState(true);  // Estado para saber se está carregando

    useEffect(() => {
        // Faz a requisição para a API para buscar os pedidos
        fetch('http://localhost:8000/orders/')  // Endereço da sua API
            .then(response => response.json())  // Converte a resposta para JSON
            .then(data => {
                setOrders(data);  // Atualiza o estado com os pedidos
                setLoading(false);  // Marca o carregamento como concluído
            })
            .catch(error => {
                console.error('Erro ao carregar os pedidos:', error);  // Exibe o erro no console
                setLoading(false);  // Marca o carregamento como concluído, mesmo em caso de erro
            });
    }, []);  // O array vazio significa que o efeito será executado apenas uma vez, na montagem do componente

    // Verifica se os pedidos estão sendo carregados
    if (loading) {
        return <div>Carregando pedidos...</div>;  // Exibe a mensagem enquanto os dados estão sendo carregados
    }

    // Verifica se não há pedidos
    if (!orders || orders.length === 0) {
        return <div>Não há pedidos disponíveis.</div>;  // Exibe mensagem caso não haja pedidos
    }

    return (
        <div>
            <h1>Pedidos</h1>
            <ul>
                {/* Itera sobre os pedidos e renderiza cada um */}
                {orders.map((order) => (
                    <li key={order.id}>
                        Pedido #{order.id}: {order.customer_name} - {order.total_price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrdersPage;
