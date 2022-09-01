const chokidar = require('chokidar');
const axios = require('axios');
import ConvertProduct from './classes/convertClasse';


const filesPath = "./assets/import/production/"
const articlesGammesFile = "./assets/import/production/articles-gamme.txt";
const articlesFile = "./assets/import/production/articles.txt";
const gammesFile = "./assets/import/production/gamme.txt";
const familleFile = "./assets/import/production/familles.txt";
const sousFamilleFile = "./assets/import/production/sous-famille.txt";


// const productsCsv = './assets/import/production/articles.txt';
// const productGammeCsv = './assets/import/production/articles-gamme.txt';
// const gammes = './assets/import/production/gammes.txt';





const watcherCsvFile = async () => {

    const watcher = chokidar.watch(filesPath, {
        persistent: true, awaitWriteFinish: {
            stabilityThreshold: 5000,
            pollInterval: 500
        }
    });

    watcher.on("change", async (event, path) => {
        await Promise.all([
            axios.get(process.env.BASE_URL + "/api/import/gammes"),
            axios.get(process.env.BASE_URL + "/api/import/product-gammes"),
            axios.get(process.env.BASE_URL + "/api/products"),
            axios.get(process.env.BASE_URL + "/api/category"),
            axios.get(process.env.BASE_URL + "/api/subCategory"),

        ])

    })
    return

    watcher.on("change", async (event, path) => {
        axios.post(process.env.BASE_URL + "/api/import/product-gammes").then(() => {
            axios.get(process.env.BASE_URL + "/api/products").then(() => {
                console.log('finish')
            })
        })

    })

    watcher.on("change", (event, path) => {
        console.log(event, path);
        const convertProduct = new ConvertProduct(articlesFile, articlesGammesFile, gammesFile);
        convertProduct.getProductCsvToJson;


        const convertProductGamme = require('./convertProductGamme')

        if (event === "change") {
            convertProductGamme;
            return
            const convertProduct = new ConvertProduct(articlesFile, articlesGammesFile, gammesFile);
            convertProduct.getProductCsvToJson;


        }

    }).then(() => {
        console.log("finish")
    });



    // chokidar.watch(filePath, {
    //     ignored: /(^|[\/\\])\../, // ignore dotfiles
    //     persistent: true,
    //     ignoreInitial: true,
    //     awaitWriteFinish: {
    //         stabilityThreshold: 2000,
    //         pollInterval: 100
    //     },
    //     alwaysStat: true,
    // }, (event, path) => {
    //     console.log('path:', path)
    //     console.log('event:', event)

    // });
}
// const watcherCsvFileV1 = () => {

//     console.log(filePath)
//     // Initialize watcher.
//     const watcher = chokidar.watch(filePath, {
//         ignored: /(^|[\/\\])\../, // ignore dotfiles
//         persistent: true,
//         ignoreInitial: true,
//         awaitWriteFinish: {
//             stabilityThreshold: 2000,
//             pollInterval: 100
//         },
//         alwaysStat: true,
//     });

//     watcher.on('change', (path) => {
//         console.log(`File ${path} has been changed`)
//         setTimeout(() => {
//             try {
//                 //Import request

//                 http.get('http://localhost:3000/api/import', (res) => {
//                     console.log('statusCode:', res.statusCode);
//                     console.log('headers:', res.headers);
//                     res.on('data', (d) => {
//                         process.stdout.write(d);
//                     });

//                 }).on('error', (e) => {
//                     console.error(e);
//                 });
//             } catch (error) {
//                 console.log(error)

//             }
//         }, 20000)
//     }).on('error', error => log(`Watcher error: ${error}`))
// };

module.exports = watcherCsvFile()