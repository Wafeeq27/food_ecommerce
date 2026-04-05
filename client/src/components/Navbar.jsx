import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, LogOut, User, ShoppingBag, Menu, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout, setAuthModalOpen } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isCartEmpty = cartItems.length === 0;

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-brand to-[#FF6B81] p-2.5 rounded-2xl shadow-lg shadow-brand/30 group-hover:scale-110 transition-transform">
              <ShoppingBag className="text-white w-7 h-7" />
            </div>
            <span className="text-3xl font-black tracking-tight text-gray-900 group-hover:text-brand transition-colors">
              Khaleel Bhai
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/menu" className="hidden md:flex flex-col items-center text-gray-500 hover:text-brand font-extrabold transition-colors">
              <Menu className="w-6 h-6 mb-1"/>
              <span className="text-[10px] uppercase tracking-widest">Menu</span>
            </Link>
            
            <Link to="/cart" className="relative text-gray-700 hover:text-brand transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {!isCartEmpty && (
                <span className="absolute -top-2 -right-2 bg-accent text-gray-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* Login / Actions */}
            {user ? (
               <div className="flex items-center gap-4 border-l-2 border-gray-100 pl-4 ml-2">
                 <div className="hidden md:block text-right">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Welcome,</p>
                    <p className="text-sm font-black text-gray-900">{user.name}</p>
                 </div>
                 {user.role === 'admin' ? (
                   <Link to="/admin" className="flex items-center gap-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white px-5 py-2.5 rounded-full hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-1 transition-all">
                     <Settings className="w-5 h-5" />
                     <span className="font-extrabold text-sm tracking-wide">STAFF PORTAL</span>
                   </Link>
                 ) : null}
                 <button onClick={logout} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                   <LogOut className="w-5 h-5" />
                 </button>
               </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)}
                className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-brand/40 px-8 py-2.5"
              >
                <User className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
