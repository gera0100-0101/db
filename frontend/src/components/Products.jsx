import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { getProducts, getCategories, getShops } from '../api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedShop]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData, shopsData] = await Promise.all([
        getProducts(selectedShop || null, selectedCategory || null),
        getCategories(),
        getShops()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setShops(shopsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="container">
      <h1>Our Products</h1>
      
      <div className="filters">
        <select 
          className="filter-select"
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select 
          className="filter-select"
          value={selectedShop} 
          onChange={(e) => setSelectedShop(e.target.value)}
        >
          <option value="">All Shops</option>
          {shops.map(shop => (
            <option key={shop.id} value={shop.id}>{shop.address}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found</div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              {product.image_groups && product.image_groups.length > 0 && 
               product.image_groups[0].images && product.image_groups[0].images.length > 0 ? (
                <img 
                  src={`http://localhost:8000${product.image_groups[0].images[0].link}`} 
                  alt={product.name}
                  className="product-image"
                />
              ) : (
                <div className="product-image" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0'}}>
                  <span style={{color: '#999'}}>No Image</span>
                </div>
              )}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                {product.structure && (
                  <p className="product-description">{product.structure}</p>
                )}
                <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
                <p className="product-stock">In stock: {product.stock_amount}</p>
                {product.weight && <p className="product-stock">Weight: {product.weight}g</p>}
                {product.calories && <p className="product-stock">Calories: {product.calories}</p>}
                <button 
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock_amount === 0}
                >
                  {product.stock_amount === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
