import SearchBar from "./search-bar";
import { Globe } from 'lucide-react';
import { Link, useResolvedPath } from 'react-router-dom';
import { CompareButton } from './compare-button';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const { pathname } = useResolvedPath();

    const [selectedCountries, setSelectedCountries] = useState([]);

    useEffect(() => {
        if (pathname.startsWith("/country/")) {
            const countries = pathname.split("/")[2];
            if (countries === "") return;
            setSelectedCountries(countries.split(","));
        } else {
            setSelectedCountries([]);
        }
    }, [pathname]);

    const onSelectCountry = (countryId, index) => {
        const newCountries = [...selectedCountries];
        if (index >= 0) {
            newCountries[index] = countryId;
        } else {
            newCountries.push(countryId);
        }
        updateUrl(newCountries);
    };

    const onRemoveCountry = (index) => {
        const newCountries = selectedCountries.filter((_, i) => i !== index);
        updateUrl(newCountries);
    };

    const updateUrl = (countries) => {
        const uniqueCountries = Array.from(new Set(countries));
        window.location = `/country/${uniqueCountries.join(",")}`;
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center">
                        <Globe className="w-8 h-8 text-blue-600" />
                        <span className="ml-2 text-xl font-semibold text-gray-900">World Data Explorer</span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {/* <button className="p-2 text-gray-500 rounded-full hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <Search className="w-5 h-5" />
                        </button> */}
                        <SearchBar />
                        
                        {selectedCountries.map((countryId, index) => (
                            <CompareButton
                                key={index}
                                countryId={countryId}
                                onSelectCountry={(id) => onSelectCountry(id, index)}
                                onRemoveCountry={() => onRemoveCountry(index)}
                                index={index}
                            />
                        ))}
                        <CompareButton
                            key="blank"
                            onSelectCountry={(id) => onSelectCountry(id, -1)}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
