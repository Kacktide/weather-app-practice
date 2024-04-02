const form = document.getElementById("submitForm");
const formInput = document.querySelector("#submitInput");
const weatherImg = document.querySelector(".weather-image");
const locationOutput = document.getElementById("location");
const temperatureOutput = document.getElementById("temperature");
const descriptionOutput = document.getElementById("description");
const humidityOutput = document.getElementById("humidity");
const windSpeedOutput = document.getElementById("wind");

const intro = document.querySelector(".intro");
const weatherBox = document.querySelector(".weather");
const nextBtn = document.querySelectorAll(".next-btn");
const checkBox = document.querySelector("#useMyLocation");
const error404 = document.querySelector(".error-404");
let rngTime = Math.floor(Math.random() * 4000 + 2000);
// fake loader
const loader = document.querySelector(".loader-wrapper");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  intro.classList.add("hidden");
  loader.classList.remove("hidden");

  setTimeout(() => {
    weatherBox.classList.remove("hidden");
    loader.classList.add("hidden");
  }, rngTime);

  checkWeather(formInput.value);
  formInput.value = "";
});

async function checkWeather(location) {
  const API_KEY = document.querySelector(".browserId").innerText;
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`;

  try {
    const weather = await fetch(URL).then((res) => res.json());
    temperatureOutput.innerText = Math.round(weather.main.temp - 273.15);
    locationOutput.innerText = weather.name;
    descriptionOutput.innerText = weather.weather[0].description;
    humidityOutput.innerText = `${weather.main.humidity}%`;
    windSpeedOutput.innerText = `${weather.wind.speed} km/hr`;

    switch (weather.weather[0].main) {
      case "Clouds":
        weatherImg.src = "/src/img/cloudy-weather.png";
        break;

      case "Clear":
        weatherImg.src = "/src/img/clear-weather.png";
        break;
      case "Mist":
        weatherImg.src = "/src/img/haze-weather.png";
        break;
      case "Rain":
        weatherImg.src = "/src/img/rainy-weather.png";
        break;
      case "Snow":
        weatherImg.src = "/src/img/snow-weather.png";
        break;
    }
  } catch (err) {
    console.error(err);
    setTimeout(() => {
      weatherBox.classList.add("hidden");
      intro.classList.add("hidden");
      error404.classList.remove("hidden");
    }, rngTime);
  }

  addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      backToSearch();
      return;
    }
  });
}

nextBtn.forEach((item) => item.addEventListener("click", backToSearch));

function backToSearch() {
  intro.classList.remove("hidden");
  weatherBox.classList.add("hidden");
  loader.classList.add("hidden");
  error404.classList.add("hidden");
}

checkBox.addEventListener("click", () => {
  if (checkBox.checked === true) {
    formInput.value = "Loading...";
    getUserLocation();

    formInput.classList.add("disabled");
  } else {
    formInput.classList.remove("disabled");
    formInput.value = "";
  }
});

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(findUserCity);
  } else {
    alert("This feature is not supported in your device!");
  }
}

async function findUserCity(pos) {
  const userLocation = await fetch(
    `https://geocode.maps.co/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&api_key=660aab0c772b4462137516wbm247f05`
  ).then((res) => res.json());
  formInput.value = userLocation.address.town;
}
