const API_KEY = "136fe3b605585857a2b817fee9f75a57";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");
const weatherCard = document.getElementById("weatherCard");

searchBtn.addEventListener("click", searchWeather);
cityInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchWeather();
  }
});

window.addEventListener("load", function () {
  getWeatherData("Lahore");
});

function searchWeather() {
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
    cityInput.value = "";
  }
}

async function getWeatherData(city) {
  showLoading(true);

  try {
    const currentResponse = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!currentResponse.ok) {
      throw new Error("City not found");
    }

    const currentData = await currentResponse.json();

    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    const forecastData = await forecastResponse.json();

    displayWeather(currentData, forecastData);
  } catch (error) {
    alert("Error: " + error.message);
    console.error("Error fetching weather data:", error);
  } finally {
    showLoading(false);
  }
}

function displayWeather(current, forecast) {
  document.getElementById("cityName").textContent =
    current.name + ", " + current.sys.country;
  document.getElementById("temperature").textContent =
    Math.round(current.main.temp) + "°C";
  document.getElementById("weatherDescription").textContent =
    current.weather[0].description;
  document.getElementById("humidity").textContent = current.main.humidity + "%";
  document.getElementById("windSpeed").textContent =
    Math.round(current.wind.speed * 3.6) + " km/h";

  const iconCode = current.weather[0].icon;
  document.getElementById(
    "weatherIcon"
  ).src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  displayForecast(forecast);

  weatherCard.style.display = "block";
}

function displayForecast(forecastData) {
  const dailyForecasts = [];
  for (
    let i = 8;
    i < forecastData.list.length && dailyForecasts.length < 3;
    i += 8
  ) {
    dailyForecasts.push(forecastData.list[i]);
  }

  for (let i = 0; i < 3; i++) {
    const dayNum = i + 1;

    if (dailyForecasts[i]) {
      const item = dailyForecasts[i];
      const date = new Date(item.dt * 1000);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const iconCode = item.weather[0].icon;
      const temp = Math.round(item.main.temp);
      const description = item.weather[0].description;

      document.getElementById(`day${dayNum}Date`).textContent = dateStr;
      document.getElementById(
        `day${dayNum}Icon`
      ).src = `https://openweathermap.org/img/wn/${iconCode}.png`;
      document.getElementById(`day${dayNum}Temp`).textContent = temp + "°C";
      document.getElementById(`day${dayNum}Desc`).textContent = description;
    } else {
      document.getElementById(`day${dayNum}Date`).textContent = "--";
      document.getElementById(`day${dayNum}Icon`).src = "";
      document.getElementById(`day${dayNum}Temp`).textContent = "--°C";
      document.getElementById(`day${dayNum}Desc`).textContent = "--";
    }
  }
}

function showLoading(show) {
  if (show) {
    loading.style.display = "block";
    weatherCard.style.display = "none";
  } else {
    loading.style.display = "none";
  }
}
