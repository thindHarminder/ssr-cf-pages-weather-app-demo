
import { ssr, ModifyHtmlFunction } from '../utils/render';
import { getWeatherData } from '../utils/weather';

export default async function page(c: Context) {
  const url = c.env.WEBFLOW_DOMAIN as string;

  // Retrieve longitude and latitude from the request information
  const req = c.req as unknown as honoRequest;
  const info = req.raw.cf || {} as cfHeaders;
  const longitude = info.longitude || 52.52;
  const latitude = info.latitude || 13.419998;

  //get page from cache
  const key = `${url}+${latitude}+${longitude}`;

  let html = await c.env.sse_weather_app_test.get(key);
  if (!html) {
    console.log('fetching fresh ssr page');
    html = await ssr(c, url, modifications);
    await c.env.sse_weather_app_test.put(key, html, { expirationTtl: 1800 });
  } else {
    console.log('fetching ssr page from cache');
  }
  

  return new Response(await html, {
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
    const req = c.req as unknown as honoRequest;
    const info = req.raw.cf || {} as cfHeaders;
    const longitude = info.longitude || 52.52;
    const latitude = info.latitude || 13.419998;

  const key = `${latitude}+${longitude}`;
  let forecat = await c.env.sse_weather_app_test.get(key);
  forecat = forecat ? JSON.parse(forecat) : null;
  if (!forecat) {
  forecat = await getWeatherData(c, latitude, longitude);
  await c.env.sse_weather_app_test.put(key, JSON.stringify(forecat), {expirationTtl: 600});
  }

  const response = forecat;
  
  console.log(response);

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