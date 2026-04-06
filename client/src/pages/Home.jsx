import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, Flame, Clock, Star, User, Mail, Lock, Phone } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const { user, setAuthModalOpen } = useContext(AuthContext);
  const navigate = useNavigate();

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

  return (
    <div className="space-y-16 pb-12 overflow-hidden">
      {/* Hero Banner - Clean Minimal Design */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fade-up">
        
        <div className="rounded-2xl p-8 md:p-12 text-left relative overflow-hidden flex flex-col justify-center bg-white border border-gray-200 shadow-sm lg:col-span-12">
          <div className="flex flex-col md:flex-row relative z-10 items-center justify-between gap-8">
            <div className="md:w-1/2">
               <span className="inline-block py-1.5 px-4 rounded-full bg-gray-100 text-brand font-bold text-xs uppercase tracking-widest mb-4">Premium Quality • Halal Certified</span>
               <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900 leading-[1.2]">
                 Farm Fresh Meats<br/>
                 <span className="text-brand">Delivered Fresh</span>
               </h1>
               <p className="text-base md:text-lg text-gray-600 mb-8 max-w-lg font-medium leading-relaxed">
                 Hand-picked cuts of premium mutton, chicken, and seafood. Fresh from our farms, straight to your kitchen with our real-time freshness tracker.
               </p>
               
               <div className="relative z-10 flex gap-4">
                 <Link to="/menu" className="bg-brand text-white font-bold text-base px-8 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-brand-dark transition-all shadow-md hover:shadow-lg active:scale-95">
                   Shop Now <ShoppingCart className="w-5 h-5"/>
                 </Link>
               </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 relative flex justify-center z-10">
               <div className="w-[250px] h-[250px] lg:w-[350px] lg:h-[350px] rounded-xl flex items-center justify-center overflow-hidden shadow-md border border-gray-200">
                 <img src="https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Fresh Raw Mutton" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Picks Grid */}
      <section className="animate-fade-up delay-100">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
             <Star className="text-brand fill-brand w-6 h-6" />
             Top Picks For You
          </h2>
          <Link to="/menu" className="text-gray-600 font-semibold hover:text-brand transition-colors text-sm">View All &rarr;</Link>
        </div>

        {loading ? (
          <div className="text-center py-10 font-medium text-gray-500 animate-pulse">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.slice(0, 4).map((product, idx) => (
              <div key={product._id} className="card bg-white flex flex-col group border border-gray-200 hover:border-brand/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden" title="1 item = 500g">
                <div className="h-40 overflow-hidden relative bg-gray-100">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🥩</div>
                  )}
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-base font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-xs mt-1 mb-4 flex-grow line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <span className="text-xl font-bold text-brand">₹{product.price_per_kg}</span>
                    <button 
                      onClick={() => addToCart(product, 0.5)}
                      className="btn-primary bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Chicken Cuts Section */}
      <section className="animate-fade-up delay-200">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Premium Chicken Cuts</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              _id: 'chicken-1',
              name: 'Chicken Curry Cut (Skin Off)',
              description: 'Perfect sized chunks ideal for curries and stews',
              price_per_kg: 280,
              image: 'https://images.unsplash.com/photo-1585238341710-4dd0de0a3664?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
            },
            {
              _id: 'chicken-2',
              name: 'Chicken Boneless Cubes',
              description: 'Tender boneless pieces for quick cooking',
              price_per_kg: 320,
              image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
            }
          ].map((product) => (
            <div key={product._id} className="card bg-white flex flex-col group border border-gray-200 hover:border-brand/50 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden" title="1 item = 500g">
              <div className="h-40 overflow-hidden relative bg-gray-100">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🍗</div>
                )}
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-base font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-xs mt-1 mb-4 flex-grow line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                  <span className="text-xl font-bold text-brand">₹{product.price_per_kg}</span>
                  <button 
                    onClick={() => addToCart(product, 0.5)}
                    className="btn-primary bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded transition-all"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
