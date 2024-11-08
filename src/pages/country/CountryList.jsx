import React from 'react'
import { Link } from 'react-router-dom'
import useCountries from '../../hooks/useCountries'

const CountryList = () => {
    const { countries, loading } = useCountries();

    return (
        <div>
            <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="md:col-span-2">
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="mb-6 text-2xl font-bold text-gray-900">Country List</h2>
                        <table className='min-w-full overflow-hidden border-collapse rounded-lg'>
                            <thead className='bg-gray-200'>
                                <tr>
                                    <th className='px-4 py-2 text-left border-b-2 border-gray-300'>Countries</th>
                                    <th className='px-4 py-2 text-left border-b-2 border-gray-300'>Country Code</th>
                                    <th className='px-4 py-2 text-left border-b-2 border-gray-300'>Capital City</th>
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && countries.map((country) => (
                                    <tr key={country.id} className='hover:bg-gray-100'>
                                        <td className='px-4 py-2 border-b border-gray-300'>
                                            <Link className='text-blue-500 underline' to={`/country/${country.id}`}>{country.name}</Link>
                                        </td>
                                        <td className='px-4 py-2 border-b border-gray-300'>{country.id}</td>
                                        <td className='px-4 py-2 border-b border-gray-300'>{country.capitalCity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                    </div>
                </div>
            </div>

        </div>
    )
}
export default CountryList