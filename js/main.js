const IMG_DIR = 'assets/images/';
const TMB_DIR = 'assets/thumbnails/'; //thumbnails
let currencyTag = '&euro;';

class ProductsList {
    constructor(container = '.products'){
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this._fetchProducts()
    }
    _fetchProducts(){
        this.goods = [
            {id: 1, title: 'Notebook', price: 2000},
            {id: 2, title: 'Mouse', price: 20},
            {id: 3, title: 'Keyboard', price: 200},
            {id: 4, title: 'Gamepad', price: 50},
            {id: 5, title: 'Chair', price: 150},
        ];
    }
    render(){
        const block = document.querySelector(this.container);
        for (let product of this.goods){
            const productObj = new ProductItem(product);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }

    getTotal() {
        let total = 0;
        this.goods.forEach(prod => {total += prod.price * prod.quantity});
        return total;
    }
}


class ProductItem {
    constructor(product, img = 'no_image.jpg'){
        this.title = product.title;
        this.price = product.price;
        this.id = product.id;
        this.img = img;
    }
    render(){
        return `<div class="product-item" data-id="${this.id}">
            <a class="product-item-link"  href="#">
                <img src="${IMG_DIR + this.img}" alt="${this.title}">
                <h3 class="product-item-title">${this.title}</h3>
                <div class="product-item-bottom-flex">
                    <p class="product-item-price">${this.price + " " + currencyTag}</p>
                    <button class="buy-btn" data-id="${this.id}">Купить</button>
                </div>
            </a>
        </div>`;
    }
}

class ShopCart {
    constructor(container = '#cart') {
        this.container = container;
        this.products = [];
    }
    
    addProduct(product, quantity) {

    }

    delProduct() {

    }

    render() {
        const containerEl = document.querySelector(this.container);
        this.products.forEach(prod => {
            render
        });
    }

    getTotal() {
        let total = 0;
        this.products.forEach(prod => {total += prod.price * prod.quantity});
        return total;
    }
}

class CartItem {
    constructor(product, quantity = 1) {
        this.price = product.price;
        this.title = product.title;
        this.quantity = quantity;
    }

    render(){

    }
}


let list = new ProductsList();
list.render();
