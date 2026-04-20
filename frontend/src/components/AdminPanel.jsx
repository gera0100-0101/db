import React, { useState, useEffect } from 'react';
import {
  getProducts, getCategories, getManufacturers, getShops, getCompanies,
  createProduct, updateProduct, deleteProduct, uploadProductImage, deleteProductImage,
  createCategory, updateCategory, deleteCategory,
  createManufacturer, updateManufacturer, deleteManufacturer,
  createShop, updateShop, deleteShop,
  createCompany,
  getWorkers, createWorker, updateWorker, deleteWorker, getPosts, createPost,
  getAdminOrders, updateOrder, deleteOrder
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

  // Category modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  // Manufacturer modal
  const [showManufacturerModal, setShowManufacturerModal] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState(null);
  const [manufacturerForm, setManufacturerForm] = useState({
    name: '', contact_person: '', phone_number: '', email: '', location: ''
  });

  // Shop modal
  const [showShopModal, setShowShopModal] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [shopForm, setShopForm] = useState({ company_id: '', address: '' });

  // Company modal
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [companyForm, setCompanyForm] = useState({ company_name: '' });

  // Worker modal
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [editingWorker, setEditingWorker] = useState(null);
  const [workerForm, setWorkerForm] = useState({
    full_name: '', email: '', phone_number: '', post_id: ''
  });

  // Post modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [postForm, setPostForm] = useState({ name: '', salary: '' });

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

  const handleDeleteOrder = async (id) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(id);
        loadData();
      } catch (error) {
        alert('Error deleting order: ' + error.message);
      }
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryForm);
      } else {
        await createCategory(categoryForm);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '' });
      loadData();
    } catch (error) {
      alert('Error saving category: ' + error.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        loadData();
      } catch (error) {
        alert('Error deleting category: ' + error.message);
      }
    }
  };

  const handleManufacturerSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingManufacturer) {
        await updateManufacturer(editingManufacturer.id, manufacturerForm);
      } else {
        await createManufacturer(manufacturerForm);
      }
      setShowManufacturerModal(false);
      setEditingManufacturer(null);
      loadData();
    } catch (error) {
      alert('Error saving manufacturer: ' + error.message);
    }
  };

  const handleDeleteManufacturer = async (id) => {
    if (confirm('Are you sure you want to delete this manufacturer?')) {
      try {
        await deleteManufacturer(id);
        loadData();
      } catch (error) {
        alert('Error deleting manufacturer: ' + error.message);
      }
    }
  };

  const handleShopSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingShop) {
        await updateShop(editingShop.id, { ...shopForm, company_id: parseInt(shopForm.company_id) });
      } else {
        const shopData = { ...shopForm, company_id: parseInt(shopForm.company_id) };
        await createShop(shopData);
      }
      setShowShopModal(false);
      setEditingShop(null);
      setShopForm({ company_id: '', address: '' });
      loadData();
    } catch (error) {
      alert('Error saving shop: ' + error.message);
    }
  };

  const handleDeleteShop = async (id) => {
    if (confirm('Are you sure you want to delete this shop?')) {
      try {
        await deleteShop(id);
        loadData();
      } catch (error) {
        alert('Error deleting shop: ' + error.message);
      }
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      await createCompany(companyForm);
      setShowCompanyModal(false);
      setCompanyForm({ company_name: '' });
      loadData();
    } catch (error) {
      alert('Error saving company: ' + error.message);
    }
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    try {
      const workerData = {
        ...workerForm,
        post_id: workerForm.post_id ? parseInt(workerForm.post_id) : null
      };
      if (editingWorker) {
        await updateWorker(editingWorker.id, workerData);
      } else {
        await createWorker(workerData);
      }
      setShowWorkerModal(false);
      setEditingWorker(null);
      setWorkerForm({ full_name: '', email: '', phone_number: '', post_id: '' });
      loadData();
    } catch (error) {
      alert('Error saving worker: ' + error.message);
    }
  };

  const handleDeleteWorker = async (id) => {
    if (confirm('Are you sure you want to delete this worker?')) {
      try {
        await deleteWorker(id);
        loadData();
      } catch (error) {
        alert('Error deleting worker: ' + error.message);
      }
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = { ...postForm, salary: parseFloat(postForm.salary) };
      await createPost(postData);
      setShowPostModal(false);
      setPostForm({ name: '', salary: '' });
      loadData();
    } catch (error) {
      alert('Error saving post: ' + error.message);
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
            <th>Actions</th>
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
              <td>
                <button 
                  className="btn btn-danger" 
                  style={{padding: '4px 8px'}}
                  onClick={() => handleDeleteOrder(order.id)}
                >
                  Delete
                </button>
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
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <h3 className="admin-section-title" style={{margin: 0}}>Categories</h3>
                <button className="btn btn-primary" onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({ name: '', description: '' });
                  setShowCategoryModal(true);
                }}>Add Category</button>
              </div>
              <table className="data-table">
                <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr></thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat.id}>
                      <td>{cat.id}</td>
                      <td>{cat.name}</td>
                      <td>{cat.description || '-'}</td>
                      <td>
                        <button 
                          className="btn btn-secondary" 
                          style={{marginRight: '5px', padding: '4px 8px'}}
                          onClick={() => {
                            setEditingCategory(cat);
                            setCategoryForm({ name: cat.name, description: cat.description || '' });
                            setShowCategoryModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{padding: '4px 8px'}}
                          onClick={() => handleDeleteCategory(cat.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'manufacturers' && (
            <div className="admin-section">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <h3 className="admin-section-title" style={{margin: 0}}>Manufacturers</h3>
                <button className="btn btn-primary" onClick={() => {
                  setEditingManufacturer(null);
                  setManufacturerForm({ name: '', contact_person: '', phone_number: '', email: '', location: '' });
                  setShowManufacturerModal(true);
                }}>Add Manufacturer</button>
              </div>
              <table className="data-table">
                <thead><tr><th>ID</th><th>Name</th><th>Contact</th><th>Phone</th><th>Email</th><th>Location</th><th>Actions</th></tr></thead>
                <tbody>
                  {manufacturers.map(m => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>{m.name}</td>
                      <td>{m.contact_person || '-'}</td>
                      <td>{m.phone_number || '-'}</td>
                      <td>{m.email || '-'}</td>
                      <td>{m.location || '-'}</td>
                      <td>
                        <button 
                          className="btn btn-secondary" 
                          style={{marginRight: '5px', padding: '4px 8px'}}
                          onClick={() => {
                            setEditingManufacturer(m);
                            setManufacturerForm({ name: m.name, contact_person: m.contact_person || '', phone_number: m.phone_number || '', email: m.email || '', location: m.location || '' });
                            setShowManufacturerModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{padding: '4px 8px'}}
                          onClick={() => handleDeleteManufacturer(m.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'shops' && (
            <div className="admin-section">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <h3 className="admin-section-title" style={{margin: 0}}>Shops</h3>
                <button className="btn btn-primary" onClick={() => {
                  setEditingShop(null);
                  setShopForm({ company_id: companies[0]?.id || '', address: '' });
                  setShowShopModal(true);
                }}>Add Shop</button>
              </div>
              <table className="data-table">
                <thead><tr><th>ID</th><th>Company</th><th>Address</th><th>Actions</th></tr></thead>
                <tbody>
                  {shops.map(shop => (
                    <tr key={shop.id}>
                      <td>{shop.id}</td>
                      <td>{shop.company?.company_name || 'N/A'}</td>
                      <td>{shop.address}</td>
                      <td>
                        <button 
                          className="btn btn-secondary" 
                          style={{marginRight: '5px', padding: '4px 8px'}}
                          onClick={() => {
                            setEditingShop(shop);
                            setShopForm({ company_id: shop.company_id, address: shop.address });
                            setShowShopModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{padding: '4px 8px'}}
                          onClick={() => handleDeleteShop(shop.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'workers' && (
            <div className="admin-section">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <h3 className="admin-section-title" style={{margin: 0}}>Workers</h3>
                <button className="btn btn-primary" onClick={() => {
                  setEditingWorker(null);
                  setWorkerForm({ full_name: '', email: '', phone_number: '', post_id: '' });
                  setShowWorkerModal(true);
                }}>Add Worker</button>
              </div>
              <table className="data-table">
                <thead><tr><th>ID</th><th>Name</th><th>Position</th><th>Phone</th><th>Email</th><th>Actions</th></tr></thead>
                <tbody>
                  {workers.map(w => (
                    <tr key={w.id}>
                      <td>{w.id}</td>
                      <td>{w.full_name}</td>
                      <td>{w.post?.name || '-'}</td>
                      <td>{w.phone_number || '-'}</td>
                      <td>{w.email || '-'}</td>
                      <td>
                        <button 
                          className="btn btn-secondary" 
                          style={{marginRight: '5px', padding: '4px 8px'}}
                          onClick={() => {
                            setEditingWorker(w);
                            setWorkerForm({ full_name: w.full_name, email: w.email || '', phone_number: w.phone_number || '', post_id: w.post_id || '' });
                            setShowWorkerModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger" 
                          style={{padding: '4px 8px'}}
                          onClick={() => handleDeleteWorker(w.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
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

      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleCategorySubmit}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCategoryModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingCategory ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showManufacturerModal && (
        <div className="modal-overlay" onClick={() => setShowManufacturerModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{editingManufacturer ? 'Edit Manufacturer' : 'Add Manufacturer'}</h3>
            <form onSubmit={handleManufacturerSubmit}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={manufacturerForm.name}
                  onChange={(e) => setManufacturerForm({...manufacturerForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Person</label>
                <input
                  type="text"
                  className="form-input"
                  value={manufacturerForm.contact_person}
                  onChange={(e) => setManufacturerForm({...manufacturerForm, contact_person: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={manufacturerForm.phone_number}
                  onChange={(e) => setManufacturerForm({...manufacturerForm, phone_number: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={manufacturerForm.email}
                  onChange={(e) => setManufacturerForm({...manufacturerForm, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <textarea
                  className="form-input"
                  rows="2"
                  value={manufacturerForm.location}
                  onChange={(e) => setManufacturerForm({...manufacturerForm, location: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowManufacturerModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingManufacturer ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showShopModal && (
        <div className="modal-overlay" onClick={() => setShowShopModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{editingShop ? 'Edit Shop' : 'Add Shop'}</h3>
            <form onSubmit={handleShopSubmit}>
              <div className="form-group">
                <label className="form-label">Company *</label>
                <select
                  className="form-input"
                  value={shopForm.company_id}
                  onChange={(e) => setShopForm({...shopForm, company_id: e.target.value})}
                  required
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.company_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Address *</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={shopForm.address}
                  onChange={(e) => setShopForm({...shopForm, address: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowShopModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingShop ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCompanyModal && (
        <div className="modal-overlay" onClick={() => setShowCompanyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Add Company</h3>
            <form onSubmit={handleCompanySubmit}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyForm.company_name}
                  onChange={(e) => setCompanyForm({...companyForm, company_name: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCompanyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showWorkerModal && (
        <div className="modal-overlay" onClick={() => setShowWorkerModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">{editingWorker ? 'Edit Worker' : 'Add Worker'}</h3>
            <form onSubmit={handleWorkerSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={workerForm.full_name}
                  onChange={(e) => setWorkerForm({...workerForm, full_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={workerForm.email}
                  onChange={(e) => setWorkerForm({...workerForm, email: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={workerForm.phone_number}
                  onChange={(e) => setWorkerForm({...workerForm, phone_number: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Position</label>
                <select
                  className="form-input"
                  value={workerForm.post_id}
                  onChange={(e) => setWorkerForm({...workerForm, post_id: e.target.value})}
                >
                  <option value="">Select Position</option>
                  {posts.map(post => (
                    <option key={post.id} value={post.id}>{post.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowWorkerModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingWorker ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Add Post</h3>
            <form onSubmit={handlePostSubmit}>
              <div className="form-group">
                <label className="form-label">Post Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={postForm.name}
                  onChange={(e) => setPostForm({...postForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Salary *</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={postForm.salary}
                  onChange={(e) => setPostForm({...postForm, salary: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPostModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
