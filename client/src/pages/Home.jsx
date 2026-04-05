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
      {/* Hero Banner aligned with Login Portal */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch animate-fade-up">
        
        <div className={`rounded-[3rem] p-10 md:p-16 text-left relative overflow-hidden flex flex-col justify-center shadow-[0_20px_50px_rgba(255,71,87,0.3)] lg:col-span-12 bg-gradient-to-br from-brand via-[#FF2E43] to-orange-500`}>
          {/* Animated Background Orbs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/20 blur-3xl rounded-full animate-float"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 bg-[#FFA502]/40 blur-3xl rounded-full animate-float delay-200"></div>
          </div>

          <div className="flex flex-col md:flex-row relative z-10 items-center justify-between">
            <div className="md:w-1/2">
               <span className="inline-block py-1.5 px-4 rounded-full bg-white/20 text-white font-extrabold text-xs uppercase tracking-widest mb-6 backdrop-blur-md shadow-sm border border-white/20">100% Halal & Fresh</span>
               <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-white drop-shadow-md leading-[1.1]">
                 Premium Cuts.<br/>
                 <span className="text-[#FFEAA7]">Delivered Fresh.</span>
               </h1>
               <p className="text-lg md:text-xl text-white/90 mb-10 max-w-lg font-medium leading-relaxed">
                 Experience the most tender, flavorful mutton sourced directly from ethically raised farms. Straight to your kitchen.
               </p>
               
               <div className="relative z-10 flex gap-4">
                 <Link to="/menu" className="bg-white text-brand font-black text-lg px-8 py-4 rounded-full inline-flex items-center gap-3 hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95">
                   Shop The Menu <ShoppingCart className="w-6 h-6"/>
                 </Link>
               </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0 relative flex justify-center z-10 animate-float delay-100">
               <div className="w-[300px] h-[300px] lg:w-[450px] lg:h-[450px] bg-white/10 rounded-full flex items-center justify-center p-8 backdrop-blur-md border border-white/20 shadow-2xl">
                 <img src="https://images.unsplash.com/photo-1603360946369-dc9bb6258143?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Fresh Raw Mutton" className="w-full h-full object-cover rounded-full shadow-inner border-[6px] border-white/50" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Picks Grid */}
      <section className="animate-fade-up delay-100">
        <div className="flex justify-between items-end mb-8 border-b-2 border-gray-100 pb-4">
          <h2 className="text-2xl md:text-3xl font-black text-accent flex items-center gap-3">
             <Star className="text-brand fill-brand w-7 h-7" />
             Top Menu Picks
          </h2>
          <Link to="/menu" className="text-gray-500 font-bold hover:text-brand transition-colors">View All &rarr;</Link>
        </div>

        {loading ? (
          <div className="text-center py-10 font-medium text-brand animate-pulse">Loading legendary cuts...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, idx) => (
              <div key={product._id} className="card bg-white flex flex-col group border border-gray-100 hover:border-brand/30 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1">
                <div className="h-44 overflow-hidden relative bg-brand-light">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🥩</div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-1 rounded text-xs font-black text-brand shadow-sm flex items-center gap-1">
                    <Flame className="w-3 h-3" /> BEST
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-black text-accent line-clamp-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mt-1 mb-5 flex-grow line-clamp-2 font-medium">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-2xl font-black text-brand">₹{product.price_per_kg}</span>
                    </div>
                    <button 
                      onClick={() => addToCart(product, 0.5)}
                      className="btn-primary w-full shadow-lg hover:shadow-brand/20 bg-brand hover:bg-brand-dark transition-all translate-y-2 opacity-100 group-hover:translate-y-0 text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="animate-fade-up delay-200">
        <h2 className="text-3xl font-extrabold mb-8 text-gray-900 flex items-center gap-3 border-b-2 border-brand inline-block pb-2">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { cat: 'Curry Cuts', img: '/images/curry_cut.png' }, 
            { cat: 'Minced (Keema)', img: '/images/keema.png' }, 
            { cat: 'Bones (Nalli)', img: '/images/nalli.png' }, 
            { cat: 'Chops & Ribs', img: '/images/chops.png' }
          ].map((item, i) => (
            <Link to="/menu" key={i} className="card p-6 flex flex-col items-center text-center group hover:bg-brand-light transition-colors cursor-pointer border border-transparent hover:border-brand/20">
              <div className="w-24 h-24 mb-5 group-hover:scale-110 transition-transform duration-500 rounded-full overflow-hidden shadow border-4 border-white ring-2 ring-brand/10">
                <img src={item.img} alt={item.cat} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-lg text-accent">{item.cat}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
