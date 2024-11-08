import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, BarChart2, Building2, Search, ArrowLeft } from 'lucide-react';

const Other = () => {
    const [usAgencies, setUsAgencies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'amount', direction: 'desc' });
    const MAJOR_THRESHOLD = 0.10;

    useEffect(() => {
        const fetchAgencyData = async () => {
            try {
                const response = await fetch('https://api.usaspending.gov/api/v2/references/toptier_agencies/', {
                    cache: "force-cache"
                });
                const data = await response.json();
                processData(data.results);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const processData = (agencies) => {
            const totalBudget = agencies.reduce((sum, agency) => sum + agency.budget_authority_amount, 0);
            let filteredAgencies = agencies
                .filter(agency => (agency.budget_authority_amount / totalBudget) <= MAJOR_THRESHOLD)
                .map(agency => ({
                    name: agency.agency_name,
                    abrv: agency.abbreviation,
                    amount: agency.budget_authority_amount,
                    percentage: (agency.budget_authority_amount / totalBudget) * 100,
                }));
            setUsAgencies(filteredAgencies);
        };

        fetchAgencyData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimization: false,
            notation: 'compact',
            compactDisplay: 'short',
        }).format(amount);
    };

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const sortedAgencies = [...usAgencies]
        .filter(agency => 
            agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agency.abrv.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortConfig.direction === 'asc') {
                return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
            }
            return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
        });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Federal Agency Explorer
                    </div>
                    <h1 className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text sm:text-6xl">
                        Federal Spending Breakdown
                    </h1>
                    <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-500">
                        Explore detailed spending information for over 100 federal agencies that each manage less than 10% of the total federal budget.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <div className="flex flex-col items-center">
                            <Building2 className="w-8 h-8 mb-4 text-blue-500" />
                            <div className="mb-2 text-2xl font-bold">
                                {usAgencies.length}
                            </div>
                            <p className="text-gray-500">Total Agencies</p>
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md">
                        <div className="flex flex-col items-center">
                            <BarChart2 className="w-8 h-8 mb-4 text-green-500" />
                            <div className="mb-2 text-2xl font-bold">
                                {formatCurrency(usAgencies.reduce((sum, agency) => sum + agency.amount, 0))}
                            </div>
                            <p className="text-gray-500">Combined Budget</p>
                        </div>
                    </div>
                    <div className="p-6 bg-white rounded-lg shadow-md sm:col-span-2 lg:col-span-1">
                        <div className="flex flex-col items-center">
                            <TrendingUp className="w-8 h-8 mb-4 text-purple-500" />
                            <div className="mb-2 text-2xl font-bold">
                                {(usAgencies.reduce((sum, agency) => sum + agency.percentage, 0)).toFixed(1)}%
                            </div>
                            <p className="text-gray-500">of Total Federal Budget</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-12 bg-white rounded-lg shadow-md">
                    <div className="flex flex-col p-6 space-y-4 border-b border-gray-200 md:flex-row md:items-center md:justify-between md:space-y-0">
                        <h2 className="text-2xl font-bold">Agency Directory</h2>
                        <div className="relative">
                            <Search className="absolute w-5 h-5 text-gray-400 left-3 top-3" />
                            <input
                                type="text"
                                placeholder="Search agencies..."
                                className="w-full px-10 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th 
                                            className="px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('name')}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <span>Agency Name</span>
                                                {sortConfig.key === 'name' && (
                                                    <ArrowLeft className={`w-4 h-4 transform ${sortConfig.direction === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                                                )}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left">Abbreviation</th>
                                        <th 
                                            className="px-6 py-3 text-right cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('amount')}
                                        >
                                            <div className="flex items-center justify-end space-x-2">
                                                <span>Budget</span>
                                                {sortConfig.key === 'amount' && (
                                                    <ArrowLeft className={`w-4 h-4 transform ${sortConfig.direction === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                                                )}
                                            </div>
                                        </th>
                                        <th 
                                            className="px-6 py-3 text-right cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('percentage')}
                                        >
                                            <div className="flex items-center justify-end space-x-2">
                                                <span>% of Total</span>
                                                {sortConfig.key === 'percentage' && (
                                                    <ArrowLeft className={`w-4 h-4 transform ${sortConfig.direction === 'asc' ? 'rotate-90' : '-rotate-90'}`} />
                                                )}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedAgencies.map((agency) => (
                                        <tr 
                                            key={agency.abrv} 
                                            className="border-t border-gray-200 hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 font-medium">{agency.name}</td>
                                            <td className="px-6 py-4 text-gray-500">{agency.abrv}</td>
                                            <td className="px-6 py-4 text-right">{formatCurrency(agency.amount)}</td>
                                            <td className="px-6 py-4 text-right">{agency.percentage.toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <Link 
                        to="/usa-breakdown"
                        className="inline-flex items-center px-6 py-3 text-base font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Main Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Other;