# SSR CF Pages Weather App

This project is a server-side rendered (SSR) weather application built using Cloudflare Pages. It allows users to get real-time weather information for any location.

## DEMO = [Click Here](https://ssr-cf-pages-weather-app.pages.dev/)
## Features

- Server-side rendering for improved performance and SEO.
- Integration with Cloudflare Pages for easy deployment and hosting.
- User-friendly interface to search for weather information by location.
- Real-time weather updates using an API.

## Installation

1. Clone the repository: `git clone https://github.com/your-username/ssr-cf-pages-weather-app.git`
2. Install dependencies: `npm install`
3. Set up environment variables:
    - Create a `.dev.vars` file in the root directory.
    - Add the following variables:
      ```
      GOOGLE_PLACES_API_KEY = YOUR_API_KEY
      ```
    - Replace `YOUR_API_KEY` with your API key for the weather API.
4. Start the development server: `npm run dev`

## Usage

1. Open your browser and navigate to the local server's endpoint.
2. The weather information for the users location will be displayed.

## Deployment

This project is configured to be deployed on Cloudflare Pages. Follow the steps below to deploy the application:

1. Sign up for a Cloudflare account if you don't have one already.
2. Sign in locally with `npx wrangler login`
3. Run `npm run build` to start the build process.
4. Run `npm run deploy` to deploy the built project to Cloudflare. Wrangler will prompt you to create a new project or choose an existing project. Choose 'Create new project'

For detailed instructions, refer to the Cloudflare Pages documentation.

## License

This project is licensed under the [MIT License](LICENSE).
