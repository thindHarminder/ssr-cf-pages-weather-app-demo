declare type Context = import('hono').Context

declare type weatherResponse = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    cloud_cover: number;
    surface_pressure: number;
    wind_speed_10m: number;
  };
};


import { ssr, ModifyHtmlFunction } from '../utils/render';

export default async function page(c: Context) {
  const url = c.env.WEBFLOW_DOMAIN as string;
  const modifiedHtml = await ssr(c, url, modifications);

  return new Response(await modifiedHtml, {
    headers: {
      'content-type': 'text/html;charset=UTF8',
    },
  });

}

/**
 * Modifies the HTML content of the index page based on the request information.
 * @param $ - The Cheerio instance representing the HTML content.
 * @param c - The request context object.
 */
const modifications: ModifyHtmlFunction = async ($, c) => {
  // Retrieve longitude and latitude from the request information
  const info = c.req.raw.cf || {};
  const longitude = info.longitude || 52.52;
  const latitude = info.latitude || 13.419998;

  console.log(longitude, latitude, info);

  // Fetch weather data from the Open Meteo API
  const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,cloud_cover,surface_pressure,wind_speed_10m`, {
    headers: c.req.header(),
  });
  const response = await weather.json() as weatherResponse;

  // Set default city to Berlin if not provided in the request information
  const city = info.city || 'Berlin';

  // Retrieve temperature unit from the weather response
  const tempUnit = response.current.temperature_2m as number;

  // Update city name in the HTML content
  const city_name = $('[thind="city_name"]');
  city_name.text(city);

  // Update temperature in the HTML content
  const temp = $('[thind="temp"]');
  temp.text(tempUnit + '°C');

  // Update wind speed in the HTML content
  const wind = $('[thind="wind"]');
  wind.text(response.current.wind_speed_10m + ' km/h');

  // Update cloud cover in the HTML content
  const cloud = $('[thind="cloud"]');
  cloud.text(response.current.cloud_cover + '%');

  const app = $('[thind="weather_app"]');
  // Set background image based on the city
  app.css('background-image', `url(/images/city/${city})`);

  // Update surface pressure in the HTML content
  const pressure = $('[thind="pressure"]');
  pressure.text(response.current.surface_pressure + ' hPa');

  const liveButton = $('[thind="live_button"]');
  // Remove live button from the HTML content
  liveButton.remove();
};