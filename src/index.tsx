import { Hono } from 'hono'
import { Bindings } from './utils/types'
import { getImage } from './utils/googlePlaces'
//pages 
import homepage from './pages/index'

const app = new Hono < {
	Bindings: Bindings
} > ();


app.get('/', async (c) => {
  return await homepage(c)
})

app.get('/images/city/:name', async (c) => {
 return await getImage(c)
})


export default app
