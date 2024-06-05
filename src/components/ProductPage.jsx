import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ProductPage.css";

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [viewedProducts, setViewedProducts] = useState([]);
  const { productId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/product/")
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.find((product) => product._id === productId));
      });
    const viewedProductsFromStorage =
      JSON.parse(localStorage.getItem("viewedProducts")) || [];
    setViewedProducts(viewedProductsFromStorage);
  }, [productId]);

  useEffect(() => {
    if (product) {
      const updatedViewedProducts = [
        product,
        ...viewedProducts.filter((p) => p._id !== product._id),
      ].slice(0, 5);
      setViewedProducts(updatedViewedProducts);
      localStorage.setItem(
        "viewedProducts",
        JSON.stringify(updatedViewedProducts)
      );
    }
  }, [product]);
  const handleBuyNow = () => {
    navigate("/checkout", { state: { selectedProduct: product } });
  };

  if (!product) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="product-page">
      <Link to={"/"}>
        <h1>Lunabella</h1>
      </Link>
      <div className="product-details">
        <h2>{product.name}</h2>
        <img src={product.image} alt={product.name} />
        <p>Автор: {product.author}</p>
        <p>{product.description}</p>
        <p className="product-price">Ціна: {product.price} грн</p>
        <button onClick={handleBuyNow}>Придбати</button>{" "}
      </div>
      <h3>Рекомендовані товари:</h3>
      <div className="viewed-products">
        {viewedProducts
          .filter((value, index) => index !== 0)
          .map((product, index) => (
            <Link
              key={index}
              to={`/product/${product._id}`}
              className="product-item"
            >
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price} грн</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default ProductPage;
