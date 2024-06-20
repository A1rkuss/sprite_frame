/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
})

// Uncomment to use Edge Runtime
// export const runtime = 'edge'



// Middleware to serve static files
app.use(serveStatic({ root: './public' }))

app.frame('/', (c) => {
  return c.res({
    action: '/picker',
    image: `${process.env.NEXT_PUBLIC_SITE_URL}lovesprite.png`,
    intents: [
      <TextInput placeholder="ya love sprite??" />,
      <Button value="lovesprite">i love sprite too!!!</Button>,
      <Button value="dontlovesprite">i hate it!</Button>
    ],
  })
})

app.frame('/picker', async (c) => {
  const reqBody = await c.req.json();
  console.log('Request Body:', reqBody); // Debugging log to check the request body

  const previousButtonValues = reqBody.untrustedData.url.split('previousButtonValues=')[1];
  const buttonValues = previousButtonValues ? decodeURIComponent(previousButtonValues).split(',') : [];
  const { buttonValue } = c

  console.log('Extracted Button Values:', buttonValues); // Debugging log to check extracted button values
  console.log('Button Value:', buttonValue); // Debugging log to check the button value

  if (buttonValue === 'dontlovesprite') {
    // show sad cat
    console.log('Showing sad cat');
    return c.res({
      action: '/cats/sadcat',
      image: `${process.env.NEXT_PUBLIC_SITE_URL}/cats/sadcat.png`, // Make sure the image path is correct
    })
  }

  // show hapi cat
  console.log('Showing hapi cat');
  return c.res({
    action: '/cats/hapicat', // Ensure action path is correct
    image: `${process.env.NEXT_PUBLIC_SITE_URL}/cats/hapicat.png`, // Make sure the image path is correct
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
