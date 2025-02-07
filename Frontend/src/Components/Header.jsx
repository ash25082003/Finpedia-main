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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a1f24] border-b border-[#2d3339] shadow-xl">
      <Container>
        <nav className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-4 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="p-3 bg-[#2ecc71]/10 rounded-xl border border-[#2ecc71]/20">
              <span className="text-2xl text-[#2ecc71]">📈</span>
            </div>
            <h1 className="text-2xl font-bold text-[#2ecc71]">
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
                   text-gray-300 hover:text-[#2ecc71] hover:bg-[#232830]
                   focus:outline-none focus:ring-2 focus:ring-[#2ecc71]"
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
