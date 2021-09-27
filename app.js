const express = require('express');
const app = express();
const productRoute = require('./routes/productsImport.route')
const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');
const watch = require('node-watch');
const cron = require('node-cron');
const md5 = require('md5');

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


// fs.stat(file, (err, stat) => {
//   console.log(stat.mtime)
//   // let read = fs.createReadStream('./assets/test.csv')
//   // read.on
// })

// const watcher = watch('./assets/', { recursive: false });
// watcher.on('change', (evt, name) => {
//   fs.stat(file, (err, stat) => {
//     console.log(stat.mtime)
//     // let read = fs.createReadStream('./assets/test.csv')
//     // read.on
//   })
// })

// let md5Previous = null;

// watcher.on('change', (evt, name) => {
// callback
//   setTimeout(() => {
//     if (name) {
//       // let read = fs.createReadStream('./assets/test.csv')
//       const md5Current = md5(fs.createReadStream('./assets/test.csv'))
//       if (md5Current == md5Previous) {
//         return;
//       }
//       md5Previous = md5Current;
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
//   }, 10000)


// });



//cronjob


// cron.schedule('* * * * *', () => {



// if (watcher.isClosed() == true) {
//   //Import request
//   http.get('http://localhost:3000/api/import', (res) => {
//     console.log('statusCode:', res.statusCode);
//     console.log('headers:', res.headers);
//     res.on('data', (d) => {
//       process.stdout.write(d);
//     });


//   }).on('error', (e) => {
//     console.error(e);
//   });
// } else if (watcher.isClosed() == false) {
//   console.log('Fichier csv en cours de modification')
// }
//   let read = fs.createReadStream('./assets/test.csv')
//   let write = fs.createWriteStream('./assets/csvCache.csv')
//   let progress = 0

// fs.stat(filePath, async (err, stat) => {
//     let total = stat.size
//     read.on('data', (chunk) => {
//       progress += chunk.length
//       console.log("j'ai lu " + Math.round(100 * progress / total))
//     })

//     read.pipe(write)

//     write.on('finish', () => {
//       console.log("Le fichier a bien été copié")
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
//     })

// })

// });

//Watch csv




// watcher.on('error', (err) => {
//   // handle error
//   console.log(err);
// });

// watcher.on('ready', () => {
//   // the watcher is ready to respond to changes
//   console.log('Watcher ready!')
// });


// // is closed?
// watcher.isClosed(
//   console.log('watcher is closed')
// )


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