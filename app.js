const express = require('express');
const app = express();
const productRoute = require('./routes/productsImport.route')
// const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
const fs = require('fs');
const md5 = require('md5');
// const productsImportCtrl = require('../controllers/productsImport.controller')
// const fetch = require('node-fetch')

// const axios = require('axios');

require('dotenv').config()

//Connexion MongoDB
// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://epok:dropknee97460@cluster0.dd3wu.mongodb.net/LittoralPeche?retryWrites=true&w=majority";

mongoose.connect(process.env.MONGO_CONNECT).then(() => {
  console.log("Connexion à la base de données réussi")
}).catch(err => { console.log("Erreur de connexion: " + err) })
// const client = new MongoClient(uri);

//Watch csv
// const csv = './assets';
// console.log(`Watching for file changes on ${csv}`);

// let md5Previous = null;
// let fsWait = false;


// fs.watch(csv, (event, filename) => {
//   if (filename) {
//     if (fsWait) return;
//     fsWait = setTimeout(() => {
//       fsWait = false;
//     }, 100);
//     const md5Current = md5(fs.readFileSync(csv));
//     if (md5Current === md5Previous) {
//       return;
//     }
//     md5Previous = md5Current;
//     console.log(`${filename} file Changed`);



//   }
// });

//Routes Api

app.use('/api/', productRoute)



module.exports = app