const fetch = require('node-fetch');

class StocksService {
    getStockPriceServerlessFunctionUrl = 'https://dev-nodejs-stocks-loader.azurewebsites.net/api/GetStockPrice';

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
            try {
                var result = await this.get(record);

                if (this.validate(result)) {
                    console.log(result);

                    results.results.push(result);
                } else {
                    console.log(record.symbol + ' ' + JSON.stringify(result) + ' Unexpected JSON format');
                }
            }
            catch (err) {
                console.log(record.symbol + ' ' + err.message);
            }
        }

        if (results.results.length === 0) {
            results.error = "Failed to load stock data.";
        }

        return results;
    }

    validate = (result) => {
        try {
            JSON.parse(result);
        } catch (e) {
            return false;
        }

        return true;
    }
}

module.exports = StocksService;