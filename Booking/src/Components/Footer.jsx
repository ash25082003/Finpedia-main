import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <section className="relative overflow-hidden py-12 bg-gradient-to-r from-green-300 to-teal-500 text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap justify-between">
          {/* Left Side: Title and Copyright */}
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex flex-col justify-between h-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Investor Discussion Hub</h2>
              </div>
              <div>
                <p className="text-sm text-gray-700">&copy; 2024 Investor Discussion Hub. All Rights Reserved.</p>
              </div>
            </div>
          </div>

          {/* Community Guidelines and Support */}
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="text-lg font-semibold mb-6 text-gray-700 uppercase">Community</h3>
              <p className="text-base text-gray-700 mb-4">Guidelines for participation</p>
              <p className="text-base text-gray-700">Support: support@investorhub.com</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="text-lg font-semibold mb-6 text-gray-700 uppercase">Contact Us</h3>
              <p className="text-base text-gray-700 mb-4">123 Finance Lane, Invest City, 56789</p>
              <p className="text-base text-gray-700">Ph: 1800-123-456</p>
            </div>
          </div>

          {/* Follow Us */}
          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="text-lg font-semibold mb-6 text-gray-700 uppercase">Follow Us</h3>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="text-black hover:text-green-700 transition duration-300 ease-in-out"
                >
                  Facebook
                </Link>
                <Link
                  to="/"
                  className="text-black hover:text-green-700 transition duration-300 ease-in-out"
                >
                  Instagram
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
