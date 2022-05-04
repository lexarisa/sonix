// imports
require('dotenv').config();
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './src/router';
import { mongoose, dbUrl } from './src/models/connection';
import { Request, Response, Express } from 'express';

// init the hostname and port
const hostname = 'http://localhost';
const port = process.env.PORT || 3001;

// init the app
const app : Express = express();

//configure and add cors
const corsConfig = {
  origin: 'http://localhost:3000',
  credentials: true,
};

//hide the x-powered-by express in response header
app.disable('x-powered-by');

// add the middleware
app.use(cors(corsConfig));
// app.use(morgan('short'));
app.use(express.json());
app.use(router);


//catch all requests not handled by router
app.get('*', (req: Request, res: Response) => {
  res.status(404).send('Not found!');
});

//connect to db and start the server
(async function bootstrap() {
  try {
    await mongoose.connect(dbUrl);
    app.listen(port, () => {
      console.log(`Ready on http://${hostname}:${port}/`);
    });
  } catch (err: unknown) {
    if (err instanceof Error)
      console.error('Failed to connect to database', err.message);
  }
})();
module.exports=app;