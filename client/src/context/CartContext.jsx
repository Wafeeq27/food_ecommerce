import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, weight = 0.5) => {
    const item = {
      product_id: product._id,
      name: product.name,
      price: product.price_per_kg,
      image: product.image,
      weight: weight,
      quantity: 1
    };

    setCartItems(prev => {
      const existItem = prev.find(x => x.product_id === item.product_id);
      if (existItem) {
        return prev.map(x => x.product_id === existItem.product_id 
          ? { ...x, quantity: x.quantity + 1 } 
          : x);
      } else {
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(x => x.product_id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
      if (newQuantity < 1) return;
      setCartItems(prev => prev.map(x => x.product_id === id ? { ...x, quantity: Math.max(1, newQuantity) } : x));
  };

  const clearCart = () => setCartItems([]);

  const totalAmount = Math.round(cartItems.reduce((acc, item) => acc + (item.price * (item.weight || 0.5) * item.quantity), 0));

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};
