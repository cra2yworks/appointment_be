if(process.env.NODE_ENV !== 'production') require('dotenv').config();
const MONGODB_URL = process.env.MONGODB_CONNECTION || 'mongodb://127.0.0.1:27017';

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const appointmentRoutes = require('./api/routes/appointment');

mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requestd-With, Content-Type, Authorization, Accept, x-access-token');
    
    if( req.method === 'OPTIONS') {
        //   res.header('Access-Control-Allow-Methods', 'PATCH, POST, PUT, DELETE, GET');
        res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use("/appointment", appointmentRoutes);

//main UI
app.get('/', (req, res) => {
  res.status(200);
  res.json({message: "Online"});
})

//Route others
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {message: error.message}
    });
});

module.exports = app;
