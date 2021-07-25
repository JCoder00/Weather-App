const textInput = document.getElementById("loc-input");
const btnInput = document.getElementById("loc-btn");
const container = document.getElementById("display");

const API_key = /* Your API key here */;

btnInput.addEventListener('click', () => {
  const city = textInput.value;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=5&appid=${API_key}`;
  fetch(url, {
    method: "GET",
  })
  .then(res => {
    if (res.status !== 200) {
      const prevCityTitle = document.getElementById("header-text");
      const prevCityData = document.getElementById("city-info");
      insertErrorMessage(prevCityTitle, prevCityData);
      console.error("There was a problem: " + res.statusText);
      return
    }

    res.json().then(data => {
      const prevCityTitle = document.getElementById("header-text");
      const prevCityData = document.getElementById("city-info");
      insertWeatherData(data, prevCityTitle, prevCityData);
      console.log(data);
    })

    .catch(err => {
      console.error('Fetch Error :-S', err);
    })
  });
});

const insertErrorMessage = (cityTitle, cityData) => {
  if (cityTitle && cityData) {
    container.removeChild(cityTitle);
    container.removeChild(cityData);
  }
  console.log("Error showing in HTML doc.")
  return
};

const insertWeatherData = (data, cityTitle, cityData) => {
  if (cityTitle && cityData) {
    container.removeChild(cityTitle);
    container.removeChild(cityData);
  }

  const days = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  const icons = {
    500: "/icons/rain.jpg",
    501: "/icons/rain.jpg",
    801: "/icons/cloud.jpg",
    802: "/icons/cloud_and_sun.jpg",
    803: "/icons/cloud_and_sun.jpg",
    804: "/icons/cloud_and_sun.jpg",
    800: "/icons/sun.jpg",
  };

  const city_info = document.createElement("div");
  city_info.setAttribute("id", "city-info");
  const header = document.createElement("h2");
  const header_text = document.createTextNode(`${data.city.name}`);
  header.setAttribute("id", "header-text");
  header.appendChild(header_text);
  container.appendChild(header);

  for (let i = 0; i < 5; i++) {
    let day = new Date().getDay();
    let dayIndex = day + (day + i > 6 ? i - 7 : i);
    const widget = document.createElement("div");
    widget.setAttribute("class", "widget");
    // Weather Icon
    const weather_icon = document.createElement("img");
    weather_icon.setAttribute("src", icons[data.list[i].weather[0].id]);
    weather_icon.setAttribute("class", "weather-icon");
    // Widget Text
    const weekday = document.createElement("p");
    const weather = document.createElement("p");
    weekday.setAttribute("class", "weekday");
    weather.setAttribute("class", "weather");
    const weekday_text = document.createTextNode(`${days[dayIndex]}`);
    const weather_text = document.createTextNode(`${(data.list[i].main.temp - 273.15).toFixed(1)}\xB0C | ${capitalise(data.list[i].weather[0].description)}`);
    // Appending to children in HTML
    weekday.appendChild(weekday_text);
    weather.appendChild(weather_text);
    widget.appendChild(weather_icon);
    widget.appendChild(weekday);
    widget.appendChild(weather);
    city_info.appendChild(widget);
    container.appendChild(city_info);
  }
};

const capitalise = str => str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
