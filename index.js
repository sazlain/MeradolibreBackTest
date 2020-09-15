const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
app.use(cors());

const exercises = require('./Exercises');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/items',exercises.fetchProducts);

app.get('/api/items/:id',exercises.fetchProduct);

app.listen(5000, () => {
  console.log('server is running on port 5000');
});