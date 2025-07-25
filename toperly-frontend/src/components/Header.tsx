"use client";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, Search, ChevronDown, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button"; // Update this path as needed

const Header = () => {
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategory, setShowCategory] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "All Courses", path: "/courses" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ];

  const categories = [
    "Digital Marketing",
    "Business",
    "Lifestyle",
    "Programming & Tech",
  ];

  const isActive = (path: string) =>
    location.pathname === path ? "text-orange-500" : "text-gray-700";

  return (
    <header
      className="bg-white shadow-sm border-b border-gray-100  top-0 z-50"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          {/* Left - Logo & Search */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            <img
              src="/logo.png"
              alt="Toperly Logo"
              className="h-12 w-auto object-contain sm:h-16 md:h-20 lg:h-[100px]"
            />

            {/* Categories Dropdown - Hidden on mobile */}
            <div className="relative group hidden md:flex">
              <button
                onClick={() => setShowCategory(!showCategory)}
                className="text-gray-700 font-medium hover:text-orange-500 focus:outline-none flex items-center"
              >
                Categories
                <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
              </button>
              {showCategory && (
                <div className="absolute top-8 left-0 mt-2 w-48 bg-white shadow-lg rounded-md border z-50">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search - Hidden on mobile, responsive width */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search for anything"
                className="w-40 sm:w-64 md:w-72 lg:w-96 px-4 py-2.5 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Right - Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-wrap">
            {navLinks.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={`font-medium hover:text-orange-600 ${isActive(path)}`}
              >
                {label}
              </NavLink>
            ))}

            {/* User Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-1 cursor-pointer">
                <User className="h-5 w-5 text-gray-700" />
                <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                  User
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                <NavLink
                  to="/student"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                >
                  Student
                </NavLink>
                <NavLink
                  to="/instructor"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                >
                  Instructor
                </NavLink>
              </div>
            </div>

            {/* Cart Icon */}
            <NavLink to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-500 hover:text-blue-600" />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                0
              </span>
            </NavLink>

            {/* Login Button */}
            <Button className="bg-gray-800 text-white hover:bg-orange-600 px-4 py-2.5 rounded-md font-medium whitespace-nowrap">
              Login/Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Menu
              className="h-6 w-6 text-gray-700 cursor-pointer"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle mobile menu"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden space-y-4 pb-4 transition-all duration-300 ease-in-out">
            {/* Mobile Search */}
            <div className="relative px-4">
              <input
                type="text"
                placeholder="Search for anything"
                className="w-full px-4 py-2.5 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-50"
              />
              <Search className="absolute right-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Nav Links */}
            {navLinks.map(({ label, path }) => (
              <NavLink
                key={path}
                to={path}
                className={`block px-4 py-2 font-medium ${isActive(path)} hover:text-orange-600`}
                onClick={() => setShowMobileMenu(false)} // Close menu on click
              >
                {label}
              </NavLink>
            ))}

            {/* Mobile Categories */}
            <div className="border-t pt-2 px-4">
              <span className="block font-medium text-gray-700 mb-2">
                Categories
              </span>
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="pl-2 text-sm text-gray-700 py-1 hover:text-orange-600 cursor-pointer"
                >
                  {cat}
                </div>
              ))}
            </div>

            {/* Mobile User */}
            <div className="border-t pt-2 px-4">
              <span className="block font-medium text-gray-700 mb-2 flex items-center">
                <User className="h-5 w-5 mr-2" /> User
              </span>
              <NavLink
                to="/student"
                className="block pl-4 py-1 text-sm text-gray-700 hover:text-orange-600"
              >
                Student
              </NavLink>
              <NavLink
                to="/instructor"
                className="block pl-4 py-1 text-sm text-gray-700 hover:text-orange-600"
              >
                Instructor
              </NavLink>
            </div>

            {/* Mobile Cart */}
            <div className="border-t pt-2 px-4">
              <NavLink
                to="/cart"
                className="flex items-center text-gray-700 hover:text-orange-600"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
                <span className="ml-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  0
                </span>
              </NavLink>
            </div>

            {/* Mobile Login */}
            <div className="px-4">
              <Button className="w-full bg-gray-800 text-white hover:bg-orange-600 py-2.5 rounded-md font-medium">
                Login/Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
