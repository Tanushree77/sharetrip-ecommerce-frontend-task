import React, { useState } from 'react';
import { ShoppingCart, Eye, Heart, Minus, Plus, Trash2, X } from 'lucide-react';

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
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);


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
    <>
    <div 
      className="bg-white shadow-md rounded-lg overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 bg-red-50">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-contain"
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
          className={`absolute top-2 right-2 ${isFavorite ? 'text- bg-white' : 'text-transparent'} ${isHovered ? 'text-red-100 font-bold' : ''} hover:text-red-500 transition-colors`}
          onClick={() => onToggleFavorite(product.id)}
          onMouseEnter={() => setIsFavoriteHovered(true)}
          onMouseLeave={() => setIsFavoriteHovered(false)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className="w-6 h-6" />
          {isFavorite && isFavoriteHovered && (
            <span className="absolute right-0 top-8 bg-white text-gray-800 text-xs px-2 py-1 rounded shadow">
              Added to Favourite
            </span>
          )}
        </button>
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-25 flex flex-col justify-end items-center p-4">
           
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
            onClick={() => setIsQuickViewOpen(true)}
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

     {/* Custom Modal */}
   {isQuickViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsQuickViewOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 z-50">
            {/* Close Button */}
            <button
              onClick={() => setIsQuickViewOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 z-10"
              aria-label="Close quick view"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Image Section */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
                <button 
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  onClick={() => onToggleFavorite(product.id)}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart 
                    className={`w-6 h-6 ${isFavorite ? 'fill-current text-red-500' : ''}`}
                  />
                </button>
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <p className="text-gray-500 text-lg mb-2">{product.brand}</p>
                <h2 className="text-2xl font-semibold mb-4">{product.title}</h2>
                
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(priceInBDT)}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(originalPriceInBDT)}
                  </span>
                </div>

                {cartQuantity > 0 ? (
                  <div className="flex items-center gap-4 mb-6">
                    <button
                      onClick={() => onRemoveFromCart(product.id)}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-xl">{cartQuantity}</span>
                    <button
                      onClick={() => onAddToCart(product.id)}
                      className="bg-gray-100 hover:bg-gray-200 p-2 rounded"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart(product.id)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
  

    </>


    
  );
};

export default ProductCard;