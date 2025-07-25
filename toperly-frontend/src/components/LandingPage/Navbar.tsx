import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, ShoppingCart, User } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu and reset dropdowns when mobile menu is closed
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsCategoriesOpen(false);
    setIsUserMenuOpen(false);
  };

  const topNavItems = [
    { label: 'For Companies', href: '#' },
    { label: 'Jobs', href: '#' },
    { label: 'Events', href: '#' },
    { label: 'Become a Master', href: '#' },
    { label: 'Blog', href: '#' }
  ];

  const mainNavItems = [
    { label: 'Home', href: '#' },
    { label: 'All Courses', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' }
  ];

  const categories = [
    "Digital Marketing",
    "Business", 
    "Lifestyle",
    "Programming & Tech",
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white text-gray-900 shadow-md transition-all duration-300 ${
      isScrolled ? 'h-16' : 'h-16 sm:h-24'
    }`}>
      {/* Top row - hidden when scrolled */}
      <div className={`${
        isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'sm:h-12 opacity-100'
      } transition-all duration-300 bg-gray-50 border-b border-gray-200`}>
        <div className="max-w-7xl mx-auto pt-2 px-4 h-full flex items-center justify-end">
          <div className="hidden md:flex items-center space-x-6 text-sm">
            {topNavItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-gray-600 hover:text-orange-500 transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className={`${
        isScrolled ? 'h-16' : 'h-12'
      } transition-all duration-300 bg-white`}>
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Company Logo"
                className="h-12 w-auto object-contain"
              />
              
              {/* Categories Dropdown - Hidden on mobile */}
              <div className="relative group hidden lg:flex">
                <button className="text-gray-900 font-medium hover:text-orange-500 focus:outline-none flex items-center">
                  Categories
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500 cursor-pointer"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {mainNavItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Search bar - hidden on mobile */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for anything"
                  className="w-64 px-4 py-2 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
                <button className="absolute right-3 top-2.5">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* User and Cart */}
            {/* <div className="hidden md:flex items-center space-x-4">
              <div className="relative group">
                <div className="flex items-center space-x-1 cursor-pointer">
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="text-sm text-gray-700 group-hover:text-orange-500 transition-colors">User</span>
                  <ChevronDown className="w-4 h-4 text-gray-700" />
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500">
                    Student
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-orange-500">
                    Instructor
                  </a>
                </div>
              </div>
              
              <button className="relative text-gray-700 hover:text-orange-500 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>

              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Login/Sign Up
              </button>
            </div> */}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for anything"
                  className="w-full px-4 py-2 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              {/* Mobile navigation items */}
              {mainNavItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="block py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </a>
              ))}

              {/* Mobile categories - Toggleable */}
              <div className="border-t border-gray-200 pt-4">
                <button
                  className="flex items-center justify-between w-full font-medium text-gray-900 focus:outline-none"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                >
                  <span>Categories</span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isCategoriesOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {/* Categories dropdown content */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  isCategoriesOpen ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}>
                  {categories.map((cat) => (
                    <a
                      key={cat}
                      href="#"
                      className="block pl-4 py-2 text-sm text-gray-600 hover:text-orange-500 cursor-pointer transition-colors"
                      onClick={closeMobileMenu}
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              </div>

              {/* Mobile user actions - Toggleable */}
              <div className="hidden border-t border-gray-200 pt-4">
                <button
                  className="flex items-center justify-between w-full font-medium text-gray-900 focus:outline-none"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span className="flex items-center">
                    <User className="h-5 w-5 mr-2" /> User
                  </span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {/* User menu dropdown content */}
                <div className={`hidden overflow-hidden transition-all duration-300 ${
                  isUserMenuOpen ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}>
                  <a 
                    href="#" 
                    className="block pl-7 py-2 text-sm text-gray-600 hover:text-orange-500 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Student
                  </a>
                  <a 
                    href="#" 
                    className="block pl-7 py-2 text-sm text-gray-600 hover:text-orange-500 transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Instructor
                  </a>
                </div>
              </div>

              <div className="hidden border-t border-gray-200 pt-4">
                <a 
                  href="#" 
                  className="flex items-center text-gray-700 hover:text-orange-500 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart
                  <span className="ml-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    0
                  </span>
                </a>
              </div>

              {/* Mobile login */}
              <div className="pt-4 hidden">
                <button 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={closeMobileMenu}
                >
                  Login/Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
