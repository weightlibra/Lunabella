import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [authors, setAuthors] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState("All");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
        const uniqueCategories = [
          ...new Set(data.map((product) => product.category)),
        ];
        setCategories(["All", ...uniqueCategories]);

        const uniqueAuthors = [
          ...new Set(data.map((product) => product.author)),
        ];
        setAuthors(["All", ...uniqueAuthors]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedAuthors !== "All") {
      filtered = filtered.filter(
        (product) => product.author === selectedAuthors
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (minPrice !== "" || maxPrice !== "") {
      filtered = filtered.filter((product) => {
        const price = parseFloat(product.price);
        if (minPrice !== "" && price < parseFloat(minPrice)) {
          return false;
        }
        if (maxPrice !== "" && price > parseFloat(maxPrice)) {
          return false;
        }
        return true;
      });
    }

    setFilteredProducts(filtered);
  }, [
    products,
    selectedCategory,
    searchTerm,
    minPrice,
    maxPrice,
    selectedAuthors,
  ]);

  const handleAuthorChange = (autor) => {
    setSelectedAuthors(autor);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="logo">
      <Link to={"/"}>
        <h1>Lunabella</h1>
      </Link>
      <div className="App">
        <div className="sidebar">
          <input
            type="text"
            placeholder="Пошук за назвою"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <h2>Категорії</h2>
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                className={selectedCategory === category ? "active" : ""}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </li>
            ))}
          </ul>

          <h2>Фільтр за ціною</h2>
          <div>
            <input
              type="number"
              placeholder="Мінімальна ціна"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="price-input"
            />
            <input
              type="number"
              placeholder="Максимальна ціна"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="price-input"
            />
          </div>
          <h2>Автори</h2>
          <ul>
            {authors.map((author, index) => (
              <li
                key={index}
                className={selectedAuthors === author ? "active" : ""}
                onClick={() => handleAuthorChange(author)}
              >
                {author}
              </li>
            ))}
          </ul>
        </div>

        <div className="product-list">
          {filteredProducts.length === 0 ? (
            <div className="not-found">Товар не знайдено</div>
          ) : (
            filteredProducts.map((product, index) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
