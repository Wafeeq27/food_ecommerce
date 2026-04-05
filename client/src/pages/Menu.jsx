import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, value) => {
    setQuantities(prev => ({ ...prev, [id]: Number(value) }));
  };

  const currentQuantity = (id) => quantities[id] || 0.5; // Default 500g

  if (loading) return <div className="text-center py-20 text-xl font-medium">Loading premium cuts...</div>;

  return (
    <div>
      <div className="mb-12 text-center animate-fade-up">
        <h1 className="text-5xl font-black mb-4 tracking-tight">Our <span className="text-brand">Fresh Cuts</span></h1>
        <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">Select from our variety of highest quality mutton cuts, perfectly portioned for your recipe.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10">No products available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <div key={product._id} className={`card p-5 border-2 border-transparent hover:border-brand/20 flex flex-col animate-fade-up delay-${(idx % 3) * 100 + 100}`}>
              <div className="h-56 bg-brand-light rounded-[1.5rem] mb-5 flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner group">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <span className="text-6xl group-hover:scale-125 transition-transform duration-500">🥩</span>
                )}
              </div>
              <h3 className="text-2xl font-black mb-2 text-gray-900">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-5 flex-grow font-medium leading-relaxed">{product.description}</p>
              
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-gray-900">₹{product.price_per_kg} <span className="text-sm text-gray-500 font-normal">/ kg</span></span>
              </div>

              <div className="flex items-center space-x-4">
                <select 
                  className="input-field w-28 bg-gray-50"
                  value={currentQuantity(product._id)}
                  onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                >
                  <option value={0.1}>100 g</option>
                  <option value={0.25}>250 g</option>
                  <option value={0.5}>500 g</option>
                  <option value={1}>1 kg</option>
                  <option value={1.5}>1.5 kg</option>
                  <option value={2}>2 kg</option>
                  <option value={3}>3 kg</option>
                </select>
                <button 
                  onClick={() => addToCart(product, currentQuantity(product._id))}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
