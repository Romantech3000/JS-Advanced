const express = require('express');
const fs = require('fs');
const app = express(); //storing the server

const cart = require('./cart_router');

app.use(express.json()); //middleware function to process every request
app.use('/', express.static('public')); // show static files from a directory
app.use('/api/cart', cart); // use router cart for this rout

app.get('/api/products', (req, res) => {
    fs.readFile('server/db/catalog_data.json', 'utf-8', (err, data) => {
        if (err) {
            res.sendStatus(404, JSON.stringify({result: 0, text: err}));
        } else {
            res.send(data);
        }
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening at port ${port} ...`);
});



