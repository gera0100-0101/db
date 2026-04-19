import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../CartContext';

const Header = () => {
  const { getCartCount } = useCart();
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">🛒 FoodStore</Link>
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Products
          </Link>
          <Link to="/cart" className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`}>
            Cart
            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
          </Link>
          <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
