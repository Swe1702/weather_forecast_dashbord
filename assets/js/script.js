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

  const apiKey = "da7be031a2610a92bdf6a6ffbcd075ef"; // Replace with your OpenWeatherMap API key
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
}
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
