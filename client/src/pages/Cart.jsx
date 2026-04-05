import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { Trash2, ShoppingBag, ShoppingCart } from 'lucide-react';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount } = useContext(CartContext);
  const { user, setAuthModalOpen } = useContext(AuthContext);
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any fresh cuts yet.</p>
        <Link to="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }



  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/');
      return;
    }

    try {
      setPlacingOrder(true);
      setErrorMsg('');
      const orderData = {
        items: cartItems,
        total_amount: totalAmount,
        delivery_address: deliveryAddress,
        phone
      };

      await api.post('/orders', orderData);
      clearCart();
      navigate('/order-confirmation', { state: { message: 'Your mutton order is on its way. Sit back and relax!' } });
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  const renderWeight = (qty) => {
    return qty < 1 ? `${Math.round(qty * 1000)}g` : `${qty} kg`;
  };

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-8 animate-fade-up">
      <div className="lg:col-span-8">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Your Cart</h2>
          <button onClick={clearCart} className="text-red-500 font-bold text-sm hover:text-red-700 hover:underline">Clear Entire Cart</button>
        </div>
        
        <div className="space-y-4">
          {cartItems.map(item => (
            <div key={item.product_id} className="card p-5 flex flex-col sm:flex-row items-center gap-6 border-b-4 border-b-transparent hover:border-b-brand/20">
              <div className="w-24 h-24 bg-gray-100 rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🥩</span>
                )}
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-500 font-medium mt-1">₹{item.price} / kg</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateQuantity(item.product_id, item.quantity - 0.1)} className="w-8 h-8 rounded-full bg-gray-100 font-bold hover:bg-gray-200">-</button>
                  <span className="w-14 text-center font-bold text-gray-800">{renderWeight(item.quantity)}</span>
                  <button onClick={() => updateQuantity(item.product_id, item.quantity + 0.1)} className="w-8 h-8 rounded-full bg-gray-100 font-bold hover:bg-gray-200">+</button>
                </div>
                <div className="font-bold text-lg w-20 text-right">
                  ₹{Math.round(item.price * item.quantity)}
                </div>
                <button onClick={() => removeFromCart(item.product_id)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-full">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 mt-8 lg:mt-0">
        <div className="card p-8 bg-gray-50 border-2 border-gray-100">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">Order Summary</h2>
          <div className="flex justify-between mb-4 text-gray-600">
            <span>Subtotal</span>
            <span className="font-semibold text-gray-900">₹{totalAmount}</span>
          </div>
          <div className="flex justify-between mb-4 text-gray-600">
            <span>Delivery</span>
            <span className="font-semibold text-green-600">Free</span>
          </div>
          <div className="flex justify-between mt-6 pt-6 border-t border-gray-200 text-xl font-bold">
            <span>Total</span>
            <span className="text-brand">₹{totalAmount}</span>
          </div>

          <form onSubmit={handleCheckout} className="mt-8 space-y-4">
            <h3 className="font-semibold text-lg mb-2">Delivery Details</h3>
            {errorMsg && <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm">{errorMsg}</div>}
            
            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md mb-4 text-sm animate-pulse">
                You need to <button type="button" onClick={() => setAuthModalOpen(true)} className="font-black text-yellow-900 underline cursor-pointer hover:text-brand">Login or Register</button> to place an order.
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <textarea 
                required 
                disabled={!user}
                rows="3" 
                className="input-field" 
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="123 Main St, Apartment 4B"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                required
                disabled={!user}
                className="input-field" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 "
              />
            </div>
            <button 
              type="submit" 
              disabled={!user || placingOrder}
              className={`w-full py-4 rounded-lg font-bold text-lg mt-6 shadow-xl transition-all ${
                !user ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {placingOrder ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cart;
