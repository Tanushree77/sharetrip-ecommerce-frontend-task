import React from 'react';
import ProductList from './components/ProductList';
import { CartProvider } from './components/CartContext';
function App() {
  return (
    <div className="App">
      <CartProvider>
      <ProductList />
      </CartProvider>
    </div>
  );
}

export default App;