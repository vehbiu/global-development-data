import { useState } from "react";
import Countries from "../data/Countries";

export default function WorldMap({ onClickCountry, heat = [] }) {
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, country: "", value: 0 });

    const maxHeat = Math.max(...heat.map(item => item.value));


    const handleMouseOver = (e) => {
        const countryName = e.target.getAttribute("name");
        const countryData = heat.find(item => item.name === countryName);
        setHoveredCountry(countryName);
        setTooltip({ visible: true, x: e.clientX + 10, y: e.clientY + 10, country: countryName, value: countryData?.value.toFixed(2) || 0 });
    };

    const handleMouseLeave = () => {
        setHoveredCountry(null);
        setTooltip({ ...tooltip, visible: false });
    };

    const getCountryColor = (countryName) => {
        if (maxHeat === 0) {
            return "gray";
        }

        const heatAmount = heat.find(item => item.name === countryName)?.value || 0;
        const intensity = maxHeat > 0 ? (heatAmount / maxHeat) : 0;
        const blue = Math.floor(intensity * 255);
        return `rgb(${200-blue}, ${225-blue}, ${255 - blue})`;
    };

    const handleClick = (e) => {
        const countryName = e.target.getAttribute("name");
        if (onClickCountry) {
            onClickCountry(countryName);
        }
    };

    return (
        <>
            <svg
                baseProfile="tiny"
                fill="#ececec"
                height={857}
                stroke="black"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth=".2"
                version="1.2"
                viewBox="0 0 2000 857"
                className="max-w-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                {Countries.map((country, i) => (
                    <path
                        key={country.name + i}
                        fill={hoveredCountry === country.name ? "red" : getCountryColor(country.name)}
                        stroke={hoveredCountry === country.name ? "red" : "black"}
                        onMouseOver={handleMouseOver}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleClick}
                        d={country.d}
                        id={country.name}
                        name={country.name}
                    />
                ))}

                {/* Optional circles */}
                <circle cx="997.9" cy="189.1" id={0}></circle>
                <circle cx="673.5" cy="724.1" id={1}></circle>
                <circle cx="1798.2" cy="719.3" id={2}></circle>
            </svg>

            {/* Tooltip */}
            {tooltip.visible && (
                <div
                    style={{
                        position: "fixed",
                        left: tooltip.x,
                        top: tooltip.y,
                        padding: "5px 10px",
                        backgroundColor: "#333",
                        color: "white",
                        borderRadius: "5px",
                        pointerEvents: "none",
                        fontSize: "14px",
                    }}
                >
                    {tooltip.country}: {tooltip.value}
                </div>
            )}
        </>
    );
}