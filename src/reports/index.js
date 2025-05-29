import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './stylesReportsPage.css';
import { FaHome, FaSignOutAlt, FaUserCircle, FaTrash } from "react-icons/fa";


const ReportsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reports, setReports] = useState([]);
    const userId = localStorage.getItem('userId');

   



    return (
        <div className="reportspage-container">
            <header className="reportspage-header">
                <img src="/logo.png" alt="Logo" className="reportspage-logo" />
                <nav className="reportspage-nav">
                    <ul className="nav-list">
                        <li><Link to="/restaurante"><FaUserCircle /> Profile</Link></li>
                        <li><Link to="/home"><FaHome /> Home</Link></li>
                        <li><Link to="/" className="logout-button"><FaSignOutAlt /> Logout</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="reportspage-main">
                <div className="reportspage-card">
                    <h2>Reports</h2>
                    {reports.map((report) => (
                        <div key={report.id} className="report-card">
                            <div className="report-info">
                                <p><strong>Report Title:</strong> {report.title || 'Untitled'}</p>
                                <p><strong>Generated On:</strong> {report.date || 'Unknown date'}</p>
                                <p><strong>Description:</strong> {report.description || 'No description'}</p>
                            </div>
                            <button className="delete-button">
                                <FaTrash /> Delete
                            </button>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="reportspage-footer">
                 &copy; 2025 Delivery Express | Todos os direitos reservados
            </footer>
        </div>
    );
};

export default ReportsPage;
