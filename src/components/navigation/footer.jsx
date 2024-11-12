import { Github, CircleAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const credits = [
        [
            "Vehbi Unal",
            "https://github.com/vehbiu/"
        ],
        [
            "David Mroz",
            "https://github.com/daveloperpl/"
        ],
        [
            "Arya Patel",
            "https://github.com/aryapatel-dev08/"
        ]
    ]
    return (
        <footer className="text-white bg-gray-800">
            <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Links */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Explore</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link to="/indicator/" className="hover:text-white">Indicators</Link>
                            </li>
                            <li>
                                <Link to="/country/" className="hover:text-white">Countries</Link>
                            </li>
                            <li>
                                <Link to="/usa-breakdown" className="hover:text-white">US Spending</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Credits */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Credits</h3>
                        <ul className="space-y-2 text-gray-200">
                            {credits.map(([name, link]) => (
                                <li className="flex items-center space-x-1">
                                    <Github className="w-6 h-6 text-gray-400" />
                                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline underline-offset-2 hover:text-blue-300">{name}</a>
                                </li>
                            ))}
                        </ul>

                    </div>

                    {/* Source Code */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Contact Us / Source Code</h3>
                        <div className="flex w-full space-x-6">
                            {/* encounterd a bug? */}
                            <a href="https://github.com/vehbiu/global-development-data/issues" target="_blank" rel="noopener noreferrer" className="flex flex-row items-center space-x-2 text-red-400 hover:text-red-400/90">
                                <CircleAlert className="w-6 h-6" />
                                <span>Report Bug</span>
                            </a>
                            <a href="https://github.com/vehbiu/global-development-data" target="_blank" rel="noopener noreferrer" className="flex flex-row items-center space-x-2 text-gray-400 hover:text-white">
                                <Github className="w-6 h-6" />
                                <span>Github</span>
                            </a>

                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-6 mt-12 text-center border-t border-gray-700">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Vehbi Unal. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-400 ">
                        Credits to the <a className="text-blue-400" href="https://worldbank.org/">World Bank</a> for providing the data.
                    </p>
                </div>
            </div>
        </footer>
    );
}
