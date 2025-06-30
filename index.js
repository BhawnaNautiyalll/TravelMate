import express from 'express';
import axios from 'axios';

const app = express();
const apiKey = 'fbd20bd98cbe42f234b8702bcd5da588';
app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
  try {
    // Detect user's city using IP-based geolocation
    const locationRes = await axios.get('http://ip-api.com/json/');
    const city = locationRes.data.city || 'Delhi';

    // Fetch weather data for that city
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const weather = weatherRes.data;


    const lat = weather.coord.lat;
    const lon = weather.coord.lon;

    // Step 2: Get air pollution data
    const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const airRes = await axios.get(airUrl);
    const air = airRes.data;

    console.log(weather);
    res.render('index', { weather,air, error: null });
  } catch (err) {
    console.error(err.message);
    res.render('index', { weather: null, error: 'City not found or API error' });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
