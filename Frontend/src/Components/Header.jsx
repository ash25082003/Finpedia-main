// components/Header/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiTrendingUp, FiBook, FiUsers } from 'react-icons/fi';
import Container from '../Container/Container';

function Header() {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  const navItems = [
    { name: 'Home', slug: '/', active: true, icon: <FiTrendingUp /> },
    { name: 'Discussion', slug: '/discussion', active: true, icon: <FiUsers /> },
    { name: 'Guide', slug: '/guide', active: true, icon: <FiBook /> },
    { name: 'Login', slug: '/login', active: !authStatus },
    { name: 'Sign Up', slug: '/signup', active: !authStatus },
  ];

  return (
    <header className="bg-gradient-to-br from-gray-900 to-gray-800 border-b border-gray-700 shadow-xl">
      <Container>
        <nav className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-4 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="p-3 bg-green-500/10 rounded-xl border border-green-400/20">
              <span className="text-2xl text-green-400">📈</span>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-300">
              FInpedia
            </h1>
          </div>

          {/* Navigation Items */}
          <ul className="flex space-x-6">
            {navItems.map((item) => item.active && (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className="flex items-center px-4 py-2.5 font-medium rounded-lg transition-all
                   text-gray-300 hover:text-white hover:bg-gray-700/30
                   focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
