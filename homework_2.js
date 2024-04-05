const fs = require('fs');
const uuid = require("uuid");

const startDate = new Date('2020-01-01');
const endDate = new Date('2024-01-01');

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

const stream = fs.createWriteStream('data.csv');

function generateCSV() {
    stream.write('uuid,price,quantity,date\n');

    for (let i = 0; i < 3000; i++) {
        const UUID = uuid.v4();
        const price = randomNumber(5000);
        const quantity = randomNumber(100);
        const date = randomDate(startDate, endDate);

        const csvContent = `${UUID},${price},${quantity},${date}\n`;
        stream.write(csvContent)
    }

    stream.end();
    console.log('...Done');
}

generateCSV()