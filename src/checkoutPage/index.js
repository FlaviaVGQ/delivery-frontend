import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import "./checkoutPage.css";

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cart, setCart } = useCart(); 

    
    const [currentStep, setCurrentStep] = useState(1);
    const [deliveryInfo, setDeliveryInfo] = useState({
        fullName: "",
        phone: "",
        street: "",
        number: "",
        complement: "",
        district: "",
        city: "",
        state: ""
    });
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const observation = location.state?.observation || "";

    const finalizeOrder = () => {
        console.log("Pedido finalizado com sucesso!");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCart([]); 
        navigate("/menu/3");
    };

    return (
        <div className="checkout-page-container">
            {currentStep === 1 && (
                <div className="delivery-info">
                    <h2>Informações de Entrega</h2>
                    <form>
                        <input type="text" placeholder="Nome completo" value={deliveryInfo.fullName} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, fullName: e.target.value })} className="input-field" />
                        <input type="text" placeholder="Telefone" value={deliveryInfo.phone} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })} className="input-field" />
                        <input type="text" placeholder="Rua" value={deliveryInfo.street} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, street: e.target.value })} className="input-field" />
                        <input type="text" placeholder="Número" value={deliveryInfo.number} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, number: e.target.value })} className="input-field" />
                        <input type="text" placeholder="Complemento" value={deliveryInfo.complement} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, complement: e.target.value })} className="input-field" />
                        <input type="text" placeholder="Bairro" value={deliveryInfo.district} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, district: e.target.value })} className="input-field" />
                        <input type="text" placeholder="Cidade" value={deliveryInfo.city} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })} className="input-field" />
                        <input type="text" placeholder="Estado" value={deliveryInfo.state} onChange={(e) => setDeliveryInfo({ ...deliveryInfo, state: e.target.value })} className="input-field" />
                        <button type="button" onClick={() => setCurrentStep(2)} className="next-step-button">Próximo</button>
                    </form>
                </div>
            )}

            {currentStep === 2 && (
                <div className="payment-method">
                    <h2>Forma de Pagamento</h2>
                    <label className="payment-option">
                        <input type="radio" name="paymentMethod" value="Cartão" checked={paymentMethod === "Cartão"} onChange={(e) => setPaymentMethod(e.target.value)} />
                        Cartão
                    </label>
                    <label className="payment-option">
                        <input type="radio" name="paymentMethod" value="Pix" checked={paymentMethod === "Pix"} onChange={(e) => setPaymentMethod(e.target.value)} />
                        Pix
                    </label>
                    <label className="payment-option">
                        <input type="radio" name="paymentMethod" value="Dinheiro" checked={paymentMethod === "Dinheiro"} onChange={(e) => setPaymentMethod(e.target.value)} />
                        Dinheiro
                    </label>
                    <button type="button" onClick={() => setCurrentStep(3)} className="next-step-button">Próximo</button>
                </div>
            )}

            {currentStep === 3 && (
                <div className="order-summary">
                    <h2>Resumo do Pedido</h2>
                    <h3>Itens:</h3>
                    <ul>
                        {cart.map(item => (
                            <li key={item.id}>
                                {item.name} - {item.quantity} x R$ {parseFloat(item.price).toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <h3>Observação:</h3>
                    <p>{observation}</p>
                    <h3>Endereço:</h3>
                    <p>{deliveryInfo.street}, {deliveryInfo.number}, {deliveryInfo.complement}</p>
                    <p>{deliveryInfo.district} - {deliveryInfo.city}/{deliveryInfo.state}</p>
                    <p>Telefone: {deliveryInfo.phone}</p>
                    <h3>Forma de Pagamento:</h3>
                    <p>{paymentMethod}</p>
                    <button type="button" onClick={finalizeOrder} className="finalize-button">Finalizar Compra</button>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-button" onClick={closeModal}>&times;</button>
                        <h2>Pedido realizado com sucesso!</h2>
                        <p>Obrigado pela sua compra!</p>
                        <button className="close-modal-button" onClick={closeModal}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
