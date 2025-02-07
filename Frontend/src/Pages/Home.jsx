// src/Pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiBook, FiAward, FiShield } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="pt-[76px]"> {/* Adjust the padding-top value based on your navbar height */}

    <div className="min-h-screen bg-[#1a1f2b]">
      <main>
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="mb-8">
            <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm">
              93% lose money in F&O - SEBI Study FY22-24
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-300">
            FInpedia: Democratizing Financial Wisdom
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Empowering retail investors with collaborative financial insights. Discuss, learn, and invest smarter through first-principles thinking. Together, let's level the playing field against institutional asymmetry.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/join" 
              className="bg-green-500 px-8 py-4 rounded-2xl text-lg hover:bg-green-600 transition flex items-center justify-center text-gray-900 font-medium"
            >
              Join the Movement
            </Link>
          </div>
        </section>

        {/* Value Pillars */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            
            <div className="p-8 bg-[#1e2632] rounded-2xl text-center hover:bg-[#222a37] transition-all">
              <FiBook className="text-4xl text-green-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-white">Educate</h3>
              <p className="text-gray-400">
                Access peer-reviewed financial resources. Learn fundamental and technical analysis, and master investing techniques with help from the community.
              </p>
            </div>
            
            <div className="p-8 bg-[#1e2632] rounded-2xl text-center hover:bg-[#222a37] transition-all">
              <FiUsers className="text-4xl text-green-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-white">Collaborate</h3>
              <p className="text-gray-400">
                Join forces with retail investors to analyze companies, build crowd-sourced intrinsic value models, and challenge market rumors with data-backed insights.
              </p>
            </div>

            <div className="p-8 bg-[#1e2632] rounded-2xl text-center hover:bg-[#222a37] transition-all">
              <FiAward className="text-4xl text-green-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-white">Invest Smarter</h3>
              <p className="text-gray-400">
                Make better financial decisions supported by collective wisdom and unbiased analysis. Let compounding and time create wealth sustainably.
              </p>
            </div>
          </div>
        </section>

        {/* Social Contract */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="bg-[#1e2632] rounded-3xl p-12">
            <FiShield className="text-4xl text-green-400 mb-6 mx-auto" />
            <h2 className="text-4xl font-bold mb-6 text-white">Our Social Contract</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Zero ties with brokers or financial products.',
                'No paid promotions or biased recommendations.',
                'Promote transparency through open-source analysis.',
                'Empower retail investors to make informed decisions.'
              ].map((principle, index) => (
                <div key={index} className="bg-[#222a37] p-4 rounded-xl">
                  <div className="text-gray-400">{principle}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
      {/* Your main content */}
</div>

  );
};

export default Home;
