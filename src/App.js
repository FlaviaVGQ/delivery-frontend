import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './loginPage';
import CreateUserPage from './createUser';
import ForgotPasswordPage from './forgotPassword';
import ResetPasswordPage from './resetPassword';
import HomePage from './homePage';
import ProductsPage from "./productsPage";
import CategoryPage from './categoryPage';
import AddProductPage from './addProductPage';
import LinkPage from "./linkPage";
import EditProductPage from './editProductPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/createUser" element={<CreateUserPage />} />
                <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/products/" element={<ProductsPage />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/addProduct" element={<AddProductPage />} />
                <Route path="/deleteProduct" element={<ProductsPage />} />
                <Route path="/link" element={<LinkPage />} />
                <Route path="/editProduct/:id" element={<EditProductPage />} />

            </Routes>
        </Router>
    );
};

export default App;
