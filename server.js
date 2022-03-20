const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.set('port', (process.env.PORT || 5000));
app.use(cors());
app.use(bodyParser.json());

require('dotenv').config();
const url = process.env.MONGODB_URI;
const mongoose = require("mongoose");

mongoose.connect(url)
  .then(() => console.log("Mongo DB connected"))
  .catch(err => console.log(err));  

var api = require('./api.js');
api.setApp( app, mongoose);

app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});