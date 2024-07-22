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
  // Fetch the HTML content from the Webflow URL
  const response = await fetch(url);
// get HTML content from the response
  const text = await response.text();

  // Load the HTML content into a Cheerio instance to create a vartual DOM on the server
  const $ = cheerio.load(text);

  // Modify the HTML content based on the request information
  await modifications($, c);

  // Return the modified HTML content
  return await $.html();
}

// Export the server-side rendering function and the HTML modification function
export { ssr, ModifyHtmlFunction };