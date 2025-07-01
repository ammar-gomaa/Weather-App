const apiKey = "bf82d83f5543421b95275101252406"; // Replace with your actual API key from weatherapi.com
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const forecastDiv = document.getElementById("forecast");

async function getWeatherData(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`
    );
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function displayForecast(data) {
  const { location, current, forecast } = data;
  const forecastday = forecast.forecastday;

  let cartoona = `
    <div class="col-md-4">
      <div class="forecast-item">
        <div class="forecast-header d-flex justify-content-between align-items-center">
          <span>${new Date(forecastday[0].date).toLocaleDateString("en-US", {
            weekday: "long",
          })}</span>
          <span>${new Date(forecastday[0].date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "long",
          })}</span>
        </div>
        <div class="forecast-content p-4">
          <p class="location">${location.name}</p>
          <div class="degree d-flex align-items-center">
            <span class="num">${current.temp_c}</span>
            <span class="fs-1"><sup>o</sup>C</span>
            <div class="forecast-icon ms-4">
              <img src="https:${current.condition.icon}" alt="" width="90" />
            </div>
          </div>
          <div class="custom">${current.condition.text}</div>
          <div class="d-flex mt-3">
            <span class="me-3"><img src="imgs/icon-umberella.png" alt="" class="me-1">20%</span>
            <span class="me-3"><img src="imgs/icon-wind.png" alt="" class="me-1">${
              current.wind_kph
            }km/h</span>
            <span class="me-3"><img src="imgs/icon-compass.png" alt="" class="me-1">${
              current.wind_dir
            }</span>
          </div>
        </div>
      </div>
    </div>
  `;

  for (let i = 1; i < forecastday.length; i++) {
    cartoona += `
      <div class="col-md-4 text-center">
        <div class="forecast-item">
          <div class="forecast-header">
            <span>${new Date(forecastday[i].date).toLocaleDateString("en-US", {
              weekday: "long",
            })}</span>
          </div>
          <div class="forecast-content p-4">
            <div class="forecast-icon">
              <img src="https:${
                forecastday[i].day.condition.icon
              }" alt="" width="48" />
            </div>
            <div class="degree pt-3 pb-2">
              <span class="num fs-3 text-white">${
                forecastday[i].day.maxtemp_c
              }<sup>o</sup>C</span>
            </div>
            <small class="fs-6">${
              forecastday[i].day.mintemp_c
            }<sup>o</sup></small>
            <div class="custom mt-3">${forecastday[i].day.condition.text}</div>
          </div>
        </div>
      </div>
    `;
  }

  forecastDiv.innerHTML = cartoona;
}

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherData(`${latitude},${longitude}`);
      },
      (error) => {
        console.error("Error getting current location:", error);
        // Fallback to a default location if user denies permission
        getWeatherData("cairo");
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    // Fallback to a default location
    getWeatherData("cairo");
  }
}

searchBtn.addEventListener("click", () => {
  if (searchInput.value) {
    getWeatherData(searchInput.value);
  }
});

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && searchInput.value) {
    getWeatherData(searchInput.value);
  }
});

// Get weather for current location on page load
getCurrentLocation();
