const fs = require('fs');
const uuid = require("uuid");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'test.csv',
    header: [
        {id: 'uuid', title: 'UUID'},
        {id: 'price', title: 'price'},
        {id: 'quantity', title: 'quantity'},
        {id: 'date', title: 'date'}
    ]
});


const startDate = new Date('2020-01-01');
const endDate = new Date('2024-01-01');

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

const randomDateResult = randomDate(startDate, endDate);
console.log(randomDateResult);

function randomNumber(max) {
    return Math.floor(Math.random() * max);
}
function generateCSV() {
    let csvContent = [];

    for (let i = 0; i < 3000; i++) {
        const UUID = uuid.v4();
        const price = randomNumber(5000);
        const quantity = randomNumber(100);
        const date = randomDate(startDate, endDate);

        const dataToFile = {
            uuid: UUID,
            price:price,
            quantity: quantity,
            date: date
        }
        csvContent.push(dataToFile)
    }

    return csvContent;
}

csvWriter.writeRecords(generateCSV())
    .then(() => {
        console.log('...Done');
    });