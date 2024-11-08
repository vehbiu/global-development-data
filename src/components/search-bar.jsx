import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';
import useCountries from '../hooks/useCountries';
import { getIndicators } from '../lib/api';

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const searchInputRef = useRef(null);
  const debouncedSearch = useDebounce(searchQuery);

  const { countries } = useCountries();
  const [indicators, setIndicators] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setIndicators(await getIndicators());
    })();
  }, []);

  useEffect(() => {
    if (isExpanded) {
      searchInputRef.current?.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    // Close the search bar if the Escape key is pressed
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
        setSearchQuery('');
      }
    };

    if (isExpanded) {
      // Only add the listener when the search bar is expanded
      window.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup the event listener when the component unmounts or search bar is closed
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  const searchResults = debouncedSearch ? {
    countries: countries.filter(country =>
      country.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    ).slice(0, 5),
    indicators: indicators.filter(indicator =>
      indicator.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      indicator.id.toLowerCase().includes(debouncedSearch.toLowerCase())
    ).slice(0, 5)
  } : null;

  const addToHistory = (query) => {
    if (!query.trim()) return;
    const newHistory = [
      query,
      ...searchHistory.filter(item => item !== query)
    ].slice(0, 3);

    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleSelect = (type, query) => {
    addToHistory(query);
    setIsExpanded(false);
    navigate(`/${type}/${query}`);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSearchQuery('');
  };

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50">
        <div className="w-full max-w-2xl mt-20 bg-white rounded-lg shadow-xl">
          <div className="flex items-center p-4 border-b">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none"
              placeholder="Search indicators or countries..."
            />
            <button
              onClick={handleClose}
              className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 divide-y divide-gray-100">
            {/* Recent Searches */}
            {!searchQuery && searchHistory.length > 0 && (
              <div className="pb-4">
                <h3 className="flex items-center mb-2 text-sm font-medium text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Searches
                </h3>
                <div className="space-y-2">
                  {searchHistory.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchQuery(query)}
                      className="block w-full p-2 text-left text-gray-700 rounded hover:bg-gray-50"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchResults && (
              <div className="pt-4">
                {searchResults.countries.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-2 text-sm font-medium text-gray-500">Countries</h3>
                    {searchResults.countries.map((country) => (
                      <div
                        key={country.id}
                        onClick={() => handleSelect("country", country.id)}
                        className="flex items-center justify-between p-2 text-gray-700 rounded hover:bg-gray-50"
                      >
                        <span>{country.name}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.indicators.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-medium text-gray-500">Indicators</h3>
                    {searchResults.indicators.map((indicator) => (
                      <Link
                        key={indicator.id}
                        to={`/indicator/${indicator.id}`}
                        onClick={() => handleSelect("indicator", indicator.id)}
                        className="block p-2 text-gray-700 rounded hover:bg-gray-50"
                      >
                        <div className="font-medium">{indicator.name}</div>
                        <div className="text-xs text-gray-400">ID: {indicator.id}</div>
                      </Link>
                    ))}
                  </div>
                )}

                {searchResults.countries.length === 0 && searchResults.indicators.length === 0 && (
                  <div className="py-4 text-center text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsExpanded(true)}
      className="p-2 text-gray-500 rounded-full hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <Search className="w-5 h-5" />
    </button>
  );
};

export default SearchBar;
