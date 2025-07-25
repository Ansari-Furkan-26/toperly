import { Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="text-2xl font-bold text-toperly-blue mb-4">toperly</div>
            <p className="text-gray-600 mb-6">
              Making India ready for the future with AI education and training programs.
            </p>
            
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-500 hover:text-toperly-blue cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-500 hover:text-toperly-blue cursor-pointer" />
              <Linkedin className="h-5 w-5 text-gray-500 hover:text-toperly-blue cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-500 hover:text-toperly-blue cursor-pointer" />
              <Youtube className="h-5 w-5 text-gray-500 hover:text-toperly-blue cursor-pointer" />
            </div>
          </div>

          {/* Courses */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Courses</h4>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-toperly-blue">Machine Learning</a></li>
              <li><a href="#" className="hover:text-toperly-blue">Data Science</a></li>
              <li><a href="#" className="hover:text-toperly-blue">AI for Business</a></li>
              <li><a href="#" className="hover:text-toperly-blue">Deep Learning</a></li>
              <li><a href="#" className="hover:text-toperly-blue">Computer Vision</a></li>
              <li><a href="#" className="hover:text-toperly-blue">Natural Language Processing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-toperly-blue">About Us</a></li>
              <li><a href="#" className="hover:text-toperly-blue">Careers</a></li>
              <li><a href="#" className="hover:text-toperly-blue">For Business</a></li>
              <li><a href="#" className="hover:text-toperly-blue">Become an Instructor</a></li>
              <li><a href="#" className="hover:text-toperly-blue">Blog</a></li>
              <li><a href="#" className="hover:text-toperly-blue">Press</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3 text-gray-600">
              <li><a href="#" className="hover:text-toperly-blue">Help Center</a></li>
              <li><a href="#" className="hover:text-toperly-blue">Contact Us</a></li>
              <li><a href="#" className="hover:text-toperly-blue">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-toperly-blue">Terms of Service</a></li>
              <li><a href="#" className="hover:text-toperly-blue">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-toperly-blue">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              © 2024 Toperly. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>English</span>
              <span>|</span>
              <span>हिंदी</span>
              <span>|</span>
              <span>FAQ</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;