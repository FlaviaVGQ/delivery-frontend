// src/AdminHomePage.js
import React from 'react';
import './styles.css';
import { FaUserCircle, FaCog, FaSignOutAlt, FaInfoCircle, FaBoxOpen, FaUtensils, FaStore, FaLink, FaChartBar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminHomePage = () => {
    return (
        <div className="admin-homepage-container">
            <header className="admin-homepage-header">
                <img src="/logo.png" alt="Logo" className="admin-homepage-logo" />
                <nav className="admin-homepage-nav">
                    <ul className="nav-list">
                        <li><span className="user-info"><FaUserCircle /> Usuário</span></li>
                        <li><Link to="/profile"><FaUserCircle /> Perfil</Link></li>
                        <li><Link to="/settings"><FaCog /> Configurações</Link></li>
                        <li><Link to="/logout" className="logout-button"><FaSignOutAlt /> Sair</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="admin-homepage-main">
                <section className="admin-homepage-grid">
                    <div className="admin-homepage-card" id="restaurant-info">
                        <h2><FaInfoCircle /> Informações do Restaurante</h2>
                        <p>Atualize os detalhes do restaurante como endereço e horário de funcionamento.</p>
                        <button className="action-button">Atualizar Informações</button>
                    </div>

                    <div className="admin-homepage-card" id="manage-products">
                        <h2><FaBoxOpen /> Gerenciar Produtos</h2>
                        <p>Adicione, edite ou remova produtos disponíveis para venda.</p>
                        <Link to="/products">
                            <button className="action-button">Gerenciar Produtos</button>
                        </Link>
                    </div>

                    <div className="admin-homepage-card" id="view-store">
                        <h2><FaStore /> Visualizar Loja</h2>
                        <p>Veja uma pré-visualização da loja online.</p>
                        <button className="action-button">Visualizar Loja</button>
                    </div>

                    <div className="admin-homepage-card" id="generate-link">
                        <h2><FaLink /> Gerar Link de Compartilhamento</h2>
                        <p>Crie um link para compartilhar a loja com clientes.</p>
                        <Link to="/link">
                            <button className="action-button">Gerar Link</button>
                        </Link>
                    </div>

                    {/*<div className="admin-homepage-card" id="reports">*/}
                    {/*    <h2><FaChartBar /> Relatórios</h2>*/}
                    {/*    <p>Gere relatórios sobre vendas, produtos e desempenho.</p>*/}
                    {/*    <button className="action-button">Ver Relatórios</button>*/}
                    {/*</div>*/}

                    <div className="admin-homepage-card" id="settings">
                        <h2><FaCog /> Configurações</h2>
                        <p>Atualize configurações da conta e preferências do sistema.</p>
                        <button className="action-button">Configurações</button>
                    </div>
                </section>
            </main>

            <footer className="admin-homepage-footer">
                <p>&copy; 2024 Delivery Express | Todos os direitos reservados</p>
            </footer>
        </div>
    );
};

export default AdminHomePage;
