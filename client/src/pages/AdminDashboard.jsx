import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { LayoutDashboard, Users, ShoppingBag, TrendingUp, CheckCircle, XCircle, PackagePlus, Edit2, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'menu'

  // Product Form State
  const [formData, setFormData] = useState({ id: null, name: '', price_per_kg: '', description: '', image: '', discount: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products')
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchData(); // Refresh orders after update
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  // Menu Management Handlers
  const handleProductChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {  // 2MB limit warning
        setMsg({ type: 'error', text: 'Image is too large. Please upload an image smaller than 2MB.'});
        return;
      }
      setMsg({ type: '', text: '' }); // Clear error
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      if (isEditing) {
        await api.put(`/products/${formData.id}`, formData);
        setMsg({ type: 'success', text: 'Product updated successfully!' });
      } else {
        await api.post('/products', formData);
        setMsg({ type: 'success', text: 'Product added successfully!' });
      }
      resetForm();
      fetchData();
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.message || 'Error processing product' });
    }
  };

  const editProduct = (product) => {
    setIsEditing(true);
    setFormData({
      id: product._id,
      name: product.name,
      price_per_kg: product.price_per_kg,
      description: product.description || '',
      image: product.image || '',
      discount: product.discount || 0
    });
    setActiveTab('menu');
    window.scrollTo(0, 0);
  };

  const deleteProduct = async (id) => {
    if(window.confirm('Are you sure you want to completely remove this cut from the menu?')) {
      try {
        await api.delete(`/products/${id}`);
        setMsg({ type: 'success', text: 'Product removed.' });
        fetchData();
      } catch(error) {
        setMsg({ type: 'error', text: 'Failed to delete custom product.' });
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormData({ id: null, name: '', price_per_kg: '', description: '', image: '', discount: 0 });
  };

  if (loading) return <div className="text-center py-20 text-xl font-medium animate-pulse">Loading Administrative Data...</div>;

  const totalRevenue = orders.filter(o => o.order_status !== 'Cancelled').reduce((acc, order) => acc + order.total_amount, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaysOrdersCount = orders.filter(o => new Date(o.createdAt || o.updatedAt) >= today).length;

  return (
    <div className="space-y-8">
      <div className="border-b-2 border-brand pb-5 mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-brand flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8" />
            Khaleel Bhai Admin
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Store Operations & Menu Management.</p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-md font-bold transition-all ${activeTab === 'orders' ? 'bg-white shadow text-brand' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Orders Summary
          </button>
          <button 
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-2 rounded-md font-bold transition-all flex items-center gap-2 ${activeTab === 'menu' ? 'bg-white shadow text-brand' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Manage Menu <PackagePlus className="w-4 h-4"/>
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <>
          {/* Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 bg-gradient-to-br from-red-50 to-red-100 border border-brand/20 shadow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-brand rounded-xl text-white shadow-lg"><ShoppingBag className="w-6 h-6" /></div>
                <div>
                  <p className="text-brand-dark font-bold text-xs uppercase tracking-wide">Total Orders</p>
                  <h3 className="text-3xl font-black text-brand">{orders.length}</h3>
                </div>
              </div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-600 rounded-xl text-white shadow-lg"><CheckCircle className="w-6 h-6" /></div>
                <div>
                  <p className="text-blue-900 font-bold text-xs uppercase tracking-wide">Today's Orders</p>
                  <h3 className="text-3xl font-black text-blue-900">{todaysOrdersCount}</h3>
                </div>
              </div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-accent/30 shadow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-accent rounded-xl text-white shadow-lg"><TrendingUp className="w-6 h-6" /></div>
                <div>
                  <p className="text-yellow-900 font-bold text-xs uppercase tracking-wide">Total Revenue</p>
                  <h3 className="text-3xl font-black text-yellow-900">₹{totalRevenue}</h3>
                </div>
              </div>
            </div>
            <div className="card p-6 bg-white border border-gray-200 shadow">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-800 rounded-xl text-white shadow-lg"><Users className="w-6 h-6" /></div>
                <div>
                  <p className="text-gray-600 font-bold text-xs uppercase tracking-wide">Customers</p>
                  <h3 className="text-3xl font-black text-gray-900">{new Set(orders.map(o => o.user_id?._id)).size}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="card overflow-hidden mt-12 border border-gray-200 shadow-xl">
            <div className="px-6 py-5 border-b-2 border-brand bg-gray-50 flex justify-between items-center">
              <h2 className="text-2xl font-extrabold text-gray-800">Recent Customer Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Order Items</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">Accept / Manage</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.length === 0 ? (
                    <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium text-lg">No orders found. Sit tight!</td></tr>
                  ) : orders.map(order => (
                    <tr key={order._id} className="hover:bg-brand-light/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand">#{order._id.substring(order._id.length - 6)}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-extrabold text-gray-900">{order.user_id?.name || 'Unknown User'}</div>
                        <div className="text-sm text-gray-600 font-medium">{order.phone}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs mt-1 bg-gray-100 inline-block px-2 py-1 rounded">{order.delivery_address}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {order.items.map(item => (
                          <div key={item._id} className="mb-1 border-b border-gray-100 last:border-0 pb-1">{item.name} <span className="font-bold text-gray-900 ml-1">x {item.quantity}kg</span></div>
                        ))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-black text-green-700">₹{order.total_amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full border shadow-sm
                          ${order.order_status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                          ${order.order_status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse' : ''}
                          ${order.order_status === 'Processing' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                          ${order.order_status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                        `}>
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {order.order_status === 'Pending' ? (
                          <div className="flex items-center justify-center gap-2">
                             <button onClick={() => updateOrderStatus(order._id, 'Processing')} title="Accept Order" className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:scale-110 transition-all shadow-md">
                               <CheckCircle className="w-5 h-5" />
                             </button>
                             <button onClick={() => updateOrderStatus(order._id, 'Cancelled')} title="Deny Order" className="p-2 bg-red-50 text-red-600 rounded-lg. hover:bg-red-100 hover:scale-110 transition-all border border-red-200">
                               <XCircle className="w-5 h-5" />
                             </button>
                          </div>
                        ) : (
                          <select 
                            className="input-field py-1 px-2 text-sm max-w-[140px] font-bold text-gray-700"
                            value={order.order_status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add/Edit Form */}
          <div className="lg:col-span-4">
            <div className="card p-6 border-t-4 border-t-accent sticky top-28 shadow-xl">
              <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2">
                {isEditing ? <Edit2 className="w-5 h-5 text-accent"/> : <PackagePlus className="w-5 h-5 text-brand"/>}
                {isEditing ? 'Edit Menu Item' : 'Add New Cut'}
              </h2>

              {msg.text && (
                <div className={`p-3 rounded mb-4 text-sm font-bold ${msg.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleProductChange} className="input-field bg-gray-50" placeholder="e.g., Keema Mutton" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price per Kg (₹)</label>
                  <input required type="number" name="price_per_kg" value={formData.price_per_kg} onChange={handleProductChange} className="input-field bg-gray-50" placeholder="950" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Discount (%)</label>
                  <input type="number" min="0" max="100" name="discount" value={formData.discount} onChange={handleProductChange} className="input-field bg-gray-50" placeholder="10" />
                  {formData.discount > 0 && (
                    <p className="text-xs text-green-600 mt-1 font-medium">Discounted price: ₹{Math.round(formData.price_per_kg * (1 - formData.discount / 100))}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea rows="3" name="description" value={formData.description} onChange={handleProductChange} className="input-field bg-gray-50" placeholder="Describe the cut..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden group">
                    {formData.image ? (
                        <>
                          <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" />
                          <span className="z-10 font-bold bg-white/90 px-3 py-1 rounded shadow text-sm">Change Image</span>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <PackagePlus className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="mb-1 text-sm text-gray-500 font-bold">Click to upload image</p>
                            <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
                        </div>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1 bg-gray-900 border border-gray-900">
                    {isEditing ? 'Update Item' : 'Add Item'}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={resetForm} className="btn-secondary">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Product Items Table */}
          <div className="lg:col-span-8">
            <div className="card overflow-hidden border border-gray-200">
              <div className="px-6 py-4 bg-gray-50 border-b">
                 <h2 className="text-xl font-bold">Current Mutton Menu ({products.length})</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {products.length === 0 ? (
                  <li className="p-8 text-center text-gray-500">No items on the menu. Add some!</li>
                ) : products.map(product => (
                  <li key={product._id} className="p-4 sm:p-6 hover:bg-gray-50 flex items-center justify-between gap-4 relative">
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-16 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        {product.discount}% OFF
                      </div>
                    )}
                    <div className="flex items-center gap-4 flex-grow">
                      <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 border shadow-sm">
                        {product.image ? <img src={product.image} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-2xl">🥩</div>}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                        <div className="text-brand font-black text-sm mt-1">
                          ₹{Math.round(product.price_per_kg * (1 - (product.discount || 0) / 100))} 
                          {product.discount > 0 && <span className="line-through text-gray-400 ml-2">₹{product.price_per_kg}</span>}
                          <span className="font-medium text-gray-500"> / kg</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => editProduct(product)} className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 hover:text-brand-dark transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => deleteProduct(product._id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
