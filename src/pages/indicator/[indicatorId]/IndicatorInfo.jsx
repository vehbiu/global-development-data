import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCountryIndicator, getIndicators, getLatestIndicatorDataHeatmap } from '../../../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Info, LayoutGrid, LayoutList, ChevronLeft, ChevronRight } from 'lucide-react';
import useDebounce from '../../../hooks/useDebounce';
import { paginate } from '../../../lib/utils';
import WorldMap from '../../../components/world-map';
import useCountries from '../../../hooks/useCountries';

const IndicatorInfo = () => {
  const { indicatorId } = useParams();
  const [isHorizontalLayout, setIsHorizontalLayout] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [indicator, setIndicator] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [historicalData, setHistoricalData] = useState({});
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [heatData, setHeatData] = useState([]);

  const { countries, loading: countriesLoading } = useCountries();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const navigate = useNavigate()

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (countriesLoading) return;
    setFilteredCountries(countries);
  }, [countriesLoading, countries]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [indicatorsData] = await Promise.all([
          getIndicators()
        ]);
        
        const currentIndicator = indicatorsData.find(ind => ind.id === indicatorId);
        setIndicator(currentIndicator);

        getLatestIndicatorDataHeatmap(indicatorId).then((response) => {
          setHeatData(response);
        });

      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [indicatorId]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (selectedCountries.length === 0) return;

      try {
        const newHistoricalData = {};
        await Promise.all(selectedCountries.map(async (country) => {
          const data = await getCountryIndicator(country.id, indicatorId);
          newHistoricalData[country.id] = data;
        }));

        setHistoricalData(prevData => {
          return JSON.stringify(prevData) !== JSON.stringify(newHistoricalData) ? newHistoricalData : prevData;
        });
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
      }
    };

    fetchHistoricalData();
  }, [selectedCountries, indicatorId]);

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [countries, debouncedSearchQuery]);


  const handleCountrySelect = (country) => {
    setSelectedCountries(prev => {
      if (prev.find(c => c.id === country.id)) {
        return prev.filter(c => c.id !== country.id);
      }
      return [...prev, country];
    });
  };

  const formatValue = (value) => {
    if (typeof value !== 'number') return value;
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
    return value.toFixed(2);
  };

  const PAGE_SIZE = 10;
  const paginatedCountries = paginate(filteredCountries, PAGE_SIZE, currentPage);
  const totalPages = Math.ceil(filteredCountries.length / PAGE_SIZE);

  const CountryCard = ({ country, data }) => (
    <div className="mb-6">
      <h4 className="text-lg font-semibold">{country.name}</h4>
      {data ? (
        <>
          <p className="text-3xl font-bold text-blue-600">
            {formatValue(data.currentValue)}
          </p>
          <p className="mt-1 text-sm text-gray-500">Latest available data</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.historical}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [formatValue(value), indicator?.name]}
                  labelFormatter={(year) => `Year: ${year}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Loading data...</p>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <Link
        to="/"
        className="inline-flex items-center mb-8 text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>

      <div className="p-6 mb-8 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900">{indicator?.name}</h1>
        <p className="mt-2 text-gray-600">{indicator?.sourceNote}</p>
        
        <div className="relative mt-6">
          <div className="absolute z-10 p-2 text-sm bg-white rounded shadow-lg top-2 right-2">
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 bg-blue-100"></span>
              <span>Low</span>
              <span className="w-4 h-4 bg-blue-500"></span>
              <span>High</span>
            </div>
          </div>
          
          <WorldMap heat={heatData} onClickCountry={(countryName) => {
            navigate(`/country-by-name/${countryName}`);
          }} />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="sticky p-6 bg-white rounded-lg shadow top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Countries</h2>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search countries..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[500px]">
              {paginatedCountries.map((country) => (
                <label
                  key={country.id}
                  className="flex items-start p-2 mx-3 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    className="mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedCountries.some(c => c.id === country.id)}
                    onChange={() => handleCountrySelect(country)}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{country.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{country.capitalCity}</p>
                  </div>
                </label>
              ))}
            </div>

            {filteredCountries.length > PAGE_SIZE && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <div className="flex justify-between flex-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Selected Countries</h2>
              {selectedCountries.length > 1 && (
                <button
                  onClick={() => setIsHorizontalLayout(!isHorizontalLayout)}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  {isHorizontalLayout ? (
                    <>
                      <LayoutList className="w-4 h-4 mr-2" />
                      <span>Switch to Vertical</span>
                    </>
                  ) : (
                    <>
                      <LayoutGrid className="w-4 h-4 mr-2" />
                      <span>Switch to Horizontal</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {selectedCountries.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg bg-gray-50">
                <Info className="w-12 h-12 mb-4 text-gray-400" />
                <p className="text-gray-600">Select countries from the map or list to view their data</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${isHorizontalLayout && selectedCountries.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {selectedCountries.map((country) => (
                  <CountryCard
                    key={country.id}
                    country={country}
                    data={historicalData[country.id]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndicatorInfo;