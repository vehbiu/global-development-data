import React, { useEffect, useRef, useState } from 'react';
import ChartJS from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingDown, PieChart, ArrowUpDown } from 'lucide-react';

ChartJS.defaults.font.size = 16;

const SpendingData = () => {
  const [chartData, setChartData] = useState(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [deficit, setDeficit] = useState(0);
  const MAJOR_THRESHOLD = 0.10;
  const navigate = useNavigate();

  const chart = useRef(null);

  const handleClick = (event) => {
    const elements = chart.current?.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
    
    if (elements.length > 0) {
      const { index } = elements[0];
      const agencyName = chartData.abrv[index];
      navigate(`/usa-breakdown/${agencyName}`);
    }
  };

  const incomeChartData = {
    labels: ['Individual Income Taxes', 'Payroll Taxes', 'Corporate Income Taxes', 'Excise Taxes', 'Other'],
    datasets: [{
      data: [2600000000000, 1500000000000, 425000000000, 100000000000, 275000000000],
      backgroundColor: [
        '#4ade80',
        '#2dd4bf',
        '#60a5fa',
        '#818cf8',
        '#c084fc'
      ],
    }],
  };

  useEffect(() => {
    const fetchAgencyData = async () => {
      try {
        const response = await fetch('https://api.usaspending.gov/api/v2/references/toptier_agencies/', {
            cache: 'no-cache',
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        processData(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const processData = (agencies) => {
      const totalBudget = agencies.reduce((sum, agency) => sum + agency.budget_authority_amount, 0);
      let majorAgencies = [];
      let otherAmount = 0;

      agencies.forEach(agency => {
        const budgetPercentage = agency.budget_authority_amount / totalBudget;
        if (budgetPercentage > MAJOR_THRESHOLD) {
          majorAgencies.push({
            name: agency.agency_name,
            abrv: agency.abbreviation,
            amount: agency.budget_authority_amount,
            percentage: budgetPercentage * 100,
          });
        } else {
          otherAmount += agency.budget_authority_amount;
        }
      });

      const income = 4900000000000;
      const spent = totalBudget;
      setTotalIncome(income);
      setTotalSpent(spent);
      setDeficit(spent - income);

      const dataS = {
        labels: [...majorAgencies.map(agency => agency.name), 'Other'],
        abrv: [...majorAgencies.map(agency => agency.abrv), 'Other'],
        datasets: [{
          data: [...majorAgencies.map(agency => agency.amount), otherAmount],
          backgroundColor: [
            '#4ade80',
            '#2dd4bf',
            '#60a5fa',
            '#818cf8',
            '#c084fc',
            '#f472b6',
            '#fb923c'
          ],
        }],
      };

      setChartData(dataS);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
            <DollarSign className="w-4 h-4 mr-2" />
            Federal Budget Overview
          </div>
          <h1 className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text sm:text-6xl">
            US Federal Spending & Income
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-xl text-gray-500">
            Explore how the US government allocates its budget and generates revenue through various sources.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              <DollarSign className="w-8 h-8 mb-4 text-green-500" />
              <div className="mb-2 text-2xl font-bold text-gray-900">
                {formatCurrency(totalIncome)}
              </div>
              <p className="text-gray-500">Total Income</p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              <TrendingDown className="w-8 h-8 mb-4 text-red-500" />
              <div className="mb-2 text-2xl font-bold text-gray-900">
                {formatCurrency(totalSpent)}
              </div>
              <p className="text-gray-500">Total Spending</p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              <ArrowUpDown className="w-8 h-8 mb-4 text-purple-500" />
              <div className="mb-2 text-2xl font-bold text-gray-900">
                {formatCurrency(Math.abs(deficit))}
              </div>
              <p className="text-gray-500">{deficit > 0 ? 'Budget Deficit' : 'Budget Surplus'}</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid gap-8 mt-12 md:grid-cols-2">
          {/* Spending Chart */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <PieChart className="w-6 h-6 mr-2 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Spending Breakdown</h2>
            </div>
            <div className="flex flex-col items-center">
              {chartData ? (
                <Pie 
                  data={chartData}
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20
                        }
                      }
                    },
                    onClick: handleClick
                  }} ref={chart}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-64">
                  <div className="text-gray-500">Loading chart...</div>
                </div>
              )}
            </div>
          </div>

          {/* Income Chart */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 mr-2 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Income Sources</h2>
            </div>
            <div className="flex flex-col items-center">
              <Pie 
                data={incomeChartData}
                options={{
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingData;