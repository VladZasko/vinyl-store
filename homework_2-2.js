const csv = require('csv-parser')
const fs = require('fs')

function filterCSV(obj) {
    const priceMin = 1000;
    const priceMax = 2000;
    const quantityMin = 10;
    const quantityMax = 50;
    const startDate = '2022-01-01';
    const endDate = '2022-04-01';

    const parsedDate = new Date(obj.date);

    const priceCondition = obj.price >= priceMin && obj.price <= priceMax;
    const quantityCondition = obj.quantity >= quantityMin && obj.quantity <= quantityMax;
    const dateCondition = parsedDate >= new Date(startDate) && parsedDate <= new Date(endDate);

    return priceCondition && quantityCondition && dateCondition;

}

const readStream = fs.createReadStream('data.csv');

const writeStream = fs.createWriteStream('filtered_data.csv');

function readAndFilteredCSV() {
    writeStream.write('uuid,price,quantity,date\n');

    readStream
        .pipe(csv())
        .on('data', (chunk) => {
            if (filterCSV(chunk)) {
                writeStream.write(`${chunk.uuid},${chunk.price},${chunk.quantity},${chunk.date}\n`);
            }
        });

    readStream.on('end', () => {
        console.log('...Done');
        writeStream.end();
    });
}

readAndFilteredCSV()
