import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Container from '../Container/Container';

function Header() {
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.auth.status);

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'Login', slug: '/login', active: !authStatus },
    { name: 'Discussion', slug: '/discussion', active: true },
    { name: 'About Us', slug: '/about-us', active: true },
    { name: 'Sign Up', slug: '/signup', active: !authStatus },
  ];

  return (
    <header className='bg-gradient-to-r from-green-500 to-teal-600 py-4 shadow-lg'>
      <Container>
        <nav className='flex justify-between items-center'>
          <div className='flex items-center'>
            <h1 className='text-white text-2xl font-bold'>Investor Discussion Hub</h1>
          </div>
          <ul className='flex space-x-6'>
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className='text-white inline-block px-6 py-2 rounded-lg font-medium transition-colors duration-300 hover:bg-green-100 hover:text-green-700 hover:underline'
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
