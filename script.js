const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const countryContainer = document.getElementById('countryContainer');

searchButton.addEventListener('click', () => {
	const searchTerm = searchInput.value.toLowerCase();
	fetch(`https://restcountries.com/v3.1/name/${searchTerm}`)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			countryContainer.innerHTML = '';
			data.forEach((country) => {
				const { name, flags, population, capital, latlng } = country;
				const countryCard = document.createElement('div');
				countryCard.classList.add('country-card');
				countryCard.innerHTML = `
                    <h2>${name.common}</h2>
                    <img src="${flags.png}" alt="${name.common} Flag">
                    <p>Population: ${population}</p>
                    <p>Capital: ${capital}</p>
                    <button class="more-details">More Details</button>
                `;
				countryCard.querySelector('.more-details').addEventListener('click', () => {
					fetch(
						`https://api.open-meteo.com/v1/forecast?latitude=${latlng[0]}&longitude=${latlng[1]}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&forecast_days=1`
					)
						.then((response) => response.json())
						.then((weatherData) => {
							console.log(weatherData);
							const { apparent_temperature, precipitation, pressure_msl, wind_speed_10m, wind_direction_10m, rain } =
								weatherData.current;
							alert(`More details for ${name.common}: \n
                                Region: ${country.region}\n
                                Languages: ${Object.values(country.languages).join(', ')}\n
                                Area: ${country.area} sq km\n
                                Weather: \n
                                \tApparent Temperature: ${apparent_temperature}°C\n
                                \tPrecipitation: ${precipitation} mm\n
                                \tPressure: ${pressure_msl} hPa\n
                                \tWind Speed: ${wind_speed_10m} m/s\n
                                \tWind Direction: ${wind_direction_10m}°\n
                                \tRain: ${rain} mm\n
                                `);
						});
				});
				countryContainer.appendChild(countryCard);
			});
		})
		.catch((error) => {
			console.error('Error fetching country data:', error);
			alert('Country not found or error occurred. Please try again.');
		});
});