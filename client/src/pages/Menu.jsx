import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import WeightSelector from '../components/WeightSelector';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  if (loading) return <div className="text-center py-20 text-xl font-medium">Loading premium cuts...</div>;

  return (
    <div>
      {selectedProduct && (
        <WeightSelector 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      <div className="mb-12 text-center animate-fade-up">
        <h1 className="text-5xl font-black mb-4 tracking-tight">Our <span className="text-brand">Fresh Cuts</span></h1>
        <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">Customize your order. Select your preferred weight and add to cart.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-10">No products available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <div key={product._id} className={`card p-5 border border-gray-200 flex flex-col rounded-lg hover:shadow-lg transition-all`}>
              <div className="h-56 bg-gray-100 rounded-xl mb-5 flex items-center justify-center overflow-hidden border border-gray-200 shadow-inner group">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <span className="text-6xl group-hover:scale-125 transition-transform duration-500">🥩</span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-5 flex-grow leading-relaxed">{product.description}</p>
              
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Starts from</p>
                  <span className="text-2xl font-bold text-brand">₹{product.price_per_kg}</span>
                  <span className="text-xs text-gray-500 ml-1">/ kg</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedProduct(product)}
                className="btn-primary w-full bg-brand hover:bg-brand-dark text-white font-bold py-2 rounded-lg transition-all"
              >
                Customize & Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
