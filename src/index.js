import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { NuqsAdapter } from 'nuqs/adapters/react-router'
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

/* Base Layout */
import Home from './Home';
import Navbar from './components/navbar';

/* Indicator */
import IndicatorsList from './pages/indicator/IndicatorsList'
import IndicatorInfo from './pages/indicator/[indicatorId]/IndicatorInfo';

/* Country */
import CountryList from './pages/country/CountryList'
import CountryInfo from './pages/country/[countryId]/CountryInfo';
import CountryByName from './pages/country/country-by-name/[countryName]/CountryByName';

/* USA Stuff */
import SpendingData from './pages/usa-breakdown/UsaSim';
import Other from './pages/usa-breakdown/other/Other';
import UsaSpecific from './pages/usa-breakdown/[agency]/USAAgency';

const Layout = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <Outlet />
  </div>
)

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/country",
        element: <CountryList />,
      },
      {
        path: "/country/:countryId",
        element: <CountryInfo />,
      },
      /* Utility route to redirect from countryName to /country/:countryId */
      {
        path: "/country-by-name/:countryName",
        element: <CountryByName />,
      },
      {
        path: "/indicator",
        element: <IndicatorsList />,
      },
      {
        path: "/indicator/:indicatorId",
        element: <IndicatorInfo />,
      },
      {
        path: "/usa-breakdown",
        element: <SpendingData />,
      },
      {
        path: "/usa-breakdown/:agencyName",
        element: <UsaSpecific />
      },
      {
        path: "/usa-breakdown/other",
        element: <Other />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <NuqsAdapter>
    <RouterProvider router={router} />
  </NuqsAdapter>
);