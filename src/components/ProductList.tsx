import React, { useState, useEffect } from "react";
import { getProducts } from "../services/api";
import { Product } from "../types/Product";
import ProductCard from "./ProductCard";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"current" | "history">("current");

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data.products);
    };
    fetchProducts();
  }, []);

  const addToCart = (productId: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1,
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find((p) => p.id === parseInt(productId));
      return total + (product?.price || 0) * 120 * quantity;
    }, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-8">Product Listing</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 hover:bg-gray-100 rounded-full"
          >
            <ShoppingCart className="w-6 h-6" />
            {Object.keys(cart).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {Object.values(cart).reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.has(product.id)}
            cartQuantity={cart[product.id] || 0}
            onRemoveFromCart={function (id: number): void {
              throw new Error("Function not implemented.");
            }}
          />
        ))}
      </div>
      {cartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50">
          <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white shadow-lg">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">CART</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab("current")}
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      activeTab === "current"
                        ? "border-b-2 border-black text-black"
                        : "text-gray-500"
                    }`}
                  >
                    CURRENT ORDER
                  </button>
                </div>

                <div className="flex-1 overflow-auto">
                  {activeTab === "current" && (
                    <div className="p-4 space-y-4">
                      {Object.entries(cart).map(([productId, quantity]) => {
                        const product = products.find(
                          (p) => p.id === parseInt(productId)
                        );
                        if (!product) return null;

                        return (
                          <div
                            key={productId}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />

                            <div className="flex-1">
                              <h3 className="font-medium">{product.title}</h3>
                              <p className="text-gray-600">
                                ৳{(product.price * 120 * quantity).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => removeFromCart(product.id)}
                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center border hover:bg-gray-50"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-4 text-center">
                                {quantity}
                              </span>
                              <button
                                onClick={() => addToCart(product.id)}
                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center border hover:bg-gray-50"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {activeTab === "current" && (
                  <div className="p-4 border-t bg-white">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Total</span>
                      <span className="font-semibold">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    <button className="w-full bg-black text-white py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800">
                      Checkout
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
