# Express with EJS Templates, Serverless Azure Function, and Yahoo Finance Stock Scraper

An Express Node.js website that displays stock information from Yahoo Finance.

This project integrates with a [Serverless Azure Function](https://github.com/romayneeastmond/serverless-azure-function-nodejs-yahoo-finance) to display a HTML table containing stock information.

## How to Use

Run an npm install or update

```
npm i
```

Edit the **src\api\Stocks\StocksService.js** file and change the value for to match your Serverless Azure Function:

```javascript
getStockPriceServerlessFunctionUrl =
  "https://YOUR_FUNCTION_NAME.azurewebsites.net/api/GetStockPrice";
```

Note that you must define the correct CORS settings to allow access to Azure functions.

To run locally use

```
npm start ts-node src/index.ts
```

## Use Case

This project provides a [list of symbols](https://dev-nodejs-stock-symbols-re01.azurewebsites.net/symbols) to a Serverless Azure Function, that runs on a timer (Monday through Friday at every hour). It then posts the [results back](https://dev-nodejs-stock-symbols-re01.azurewebsites.net/results), which are saved to a JSON file.

This results file is what produces the HTML table generated within the EJS template.

A Google Sheets document consumes this data by using the IMPORTHTML formula.

```
=IMPORTHTML("https://dev-nodejs-stock-symbols-re01.azurewebsites.net/", "table", 0)
```

Using a VLOOKUP the stock prices are inserted into cells in another sheet.

```
=VLOOKUP(A6,'Dynamic Data'!$A$2:'Dynamic Data'!$D$36,3,false)
```

Since the HTML data is constantly being by Azure functions, the Google document also uses a trigger to refresh the stock data used in various calculations.

### Google Sheets Apps Script Code

```javascript
function updateDynamicData() {
  var spreadsheet = SpreadsheetApp.getActive();

  spreadsheet.setActiveSheet(spreadsheet.getSheetByName("Dynamic Data"), true);

  spreadsheet.getRange("A1").activate().clearContent();

  spreadsheet
    .getRange("A1")
    .activate()
    .setFormula(
      '=IMPORTHTML("https://dev-nodejs-stock-symbols-re01.azurewebsites.net/?callback=' +
        Date.now() +
        '", "table", 0)'
    );
}
```

Note that the dynamic, callback query string prevents Google Sheets from caching the IMPORTHTML formula's output.

Google Apps Script code can be set on a [trigger system](https://developers.google.com/apps-script/guides/triggers/installable) very similar timer Serverless Azure Functions.

## Copyright and Ownership

All terms used are copyright to their original authors.

## Live Demo

Live demo hosted in Microsoft Azure.

HTML

https://dev-nodejs-stock-symbols-re01.azurewebsites.net/

Symbols

https://dev-nodejs-stock-symbols-re01.azurewebsites.net/symbols

Results

https://dev-nodejs-stock-symbols-re01.azurewebsites.net/results

Azure F1 instances are :snowflake: ice cold. That first load will need some :sun_with_face: warming up.
