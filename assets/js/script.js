function initPage() {
  const cityInput = document.getElementById("search-input");
  const historyList = document.getElementById("history");
  const todaySection = document.getElementById("today");
  const forecastSection = document.getElementById("forecast");
  const searchForm = document.getElementById("search-form");

  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  todaySection.classList.add("hidden");
  forecastSection.classList.add("hidden");
  searchForm.reset();

  const apiKey = "add your API Key"; // Replace with your OpenWeatherMap API key
  document
    .getElementById("search-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const cityName = cityInput.value.trim();
      if (cityName) {
        getWeather(cityName);
        let duplicate = searchHistory.every(function (name) {
          return name !== cityName;
        });
        if (duplicate) {
          searchHistory.push(cityName);
        }
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
      }
    });

// Event listener for history item click
historyList.addEventListener("click", function (event) {
  if (event.target.classList.contains("history")) {
    const cityName = event.target.textContent;
    getWeather(cityName);
  }
});

historyList.addEventListener("click", function (event) {
  if (event.target.innerText === "clear") {
    searchHistory = [];
    todaySection.innerText = "";
    forecastSection.innerText = "";
    todaySection.classList.add("hidden");
    forecastSection.classList.add("hidden");
    searchForm.reset();
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
  }
});
// Function to fetch weather data from the OpenWeatherMap API
function getWeather(cityName) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

  // Make API request
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Process and display current weather
      displayCurrentWeather(data);

      // Fetch and display 5-day forecast
      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      // Process and display 5-day forecast
      displayFiveDayForecast(data);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}
// Function to display current weather
function displayCurrentWeather(data) {
  todaySection.innerHTML = ""; // Clear previous content
  todaySection.classList.remove("hidden");
  const cityName = data.name;
  const date = new Date(data.dt * 1000);
  const temperature = data.main.temp;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const weatherIcon = data.weather[0].icon;

  // Create and append HTML elements
  const currentWeatherHTML = `
        <h2>${cityName} (${dayjs(date).format("MM/DD/YYYY")})</h2>
        <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="${
    data.weather[0].description
  }">
        <p>Temperature: ${temperature} &#176;C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;

  todaySection.innerHTML = currentWeatherHTML;
}

// Function to display 5-day forecast
function displayFiveDayForecast(data) {
  forecastSection.innerHTML = ""; // Clear previous content
  forecastSection.classList.remove("hidden");
  const forecastList = data.list;
  for (let i = 4; i < forecastList.length; i += 8) {
    const forecastData = forecastList[i];
    const date = new Date(forecastData.dt * 1000);
    const temperature = forecastData.main.temp;
    const humidity = forecastData.main.humidity;
    const weatherIcon = forecastData.weather[0].icon;

    // Create and append HTML elements for each forecast day
    const forecastHTML = `
          <div class="col-md-2 new">
            <p>Date: ${dayjs(date).format("MM/DD/YYYY")}</p>
            <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="${
      forecastData.weather[0].description
    }">
            <p>Temperature: ${temperature} &#176;C</p>
            <p>Humidity: ${humidity}%</p>
          </div>
        `;

    forecastSection.innerHTML += forecastHTML;
  }
}
  // Function to render search history
  function renderSearchHistory() {
    historyList.innerHTML = ""; // Clear previous content

    for (let i = 0; i < searchHistory.length; i++) {
      const historyItem = document.createElement("button");
      historyItem.classList.add(
        "list-group-item",
        "list-group-item-action",
        "history"
      );
      historyItem.innerText = searchHistory[i];
      historyList.appendChild(historyItem);
    }
    const clearitems = document.createElement("button");
    clearitems.innerText = "clear";
    historyList.appendChild(clearitems);
  }

  // Initial rendering of search history
  renderSearchHistory();
}

// Initialize the page
initPage();
