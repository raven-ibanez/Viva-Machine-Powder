import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">☕</div>
          <h2 className="text-2xl font-montserrat font-semibold text-vendo-dark mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started!</p>
          <button
            onClick={onContinueShopping}
            className="bg-vendo-primary text-white px-6 py-3 rounded-lg hover:bg-vendo-secondary transition-all duration-200 font-semibold"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <button
          onClick={onContinueShopping}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm sm:text-base">Continue Shopping</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-montserrat font-bold text-vendo-dark order-first sm:order-none">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-vendo-accent hover:text-vendo-accent/80 transition-colors duration-200 font-semibold text-sm sm:text-base"
        >
          Clear All
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 sm:mb-8">
        {cartItems.map((item, index) => (
          <div key={item.id} className={`p-4 sm:p-6 ${index !== cartItems.length - 1 ? 'border-b border-cream-200' : ''}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 w-full sm:w-auto">
                <h3 className="text-base sm:text-lg font-montserrat font-semibold text-vendo-dark mb-1">{item.name}</h3>
                {item.selectedVariation && (
                  <p className="text-sm text-gray-500 mb-1">Size: {item.selectedVariation.name}</p>
                )}
                {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                  <p className="text-sm text-gray-500 mb-1">
                    Add-ons: {item.selectedAddOns.map(addOn => 
                      addOn.quantity && addOn.quantity > 1 
                        ? `${addOn.name} x${addOn.quantity}`
                        : addOn.name
                    ).join(', ')}
                  </p>
                )}
                <p className="text-lg font-semibold text-black">₱{item.totalPrice} each</p>
              </div>
              
              <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-3 sm:gap-4 sm:ml-4">
                <div className="flex items-center space-x-2 sm:space-x-3 bg-vendo-light rounded-lg p-1 border border-vendo-silver">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-vendo-cream rounded-lg transition-colors duration-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-semibold text-vendo-dark min-w-[32px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-vendo-cream rounded-lg transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="text-right sm:text-left">
                  <p className="text-base sm:text-lg font-semibold text-black">₱{item.totalPrice * item.quantity}</p>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-vendo-accent hover:text-vendo-accent/80 hover:bg-vendo-light rounded-lg transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between text-xl sm:text-2xl font-montserrat font-bold text-vendo-dark mb-4 sm:mb-6">
          <span>Total:</span>
          <span className="text-vendo-primary">₱{parseFloat(getTotalPrice() || 0).toFixed(2)}</span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full bg-vendo-primary text-white py-3 sm:py-4 rounded-lg hover:bg-vendo-secondary transition-all duration-200 transform hover:scale-[1.02] font-semibold text-base sm:text-lg shadow-md"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;