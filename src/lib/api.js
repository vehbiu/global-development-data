/* https://datahelpdesk.worldbank.org/knowledgebase/topics/125589 */

const CORS_URL = "https://cors-proxy.vehbi.me/"

const POPULAR_INDICATORS = {
    'NY.GDP.MKTP.CD': 'GDP (current US$)',
    'NY.GDP.PCAP.CD': 'GDP per capita (current US$)',
    'SP.POP.TOTL': 'Population, total',
    'FP.CPI.TOTL.ZG': 'Inflation, consumer prices (annual %)',
    'SL.UEM.TOTL.ZS': 'Unemployment, total (% of labor force)',
    'NY.GNS.ICTR.ZS': 'Gross savings (% of GDP)',
    'BX.KLT.DINV.WD.GD.ZS': 'Foreign direct investment (%)',
    'SE.XPD.TOTL.GD.ZS': 'Government expenditure on education',
    'SH.XPD.CHEX.GD.ZS': 'Current health expenditure (% of GDP)',
    'EG.USE.PCAP.KG.OE': 'Energy use (kg of oil equivalent per capita)',
};

/** 
 * @typedef {Object} RequestOptions
 * @property {string} path
 * @property {Object} [options={}]
 * @property {Object} [params={}]
 */

/**
 * @typedef {Object} Indicator
 * @property {string} id
 * @property {string} name
 * @property {string} [value]
 * @property {boolean} isPopular
 */

/**
 * @typedef {Object} CountryIndicatorData
 * @property {string} name
 * @property {Array<{ year: number, value: number }>} historical
 * @property {number} currentValue
 */

/**
 * @typedef {Object} CountryMetadata
 * @property {string} id
 * @property {string} name
 * @property {string} capitalCity
 */

/**
 * @typedef {Object} HeatmapData
 * @property {string} name
 * @property {number} value
 */

/**
 * @typedef {Object} IndicatorDataItem
 * @property {string} country
 * @property {number} value
 * @property {string} year
 */

/**
 * @param {RequestOptions} requestOptions
 * @returns {Promise<Object>}
 */
async function makeRequest({ path, options = {}, params = {} }) {
    const baseUrl = `${CORS_URL}https://api.worldbank.org/v2`;
    const url = new URL(`${baseUrl}${path}`);

    params = params || {};
    params.format = "json";

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Request failed:", error);
        throw error;
    }
}

/**
 * @returns {Promise<Indicator[]>}
 */
export async function getIndicators() {
    const indicators = await makeRequest({
        path: "/indicator",
        params: {
            per_page: 25000,
        }
    });
    return indicators[1].map(indicator => ({
        ...indicator,
        isPopular: POPULAR_INDICATORS.hasOwnProperty(indicator.id)
    }));
}

/**
 * @param {string} countryCode
 * @param {string} indicatorId
 * @returns {Promise<CountryIndicatorData | null>}
 */
export async function getCountryIndicator(countryCode, indicatorId) {
    try {
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 10;

        const response = await makeRequest({
            path: `/country/${countryCode}/indicator/${indicatorId}`,
            params: {
                date: `${startYear}:${currentYear}`,
                per_page: 1000,
            }
        });

        const transformedData = {
            name: response[1][0]?.indicator.value,
            historical: []
        };

        response[1]?.forEach(item => {
            if (item.value !== null) {
                transformedData.historical.push({
                    year: item.date,
                    value: item.value
                });
            }
        });

        transformedData.historical.sort((a, b) => a.year - b.year);
        transformedData.currentValue = transformedData.historical[transformedData.historical.length - 1]?.value;

        return transformedData;
    } catch (error) {
        console.error(`Failed to fetch indicator ${indicatorId} info for ${countryCode}:`, error);
        return null;
    }
}

/**
 * @param {string} countryCode
 * @returns {Promise<CountryMetadata | null>}
 */
export async function getCountryMetadata(countryCode) {
    try {
        const response = await makeRequest({
            path: `/country/${countryCode}`,
        });
        return response[1][0];
    } catch (error) {
        console.error(`Failed to fetch country metadata for ${countryCode}:`, error);
        return null;
    }
}

/**
 * @returns {Promise<CountryMetadata[]>}
 */
export async function getAllCountries() {
    const countries = await makeRequest({
        path: "/country",
        params: {
            per_page: 300,
        }
    });
    return countries[1].filter(country =>
        country.capitalCity &&
        !country.id.includes("EMU") &&
        !country.id.includes("EUU") &&
        !country.id.includes("SSF")
    );
}

/**
 * @param {string} indicatorId
 * @returns {Promise<HeatmapData[]>}
 */
export async function getLatestIndicatorDataHeatmap(indicatorId) {
    try {
        const response = await makeRequest({
            path: `/country/all/indicator/${indicatorId}`,
            params: {
                per_page: 9999,
            }
        });

        const countriesNames = [...new Set(response[1].map(item => item.country.value))];

        const output = [];

        for (const countryName of countriesNames) {
            const countryData = response[1].filter(item => item.country.value === countryName);
            const sortedData = countryData.sort((a, b) => b.year - a.year);
            const latestData = sortedData.find(item => item.value !== null && item.value !== undefined && item.value !== 0);

            if (latestData) {
                output.push({
                    name: countryName,
                    value: latestData.value || 0,
                });
            } else {
                output.push({
                    name: countryName,
                    value: 0,
                });
            }
        }

        return output;
    } catch (error) {
        console.error(`Failed to fetch latest indicator data for ${indicatorId}:`, error);
        return null;
    }
}

/**
 * @param {string} countryCode
 * @param {string} indicatorId
 * @returns {Promise<IndicatorDataItem[]>}
 */
export async function getIndicatorData(countryCode, indicatorId) {
    try {
        const response = await makeRequest({
            path: `/country/${countryCode}/indicator/${indicatorId}`,
            params: {
                per_page: 9999,
                start: 1960,
                end: (new Date()).getFullYear(),
            }
        });
        return response[1];
    } catch (error) {
        console.error(`Failed to fetch indicator data for ${indicatorId}:`, error);
        return null;
    }
}

/**
 * @param {string} indicatorId
 * @returns {Promise<IndicatorDataItem[]>}
 */
export async function getAllIndicatorData(indicatorId) {
    return await getIndicatorData("all", indicatorId);
}
