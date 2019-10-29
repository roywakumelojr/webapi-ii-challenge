const express = require('express');
const AppRouter = require('./AppRouter.js');

const server = express();
const port = 5000

server.use(express.json());

server.get('/', (req, res) => {
  res.send(`<p>We're now cooking with gas... </p>`);
});

server.use('/api/posts', AppRouter)

server.listen(port, () => {
  console.log( `The server is fired up on port ${port}`);
});
