// user cart statistics
const fs = require('fs');
const moment = require('moment');

const writeStat = (action, prodName) => {
    const statFile = 'server/db/stats.json';
    let stats = [];
    fs.access(statFile, fs.constants.F_OK, (err) => {
        if (err) { // if stat file doesn't exist, write 1-element array
            stats.push({
                time: moment().format('DD MMM YYYY, hh:mm:ss a'),
                action: action,
                productName: prodName
            });
            fs.writeFile(statFile, JSON.stringify([]), (err) => {
                if (err) throw err;
            });
        } else {
            // if stat file exists, read the existing data first
            fs.readFile(statFile, 'utf-8', (err, data) => {
                if (err) {
                    console.log('stat file error');
                    throw err;
                } else {
                    stats = JSON.parse(data);
                    stats.push({
                        time: moment().format('LLLL'),
                        action: action,
                        productName: prodName
                    });
                    fs.writeFile(statFile, JSON.stringify(stats, null, 2), (err) => {
                        if (err) throw err;
                    });
                }
            });
        }
    });
};

module.exports = writeStat;