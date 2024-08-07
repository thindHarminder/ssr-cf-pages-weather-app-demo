import * as cheerio from 'cheerio';
declare type Context = import('hono').Context

type ModifyHtmlFunction = ($: any, c: Context) => void;

/**
 * Server-side rendering function.
 *
 * @param c - The context object.
 * @param url - The Webflow URL to fetch.
 * @param modifications - The function to modify the HTML.
 * @returns A promise that resolves to the rendered HTML.
 */
async function ssr(c: Context, url: string, modifications: ModifyHtmlFunction): Promise<string> {

  let html = await c.env.sse_weather_app_test.get(url);
  if (!html) {
    html = await fetch(url);
    console.log('fetching fresh webflow html');
    html =  await html.text();
    await c.env.sse_weather_app_test.put(url, html, { expirationTtl: 1800 });
  } else {
    console.log('fetching webflow from cache');
  }

  const text =  html

  // Load the HTML content into a Cheerio instance to create a vartual DOM on the server
  const $ = cheerio.load(text);

  // Modify the HTML content based on the request information
  await modifications($, c);

  // Return the modified HTML content
  return await $.html();

}

// Export the server-side rendering function and the HTML modification function
export { ssr, ModifyHtmlFunction };