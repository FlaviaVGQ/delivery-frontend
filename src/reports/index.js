import React, { useState, useEffect } from 'react';
import { FaHome, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { getProductsByUser, getOrdersByUser } from '../fileService';
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

    const totalVendas = allItems.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
    }, 0);

    const totalItensVendidos = allItems.reduce((acc, item) => {
    return acc + item.quantity;
    }, 0);

    const totalCategorias = [...new Set(products.map(p => p.category || 'Sem Categoria'))].length;



    

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
                 {/* <h2>Relatórios Gráficos</h2> */}

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
                            <h4>Total de Categorias</h4>
                            <p>{totalCategorias}</p>
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
                                </tr>
                            </thead>
                            <tbody>
                                {orders
                                .slice(0, 5) // Pega os 5 primeiros pedidos
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
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantidade" fill="#1f77b4" />
                                </BarChart>
                            </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="chart-container">
                            <h3>Produtos Mais Vendidos</h3>
                            <div className="chart-wrapper">
                            <ResponsiveContainer>
                                <BarChart data={produtosMaisVendidosData}>
                                <XAxis dataKey="name" />
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
                                <Legend />
                                <Bar dataKey="quantidade" name="Quantidade Vendida" fill="#1f77b4" />
                                <Bar dataKey="totalArrecadado" name="Total Arrecadado (R$)" fill="#d62728" />
                                </BarChart>
                            </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="chart-container">
                            <h3>Preço Médio por Categoria</h3>
                            <div className="chart-wrapper">
                            <ResponsiveContainer>
                                <BarChart data={precoMedioPorCategoriaData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="precoMedio" fill="#2ca02c" />
                                </BarChart>
                            </ResponsiveContainer>
                            </div>
                        </div>
                        </div>

                        
                        <div className="generate-report-container" style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button
                            className="generate-report-button"
                            onClick={() => {
                            alert('Botão de gerar relatório clicado!');
                            }}
                        >
                            Gerar Relatório
                        </button>
                        </div>
                </div>

                {/*
                <div className="tabs" >
                    <button
                        className={activeTab === 'produtosPorCategoria' ? 'active' : ''}
                        onClick={() => setActiveTab('produtosPorCategoria')}
                    >
                        Produtos por Categoria
                    </button>
                    <button
                        className={activeTab === 'produtosMaisVendidos' ? 'active' : ''}
                        onClick={() => setActiveTab('produtosMaisVendidos')}
                    >
                        Produtos Mais Vendidos
                    </button>
                    <button
                        className={activeTab === 'precoMedioPorCategoria' ? 'active' : ''}
                        onClick={() => setActiveTab('precoMedioPorCategoria')}
                    >
                        Preço Médio por Categoria
                    </button>
                </div>
                
                <div className="chart-container" style={{ width: '100%', height: 400 }}>
                    {activeTab === 'produtosPorCategoria' && (
                        <ResponsiveContainer>
                            <BarChart data={produtosPorCategoriaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantidade" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {activeTab === 'produtosMaisVendidos' && (
                        <ResponsiveContainer>
                            <BarChart data={produtosMaisVendidosData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value, name) => {
                                    if (name === 'totalArrecadado') {
                                        return [`R$ ${value.toFixed(2)}`, 'Valor arrecadado'];
                                    }
                                    if (name === 'quantidade') {
                                        return [`${value} unid.`, 'Quantidade'];
                                    }
                                    return [value, name];
                                }} />

                                <Legend />
                                <Bar dataKey="quantidade" name="Quantidade Vendida" fill="#82ca9d" />
                                <Bar dataKey="totalArrecadado" name="Total Arrecadado (R$)" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {activeTab === 'precoMedioPorCategoria' && (
                        <ResponsiveContainer>
                            <BarChart data={precoMedioPorCategoriaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="precoMedio" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
                */}
            </main>

           
        </div>
    );
};

export default ReportsPage;

