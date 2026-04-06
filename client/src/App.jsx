import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminDashboard from './pages/AdminDashboard';
import AuthModal from './components/AuthModal';
import { ShoppingBag } from 'lucide-react';

function App() {
  const { cartItems, totalAmount } = useContext(CartContext);

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col relative pb-20">
        <Navbar />
        <AuthModal />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        
        {/* Floating Cart Verification Component */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none fade-in">
            <div className="max-w-4xl mx-auto pointer-events-auto">
              <Link to="/cart" className="bg-accent text-white rounded-xl shadow-2xl p-4 flex items-center justify-between hover:bg-gray-800 transition-all transform hover:scale-[1.02]">
                 <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                       <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold">{cartItems.reduce((acc, item) => acc + item.quantity, 0)} items in cart</p>
                      <p className="text-xs text-gray-300">Verify items & checkout</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <span className="font-black text-xl">₹{totalAmount}</span>
                   <span className="bg-brand text-white px-4 py-2 font-bold rounded-lg shadow uppercase tracking-wide text-sm">Review Cart &rarr;</span>
                 </div>
              </Link>
            </div>
          </div>
        )}

        <footer className="bg-white border-t py-8 text-center text-gray-500 mt-auto">
          <p>&copy; {new Date().getFullYear()} indraaam. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
