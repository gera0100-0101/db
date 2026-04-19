import React, { useState, useEffect } from 'react';
import {
  getProducts, getCategories, getManufacturers, getShops, getCompanies,
  createProduct, updateProduct, deleteProduct, uploadProductImage, deleteProductImage,
  createCategory, createManufacturer, updateManufacturer, createShop, createCompany,
  getWorkers, createWorker, updateWorker, getPosts, createPost,
  getAdminOrders, updateOrder
} from '../api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [shops, setShops] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', price: '', weight: '', calories: '', structure: '', stock_amount: 0,
    shop_id: '', category_id: '', manufacturer_id: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const promises = [];
      if (activeTab === 'products') {
        promises.push(getProducts().then(setProducts));
        promises.push(getCategories().then(setCategories));
        promises.push(getManufacturers().then(setManufacturers));
        promises.push(getShops().then(setShops));
      } else if (activeTab === 'categories') {
        promises.push(getCategories().then(setCategories));
      } else if (activeTab === 'manufacturers') {
        promises.push(getManufacturers().then(setManufacturers));
      } else if (activeTab === 'shops') {
        promises.push(getShops().then(setShops));
        promises.push(getCompanies().then(setCompanies));
      } else if (activeTab === 'workers') {
        promises.push(getWorkers().then(setWorkers));
        promises.push(getPosts().then(setPosts));
      } else if (activeTab === 'orders') {
        promises.push(getAdminOrders().then(setOrders));
      }
      await Promise.all(promises);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        weight: productForm.weight ? parseFloat(productForm.weight) : null,
        calories: productForm.calories ? parseFloat(productForm.calories) : null,
        stock_amount: parseInt(productForm.stock_amount),
        shop_id: parseInt(productForm.shop_id),
        category_id: productForm.category_id ? parseInt(productForm.category_id) : null,
        manufacturer_id: productForm.manufacturer_id ? parseInt(productForm.manufacturer_id) : null
      };
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      loadData();
    } catch (error) {
      alert('Error saving product: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleImageUpload = async (productId, file) => {
    try {
      await uploadProductImage(productId, file);
      loadData();
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        loadData();
      } catch (error) {
        alert('Error deleting product: ' + error.message);
      }
    }
  };

  const handleAssignCourier = async (orderId, courierId) => {
    try {
      await updateOrder(orderId, { courier_id: parseInt(courierId), status: 'processing' });
      loadData();
    } catch (error) {
      alert('Error assigning courier: ' + error.message);
    }
  };

  const renderProducts = () => (
    <div className="admin-section">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
        <h3 className="admin-section-title" style={{margin: 0}}>Products</h3>
        <button className="btn btn-primary" onClick={() => {
          setEditingProduct(null);
          setProductForm({
            name: '', price: '', weight: '', calories: '', structure: '', stock_amount: 0,
            shop_id: shops[0]?.id || '', category_id: '', manufacturer_id: ''
          });
          setShowProductModal(true);
        }}>
          Add Product
        </button>
      </div>
      
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Shop</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>${parseFloat(product.price).toFixed(2)}</td>
              <td>{product.stock_amount}</td>
              <td>{product.shop?.address || 'N/A'}</td>
              <td>{product.category?.name || 'N/A'}</td>
              <td>
                <button 
                  className="btn btn-secondary" 
                  style={{marginRight: '5px', padding: '4px 8px'}}
                  onClick={() => {
                    setEditingProduct(product);
                    setProductForm({
                      name: product.name,
                      price: product.price.toString(),
                      weight: product.weight?.toString() || '',
                      calories: product.calories?.toString() || '',
                      structure: product.structure || '',
                      stock_amount: product.stock_amount,
                      shop_id: product.shop_id,
                      category_id: product.category_id || '',
                      manufacturer_id: product.manufacturer_id || ''
                    });
                    setShowProductModal(true);
                  }}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger" 
                  style={{padding: '4px 8px'}}
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
                <div style={{marginTop: '8px'}}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleImageUpload(product.id, e.target.files[0])}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderOrders = () => (
    <div className="admin-section">
      <h3 className="admin-section-title">Orders</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Courier</th>
            <th>Address</th>
            <th>Created At</th>
            <th>Assign Courier</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer?.name || 'N/A'}</td>
              <td>${order.check?.total_price?.toFixed(2) || '0.00'}</td>
              <td className={`status-${order.status}`}>{order.status}</td>
              <td>{order.courier?.full_name || 'Not assigned'}</td>
              <td>{order.delivery_address || 'N/A'}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
              <td>
                <select 
                  onChange={(e) => handleAssignCourier(order.id, e.target.value)}
                  value={order.courier_id || ''}
                  style={{padding: '4px'}}
                >
                  <option value="">Select Courier</option>
                  {workers.filter(w => w.post?.name?.toLowerCase().includes('courier') || w.post?.name?.toLowerCase().includes('delivery')).map(worker => (
                    <option key={worker.id} value={worker.id}>{worker.full_name}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container">
      <h1>Admin Panel</h1>
      
      <div className="filters" style={{marginTop: '20px'}}>
        <button 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={`btn ${activeTab === 'categories' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories
        </button>
        <button 
          className={`btn ${activeTab === 'manufacturers' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('manufacturers')}
        >
          Manufacturers
        </button>
        <button 
          className={`btn ${activeTab === 'shops' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('shops')}
        >
          Shops
        </button>
        <button 
          className={`btn ${activeTab === 'workers' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('workers')}
        >
          Workers
        </button>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="admin-panel">
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'categories' && (
            <div className="admin-section">
              <h3 className="admin-section-title">Categories</h3>
              <p>Use API or extend the panel to add categories.</p>
              <table className="data-table">
                <thead><tr><th>ID</th><th>Name</th><th>Description</th></tr></thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}><td>{cat.id}</td><td>{cat.name}</td><td>{cat.description || '-'}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'manufacturers' && (
            <div className="admin-section">
              <h3 className="admin-section-title">Manufacturers</h3>
              <table className="data-table">
                <thead><tr><th>ID</th><th>Name</th><th>Contact</th><th>Phone</th><th>Email</th></tr></thead>
                <tbody>
                  {manufacturers.map(m => (
                    <tr key={m.id}><td>{m.id}</td><td>{m.name}</td><td>{m.contact_person || '-'}</td><td>{m.phone_number || '-'}</td><td>{m.email || '-'}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'workers' && (
            <div className="admin-section">
              <h3 className="admin-section-title">Workers</h3>
              <table className="data-table">
                <thead><tr><th>ID</th><th>Name</th><th>Position</th><th>Phone</th><th>Email</th></tr></thead>
                <tbody>
                  {workers.map(w => (
                    <tr key={w.id}><td>{w.id}</td><td>{w.full_name}</td><td>{w.post?.name || '-'}</td><td>{w.phone_number || '-'}</td><td>{w.email || '-'}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Stock Amount *</label>
                <input
                  type="number"
                  className="form-input"
                  value={productForm.stock_amount}
                  onChange={(e) => setProductForm({...productForm, stock_amount: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Weight (g)</label>
                <input
                  type="number"
                  step="0.001"
                  className="form-input"
                  value={productForm.weight}
                  onChange={(e) => setProductForm({...productForm, weight: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Calories</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={productForm.calories}
                  onChange={(e) => setProductForm({...productForm, calories: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Structure/Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={productForm.structure}
                  onChange={(e) => setProductForm({...productForm, structure: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Shop *</label>
                <select
                  className="form-input"
                  value={productForm.shop_id}
                  onChange={(e) => setProductForm({...productForm, shop_id: e.target.value})}
                  required
                >
                  <option value="">Select Shop</option>
                  {shops.map(shop => (
                    <option key={shop.id} value={shop.id}>{shop.address}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={productForm.category_id}
                  onChange={(e) => setProductForm({...productForm, category_id: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Manufacturer</label>
                <select
                  className="form-input"
                  value={productForm.manufacturer_id}
                  onChange={(e) => setProductForm({...productForm, manufacturer_id: e.target.value})}
                >
                  <option value="">Select Manufacturer</option>
                  {manufacturers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProductModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingProduct ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
