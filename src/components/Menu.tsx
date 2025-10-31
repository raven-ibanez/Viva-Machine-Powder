import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import MenuItemCard from './MenuItemCard';
import MobileNav from './MobileNav';

// Preload images for better performance
const preloadImages = (items: MenuItem[]) => {
  items.forEach(item => {
    if (item.image) {
      const img = new Image();
      img.src = item.image;
    }
  });
};

interface MenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number, variation?: any, addOns?: any[]) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity }) => {
  const { categories } = useCategories();
  const [activeCategory, setActiveCategory] = React.useState('hot-coffee');

  // Preload images when menu items change
  React.useEffect(() => {
    if (menuItems.length > 0) {
      // Preload images for visible category first
      const visibleItems = menuItems.filter(item => item.category === activeCategory);
      preloadImages(visibleItems);
      
      // Then preload other images after a short delay
      setTimeout(() => {
        const otherItems = menuItems.filter(item => item.category !== activeCategory);
        preloadImages(otherItems);
      }, 1000);
    }
  }, [menuItems, activeCategory]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      const headerHeight = 64; // Header height
      const mobileNavHeight = 60; // Mobile nav height
      const offset = headerHeight + mobileNavHeight + 20; // Extra padding
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    if (categories.length > 0) {
      // Set default to dim-sum if it exists, otherwise first category
      const defaultCategory = categories.find(cat => cat.id === 'dim-sum') || categories[0];
      if (!categories.find(cat => cat.id === activeCategory)) {
        setActiveCategory(defaultCategory.id);
      }
    }
  }, [categories, activeCategory]);

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(cat => document.getElementById(cat.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveCategory(categories[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <MobileNav 
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16 relative">
        {/* Decorative background elements */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-96 h-96 bg-vendo-light rounded-full blur-3xl opacity-30"></div>
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-vendo-primary to-transparent"></div>
              <div className="text-5xl">📦</div>
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-vendo-primary to-transparent"></div>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-montserrat font-black text-transparent bg-clip-text bg-gradient-to-r from-vendo-dark via-vendo-primary to-vendo-secondary mb-4 sm:mb-6 leading-tight px-4">
            Our Premium Products
          </h2>
          
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-vendo-accent to-transparent mx-auto mb-4 sm:mb-6"></div>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
            Browse our complete vendo machine packages. Each package includes everything you need 
            to start your own profitable vending business - machines, flavors, cups, and full support.
          </p>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 px-4">
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md border border-vendo-silver">
              <span className="text-lg sm:text-2xl">🚀</span>
              <span className="text-xs sm:text-sm font-semibold text-vendo-primary">Ready to Ship</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md border border-vendo-silver">
              <span className="text-lg sm:text-2xl">⭐</span>
              <span className="text-xs sm:text-sm font-semibold text-vendo-primary">Quality Guaranteed</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md border border-vendo-silver">
              <span className="text-lg sm:text-2xl">💼</span>
              <span className="text-xs sm:text-sm font-semibold text-vendo-primary">Business Ready</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md border border-vendo-silver">
              <span className="text-lg sm:text-2xl">🎁</span>
              <span className="text-xs sm:text-sm font-semibold text-vendo-primary">Complete Packages</span>
            </div>
          </div>
        </div>
      </div>

      {categories.map((category) => {
        const categoryItems = menuItems.filter(item => item.category === category.id);
        
        if (categoryItems.length === 0) return null;
        
        return (
          <section key={category.id} id={category.id} className="mb-20">
            {/* Enhanced Category Header */}
            <div className="relative mb-10">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center space-x-4">
                  <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-vendo-primary to-vendo-primary"></div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-montserrat font-bold text-vendo-dark flex items-center space-x-2 sm:space-x-3">
                    <span className="text-3xl sm:text-4xl md:text-5xl">{category.icon}</span>
                    <span>{category.name}</span>
                  </h3>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-vendo-primary via-vendo-primary to-transparent"></div>
                </div>
              </div>
              
              {/* Optional decorative element */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-4">
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-vendo-silver to-transparent"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categoryItems.map((item) => {
                const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
                return (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={addToCart}
                    quantity={cartItem?.quantity || 0}
                    onUpdateQuantity={updateQuantity}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
      </main>
    </>
  );
};

export default Menu;