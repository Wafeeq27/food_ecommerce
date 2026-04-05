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

  const addToCart = (product, quantity) => {
    const item = {
      product_id: product._id,
      name: product.name,
      price: product.price_per_kg,
      image: product.image,
      quantity
    };

    setCartItems(prev => {
      const existItem = prev.find(x => x.product_id === item.product_id);
      if (existItem) {
        return prev.map(x => x.product_id === existItem.product_id 
          ? { ...x, quantity: Math.round((x.quantity + quantity) * 10) / 10 } 
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
      // Minimum is 0.1 (100g)
      if (newQuantity < 0.1) return;
      const roundedQuantity = Math.round(newQuantity * 10) / 10;
      setCartItems(prev => prev.map(x => x.product_id === id ? { ...x, quantity: roundedQuantity } : x));
  };

  const clearCart = () => setCartItems([]);

  const totalAmount = Math.round(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0));

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};
