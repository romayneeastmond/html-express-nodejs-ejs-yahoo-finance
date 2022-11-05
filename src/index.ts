const express = require('express');
const fs = require('fs');
const StocksService = require('../src/api/Stocks/StocksService');

(async () => {
    const app = express();
    const router = express.Router();

    router.get('/', function (req, res) {
        const results = JSON.parse(fs.readFileSync('./src/data/results.json', { encoding: 'utf8' }));

        res.render('pages/index', { results });
    });

    router.get('/load', async function (req, res) {
        const symbols = JSON.parse(fs.readFileSync('./src/data/symbols.json', { encoding: 'utf8' }));

        const stocksService = new StocksService();

        let results = await stocksService.load(symbols);

        if (results.error === '') {
            fs.writeFileSync('./src/data/results.json', JSON.stringify(results));
        }

        res.json(results);
    });

    router.get('/results', function (req, res) {
        const results = JSON.parse(fs.readFileSync('./src/data/results.json', { encoding: 'utf8' }));

        res.json(results);
    });

    router.get('/symbols', function (req, res) {
        const symbols = JSON.parse(fs.readFileSync('./src/data/symbols.json', { encoding: 'utf8' }));

        res.json(symbols);
    });

    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.static('public'));
    app.use('/', router);
    app.set('view engine', 'ejs');
    app.set('port', process.env.PORT || 3000);

    app.listen(app.get('port'), () => {
        console.log(`Express server started http://localhost:${app.get('port')}`);
    })
})();