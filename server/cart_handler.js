const fs = require('fs');
const cart = require('./cart');

const actions = {
    add: cart.add,
    change: cart.change,
    del: cart.del
};

// we should probably create this file for a user at some point.
// probably when we create a session or the 1st product is being added
const handler = (req, res, action, fileName) => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
            let newCart = actions[action](JSON.parse(data), req);
            fs.writeFile(fileName, newCart, (err) => {
                if (err) {
                    res.send('{"result": 0}');
                } else {
                    res.send('{"result": 1}');
                }
            });
        }
    })
};

module.exports = handler;