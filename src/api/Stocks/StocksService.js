const fetch = require('node-fetch');

class StocksService {
    getStockPriceServerlessFunctionUrl = 'https://YOUR_FUNCTION_NAME.azurewebsites.net/api/GetStockPrice';

    get = async (data) => {
        var url = `${this.getStockPriceServerlessFunctionUrl}?symbol=${data.symbol}`;

        if (data.exchange && data.exchange === 'TSX') {
            url += '&exchange=TSX';
        }

        const res = await fetch(url);
        const resData = await res.text();

        return JSON.parse(resData);
    };

    load = async (records) => {
        let results = {
            lastUpdated: new Date().toString(),
            results: [

            ],
            error: ''
        };

        for (const record of records.symbols) {
            var result = await this.get(record);

            console.log(result);

            results.results.push(result);
        }

        if (results.results.length === 0) {
            results.error = "Failed to load stock data.";
        }

        return results;
    }
}

module.exports = StocksService;