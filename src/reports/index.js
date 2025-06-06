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
                <h2>Relatórios Gráficos</h2>
                
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
            </main>

            <footer className="reportspage-footer">
                &copy; 2025 Delivery Express | Todos os direitos reservados
            </footer>
        </div>
    );
};

export default ReportsPage;

