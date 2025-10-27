import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-vendo-light to-white py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-montserrat font-bold text-vendo-dark mb-6 animate-fade-in">
          Quality Vendo Machines
          <span className="block text-vendo-primary mt-2">Complete Business Solutions</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
          Start your own profitable vending machine business with our complete packages. 
          Hot & Cold drink machines, premium flavors, and full support included.
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href="#menu"
            className="bg-vendo-primary text-white px-8 py-3 rounded-lg hover:bg-vendo-secondary transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
          >
            View Packages
          </a>
          <a 
            href="#contact"
            className="bg-white text-vendo-primary px-8 py-3 rounded-lg border-2 border-vendo-primary hover:bg-vendo-light transition-all duration-300 font-semibold"
          >
            Get Quote
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;