// user cart statistics
const fs = require('fs');
const moment = require('moment');

// placed the user cart statistics code here 'cause product name for a product being deleted
// is known only here without extra file reading
// I wonder if the homework assignment meant that a more frontend approach be used for the stats
const writeStat = (action, prodName) => {
    const statFile = 'server/db/stats.json';
    let stats = [];
    fs.access(statFile, fs.constants.F_OK, (err) => {
        if (err) { // if stat file doesn't exist, write 1-element array
            stats.push({
                time: moment().format('LLLL'),
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

const add = (cart, req) => {
    console.log('Add. params');
    console.log(JSON.stringify(req.params));
    console.log('body');
    console.log(req.body);
    cart.contents.push(req.body);
    console.log(req.body.product_name);
    writeStat('add', req.body.product_name);
    return JSON.stringify(cart, null, 2);
};

// the product should be in the cart
const change = (cart, req) => {
    console.log('Change. params');
    console.log(JSON.stringify(req.params));
    console.log('body');
    console.log(req.body);
    let find = cart.contents.find((el) => el.id_product === +req.params.id); // app/cart/:id
    find.quantity += req.body.quantity;
    writeStat('change', req.body.product_name);
    return JSON.stringify(cart, null, 2);
};

const del = (cart, req) => {
    console.log('Del. params');
    console.log(JSON.stringify(req.params));
    console.log('body');
    console.log(req.body);
    let elIdx = cart.contents.findIndex((el) => el.id_product === +req.params.id);
    // it might happen that there's a previously made request, that hadn't been processed by the time
    // we make a new one, so by the time the 2nd request gets processed the product isn't there anymore
    // so we just return the unchanged cart contents
    // the whole
    if (elIdx >= 0) {
        writeStat('delete', cart.contents[elIdx].product_name);
        cart.contents.splice(elIdx, 1);
    }
    return JSON.stringify(cart, null, 2);
};

module.exports = {
  add,
  change,
    del
};