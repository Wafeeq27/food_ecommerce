import { useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';

const WeightSelector = ({ product, onClose, onAddToCart }) => {
  const [selectedWeight, setSelectedWeight] = useState(0.5);

  const weights = [
    { label: '250 g', value: 0.25 },
    { label: '500 g', value: 0.5 },
    { label: '1 kg', value: 1 },
    { label: '1.5 kg', value: 1.5 },
    { label: '2 kg', value: 2 }
  ];

  const price = Math.round(product.price_per_kg * selectedWeight);

  const handleAddToCart = () => {
    onAddToCart(product, selectedWeight);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Customize Your Order</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🥩</div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
              <p className="text-xs text-gray-500 mt-2">Price per kg: ₹{product.price_per_kg}</p>
            </div>
          </div>

          {/* Weight Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">Select Weight</label>
            <div className="grid grid-cols-3 gap-2">
              {weights.map(weight => (
                <button
                  key={weight.value}
                  onClick={() => setSelectedWeight(weight.value)}
                  className={`py-3 px-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedWeight === weight.value
                      ? 'bg-brand text-white shadow-md'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {weight.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Selected: {selectedWeight < 1 ? Math.round(selectedWeight * 1000) : selectedWeight}g</span>
              <span className="font-bold text-brand">₹{price}</span>
            </div>
            <p className="text-xs text-gray-500">Price: {product.price_per_kg} × {selectedWeight}kg = ₹{price}</p>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart - ₹{price}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeightSelector;
