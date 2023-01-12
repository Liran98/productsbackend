const fs = require('fs');
const path = require('path');
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoute = require('./routes/users-routes')
const productsRoute = require('./routes/products-routes');
const app = express();





app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});


app.use('/api/users', usersRoute);
app.use('/api/products', productsRoute);





app.use((error, req, res, next) => {
    if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const dbname = process.env.DB_NAME;
const port = process.env.PORT;
const cluster = process.env.DB_CLUSTER;







mongoose.connect(`mongodb+srv://${user}:${pass}@${cluster}.ys18umm.mongodb.net/${dbname}?retryWrites=true&w=majority`)

  .then(() => {
    app.listen(port || 5000, console.log(`connecting to localhost ${port} database working !!!`));
  })
  .catch(err => {
    console.log(err);
  })