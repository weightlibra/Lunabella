import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const location = useLocation();
  const selectedProduct = location.state && location.state.selectedProduct;
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    deliveryOption: "nova-poshta",
  });
  const navigate = useNavigate();

  console.log(selectedProduct);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (orderPlaced) {
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  }, [orderPlaced]);

  const handleOrder = async (e) => {
    e.preventDefault();
    const orderData = {
      productId: selectedProduct._id,
      product: {
        name: selectedProduct.name,
        price: selectedProduct.price,
      },
      customer: formData,
    };

    try {
      const response = await fetch("/api/sold-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderPlaced(true);
      } else {
        console.error("Failed to place order:", response.statusText);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="checkout-page">
      <Link to={"/"}>
        <h1>Lunabella</h1>
      </Link>
      <div className="checkout">
        <h2>Оформлення замовлення</h2>
        {selectedProduct && (
          <div className="selected-products">
            <h3>Обрані товари:</h3>
            <ul>
              <li key={selectedProduct._id}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="product-image"
                />
                <div>
                  <p>
                    {selectedProduct.name} - {selectedProduct.price} грн
                  </p>
                </div>
              </li>
            </ul>
          </div>
        )}

        {!orderPlaced && (
          <form onSubmit={handleOrder}>
            <label htmlFor="firstName">Ім'я:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="lastName">Прізвище:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="phone">Номер телефону</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="address">Адреса доставки:</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="deliveryOption">Оберіть спосіб доставки:</label>
            <select
              id="deliveryOption"
              name="deliveryOption"
              value={formData.deliveryOption}
              onChange={handleInputChange}
              required
            >
              <option value="nova-poshta">Нова пошта</option>
              <option value="ukrposhta">Укрпошта</option>
            </select>
            <button type="submit">Замовити</button>
          </form>
        )}
        {orderPlaced && (
          <div className="order-placed-message">
            Замовлення прийняте! Через кілька секунд вас буде перенаправлено на
            головну сторінку.
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
