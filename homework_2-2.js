const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs')

const csvWriter = createCsvWriter({
    path: 'testForEx2.csv',
    header: [
        {id: 'UUID', title: 'UUID'},
        {id: 'price', title: 'price'},
        {id: 'quantity', title: 'quantity'},
        {id: 'date', title: 'date'}
    ]
});

const results = [];

let priceMin = 1000;
let priceMax = 2000;
let quantityMin = 10;
let quantityMax = 50;
let startDate = '2022-01-01';
let endDate = '2022-04-01';

function filterArrayFromCSV(array, priceMin, priceMax, quantityMin, quantityMax, startDate, endDate) {
    return array.filter(item => {
        let itemDate = new Date(item.date);
        return item.price >= priceMin &&
            item.price <= priceMax &&
            item.quantity >= quantityMin &&
            item.quantity <= quantityMax &&
            itemDate >= new Date(startDate) &&
            itemDate <= new Date(endDate);
    });

}

async function readAndFilteredCsv() {
    let filterdResults = []

    await new Promise((resolve, reject) => {
        fs.createReadStream('test.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                filterdResults = filterArrayFromCSV(results, priceMin, priceMax, quantityMin, quantityMax, startDate, endDate);
                resolve();
            });
    })
    csvWriter.writeRecords(filterdResults)
        .then(() => {
            console.log('...Done');
        });

}

readAndFilteredCsv()