const express = require('express');
const fs = require('fs');
const cart_handler = require('./cart_handler');
const router = express.Router();

let cartFile = 'server/db/user_cart.json';


router.get('/', (req, res) => {
    console.log('router. get cart');
    fs.readFile(cartFile, 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
            res.send(data);
        }
    })
});

router.post('/', (req, res) => {
    cart_handler(req, res, 'add', cartFile);
});

router.put('/:id', (req, res) => {
    cart_handler(req, res, 'change', cartFile);
});

router.delete('/:id', (req, res) => {
    cart_handler(req, res, 'del', cartFile);
});


module.exports = router;
