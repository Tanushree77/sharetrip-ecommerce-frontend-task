import React, { useState } from 'react';
import { ShoppingCart, Eye, Heart, Minus, Plus, Trash2 } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  brand: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: number) => void;
  onRemoveFromCart: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  isFavorite: boolean;
  cartQuantity: number;
}
const USD_TO_BDT_RATE = 120;

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onRemoveFromCart,
  onToggleFavorite,
  isFavorite,
  cartQuantity
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavoriteHovered, setIsFavoriteHovered] = useState(false);

  const originalPrice = (product.price / (1 - product.discountPercentage / 100));
  const discountAmount = originalPrice - product.price;

  // Convert USD prices to BDT
  const priceInBDT = Math.round(product.price * USD_TO_BDT_RATE);
  const originalPriceInBDT = Math.round(priceInBDT / (1 - product.discountPercentage / 100));
  const discountAmountInBDT = originalPriceInBDT - priceInBDT;

  const formatPrice = (price: number) => {
    return (
      <span className="flex items-center">
        <span className="mr-1">৳</span>
        <span>{price.toLocaleString('en-IN')}</span>
      </span>
    );
  };


  return (
    <div 
      className="bg-white shadow-md rounded-lg overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover"
        />
<div className="absolute top-2 left-2 text-white text-sm font-bold -ml-2">
  <div className="relative w-20 h-8 flex items-center justify-center">
    <img src="/img/top-card.svg" alt="Discount" className="absolute inset-0 w-full h-full object-cover" />
    <div className="relative flex items-center justify-left">
      <Minus className="w-4 h-4 mr-1" />
      {formatPrice(discountAmountInBDT)}
    </div>
  </div>
</div>


        <button 
          className={`absolute top-2 right-2 ${isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors`}
          onClick={() => onToggleFavorite(product.id)}
          onMouseEnter={() => setIsFavoriteHovered(true)}
          onMouseLeave={() => setIsFavoriteHovered(false)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} />
          {isFavorite && isFavoriteHovered && (
            <span className="absolute right-0 top-8 bg-white text-gray-800 text-xs px-2 py-1 rounded shadow">
              Added to Favourite
            </span>
          )}
        </button>
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-end items-center p-4">
            {cartQuantity > 0 ? (
              <div className="w-full bg-green-500 text-white px-4 py-2 rounded-sm mb-2 flex justify-between items-center">
                <button 
                  onClick={() => onRemoveFromCart(product.id)} 
                  className="hover:opacity-75 transition-opacity"
                  aria-label="Remove from cart"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <span>{cartQuantity} Added to Cart</span>
                <button 
                  onClick={() => onAddToCart(product.id)} 
                  className="hover:opacity-75 transition-opacity"
                  aria-label="Add one more to cart"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCart(product.id)}
                className="w-full bg-white bg-opacity-20 backdrop-blur-sm text-white border border-white border-opacity-40 px-4 py-2 rounded-sm mb-2 hover:bg-opacity-30 transition-colors flex items-center justify-center"
                aria-label={`Add ${product.title} to cart`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
            )}
            <button 
              className="w-full bg-white bg-opacity-20 backdrop-blur-sm text-white border border-white border-opacity-40 px-4 py-2 rounded-sm hover:bg-opacity-30 transition-colors flex items-center justify-center"
              aria-label="Quick view product"
            >
              <Eye className="w-5 h-5 mr-2" />
              Quick View
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
        <h2 className="text-sm font-normal mb-2 text-gray-700">{product.title}</h2>
        <div className="flex items-center">
          <span className="text-lg font-bold text-blue-600 mr-2 flex items-center">
            {formatPrice(priceInBDT)}
          </span>
          <span className="text-sm text-gray-500 line-through flex items-center">
            {formatPrice(originalPriceInBDT)}
          </span>
        </div>
    </div>
    </div>
  );
};

export default ProductCard;