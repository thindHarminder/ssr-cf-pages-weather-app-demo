
  type weatherResponse = {
    current: {
      temperature_2m: number;
      relative_humidity_2m: number;
      weather_code: number;
      cloud_cover: number;
      surface_pressure: number;
      wind_speed_10m: number;
    };
  }
  type Context = import('hono').Context
  type Bindings = {
    [key in keyof CloudflareBindings]: CloudflareBindings[key];
  }

