const elements = {
  form: document.querySelector(".js-search-form"),
  list: document.querySelector(".js-list"),
};

elements.form.addEventListener("submit", handlerForecast);

function handlerForecast(evt) {
  evt.preventDefault();
  const { city, days } = evt.currentTarget.elements;

  serviceWeather(city.value, days.value)
    .then((data) => {
      elements.list.innerHTML = createMarkup(data.forecast.forecastday);
    })
    .catch((err) => {
      console.log(err);
    });
}

function serviceWeather(city, days) {
  const BASE_URL = "http://api.weatherapi.com/v1";
  const API_KEY = "c02ea0ce7ac543b281d144702233110";
  const params = new URLSearchParams({
    key: API_KEY,
    q: city,
    lang: "uk",
    days,
  });

  return fetch(`${BASE_URL}/forecast.json?${params}`).then((resp) => {
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  });
}

function createMarkup(arr) {
  return arr
    .map(
      ({
        date,
        day: {
          avgtemp_c,
          condition: { text, icon },
        },
      }) => `
    <li class="weather-card">
      <img src="${icon}" alt="${text}" class="weather-icon">
      <h2 class="date">${date}</h2>
      <h3 class="weather-text">${text}</h3>
      <h3 class="temperature">${avgtemp_c} °C</h3>
    </li>`
    )
    .join("");
}
