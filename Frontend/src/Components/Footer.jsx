// components/Footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg border border-green-400/20">
                <span className="text-2xl text-green-400">📊</span>
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-300">
                FInpedia
              </h2>
            </div>
            <p className="text-sm text-gray-400">
              Democratizing financial intelligence through collaborative analysis
            </p>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400 uppercase">Resources</h3>
            <ul className="space-y-3">
              {['Screener', 'API Docs', 'Market Reports'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400 uppercase">Learn</h3>
            <ul className="space-y-3">
              {['Courses', 'Glossary', 'Case Studies'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400 uppercase">Connect</h3>
            <div className="flex space-x-4 text-2xl text-gray-400">
              <a href="#" className="hover:text-green-400"><FiGithub /></a>
              <a href="#" className="hover:text-green-400"><FiLinkedin /></a>
              <a href="#" className="hover:text-green-400"><FiTwitter /></a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 text-center text-sm text-gray-500 border-t border-gray-800">
          <p>© {new Date().getFullYear()} FInpedia. All rights reserved. Empowering India's investors</p>
          <p className="mt-2 text-xs">Data sources: NSE, BSE, RBI, and community contributions</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
