// API Key
const apiKey = '787008014be4b5e10db7c75c2413998b'; 
const currentApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const flipCardContainer = document.querySelector('.flip-card');
const flipCardInner = document.getElementById('flipCardInner');
const weatherBack = document.getElementById('weatherBack');
const locationName = document.getElementById('locationName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const backButton = document.getElementById('backButton');
const darkModeToggle = document.getElementById('darkModeToggle');
const messageBox = document.getElementById('messageBox');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const loadingMessage = document.getElementById('loadingMessage');
const celsiusBtn = document.getElementById('celsiusBtn');
const fahrenheitBtn = document.getElementById('fahrenheitBtn');
const forecastContainer = document.getElementById('forecast-container');
const funFactElement = document.getElementById('funFact');

// State variables
let isFlipped = false;
let isDarkMode = false;
let currentWeatherData = null; 
let forecastData = null;     
let currentUnit = 'C';      

// Fun facts about weather
const funFacts = [
    "A bolt of lightning is five times hotter than the surface of the sun!",
    "Rain isn't actually tear-shaped; it's spherical!",
    "The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley, USA.",
    "The coldest temperature ever recorded was -89.2°C (-128.6°F) in Vostok Station, Antarctica.",
    "Clouds are not weightless; a typical cumulus cloud can weigh over 550 tons!",
    "A 'Derecho' is a widespread, long-lived wind storm associated with a band of rapidly moving showers or thunderstorms.",
    "There are more than 100 types of lightning, including red sprites and blue jets!",
    "Fog is essentially a cloud that touches the ground.",
    "A 'haboob' is a type of intense dust storm common in arid regions.",
    "Snowflakes are always six-sided, but no two are exactly alike!"
];

// Function to show messages (errors/loading)
function showMessage(msg, type = 'error') {
    errorMessage.textContent = msg;
    messageBox.className = `fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-50 transition-all duration-300 ease-in-out ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white block`;
    setTimeout(() => {
        messageBox.classList.add('hidden');
    }, 3000); 
}

// Function to toggle loading spinner and message
function toggleLoading(show, message = 'Fetching weather...') {
    if (show) {
        loadingSpinner.classList.remove('hidden');
        loadingMessage.textContent = message;
    } else {
        loadingSpinner.classList.add('hidden');
    }
}

// Function to convert temperature
function convertTemperature(temp, unit) {
    if (unit === 'F') {
        return (temp * 9/5) + 32; 
    }
    return temp;
}

// Function to fetch weather data
async function fetchWeatherData(city) {
    if (!city) {
        showMessage('Please enter a city name!');
        return;
    }
    if (!apiKey) {
        showMessage('API Key is missing! Please get one from OpenWeatherMap.org and add it to the code.');
        return;
    }

    toggleLoading(true, `Looking up ${city}'s weather...`);
    try {
       
        const currentResponse = await fetch(`${currentApiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        currentWeatherData = await currentResponse.json();

      
        const forecastResponse = await fetch(`${forecastApiUrl}?q=${city}&appid=${apiKey}&units=metric`);
        forecastData = await forecastResponse.json();

        if (currentResponse.ok && forecastResponse.ok) {
            updateWeatherUI(); 
            if (!isFlipped) {
                flipCard();
            }
        } else {
            const errorMessageCurrent = currentWeatherData.message || 'Error fetching current weather.';
            const errorMessageForecast = forecastData.message || 'Error fetching forecast.';
            showMessage(`Weather data not found for "${city}". ${errorMessageCurrent} ${errorMessageForecast}`);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showMessage('Failed to fetch weather data. Please check your internet connection or city name.');
    } finally {
        toggleLoading(false);
    }
}

// Function to update the UI with weather data
function updateWeatherUI() {
    if (!currentWeatherData) return;

    locationName.textContent = `${currentWeatherData.name}, ${currentWeatherData.sys.country}`;
    description.textContent = currentWeatherData.weather[0].description;
    humidity.textContent = `${currentWeatherData.main.humidity}%`;
    windSpeed.textContent = `${Math.round(currentWeatherData.wind.speed * 3.6)} km/h`;

    
    updateCurrentTemperatureDisplay();

    const iconCode = currentWeatherData.weather[0].icon;
    weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="${currentWeatherData.weather[0].description}" class="w-24 h-24">`;

    
    applyWeatherBackground(currentWeatherData.weather[0].main.toLowerCase());

    displayRandomFunFact();
    displayForecast();
}

// Function to update only the current temperature display 
function updateCurrentTemperatureDisplay() {
    if (!currentWeatherData) return;
    let temp = currentWeatherData.main.temp;
    if (currentUnit === 'F') {
        temp = convertTemperature(temp, 'F');
        temperature.textContent = `${Math.round(temp)}°F`;
    } else {
        temperature.textContent = `${Math.round(temp)}°C`;
    }
}

function applyWeatherBackground(weatherMain) {
    weatherBack.classList.remove('bg-clear', 'bg-clouds', 'bg-rain', 'bg-drizzle', 'bg-thunderstorm', 'bg-snow', 'bg-mist', 'bg-smoke', 'bg-haze', 'bg-dust', 'bg-fog', 'bg-sand', 'bg-ash', 'bg-squall', 'bg-tornado', 'card-default-bg');

    let newBgClass = '';
    let newTextColor = '';

    switch (weatherMain) {
        case 'clear':
            newBgClass = 'bg-clear';
            newTextColor = '#333';
            break;
        case 'clouds':
            newBgClass = 'bg-clouds';
            newTextColor = '#333';
            break;
        case 'rain':
            newBgClass = 'bg-rain';
            newTextColor = 'white';
            break;
        case 'drizzle':
            newBgClass = 'bg-drizzle';
            newTextColor = '#333';
            break;
        case 'thunderstorm':
            newBgClass = 'bg-thunderstorm';
            newTextColor = 'white';
            break;
        case 'snow':
            newBgClass = 'bg-snow';
            newTextColor = '#333';
            break;
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'dust':
        case 'fog':
        case 'sand':
        case 'ash':
        case 'squall':
        case 'tornado':
            newBgClass = 'bg-mist';
            newTextColor = '#333';
            break;
        default:
            newBgClass = 'card-default-bg';
            newTextColor = isDarkMode ? 'var(--text-color-dark)' : 'var(--text-color-light)';
            break;
    }
    weatherBack.classList.add(newBgClass);
    weatherBack.style.color = newTextColor;
}


function displayForecast() {
    if (!forecastData) return;

    forecastContainer.innerHTML = ''; 

    const dailyForecasts = {};
    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const hour = date.getHours();

    
    });
}
    

// Function to display a random fun fact
function displayRandomFunFact() {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    funFactElement.textContent = funFacts[randomIndex];
}

// Function to flip the card
function flipCard() {
    if (!isFlipped) {
        flipCardContainer.classList.add('flipped');
    } else {
        flipCardContainer.classList.remove('flipped');
    }
    isFlipped = !isFlipped;
}

// Function to toggle dark/light mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark-mode', isDarkMode);

   
    if (isFlipped && currentWeatherData) { 
        applyWeatherBackground(currentWeatherData.weather[0].main.toLowerCase());
    } else {
   
        weatherBack.classList.remove('card-default-bg');
        weatherBack.classList.add('card-default-bg');
        weatherBack.style.color = isDarkMode ? 'var(--text-color-dark)' : 'var(--text-color-light)';
    }

    // Also update the main card background outside the inner flip card
    flipCardContainer.classList.remove('card-default-bg');
    flipCardContainer.classList.add('card-default-bg');
}

// Event Listeners
searchButton.addEventListener('click', () => fetchWeatherData(cityInput.value));
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchWeatherData(cityInput.value);
    }
});
backButton.addEventListener('click', flipCard);
darkModeToggle.addEventListener('click', toggleDarkMode);

celsiusBtn.addEventListener('click', () => {
    currentUnit = 'C';
    celsiusBtn.classList.add('active');
    fahrenheitBtn.classList.remove('active');
    updateCurrentTemperatureDisplay();
    displayForecast(); 
});

fahrenheitBtn.addEventListener('click', () => {
    currentUnit = 'F';
    fahrenheitBtn.classList.add('active');
    celsiusBtn.classList.remove('active');
    updateCurrentTemperatureDisplay();
    displayForecast(); 
});

// Initial setup
window.onload = () => {
   
    weatherBack.classList.add('card-bg-light');
    flipCardContainer.classList.add('card-default-bg');
    celsiusBtn.classList.add('active');
};
