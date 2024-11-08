import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCountries from '../../../../hooks/useCountries';


export default function CountryByName() {
    const { countryName } = useParams();
    const navigate = useNavigate();
    const { countries, loading } = useCountries();

    useEffect(() => {
        if (loading) return;
        async function redirectToCountry() {
            try {
                const country = countries.find(
                    (c) => c.name.toLowerCase() === countryName.toLowerCase()
                );
                
                if (country) {
                    navigate(`/country/${country.id}`);
                } else {
                    console.error("Country not found");
                }
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        }

        redirectToCountry();
    }, [countryName, navigate, countries, loading]);

    return (
        <div>
            <h1>Redirecting to country details...</h1>
        </div>
    );
}
