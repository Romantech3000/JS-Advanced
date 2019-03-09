const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';


// now it returns a promise
let getRequest = url => {
    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4){
                if(xhr.status !== 200){
                    reject(`Error status ${xhr.status}: ${xhr.responseText}`);
                } else {
                    resolve(xhr.responseText);// cb(xhr.responseText);
                    console.log(JSON.stringify(JSON.parse(xhr.responseText)));
                }
            }
            //what happens if readyState never becomes 4?
            // probably stays in webapis loop for the time being and nothing goes to the event loop
        };
        xhr.send(); // async by default. "the result is delivered using events"

    });
};


class ProductsList {
    constructor(container = '.products') {
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        //probably should rewrite the code so that the loss of context won't be an issua
        this._fetchProducts(this.render.bind(this));
    }

    _fetchProducts(cb){
        getRequest(`${API}/catalogData.json`)
            .then((data) => {
                this.goods = JSON.parse(data);
                cb(); //rendering the list. probably nit the best way to do it
                })
            .catch(error =>  console.log(error));
    }

    calcSum(){
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    }

    render(){
        const block = document.querySelector(this.container);
        for (let product of this.goods){
            const productObj = new ProductItem(product);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
        block.insertAdjacentHTML('afterend', `<p>Стоимость товаров: ${this.calcSum()}</p>`);
    }
}


class ProductItem {
    constructor(product, img = 'https://placehold.it/200x150'){
        this.title = product.product_name;
        this.price = product.price;
        this.id = product.id_product;
        this.img = img;
    }
    render(){
        return `<div class="product-item" data-id="${this.id}">
                <img src="${this.img}" alt="Some img">
                <div class="desc">
                    <h3>${this.title}</h3>
                    <p>${this.price} $</p>
                    <button class="buy-btn">Купить</button>
                </div>
            </div>`
    }
}

let list = new ProductsList();

