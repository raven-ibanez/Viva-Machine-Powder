import React, { useState } from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onAddToCart, 
  quantity, 
  onUpdateQuantity 
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(
    item.variations?.[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<(AddOn & { quantity: number })[]>([]);

  const calculatePrice = () => {
    // Use effective price (discounted or regular) as base
    let price = item.effectivePrice || item.basePrice;
    if (selectedVariation) {
      price = (item.effectivePrice || item.basePrice) + selectedVariation.price;
    }
    selectedAddOns.forEach(addOn => {
      price += addOn.price * addOn.quantity;
    });
    return price;
  };

  const handleAddToCart = () => {
    if (item.variations?.length || item.addOns?.length) {
      setShowCustomization(true);
    } else {
      setShowProductDetail(true);
    }
  };

  const handleAddFromDetail = () => {
    onAddToCart(item, 1);
    setShowProductDetail(false);
  };

  const handleCustomizedAddToCart = () => {
    // Convert selectedAddOns back to regular AddOn array for cart
    const addOnsForCart: AddOn[] = selectedAddOns.flatMap(addOn => 
      Array(addOn.quantity).fill({ ...addOn, quantity: undefined })
    );
    onAddToCart(item, 1, selectedVariation, addOnsForCart);
    setShowCustomization(false);
    setSelectedAddOns([]);
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onUpdateQuantity(item.id, quantity - 1);
    }
  };

  const updateAddOnQuantity = (addOn: AddOn, quantity: number) => {
    setSelectedAddOns(prev => {
      const existingIndex = prev.findIndex(a => a.id === addOn.id);
      
      if (quantity === 0) {
        // Remove add-on if quantity is 0
        return prev.filter(a => a.id !== addOn.id);
      }
      
      if (existingIndex >= 0) {
        // Update existing add-on quantity
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      } else {
        // Add new add-on with quantity
        return [...prev, { ...addOn, quantity }];
      }
    });
  };

  const groupedAddOns = item.addOns?.reduce((groups, addOn) => {
    const category = addOn.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(addOn);
    return groups;
  }, {} as Record<string, AddOn[]>);

  return (
    <>
      <div className={`bg-gradient-to-br from-white to-vendo-cream rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden group animate-scale-in border border-vendo-silver ${!item.available ? 'opacity-60' : ''} hover:-translate-y-2`}>
        {/* Image Container with Badges */}
        <div className="relative h-56 bg-gradient-to-br from-vendo-light via-white to-vendo-cream overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(45deg, #005C97 25%, transparent 25%), linear-gradient(-45deg, #005C97 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #005C97 75%), linear-gradient(-45deg, transparent 75%, #005C97 75%)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
            }} />
          </div>
          
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-105"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 flex items-center justify-center ${item.image ? 'hidden' : ''}`}>
            <div className="text-6xl opacity-20 text-vendo-primary">📦</div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {item.isOnDiscount && item.discountPrice && (
              <div className="bg-gradient-to-r from-vendo-accent to-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl animate-pulse transform hover:scale-105 transition-transform">
                🔥 SALE
              </div>
            )}
            {item.popular && (
              <div className="bg-gradient-to-r from-vendo-gold to-yellow-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl transform hover:scale-105 transition-transform">
                ⭐ BESTSELLER
              </div>
            )}
          </div>
          
          {!item.available && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              UNAVAILABLE
            </div>
          )}
          
          {/* Discount Percentage Badge */}
          {item.isOnDiscount && item.discountPrice && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-vendo-accent text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              {Math.round(((item.basePrice - item.discountPrice) / item.basePrice) * 100)}% OFF
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 bg-gradient-to-b from-white to-transparent">
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-xl font-bold text-vendo-dark leading-tight flex-1 pr-2 group-hover:text-vendo-primary transition-colors">{item.name}</h4>
            {item.variations && item.variations.length > 0 && (
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                {item.variations.length} sizes
              </div>
            )}
          </div>
          
          <p className={`text-sm mb-5 leading-relaxed line-clamp-2 ${!item.available ? 'text-gray-400' : 'text-gray-600'}`}>
            {!item.available ? 'Currently Unavailable' : item.description}
          </p>
          
          {/* Pricing Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              {item.isOnDiscount && item.discountPrice ? (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-vendo-accent">
                      ₱{item.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₱{item.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Save ₱{(item.basePrice - item.discountPrice).toFixed(2)}
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-bold bg-gradient-to-r from-vendo-primary to-vendo-secondary bg-clip-text text-transparent">
                  ₱{item.basePrice.toFixed(2)}
                </div>
              )}
              
              {item.variations && item.variations.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  Starting price
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex-shrink-0">
              {!item.available ? (
                <button
                  disabled
                  className="bg-gray-200 text-gray-500 px-4 py-2.5 rounded-xl cursor-not-allowed font-medium text-sm"
                >
                  Unavailable
                </button>
              ) : quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-vendo-primary to-vendo-secondary text-white px-7 py-3 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 font-bold text-sm shadow-lg"
                >
                  <span className="flex items-center space-x-1">
                    {item.variations?.length || item.addOns?.length ? (
                      <>⚙️ <span>Customize</span></>
                    ) : (
                      <>🛒 <span>Add to Cart</span></>
                    )}
                  </span>
                </button>
              ) : (
                <div className="flex items-center space-x-3 bg-gradient-to-r from-vendo-light to-vendo-cream rounded-xl p-2 border-2 border-vendo-silver shadow-md">
                  <button
                    onClick={handleDecrement}
                    className="p-2.5 hover:bg-vendo-primary hover:text-white rounded-lg transition-all duration-300 hover:scale-125 hover:shadow-md"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-xl bg-white px-4 py-1.5 rounded-lg shadow-inner min-w-[40px] text-center">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="p-2.5 hover:bg-vendo-primary hover:text-white rounded-lg transition-all duration-300 hover:scale-125 hover:shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Add-ons indicator */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-vendo-primary bg-gradient-to-r from-vendo-light to-transparent px-3 py-1.5 rounded-lg font-semibold border border-vendo-silver">
              <span>✨</span>
              <span>{item.addOns.length} add-on{item.addOns.length > 1 ? 's' : ''} available</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {showProductDetail && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="text-2xl font-bold text-vendo-dark">{item.name}</h3>
              <button
                onClick={() => setShowProductDetail(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Large Image */}
              <div className="mb-6">
                <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`absolute inset-0 flex items-center justify-center ${item.image ? 'hidden' : ''}`}>
                    <div className="text-9xl opacity-20 text-gray-400">📦</div>
                  </div>
                  
                  {/* Badges on enlarged image */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {item.isOnDiscount && item.discountPrice && (
                      <div className="bg-vendo-accent text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg animate-pulse">
                        SALE
                      </div>
                    )}
                    {item.popular && (
                      <div className="bg-vendo-gold text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                        ⭐ POPULAR
                      </div>
                    )}
                  </div>
                  
                  {/* Discount Percentage Badge */}
                  {item.isOnDiscount && item.discountPrice && (
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-vendo-accent text-sm font-bold px-3 py-2 rounded-full shadow-lg">
                      {Math.round(((item.basePrice - item.discountPrice) / item.basePrice) * 100)}% OFF
                    </div>
                  )}
                </div>
              </div>

              {/* Product Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Product Description</h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {item.description}
                  </p>
                </div>

                {/* Pricing and Add to Cart */}
                <div className="bg-vendo-cream rounded-xl p-6">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Price</h4>
                    {item.isOnDiscount && item.discountPrice ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-4xl font-bold text-vendo-accent">
                            ₱{item.discountPrice.toFixed(2)}
                          </span>
                          <span className="text-xl text-gray-500 line-through">
                            ₱{item.basePrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 font-semibold">
                          You save ₱{(item.basePrice - item.discountPrice).toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-4xl font-bold text-vendo-primary">
                        ₱{item.basePrice.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleAddFromDetail}
                    className="w-full bg-vendo-primary text-white py-4 rounded-lg hover:bg-vendo-secondary transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Customize {item.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Choose your preferences</p>
              </div>
              <button
                onClick={() => setShowCustomization(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Size Variations */}
              {item.variations && item.variations.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Choose Size</h4>
                  <div className="space-y-3">
                    {item.variations.map((variation) => (
                      <label
                        key={variation.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedVariation?.id === variation.id
                            ? 'border-vendo-primary bg-vendo-light'
                            : 'border-gray-200 hover:border-vendo-silver hover:bg-vendo-cream'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="variation"
                            checked={selectedVariation?.id === variation.id}
                            onChange={() => setSelectedVariation(variation)}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span className="font-medium text-gray-900">{variation.name}</span>
                        </div>
                        <span className="text-gray-900 font-semibold">
                          ₱{((item.effectivePrice || item.basePrice) + variation.price).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {groupedAddOns && Object.keys(groupedAddOns).length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Add-ons</h4>
                  {Object.entries(groupedAddOns).map(([category, addOns]) => (
                    <div key={category} className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-3 capitalize">
                        {category.replace('-', ' ')}
                      </h5>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div
                            key={addOn.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                          >
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">{addOn.name}</span>
                              <div className="text-sm text-gray-600">
                                {addOn.price > 0 ? `₱${addOn.price.toFixed(2)} each` : 'Free'}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {selectedAddOns.find(a => a.id === addOn.id) ? (
                                <div className="flex items-center space-x-2 bg-vendo-light rounded-lg p-1 border border-vendo-silver">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 1) - 1);
                                    }}
                                    className="p-1.5 hover:bg-vendo-cream rounded-lg transition-colors duration-200"
                                  >
                                    <Minus className="h-3 w-3 text-vendo-primary" />
                                  </button>
                                  <span className="font-semibold text-gray-900 min-w-[24px] text-center text-sm">
                                    {selectedAddOns.find(a => a.id === addOn.id)?.quantity || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 0) + 1);
                                    }}
                                    className="p-1.5 hover:bg-vendo-cream rounded-lg transition-colors duration-200"
                                  >
                                    <Plus className="h-3 w-3 text-vendo-primary" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => updateAddOnQuantity(addOn, 1)}
                                  className="flex items-center space-x-1 px-4 py-2 bg-vendo-primary text-white rounded-lg hover:bg-vendo-secondary transition-all duration-200 text-sm font-semibold shadow-md"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>Add</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between text-2xl font-bold text-gray-900">
                  <span>Total:</span>
                  <span className="text-vendo-primary">₱{calculatePrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCustomizedAddToCart}
                className="w-full bg-vendo-primary text-white py-4 rounded-lg hover:bg-vendo-secondary transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart - ₱{calculatePrice().toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;