import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useCountries from '../hooks/useCountries';

export function CompareButton({ onSelectCountry, countryId, onRemoveCountry }) {
    const { countries } = useCountries();
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [navSearchQuery, setNavSearchQuery] = useState('');
    const dropdownRef = useRef(null);

    const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(navSearchQuery.toLowerCase())
    );

    const selectedCountry = countryId;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsCountryDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {selectedCountry ? selectedCountry : 'Select Country'}
                <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {isCountryDropdownOpen && (
                <div className="absolute right-0 z-50 w-64 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="p-2">
                        <input
                            type="text"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search countries..."
                            value={navSearchQuery}
                            onChange={(e) => setNavSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="overflow-y-auto max-h-64">
                        {filteredCountries.map((country) => (
                            <Link
                                key={country.id}
                                onClick={() => {
                                    onSelectCountry(country.id);
                                    setIsCountryDropdownOpen(false);
                                }}
                                to={`/country/${country.id}`}
                                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                            >
                                {country.name}
                            </Link>
                        ))}
                    </div>
                    {selectedCountry && (
                        <div className="p-2">
                            <button
                                onClick={() => {
                                    onRemoveCountry();
                                    setIsCountryDropdownOpen(false);
                                }}
                                className="w-full px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-100 focus:outline-none"
                            >
                                Unselect Item
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
