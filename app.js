const express = require('express');
const app = express();
const productRoute = require('./routes/productsImport.route')
// const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');


require('dotenv').config()

//Connexion MongoDB
// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://epok:dropknee97460@cluster0.dd3wu.mongodb.net/LittoralPeche?retryWrites=true&w=majority";

mongoose.connect(process.env.MONGO_CONNECT).then(() => {
  console.log("Connexion à la base de données réussi")
}).catch(err => { console.log("Erreur de connexion: " + err) })
// const client = new MongoClient(uri);




// async function run() {
//   try {
//     await client.connect();

//     const database = client.db('sample_mflix');
//     const movies = database.collection('movies');

//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: "The Land Beyond the Sunset" };
//     const movie = await movies.findOne(query);

//     console.log(movie);

//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

// // app.use('/', (req, res) => {
// //     console.log('hello world')
// //     res.send("hello world")

// // });

app.use('/api/', productRoute)

module.exports = app