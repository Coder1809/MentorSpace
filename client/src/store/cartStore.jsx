import { useState, useEffect } from "react";

let currentCart = [];
let cartListeners = [];

const updateCart = (newCart) => {
  currentCart = newCart;
  cartListeners.forEach((l) => l(currentCart));
};

export const useCartStore = (selector) => {
  const [cart, setCart] = useState(currentCart);

  useEffect(() => {
    const listener = (val) => setCart(val);
    cartListeners.push(listener);
    return () => {
      cartListeners = cartListeners.filter((l) => l !== listener);
    };
  }, []);

  const store = {
    cart,
    addToCart: (item) => {
      if (!cart.find((i) => i._id === item._id)) {
        updateCart([...cart, item]);
      }
    },
    removeFromCart: (id) => updateCart(cart.filter((item) => item._id !== id)),
    clearCart: () => updateCart([]),
    getTotal: () => cart.reduce((total, item) => total + Number(item.price), 0),
  };

  return typeof selector === "function" ? selector(store) : store;
};
