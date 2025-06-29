import React, { useState, useEffect } from 'react';
import { FaHome, FaSignOutAlt, FaUserCircle, FaCheck, FaClock, FaTimes, FaMinus } from "react-icons/fa";
import { getProductsByUser, getOrdersByUser, downloadReportPDF } from '../fileService';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './stylesReportsPage.css';

const ReportsPage = () => {
    const userId = localStorage.getItem('userId');
    const [activeTab, setActiveTab] = useState('produtosPorCategoria');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [errorProducts, setErrorProducts] = useState(null);
    const [errorOrders, setErrorOrders] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoadingProducts(true);
                const prodData = await getProductsByUser(userId);
                console.log('Produtos retornados da API:', prodData);
                setProducts(prodData);
                setErrorProducts(null);
            } catch (err) {
                setErrorProducts('Erro ao carregar produtos.');
                console.error(err);
            } finally {
                setLoadingProducts(false);
            }
        }
        fetchProducts();
    }, [userId]);

    useEffect(() => {
        async function fetchOrders() {
            try {
                setLoadingOrders(true);
                const ordersData = await getOrdersByUser(userId);
                console.log('Pedidos retornados da API:', ordersData);
                setOrders(ordersData.data);
                setErrorOrders(null);
            } catch (err) {
                setErrorOrders('Erro ao carregar pedidos.');
                console.error(err);
            } finally {
                setLoadingOrders(false);
            }
        }
        fetchOrders();
    }, [userId]);


    const handleDownload = async () => {
        try {
            const blob = await downloadReportPDF(userId);
            const url  = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'relatorio.pdf';
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert('Erro ao baixar relatório');
        }
    };


    const loading = loadingProducts || loadingOrders;
    const error = errorProducts || errorOrders;

    const allItems = (Array.isArray(orders) ? orders : []).flatMap(order =>
        order.items.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category || 'Sem Categoria',
            price: parseFloat(item.price) || 0,
            quantity: item.quantity || 1,
        }))
    );


    const produtosPorCategoriaData = Object.values(
        products.reduce((acc, product) => {
            const categoria = product.category || 'Sem Categoria';
            acc[categoria] = acc[categoria] || { name: categoria, quantidade: 0 };
            acc[categoria].quantidade += 1;
            return acc;
        }, {})
    );


    const produtosMaisVendidosData = Object.values(
        orders.flatMap(order => order.items).reduce((acc, item) => {
            const nome = item.product_name || 'Produto Desconhecido';
            const quantidade = item.quantity || 0;
            const preco = parseFloat(item.price) || 0;

            if (!acc[nome]) {
                acc[nome] = {
                    name: nome,
                    quantidade: 0,
                    totalArrecadado: 0
                };
            }

            acc[nome].quantidade += quantidade;
            acc[nome].totalArrecadado += quantidade * preco;

            return acc;
        }, {})
    )
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 10);

    const produtoMaisVendido = produtosMaisVendidosData.length > 0 ? produtosMaisVendidosData[0] : null;


    const precoMedioPorCategoriaData = Object.values(
        products.reduce((acc, product) => {
            const categoria = product.category || 'Sem Categoria';
            const preco = parseFloat(product.price) || 0;

            if (!acc[categoria]) {
                acc[categoria] = {
                    name: categoria,
                    total: 0,
                    count: 0
                };
            }

            acc[categoria].total += preco;
            acc[categoria].count += 1;
            acc[categoria].precoMedio = Number((acc[categoria].total / acc[categoria].count).toFixed(2));

            return acc;
        }, {})
    );

    const pedidosPorStatusData = Object.values(
        orders.reduce((acc, order) => {
            const status = order.status || 'Sem Status';
            acc[status] = acc[status] || { name: status, quantidade: 0 };
            acc[status].quantidade += 1;
            return acc;
        }, {})
    );

    const totalVendas = allItems.reduce((acc, item) => {
        return acc + (item.price * item.quantity);
    }, 0);

    const totalItensVendidos = allItems.reduce((acc, item) => {
        return acc + item.quantity;
    }, 0);

    const totalCategorias = [...new Set(products.map(p => p.category || 'Sem Categoria'))].length;

    const renderStatusIcon = (status) => {
        const lowerStatus = (status || '').toLowerCase().trim();
        switch (lowerStatus) {
            case 'feito':
            case 'entregue':
                return <FaCheck title="Feito" />;
            case 'em-andamento':
            case 'pendente':
                return <FaClock title="Em Andamento" />;
            case 'nao-feito':
            case 'cancelado':
                return <FaTimes title="Não Feito" />;
            default:
                return <FaMinus title="Desconhecido" />;
        }
    };

    if (loading) return <div className="loading">Carregando dados...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="reportspage-container">
            <header className="reportspage-header">
                <img src="/logo.png" alt="Logo" className="reportspage-logo" />
                <nav className="reportspage-nav">
                    <ul className="nav-list">
                        <li><a href="/restaurante"><FaUserCircle /> Profile</a></li>
                        <li><a href="/home"><FaHome /> Home</a></li>
                        <li><a href="/" className="logout-button"><FaSignOutAlt /> Logout</a></li>
                    </ul>
                </nav>
            </header>

            <main className="reportspage-main">
                <div>
                    <div className="reportspage-summary">
                        <div className="summary-box">
                            <h4>Total de Vendas</h4>
                            <p>R$ {totalVendas.toFixed(2)}</p>
                        </div>
                        <div className="summary-box">
                            <h4>Total de Itens Vendidos</h4>
                            <p>{totalItensVendidos}</p>
                        </div>
                        <div className="summary-box">
                            <h4>Mais Vendido</h4>
                            <p>{produtoMaisVendido ? produtoMaisVendido.name : '---'}</p>
                        </div>
                    </div>
                    <div className="recent-orders-container">
                        <h3>Últimos Pedidos</h3>
                        {orders.length === 0 ? (
                            <p>Nenhum pedido encontrado.</p>
                        ) : (
                            <table className="recent-orders-table">
                                <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Observação</th>
                                    <th>Itens do Pedido</th>
                                    <th>Valor Total</th>
                                    <th>Método de Pagamento</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders
                                    .slice(0, 5)
                                    .map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.customer_name  || '---'}</td>
                                            <td>{order.observation || '---'}</td>
                                            <td>
                                                {order.items
                                                    .map(item => `${item.product_name} (${item.quantity})`)
                                                    .join(', ')}
                                            </td>
                                            <td>R$ {parseFloat(order.total_price || 0).toFixed(2)}</td>
                                            <td>{order.payment_method  || '---'}</td>
                                            <td className={`status-icon ${order.status ? order.status.toLowerCase().replace(/\s/g, '-') : ''}`}>
                                                {renderStatusIcon(order.status)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="charts-section">
                        <div className="chart-container">
                            <h3>Produtos por Categoria</h3>
                            <div className="chart-wrapper">
                                <ResponsiveContainer>
                                    <BarChart data={produtosPorCategoriaData}>
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            align="center" 
                                            height={36} 
                                            wrapperStyle={{ transform: 'translateY(35px)' }}  
                                        />
                                        <Bar dataKey="quantidade" name="Quantidade" fill="#00509e" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="chart-container">
                            <h3>Produtos Mais Vendidos</h3>
                            <div className="chart-wrapper">
                                <ResponsiveContainer>
                                    <BarChart data={produtosMaisVendidosData}>
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value, name) => {
                                                if (name === 'totalArrecadado') {
                                                    return [`R$ ${value.toFixed(2)}`, 'Valor arrecadado'];

                                                }
                                                if (name === 'quantidade') {
                                                    return [`${value} unid.`, 'Quantidade'];
                                                }
                                                return [value, name];
                                            }}
                                        />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            align="center" 
                                            height={36} 
                                            wrapperStyle={{ transform: 'translateY(35px)' }}  
                                        />
                                        <Bar dataKey="quantidade" name="Quantidade Vendida" fill="#d62728" />
                                        <Bar dataKey="totalArrecadado" name="Total Arrecadado (R$)" fill="#1f77b4" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="chart-container">
                            <h3>Preço Médio por Categoria</h3>
                            <div className="chart-wrapper">
                                <ResponsiveContainer>
                                    <BarChart data={precoMedioPorCategoriaData}>
                                        <XAxis dataKey="name"  angle={-45} textAnchor="end" interval={0}/>
                                        <YAxis />
                                        <Tooltip />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            align="center" 
                                            height={36} 
                                            wrapperStyle={{ transform: 'translateY(35px)' }}  
                                        />
                                        <Bar dataKey="precoMedio" name="Preço Médio" fill="#2ca02c" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="chart-container">
                            <h3>Pedidos por Status</h3>
                            <div className="chart-wrapper" style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={pedidosPorStatusData}>
                                        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0}/>
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Legend 
                                            verticalAlign="bottom" 
                                            align="center" 
                                            height={36} 
                                            wrapperStyle={{ transform: 'translateY(35px)' }}  
                                        />
                                        <Bar dataKey="quantidade" name="Quantidade" fill="#1f77b4" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="generate-report-container" style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button
                            className="generate-report-button"
                            onClick={handleDownload}
                        >
                            Gerar Relatório
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ReportsPage;
