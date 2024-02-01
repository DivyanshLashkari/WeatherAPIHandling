import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs'); // Set the view engine to ejs
app.set('views', __dirname); // Set the views directory to the current directory

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render("index"); // Render the index.ejs file
});

app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;
    const weatherData = await getWeatherData(cities);
    res.json({ weather: weatherData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function getWeatherData(cities) {
  const apiKey = '07494019074a409741824b83de8bf94c';
  const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  const promises = cities.map(async (city) => {
    const response = await axios.get(apiUrl, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric', // Change to 'imperial' for Fahrenheit
      },
    });

    const temperature = response.data.main.temp;
    return { [city]: `${temperature}C` };
  });

  return Promise.all(promises).then((results) => Object.assign({}, ...results));
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
