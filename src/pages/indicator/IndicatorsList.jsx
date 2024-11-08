import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';
import { getIndicators } from '../../lib/api';
import { paginate } from '../../lib/utils';
import { Link } from "react-router-dom";
import { useQueryState } from 'nuqs'
import useCountries from "../../hooks/useCountries";

const IndicatorsList = () => {
    const [indicators, setIndicators] = useState([]);
    const { countries } = useCountries();
    const [mainSearchQuery, setMainSearchQuery] = useQueryState('q', '');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const PAGE_SIZE = 10;
    const debouncedMainSearch = useDebounce(mainSearchQuery, 300) || "";

    const filteredIndicators = indicators.filter(indicator =>
        indicator.name.toLowerCase().includes(debouncedMainSearch.toLowerCase()) ||
        indicator.id.toLowerCase().includes(debouncedMainSearch.toLowerCase())
    );

    const popularIndicators = filteredIndicators.filter(indicator => indicator.isPopular);
    const otherIndicators = filteredIndicators.filter(indicator => !indicator.isPopular);

    const paginatedPopularIndicators = paginate(popularIndicators, Math.min(PAGE_SIZE, popularIndicators.length), currentPage);
    const paginatedOtherIndicators = paginate(otherIndicators, Math.max(0, PAGE_SIZE - popularIndicators.length), currentPage);

    const totalPages = Math.ceil((popularIndicators.length + otherIndicators.length) / PAGE_SIZE);

    const searchResults = debouncedMainSearch ? {
        countries: countries.filter(country =>
            country.name.toLowerCase().includes(debouncedMainSearch.toLowerCase())
        ),
        indicators: {
            popular: paginatedPopularIndicators,
            other: paginatedOtherIndicators
        }
    } : null;

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedMainSearch]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [indicatorsData] = await Promise.all([
                    getIndicators()
                ]);
                setIndicators(indicatorsData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

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

    const IndicatorCard = ({ indicator }) => (
        <Link
            to={`/indicator/${indicator.id}`}
            className="block p-4 transition-shadow duration-200 bg-white border border-gray-200 rounded-lg hover:shadow-md"
        >
            <h4 className="font-medium text-gray-900">{indicator.name}</h4>
            <p className="mt-1 text-sm text-gray-500">{indicator.sourceNote}</p>
            <div className="mt-2 text-xs text-gray-400">ID: {indicator.id}</div>
        </Link>
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
            <div className="p-6 bg-white rounded-lg shadow">
                {/* Search Section */}
                <div className="max-w-3xl mx-auto">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full py-4 pl-10 pr-3 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search for indicators..."
                            value={mainSearchQuery || ""}
                            onChange={(e) => setMainSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Popular Indicators Section */}
                <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Popular Indicators</h3>
                    <div className="space-y-4">
                        {paginatedPopularIndicators.map((indicator) => (
                            <IndicatorCard key={indicator.id} indicator={indicator} />
                        ))}
                    </div>

                    {/* Search Results */}
                    {searchResults && searchResults.indicators.other.length > 0 && (
                        <div className="mt-8">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Other Indicators</h3>
                            <div className="space-y-4">
                                {searchResults.indicators.other.map((indicator) => (
                                    <IndicatorCard key={indicator.id} indicator={indicator} />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {filteredIndicators.length > PAGE_SIZE && (
                                <PaginationControls />
                            )}
                        </div>
                    )}

                    {searchResults && searchResults.countries.length === 0 && searchResults.indicators.popular.length === 0 && searchResults.indicators.other.length === 0 && (
                        <div className="p-8 mt-8 text-center text-gray-500 rounded-lg bg-gray-50">
                            No results found for "{mainSearchQuery}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IndicatorsList;