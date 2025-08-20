// ---- CONFIG ----
const API_KEY = "0260fca1aab9fbe80993c9cfd882f780"; // <- OpenWeatherMap key paste karo
const BASE = "https://api.openweathermap.org/data/2.5/weather";

// ---- DOM ----
const form = document.getElementById("search-form");
const input = document.getElementById("city-input");
const card = document.getElementById("card");
const msg = document.getElementById("msg");
const geoBtn = document.getElementById("geo-btn");

const el = (id) => document.getElementById(id);

// ---- Helpers ----
function showMessage(text) {
  msg.textContent = text || "";
}
function showCard(data) {
  card.classList.remove("hidden");
  el("place").textContent = `${data.name}, ${data.sys.country}`;
  el("desc").textContent = data.weather[0].description.replace(/^\w/, c => c.toUpperCase());
  el("temp").textContent = Math.round(data.main.temp);
  el("feels").textContent = Math.round(data.main.feels_like);
  el("humidity").textContent = data.main.humidity;
  el("wind").textContent = data.wind.speed;

  const iconCode = data.weather[0].icon; // e.g., "10d"
  el("icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  el("icon").alt = data.weather[0].main;
}

async function fetchByCity(city) {
  showMessage("Loading...");
  try {
    const url = `${BASE}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    showCard(data);
    showMessage("");
  } catch (err) {
    showMessage(err.message || "Something went wrong");
    card.classList.add("hidden");
  }
}

async function fetchByCoords(lat, lon) {
  showMessage("Getting your location weather...");
  try {
    const url = `${BASE}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Could not fetch weather");
    const data = await res.json();
    showCard(data);
    showMessage("");
  } catch (err) {
    showMessage(err.message || "Something went wrong");
    card.classList.add("hidden");
  }
}

// ---- Events ----
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (city) fetchByCity(city);
});

geoBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showMessage("Geolocation not supported in your browser.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      fetchByCoords(latitude, longitude);
    },
    () => showMessage("Location permission denied.")
  );
});

// Optional: try to auto-load using cached city
// fetchByCity("Delhi");