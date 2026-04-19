import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { checkoutOrder } from '../api';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_address: '',
    payment_bank: 'Default Bank'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const items = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));
      
      await checkoutOrder({
        ...checkoutData,
        items
      });
      
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <div className="container">
        <h1>Shopping Cart</h1>
        <div className="empty-state">
          <p>Your cart is empty</p>
          <Link to="/" className="btn btn-primary" style={{marginTop: '20px', display: 'inline-block'}}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Order placed successfully!</h2>
          <p>Thank you for your order. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Shopping Cart</h1>
      
      {!showCheckout ? (
        <>
          <div className="cart-container">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">${parseFloat(item.price).toFixed(2)}</div>
                </div>
                <div className="cart-item-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                  <button 
                    className="btn btn-danger"
                    style={{marginLeft: '10px'}}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            
            <div className="cart-total">
              Total: ${getCartTotal().toFixed(2)}
            </div>
            
            <div style={{marginTop: '20px', textAlign: 'right'}}>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/')}
                style={{marginRight: '10px'}}
              >
                Continue Shopping
              </button>
              <button 
                className="btn btn-success"
                onClick={() => setShowCheckout(true)}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      ) : (
        <form className="checkout-form" onSubmit={handleCheckout}>
          <h2>Checkout</h2>
          
          {error && (
            <div style={{color: '#e74c3c', marginBottom: '16px', padding: '10px', background: '#fdeaea', borderRadius: '4px'}}>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              value={checkoutData.customer_name}
              onChange={(e) => setCheckoutData({...checkoutData, customer_name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              value={checkoutData.customer_phone}
              onChange={(e) => setCheckoutData({...checkoutData, customer_phone: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Delivery Address *</label>
            <textarea
              className="form-input"
              rows="3"
              value={checkoutData.delivery_address}
              onChange={(e) => setCheckoutData({...checkoutData, delivery_address: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Payment Bank</label>
            <input
              type="text"
              className="form-input"
              value={checkoutData.payment_bank}
              onChange={(e) => setCheckoutData({...checkoutData, payment_bank: e.target.value})}
            />
          </div>
          
          <div className="cart-total">
            Total: ${getCartTotal().toFixed(2)}
          </div>
          
          <div className="modal-actions">
            <button 
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowCheckout(false)}
            >
              Back to Cart
            </button>
            <button 
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Cart;
