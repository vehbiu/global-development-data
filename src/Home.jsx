import React, { useState, useEffect } from 'react';
import { getIndicators } from './lib/api';
import { Globe, TrendingUp, BarChart2, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [indicators, setIndicators] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [indicatorsData] = await Promise.all([
          getIndicators()
        ]);
        setIndicators(indicatorsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text sm:text-6xl md:text-7xl">
            Explore Global Development Data
          </h1>
          <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Access comprehensive World Bank data indicators and country-specific information in one place. Compare and
            analyze trends over time.
          </p>
        </div>

        {/* Main Options */}
        <div className="grid gap-8 mt-16 md:grid-cols-2 lg:gap-12">
          <div className="transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
            <div className="p-8">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-gray-900">Explore by Indicator</h2>
              <p className="mt-4 text-gray-500">
                Browse through <strong className='text-blue-600'>{indicators.length}</strong> different development
                indicators across all countries and regions.
              </p>

              <Link to={'/indicator/'} className="inline-flex items-center px-6 py-3 mt-6 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                View Indicators
              </Link>
            </div>
          </div>

          <div className="transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
            <div className="p-8">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-gray-900">Explore by Country</h2>
              <p className="mt-4 text-gray-500">
                Select a country to view its comprehensive development indicators and trends over time.
              </p>
              <Link
                className="inline-flex items-center px-6 py-3 mt-6 text-base font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                to={`/country/`}
              >
                View Countries
              </Link>
            </div>
          </div>
        </div>


        {/* Button for Us Spending */}
        <div className="p-8 mt-16 shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Left Column - Main Content */}
            <div className="space-y-6 md:col-span-2">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10">
                <DollarSign className="w-5 h-5 mr-2 text-white" />
                <span className="font-medium text-white">US Federal Spending Analysis</span>
              </div>

              <h2 className="text-3xl font-bold text-white">
                Explore United States Federal Spending Patterns
              </h2>

              <p className="text-lg text-blue-100">
                Dive deep into comprehensive analysis of US federal budget allocations, spending trends, and financial distributions across different sectors and programs.
              </p>

              <Link
                to="/usa-breakdown"
                className="inline-flex items-center px-6 py-3 font-medium text-blue-600 transition-colors bg-white rounded-lg hover:bg-blue-50"
              >
                Explore US Spending
                <BarChart2 className="w-5 h-5 ml-2" />
              </Link>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="space-y-4">
              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-200" />
                  <h3 className="text-lg font-semibold text-white">Budget Trends</h3>
                </div>
                <p className="text-blue-100">
                  Track historical patterns and future projections of federal spending
                </p>
              </div>

              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="flex items-center mb-2">
                  <BarChart2 className="w-5 h-5 mr-2 text-blue-200" />
                  <h3 className="text-lg font-semibold text-white">Sector Analysis</h3>
                </div>
                <p className="text-blue-100">
                  Compare spending across different government departments and programs
                </p>
              </div>
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default Home;