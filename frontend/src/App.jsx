import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import Header from './components/Header';
import Products from './components/Products';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
