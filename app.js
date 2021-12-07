const express = require('express');
const app = express();
const productRoute = require('./routes/productsImport.route')
const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');



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

//Connexion MongoDB
// Replace the uri string with your MongoDB deployment's connection string.

mongoose.connect(process.env.MONGO_CONNECT).then(() => {
  console.log("Connexion à la base de données réussi")
}).catch(err => { console.log("Erreur de connexion: " + err) })
// const client = new MongoClient(uri);
const filePath = "./assets/test.csv"

const chokidar = require('chokidar');

// Initialize watcher.
const watcher = chokidar.watch(filePath, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  },
  alwaysStat: true,
});

watcher.on('change', (path) => {
  console.log(`File ${path} has been changed`)
  try {
    //Import request

    http.get('http://localhost:3000/api/import', (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
      res.on('data', (d) => {
        process.stdout.write(d);
      });

    }).on('error', (e) => {
      console.error(e);
    });
  } catch (error) {
    console.log(error)

  }
}).on('error', error => log(`Watcher error: ${error}`))

//Cron job


//Routes Api
const CronJob = require('cron').CronJob;
const job = new CronJob(
  '59 * * * *',
  () => {
    console.log('Mise à jour toute les 1h OK - date' + new Date());






  },
  null,
  true,
  'Indian/Reunion'
);
// Use this if the 4th param is default value(false)
job.start()

app.use('/api/', productRoute)



module.exports = app