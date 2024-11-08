import { ArrowLeft, Building2, Globe, Briefcase, Target, DollarSign } from 'lucide-react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';

const agencyData = {
    'SSA': {
        fullName: 'Social Security Administration',
        description: 'The Social Security Administration (SSA) is an independent agency of the U.S. federal government that administers Social Security, a social insurance program providing retirement, disability, and survivors\' benefits.',
        economicImpact: 'The SSA is a major employer in the U.S., with over 60,000 federal employees. Its programs provide critical income support to millions of Americans, contributing significantly to the nation\'s economic stability and consumer spending.',
        globalImpact: 'The SSA\'s work on international social security agreements helps facilitate the portability of benefits for individuals who have worked in multiple countries, promoting global workforce mobility.',
        responsibilities: 'The SSA\'s primary responsibilities include managing the Social Security program, which provides retirement, disability, and survivors\' benefits, as well as the Supplemental Security Income (SSI) program, which provides assistance to individuals with limited income and resources.'
    },
    'HHS': {
        fullName: 'Department of Health and Human Services',
        description: 'The Department of Health and Human Services (HHS) is a federal executive department responsible for protecting the health and well-being of all Americans and providing essential human services.',
        economicImpact: 'HHS is a significant driver of the U.S. economy, employing over 80,000 people and funding research, healthcare, and social services that support millions of jobs across the country.',
        globalImpact: 'HHS plays a crucial role in global health initiatives, collaborating with international organizations to address pandemics, promote universal health coverage, and improve access to essential medicines and vaccines worldwide.',
        responsibilities: 'HHS\'s responsibilities include administering Medicare and Medicaid, overseeing the Centers for Disease Control and Prevention (CDC), conducting medical research through the National Institutes of Health (NIH), and supporting a wide range of social services programs.'
    },
    'TREAS': {
        fullName: 'Department of the Treasury',
        description: 'The Department of the Treasury is the executive department responsible for promoting economic prosperity, managing the U.S. government\'s finances, and ensuring the safety, soundness, and security of the U.S. and international financial systems.',
        economicImpact: 'The Treasury Department plays a crucial role in the U.S. economy, managing the country\'s finances, collecting taxes, and overseeing economic policies that impact businesses and consumers.',
        globalImpact: 'The Treasury Department\'s international work includes promoting global financial stability, combating financial crimes, and enforcing economic sanctions, contributing to the U.S. role in the global economy.',
        responsibilities: 'The Treasury Department\'s core responsibilities include collecting taxes, managing government accounts and the public debt, enforcing financial laws and regulations, and overseeing the production of currency and coinage.'
    },
    'DOD': {
        fullName: 'Department of Defense',
        description: 'The Department of Defense (DoD) is a federal agency responsible for overseeing the United States\' national defense and military operations.',
        economicImpact: 'The DoD is a major driver of the U.S. economy, creating millions of jobs and contributing significantly to the GDP through salaries, contracts, and support for local economies.',
        globalImpact: 'The DoD influences international stability, security, and diplomacy, acting as a stabilizing force and addressing global threats through military presence, partnerships, and technological advancements.',
        responsibilities: 'The DoD\'s primary responsibilities include maintaining military readiness, coordinating defense strategies, managing the U.S. Armed Forces, intelligence gathering, and cybersecurity.'
    }
};

const SpendingData = () => {
    const { agencyName } = useParams();

    const agency = agencyData[agencyName] || {
        fullName: 'Agency Not Found',
        description: 'Information not available',
        economicImpact: 'Information not available',
        globalImpact: 'Information not available',
        responsibilities: 'Information not available'
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Navigation */}
                <Link
                    to="/usa-breakdown"
                    className="inline-flex items-center px-4 py-2 mb-8 text-sm font-medium text-blue-600 transition-colors bg-blue-100 rounded-full hover:bg-blue-200"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Agency Overview
                </Link>

                {/* Header Section */}
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
                        <Building2 className="w-4 h-4 mr-2" />
                        Federal Agency Profile
                    </div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text sm:text-5xl">
                        {agency.fullName}
                    </h1>
                    <p className="max-w-3xl mx-auto mt-4 text-xl text-gray-600">
                        {agency.description}
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-8 mb-12 md:grid-cols-2">
                    {/* Economic Impact */}
                    <div className="overflow-hidden bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="flex items-center justify-center w-10 h-10 mr-4 bg-green-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Economic Impact</h2>
                            </div>
                            <p className="text-gray-600">{agency.economicImpact}</p>
                        </div>
                    </div>

                    {/* Global Impact */}
                    <div className="overflow-hidden bg-white rounded-lg shadow-md">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="flex items-center justify-center w-10 h-10 mr-4 bg-blue-100 rounded-lg">
                                    <Globe className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Global Impact</h2>
                            </div>
                            <p className="text-gray-600">{agency.globalImpact}</p>
                        </div>
                    </div>
                </div>

                {/* Responsibilities Section */}
                <div className="overflow-hidden bg-white rounded-lg shadow-md">
                    <div className="p-6">
                        <div className="flex items-center mb-6">
                            <div className="flex items-center justify-center w-10 h-10 mr-4 bg-purple-100 rounded-lg">
                                <Target className="w-6 h-6 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Core Responsibilities</h2>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-xl">
                            <p className="text-gray-600">{agency.responsibilities}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex justify-center mt-8 space-x-4">
                    <Link
                        to="/usa-breakdown"
                        className="inline-flex items-center px-6 py-3 text-base font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Briefcase className="w-5 h-5 mr-2" />
                        View All Agencies
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SpendingData;