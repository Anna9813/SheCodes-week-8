//Функция времени и даты
function formateDate(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10) {
        hours = `0${hours}`;
    } 
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    } 
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[date.getDay()];
    return `${day} ${hours}:${minutes}`;
}
function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return days[day];
}
function displayForecast(response) {
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#forecast");

    let forecastHTML = `<div class="row">`;
    //let days = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
        forecast.forEach(function (forecastDay, index) {
            if (index < 6) {
        forecastHTML = forecastHTML + 
        `
        <div class="col-2">
            <div class="weather-forecast-date" id="forecast">${formatDay(forecastDay.dt)}</div>
            <img 
                src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" 
                alt=""
                width="38"
            />
            <div class="weather-forecast-temperature">
                <span class="weather-forecast-temperature-max">${Math.round(forecastDay.temp.max)}°</span>
                <span class="weather-forecast-temperature-min">${Math.round(forecastDay.temp.min)}°</span>
           </div>

        </div>
 `;
    }
});
 forecastHTML = forecastHTML + `</div>`;
 forecastElement.innerHTML = forecastHTML;          
}

function getForecast(coordinates) {
    let apiKey = "8c48afa47a9a9c24f3500c7039d50aaa";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
}

//Функция изменения на странице температуры, города, влажности, ветра, даты, иконок
function displayTemperature(response) {
    let temperatureElement = document.querySelector("#temperature");
    let cityElement = document.querySelector("#city");
    let descriptionElement = document.querySelector("#description");
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind");
    let dateElement = document.querySelector("#date");
    let iconElement = document.querySelector("#icon");

    celciusTemperature = response.data.main.temp;

    temperatureElement.innerHTML = Math.round(response.data.main.temp);
    cityElement.innerHTML = response.data.name;
    descriptionElement.innerHTML = response.data.weather[0].description;
    humidityElement.innerHTML = response.data.main.humidity;
    windElement.innerHTML = Math.round(response.data.wind.speed);
    dateElement.innerHTML = formateDate(response.data.dt * 1000);
    iconElement.setAttribute(
        "src", 
        `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        );
    iconElement.setAttribute(
        "alt",  response.data.weather[0].description);

        getForecast(response.data.coord);
}

//Функция изменения города
function search(city) {
    let apiKey = "8c48afa47a9a9c24f3500c7039d50aaa";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayTemperature);
}
//Функция изменения города в форме
function handelSubmit(event) {
    event.preventDefault();
    let cityInputElement = document.querySelector("#city-input");
    search(cityInputElement.value);
}

function searchLocation(position) {
  let apiKey = "8c48afa47a9a9c24f3500c7039d50aaa";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handelSubmit);

let currentLocationButton = document.querySelector("#location-btn");
currentLocationButton.addEventListener("click", getCurrentLocation);

search("New York");
