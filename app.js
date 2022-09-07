const express = require('express');
const app = express();
const productRoute = require('./routes/productsImport.route');
const productsRoute = require('./routes/products.route');
const categoryRoute = require('./routes/category.route')

const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');

// Watcher
const watcherFile = require('./utils/watcherCsvFile')
const cronJobSdk = require('./utils/cronJobSdk')



require('dotenv').config()

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(express.static("public"))
//Connexion MongoDB
// Replace the uri string with your MongoDB deployment's connection string.

mongoose.connect(process.env.MONGO_CONNECT).then(() => {
  console.log("Connexion à la base de données réussi")
}).catch(err => { console.log("Erreur de connexion: " + err) })


//Cron job 
// app.get(cronJobSdk)
//watcherFile
// app.get(watcherFile)

//Routes Api


app.use('/api', productRoute);
app.use('/api', productsRoute);
app.use('/api', categoryRoute);




module.exports = app
