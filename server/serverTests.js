//APP.JS

// require('dotenv').config();
// const express = require('express');
// const morgan = require('morgan');
// const cors = require('cors');
// const router = require('./router');

// // init the app
// const app = express();

// //configure and add cors
// const corsConfig = {
//   origin: 'http://localhost:3000',
//   credentials: true,
// };

// //hide the x-powered-by express in response header
// app.disable('x-powered-by');

// // add the middleware
// app.use(cors(corsConfig));
// app.use(morgan('short'));
// app.use(express.json());
// app.use(router);

// //catch all requests not handled by router
// app.get('*', (req, res) => {
//   res.status(404).send('Not found!');
// });

// module.exports = app;

// //INDEX.JS


// // const app=require('./app');

// // //connect to db and start the server
// (async function bootstrap() {
//   try {
//     // await mongoose.connect(dbUrl);
//     app.listen(port, () => {
//       console.log(`Ready on http://${hostname}:${port}/`);
//     });
//   } catch (err) {
//     console.error('Failed to connect to database', err.message);
//   }
// })();
