export async function getWeatherData(c: Context, latitude: number, longitude: number) {
    const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,cloud_cover,surface_pressure,wind_speed_10m`, {
        headers: c.req.header(),
    });
    return await weather.json() as weatherResponse;
}
