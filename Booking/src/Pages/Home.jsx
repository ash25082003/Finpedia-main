import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-10">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-semibold text-green-600 mb-4">
          Welcome to the Investor Discussion Hub
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Join a vibrant community of investor enthusiasts to discuss stock market trends, share insights, and learn from others. Whether you're a seasoned investor or just starting out, our platform provides a safe and engaging space to exchange ideas.
        </p>
      </header>

      {/* Join Discussion Section */}
      <section className="bg-white shadow-lg rounded-lg p-8 w-full sm:w-3/4 lg:w-1/2 mx-auto">
        <h2 className="text-3xl font-semibold text-green-600 text-center mb-6">
          Join the Discussion
        </h2>
        <p className="text-gray-700 mb-6 text-center">
          Share your thoughts, ask questions, and stay updated on the latest trends in the stock market. Connect with like-minded investors and grow together.
        </p>

        {/* Join Now Button */}
        <div className="flex justify-center">
          <Link
            to="/discussion"
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Join Now
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Investor Discussion Hub</p>
        <p>All rights reserved © 2024</p>
      </footer>
    </div>
  );
};

export default Home;