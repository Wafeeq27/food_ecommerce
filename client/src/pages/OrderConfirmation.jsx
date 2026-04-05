import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const message = location.state?.message || 'Your order has been successfully placed!';

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-up">
      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center border-t-8 border-green-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 font-medium text-lg mb-8">{message}</p>
        
        <div className="flex flex-col gap-3">
          <Link to="/menu" className="btn-primary bg-green-600 hover:bg-green-700 text-white w-full shadow-lg">
            Continue Shopping
          </Link>
          <Link to="/" className="text-gray-500 font-bold hover:text-gray-800 py-3 transition-colors">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
