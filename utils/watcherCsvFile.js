const chokidar = require('chokidar');
const axios = require('axios');
// import ConvertProduct from './classes/convertClasse';


const filesPath = "./assets/import/production/"
// const articlesGammesFile = "./assets/import/production/articles-gamme.txt";
const articlesFile = "./assets/import/production/articles.txt";
// const gammesFile = "./assets/import/production/gamme.txt";
// const familleFile = "./assets/import/production/familles.txt";
// const sousFamilleFile = "./assets/import/production/sous-famille.txt";


// const productsCsv = './assets/import/production/articles.txt';
// const productGammeCsv = './assets/import/production/articles-gamme.txt';
// const gammes = './assets/import/production/gammes.txt';





const watcherCsvFile = async () => {

    const watcher = chokidar.watch(articlesFile, {
        persistent: true, awaitWriteFinish: {
            stabilityThreshold: 15000,
            pollInterval: 200
        }
    });

    watcher.on("change", async (event, path) => {
        console.log('event:', event)
        await Promise.all([
            axios.get(process.env.BASE_URL + "/api/import/gammes"),
            axios.get(process.env.BASE_URL + "/api/import/product-gammes"),
            axios.get(process.env.BASE_URL + "/api/products"),
            axios.get(process.env.BASE_URL + "/api/category"),
            axios.get(process.env.BASE_URL + "/api/subCategory"),

        ])

    })


}


module.exports = watcherCsvFile()