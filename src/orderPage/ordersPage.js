import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import './ordersPage.css';
import { FaHome, FaSignOutAlt, FaUserCircle,  FaTrash } from "react-icons/fa"; 
import { getOrdersByUser, deleteOrder, updateOrderStatus} from '../fileService'; 

const OrdersPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (userId) {
                    const response = await getOrdersByUser(userId);
                    setOrders(response.data);
                } else {
                    console.error('Usuário não logado');
                }
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
                setError('Erro ao buscar pedidos');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    const handleStatusChange = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status } : order
                )
            );
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Erro ao atualizar status do pedido.');
        }
        };

    const handleDelete = async (orderId) => {
        try {
            await deleteOrder(orderId, userId); 
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));  
        } catch (error) {
            console.error('Erro ao excluir pedido:', error);
        }
    };

    if (loading) return <div className="loading">Carregando pedidos...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!orders || orders.length === 0) return <div className="no-orders">Não há pedidos disponíveis.</div>;

    return (
        <div className="orderpage-container">
            <header className="admin-homepage-header">
                <img src="/logo.png" alt="Logo" className="admin-homepage-logo" />
                <nav className="admin-homepage-nav">
                    <ul className="nav-list">
                        <li><Link to="/restaurante"><FaUserCircle /> Perfil</Link></li>
                        <li><Link to="/home"><FaHome /> Início</Link></li>
                        <li><Link to="/" className="logout-button"><FaSignOutAlt /> Sair</Link></li>
                    </ul>
                </nav>
            </header>

            <div>
                {orders.length > 0 ? (
                    <main className="orderpage-main">
                        <div className="orderpage-card">
                            <h2>Pedidos</h2>
                            {orders.map((order) => (
                                <div key={order.id} className={`order-card ${order.status}`}>
                                    <div className="order-info">
                                        <p><strong>Cliente:</strong> {order.customer_name || 'Não informado'}</p>
                                        <p><strong>Endereço:</strong> {order.address || 'Não informado'}</p>
                                        <p><strong>Telefone:</strong> {order.phone || 'Não informado'}</p>
                                        <p><strong>Observação:</strong> {order.observation || 'Nenhuma observação'}</p>
                                        <p><strong>Total:</strong> R${parseFloat(order.total_price).toFixed(2)}</p>
                                        <p><strong>Método de Pagamento:</strong> {order.payment_method || 'Não informado'}</p>
                                    </div>
                                    <div className="order-items">
                                        <h3>Itens do Pedido:</h3>
                                        <ul>
                                            {order.items && order.items.length > 0 ? (
                                                order.items.map((item, index) => (
                                                    <li key={index}>
                                                        Produto: {item.product_name} - Quantidade: {item.quantity} - Preço: R${parseFloat(item.price).toFixed(2)}
                                                    </li>
                                                ))
                                            ) : (
                                                <li>Sem itens no pedido.</li>
                                            )}
                                        </ul>
                                    </div>

                                    <div className="order-status">
                                        <label>
                                            <input
                                                type="radio"
                                                name={`status-${order.id}`}
                                                value="feito"
                                                checked={order.status === 'feito'}
                                                onChange={() => handleStatusChange(order.id, 'feito')}
                                            />
                                            Feito
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`status-${order.id}`}
                                                value="nao-feito"
                                                checked={order.status === 'nao-feito'}
                                                onChange={() => handleStatusChange(order.id, 'nao-feito')}
                                            />
                                            Não Feito
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`status-${order.id}`}
                                                value="em-andamento"
                                                checked={order.status === 'em-andamento'}
                                                onChange={() => handleStatusChange(order.id, 'em-andamento')}
                                            />
                                            Em Andamento
                                        </label>
                                    </div>

                                    <button onClick={() => handleDelete(order.id)} className="delete-button-orders">
                                        <FaTrash /> 
                                    </button>
                                </div>
                            ))}
                        </div>
                    </main>
                ) : (
                    <p>Você não tem pedidos.</p>
                )}
            </div>

            <footer className="orderpage-footer">
                &copy; 2025 Delivery Express | Todos os direitos reservados
            </footer>
        </div>
    );
};

export default OrdersPage;
