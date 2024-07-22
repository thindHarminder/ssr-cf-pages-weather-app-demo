import * as cheerio from 'cheerio';
declare type Context = import('hono').Context

type ModifyHtmlFunction = ($: any, c: Context) => void;

async function ssr(c: Context, url: string, modifications: ModifyHtmlFunction): Promise<string> {
  const response = await fetch(url);

  const text = await response.text();
  const $ = cheerio.load(text);

  await modifications($, c);

  return await $.html();
}

export { ssr, ModifyHtmlFunction };