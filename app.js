const express = require('express');
const app = express();
const productRoute = require('./routes/productsImport.route')
const http = require('http');
const fs = require('fs');
// const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
// const fs = require('fs');
// const md5 = require('md5');
// const productsImportCtrl = require('../controllers/productsImport.controller')
// const fetch = require('node-fetch')

// const axios = require('axios');

// const httpGet = (host, path, chunkFunction) => {
//   http.get({ host, path }, (res) => res.on('data', chunkFunction));
// }
// const handleChunk = (chunk) => { "hello handle chunk" };
// const req = httpGet(host, path, handleChunk);

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




//cronjob
const cron = require('node-cron');

cron.schedule('* * * * *', () => {

  let read = fs.createReadStream('./assets/test.csv')
  let write = fs.createWriteStream('./assets/csvCache.csv')
  let progress = 0

  fs.stat('./assets/test.csv', async (err, stat) => {
    let total = stat.size
    read.on('data', (chunk) => {
      progress += chunk.length
      console.log("j'ai lu " + Math.round(100 * progress / total))
    })

    read.pipe(write)

    write.on('finish', () => {
      console.log("Le fichier a bien été copié")
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
    })

    // read.on('end', () => {
    //   console.log("J'ai fini de lire le fichier")
    //   //Import request
    //   // http.get('http://localhost:3000/api/import', (res) => {
    //   //   console.log('statusCode:', res.statusCode);
    //   //   console.log('headers:', res.headers);
    //   //   res.on('data', (d) => {
    //   //     process.stdout.write(d);
    //   //   });

    //   // }).on('error', (e) => {
    //   //   console.error(e);
    //   // });
    // })
  })



  // fs.readFile('./assets/test.csv', (err, data) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   fs.writeFile('csvCache.csv', data, (err, data) => {
  //     if (err) {
  //       console.log()
  //     } else {
  //       //Import request
  //       http.get('http://localhost:3000/api/import', (res) => {
  //         console.log('statusCode:', res.statusCode);
  //         console.log('headers:', res.headers);

  //         res.on('data', (d) => {
  //           process.stdout.write(d);
  //         });

  //       }).on('error', (e) => {
  //         console.error(e);
  //       });
  //     }
  //   })
  // })

});

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