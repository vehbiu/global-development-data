import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCountryIndicator, getIndicators, getCountryMetadata } from '../../../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Info, MapPin, Globe, Filter, LayoutGrid, LayoutList, ChevronLeft, ChevronRight } from 'lucide-react';
import useDebounce from '../../../hooks/useDebounce';
import { formatValue, paginate } from '../../../lib/utils';

const CountryInfo = () => {
  const { countryId } = useParams();
  const countries = useMemo(() => countryId.includes(",") ? countryId.split(",") : [countryId], [countryId]);
  const [isHorizontalLayout, setIsHorizontalLayout] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);

  const [countryMetadatas, setCountryMetadatas] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopularOnly, setShowPopularOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [historicalData, setHistoricalData] = useState({});
  const [filteredIndicators, setFilteredIndicators] = useState([]);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, showPopularOnly]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [indicatorsData, metadataList] = await Promise.all([
          getIndicators(),
          Promise.all(countries.map(id => getCountryMetadata(id)))
        ]);
        setIndicators(indicatorsData);
        setCountryMetadatas(metadataList);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [countryId, countries]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (selectedIndicators.length === 0) return;

      try {
        const newHistoricalData = {};
        await Promise.all(selectedIndicators.map(async (indicator) => {
          const countryDataResults = await Promise.all(countries.map(country =>
            getCountryIndicator(country, indicator.id)
          ));

          newHistoricalData[indicator.id] = {};
          countries.forEach((country, index) => {
            newHistoricalData[indicator.id][country] = countryDataResults[index];
          });
        }));

        setHistoricalData(prevData => {
          return JSON.stringify(prevData) !== JSON.stringify(newHistoricalData) ? newHistoricalData : prevData;
        });
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
      }
    };

    fetchHistoricalData();
  }, [selectedIndicators, countries]);

  useEffect(() => {
    const filtered = indicators.filter(indicator => {
      const matchesSearch = indicator.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
      return showPopularOnly ? indicator.isPopular && matchesSearch : matchesSearch;
    });
    setFilteredIndicators(filtered);
  }, [indicators, debouncedSearchQuery, showPopularOnly]);

  const PAGE_SIZE = 10;
  const paginatedIndicators = paginate(filteredIndicators, PAGE_SIZE, currentPage);
  const totalPages = Math.ceil(filteredIndicators.length / PAGE_SIZE);

  const PaginationControls = () => (
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
  );

  const handleIndicatorSelect = (indicator) => {
    setSelectedIndicators(prev => {
      if (prev.find(i => i.id === indicator.id)) {
        return prev.filter(i => i.id !== indicator.id);
      }
      return [...prev, indicator];
    });
  };

  const IndicatorCard = ({ countryId, indicator, data }) => (
    <div className="mb-6">
      <h4 className="text-lg font-semibold">
        {countryMetadatas.find(m => m.id === countryId)?.name || countryId}
      </h4>
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
                  formatter={(value) => [formatValue(value), indicator.name]}
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

      <div className="grid gap-4 mb-8">
        {countryMetadatas.map((metadata) => (
          <div key={metadata.id} className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{metadata.name}</h1>
                <div className="flex items-center mt-2 space-x-4 text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{metadata.capitalCity}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    <span>{metadata.region.value}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="sticky p-6 bg-white rounded-lg shadow top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Indicators</h2>
              <button
                onClick={() => setShowPopularOnly(!showPopularOnly)}
                className="flex items-center px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <Filter className="w-4 h-4 mr-1" />
                {showPopularOnly ? 'Popular' : 'All'}
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search indicators..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[500px]">
              {paginatedIndicators.map((indicator) => (
                <label
                  key={indicator.id}
                  className="flex items-start mx-3 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    className="mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedIndicators.some(i => i.id === indicator.id)}
                    onChange={() => handleIndicatorSelect(indicator)}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{indicator.name}</p>
                    <p className="mt-1 text-xs text-gray-500">{indicator.sourceNote}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Add Pagination Controls */}
            {filteredIndicators.length > PAGE_SIZE && (
              <PaginationControls />
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="p-6 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Selected Indicators</h2>
              {countries.length > 1 && (
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

            {selectedIndicators.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg bg-gray-50">
                <Info className="w-12 h-12 mb-4 text-gray-400" />
                <p className="text-gray-600">Select indicators from the left panel to view their data</p>
              </div>
            ) : (
              <div className="space-y-8">
                {selectedIndicators.map((indicator) => (
                  <div key={indicator.id} className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="mb-4 text-lg font-medium text-gray-900">{indicator.name}</h3>
                    <div className={`grid gap-6 ${isHorizontalLayout && countries.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {countries.map((countryId) => (
                        <IndicatorCard
                          key={`${indicator.id}-${countryId}`}
                          countryId={countryId}
                          indicator={indicator}
                          data={historicalData[indicator.id]?.[countryId]}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryInfo;