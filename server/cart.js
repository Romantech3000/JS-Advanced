const writeStat = require('./cart_stat');


// placed writeStat calls in this module 'cause product name is available here
// without an extra file reading
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
    writeStat('change', find.product_name);
    return JSON.stringify(cart, null, 2);
};

const del = (cart, req) => {
    console.log('Del. params');
    console.log(JSON.stringify(req.params));
    console.log('body');
    console.log(req.body);
    let elIdx = cart.contents.findIndex((el) => el.id_product === +req.params.id);
    // it might happen that there's a previously made request, that hadn't been processed by the time
    // we made a new one, so by the time the 2nd request gets processed the product isn't there anymore
    // so we just return the unchanged cart contents
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