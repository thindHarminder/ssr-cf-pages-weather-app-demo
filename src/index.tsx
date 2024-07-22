import { Hono } from 'hono'
import { Bindings } from './utils/types'
import { getImage } from './utils/googlePlaces'
//pages 
import homepage from './pages/index'

// Create a new Hono instance
const app = new Hono < {
	Bindings: Bindings
} > ();

// Define the routes

// Route for the homepage that renders the index page
app.get('/', async (c) => {
  return await homepage(c)
})


// Route for the city image that retrieves an image from Google Places API
app.get('/images/city/:name', async (c) => {
 return await getImage(c)
})


export default app
