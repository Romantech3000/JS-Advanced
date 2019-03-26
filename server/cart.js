const add = (cart, req) => {
    console.log('Add. params');
    console.log(JSON.stringify(req.params));
    console.log('body');
    console.log(req.body);
    cart.contents.push(req.body);
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
    return JSON.stringify(cart, null, 2);
};

const del = (cart, req) => {
    console.log('Del. params');
    console.log(JSON.stringify(req.params));
    console.log('body');
    console.log(req.body);
    let elIdx = cart.contents.findIndex((el) => el.id_product === +req.params.id);
    cart.contents.splice(elIdx, 1);
    return JSON.stringify(cart, null, 2);
};

module.exports = {
  add,
  change,
    del
};